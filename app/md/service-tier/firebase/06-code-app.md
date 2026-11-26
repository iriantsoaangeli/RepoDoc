# 06 — Code de l'app Vue + Capacitor

## ✅ Checklist

- [ ] 1. Installer le SDK
- [ ] 2. `src/firebase.ts` (connexion)
- [ ] 3. `src/photos.ts` (base64)
- [ ] 4. `src/db.ts` (toutes les opérations)
- [ ] 5. Tester sur les émulateurs
- [ ] 6. Utiliser dans un composant
- [ ] 7. Builder l'APK

Pas d'API, pas de `fetch`, pas d'URL de serveur : le SDK s'occupe de tout.

---

## 1. SDK

```bash
$ cd ton-app-vue
$ npm install firebase
```

## 2. `src/firebase.ts`

```ts
// src/firebase.ts — connexion à Firebase (plan Spark : Auth + Firestore uniquement)
import { initializeApp } from "firebase/app";
import {
  initializeAuth, indexedDBLocalPersistence, signInAnonymously, connectAuthEmulator,
} from "firebase/auth";
import { initializeFirestore, persistentLocalCache, connectFirestoreEmulator } from "firebase/firestore";

// Colle ici l'objet copié depuis la console (doc 02, étape 4)
const firebaseConfig = {
  apiKey: "...",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  appId: "...",
};

export const app = initializeApp(firebaseConfig);
// Persistance indexedDB : fiable dans la WebView Capacitor, l'uid anonyme est conservé
export const auth = initializeAuth(app, { persistence: indexedDBLocalPersistence });
// Cache local : les photos déjà vues ne sont pas re-téléchargées (doc 06)
export const db = initializeFirestore(app, { localCache: persistentLocalCache() });

// `npm run dev` avec VITE_EMULATORS=1 → tout passe par les émulateurs locaux (0 quota consommé)
if (import.meta.env.VITE_EMULATORS === "1") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

/** Connecte l'utilisateur en anonyme une seule fois. */
export async function ensureUser() {
  await auth.authStateReady();
  if (!auth.currentUser) await signInAnonymously(auth);
  return auth.currentUser!;
}
```

## 3. `src/photos.ts`

```ts
// src/photos.ts — photos stockées en base64 dans Firestore (pas de Cloud Storage)
import { doc, addDoc, getDoc, getDocFromCache, deleteDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, ensureUser } from "./firebase";

// Limites (doivent correspondre aux règles du doc 05)
export const PHOTO_MAX_CHARS = 700_000; // ≈ 510 Ko de JPEG ; un document Firestore fait 1 Mio max
export const THUMB_MAX_CHARS = 30_000;  // ≈ 22 Ko : miniature stockée DANS l'annonce

/** Lit un Blob et renvoie sa version base64 (sans le préfixe "data:image/jpeg;base64,"). */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((ok, ko) => {
    const r = new FileReader();
    r.onload = () => ok((r.result as string).split(",")[1]);
    r.onerror = () => ko(r.error);
    r.readAsDataURL(blob);
  });
}

/** Redimensionne + JPEG. Baisse la qualité puis la taille jusqu'à passer sous maxChars. */
export async function imageToBase64(file: Blob, maxSide: number, maxChars: number): Promise<string> {
  const bmp = await createImageBitmap(file);
  let side = maxSide;
  for (let attempt = 0; attempt < 8; attempt++) {
    const scale = Math.min(1, side / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.8, 0.7, 0.6, 0.5]) {
      const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", quality));
      if (!blob) throw new Error("compression échouée");
      const b64 = await blobToBase64(blob);
      if (b64.length <= maxChars) return b64;
    }
    side = Math.round(side * 0.75); // toujours trop gros → on réduit les dimensions
  }
  throw new Error("image impossible à réduire sous la limite");
}

/** Photo pleine taille → document photos/{id}. Renvoie l'id. */
export async function savePhoto(file: File): Promise<string> {
  const user = await ensureUser();
  const b64 = await imageToBase64(file, 1280, PHOTO_MAX_CHARS);
  const ref = await addDoc(collection(db, "photos"), { owner: user.uid, b64, createdAt: serverTimestamp() });
  return ref.id;
}

/** Miniature (240 px) à mettre directement dans l'annonce. */
export function makeThumb(file: File): Promise<string> {
  return imageToBase64(file, 240, THUMB_MAX_CHARS);
}

/** Lit une photo : d'abord le cache local (gratuit), sinon Firestore (1 lecture). */
export async function getPhoto(photoId: string): Promise<string | null> {
  const ref = doc(db, "photos", photoId);
  try {
    const cached = await getDocFromCache(ref);
    if (cached.exists()) return cached.get("b64");
  } catch {
    /* pas en cache → on va sur le serveur */
  }
  const snap = await getDoc(ref);
  return snap.exists() ? snap.get("b64") : null;
}

export function deletePhoto(photoId: string): Promise<void> {
  return deleteDoc(doc(db, "photos", photoId));
}

/** À utiliser dans <img :src="..."> */
export function toSrc(b64: string): string {
  return "data:image/jpeg;base64," + b64;
}
```

| Élément | Pourquoi |
|---|---|
| `PHOTO_MAX_CHARS` / `THUMB_MAX_CHARS` | Doivent être **identiques** aux limites des règles (doc 05). |
| Boucle qualité puis dimensions | Garantit de passer sous la limite quelle que soit la photo. |
| `getDocFromCache` d'abord | Photo déjà vue = 0 lecture, 0 téléchargement. |

## 4. `src/db.ts`

```ts
// src/db.ts — toutes les opérations de l'app (pas d'API : SDK + règles)
import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, writeBatch,
  query, where, orderBy, limit, startAfter, serverTimestamp, getCountFromServer,
  QueryDocumentSnapshot, DocumentSnapshot,
} from "firebase/firestore";
import { db, ensureUser } from "./firebase";
import { savePhoto, makeThumb, deletePhoto } from "./photos";

export type Item = {
  id: string; title: string; price: number; owner: string; ownerName: string;
  thumb?: string; photoId?: string; tags?: string[]; createdAt?: Date;
};

const items = collection(db, "items");

function toItem(d: DocumentSnapshot): Item {
  const x = d.data()!;
  return { id: d.id, ...x, createdAt: x.createdAt?.toDate() } as Item;
}

// ---------- Profil (id du document = uid) ----------

export async function getMyProfile() {
  const user = await ensureUser();
  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.exists() ? (snap.data() as { name: string }) : null;
}

/** À appeler au premier lancement : sans profil, les règles refusent de publier. */
export async function createProfile(name: string) {
  const user = await ensureUser();
  await setDoc(doc(db, "users", user.uid), { name });
}

/** Renomme le profil ET met à jour la copie `ownerName` dans mes annonces (par paquets de 10). */
export async function renameProfile(name: string) {
  const user = await ensureUser();
  const mine = await getDocs(query(items, where("owner", "==", user.uid)));
  const docs = mine.docs;
  for (let i = 0; i === 0 || i < docs.length; i += 10) {
    const batch = writeBatch(db);
    if (i === 0) batch.update(doc(db, "users", user.uid), { name });
    docs.slice(i, i + 10).forEach((d) => batch.update(d.ref, { ownerName: name }));
    await batch.commit();
  }
}

// ---------- Annonces ----------

export async function createItem(title: string, price: number, photo?: File, tags: string[] = []) {
  const user = await ensureUser();
  const profile = await getMyProfile();
  if (!profile) throw new Error("Crée ton profil d'abord");
  const extra: Record<string, unknown> = {};
  if (photo) {
    extra.thumb = await makeThumb(photo);   // petite image DANS l'annonce (liste)
    extra.photoId = await savePhoto(photo); // grande image À PART (détail)
  }
  if (tags.length) extra.tags = tags;
  const ref = await addDoc(items, {
    title, price, owner: user.uid, ownerName: profile.name, createdAt: serverTimestamp(), ...extra,
  });
  return ref.id;
}

/** 20 annonces par page. Passe `last` pour la page suivante. */
export async function listItems(last?: QueryDocumentSnapshot) {
  const q = last
    ? query(items, orderBy("createdAt", "desc"), startAfter(last), limit(20))
    : query(items, orderBy("createdAt", "desc"), limit(20));
  const snap = await getDocs(q);
  return { items: snap.docs.map(toItem), last: snap.docs.at(-1) };
}

export async function getItem(id: string) {
  const d = await getDoc(doc(db, "items", id));
  return d.exists() ? toItem(d) : null;
}

/** Nécessite l'index composite owner + createdAt (doc 05). */
export async function listMyItems() {
  const user = await ensureUser();
  const q = query(items, where("owner", "==", user.uid), orderBy("createdAt", "desc"), limit(20));
  return (await getDocs(q)).docs.map(toItem);
}

/** Compteur sans le stocker : 1 lecture par tranche de 1 000 annonces comptées. */
export async function countMyItems() {
  const user = await ensureUser();
  const snap = await getCountFromServer(query(items, where("owner", "==", user.uid)));
  return snap.data().count;
}

export async function itemsWithTag(tag: string) {
  const q = query(items, where("tags", "array-contains", tag), limit(20));
  return (await getDocs(q)).docs.map(toItem);
}

export async function updateItem(id: string, changes: { title?: string; price?: number }) {
  await updateDoc(doc(db, "items", id), changes);
}

/** Supprime commentaires → photo → annonce (supprimer un document ne supprime PAS ses sous-collections). */
export async function deleteItem(id: string) {
  const item = await getItem(id);
  if (!item) return;
  const comments = await getDocs(collection(db, "items", id, "comments"));
  for (let i = 0; i < comments.docs.length; i += 10) {
    const batch = writeBatch(db);
    comments.docs.slice(i, i + 10).forEach((c) => batch.delete(c.ref));
    await batch.commit();
  }
  if (item.photoId) await deletePhoto(item.photoId);
  await deleteDoc(doc(db, "items", id));
}

// ---------- Commentaires (sous-collection) ----------

export async function addComment(itemId: string, text: string) {
  const user = await ensureUser();
  const profile = await getMyProfile();
  if (!profile) throw new Error("Crée ton profil d'abord");
  await addDoc(collection(db, "items", itemId, "comments"), {
    text, owner: user.uid, ownerName: profile.name, createdAt: serverTimestamp(),
  });
}

export async function listComments(itemId: string) {
  const q = query(collection(db, "items", itemId, "comments"), orderBy("createdAt", "desc"), limit(20));
  return (await getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteComment(itemId: string, commentId: string) {
  await deleteDoc(doc(db, "items", itemId, "comments", commentId));
}

// ---------- Favoris (id du document = id de l'annonce → pas de doublon) ----------

export async function addFavorite(item: Item) {
  const user = await ensureUser();
  await setDoc(doc(db, "users", user.uid, "favorites", item.id), {
    title: item.title, price: item.price, ...(item.thumb ? { thumb: item.thumb } : {}),
  });
}

export async function removeFavorite(itemId: string) {
  const user = await ensureUser();
  await deleteDoc(doc(db, "users", user.uid, "favorites", itemId));
}

export async function listFavorites() {
  const user = await ensureUser();
  const snap = await getDocs(query(collection(db, "users", user.uid, "favorites"), limit(50)));
  return snap.docs.map((d) => ({ itemId: d.id, ...d.data() }));
}
```

| Fonction | Remarque |
|---|---|
| `createProfile` | À appeler au premier lancement, sinon les règles refusent de publier. |
| `createItem` | Écrit d'abord la photo (`photos/`), puis l'annonce avec la miniature et le `photoId`. 2 écritures. |
| `listItems(last)` | Pagination : passe le `last` renvoyé pour la page suivante. |
| `countMyItems` | Pas de compteur stocké : Firestore compte (1 lecture par tranche de 1 000). |
| `renameProfile` | Met à jour la copie `ownerName` dans toutes tes annonces. |
| `deleteItem` | Commentaires → photo → annonce. L'ordre compte : la règle des commentaires lit l'annonce, qui doit encore exister. |

## 5. Tester sur les émulateurs (0 quota consommé)

```bash
# terminal 1 : dans le dossier de l'app
$ firebase emulators:start

# terminal 2
$ echo "VITE_EMULATORS=1" > .env.development.local
$ npm run dev
```

- Interface des émulateurs (données, utilisateurs, refus des règles) : http://127.0.0.1:4000
- L'émulateur applique **exactement** ton `firestore.rules` → fais les tests du tableau du doc 05.
- Supprime `.env.development.local` pour revenir sur la vraie base.

## 6. Exemple de composant : `src/Accueil.vue`

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getMyProfile, createProfile, createItem, listItems, deleteItem, type Item } from "@/db";
import { getPhoto, toSrc } from "@/photos";
import { auth } from "@/firebase";

const items = ref<Item[]>([]);
const hasProfile = ref(false);
const name = ref("");
const title = ref("");
const price = ref(0);
const file = ref<File | null>(null);
const bigPhoto = ref<string | null>(null);
const busy = ref(false);

async function refresh() { items.value = (await listItems()).items; }

onMounted(async () => {
  hasProfile.value = !!(await getMyProfile());
  await refresh();
});

async function saveProfile() {
  await createProfile(name.value);
  hasProfile.value = true;
}

async function publish() {
  busy.value = true;
  try {
    await createItem(title.value, price.value, file.value ?? undefined);
    title.value = ""; price.value = 0; file.value = null;
    await refresh();
  } finally { busy.value = false; }
}

async function open(i: Item) {
  bigPhoto.value = i.photoId ? await getPhoto(i.photoId) : null; // 1 lecture, ou 0 si déjà en cache
}
</script>

<template>
  <section v-if="!hasProfile">
    <input v-model="name" placeholder="Ton nom" /> <button @click="saveProfile">Créer mon profil</button>
  </section>

  <section v-else>
    <input v-model="title" placeholder="Titre" />
    <input v-model.number="price" type="number" min="0" />
    <input type="file" accept="image/*" @change="file = ($event.target as HTMLInputElement).files?.[0] ?? null" />
    <button :disabled="busy" @click="publish">{{ busy ? "Envoi…" : "Publier" }}</button>
  </section>

  <ul>
    <li v-for="i in items" :key="i.id" @click="open(i)">
      <img v-if="i.thumb" :src="toSrc(i.thumb)" width="60" />
      {{ i.title }} — {{ i.price }} — {{ i.ownerName }}
      <button v-if="i.owner === auth.currentUser?.uid" @click.stop="deleteItem(i.id).then(refresh)">Supprimer</button>
    </li>
  </ul>

  <img v-if="bigPhoto" :src="toSrc(bigPhoto)" style="max-width: 100%" @click="bigPhoto = null" />
</template>
```

## 7. Builder l'APK

```bash
$ npm run build
$ npx cap sync android
$ npx cap open android     # Android Studio → Build > Build App Bundle(s) / APK(s) > Build APK(s)
```

Aucune configuration Android spécifique à Firebase n'est nécessaire (pas de `google-services.json`) : tout passe par le SDK web.

➡️ Suite : `07-garde-fous-quotas.md`
