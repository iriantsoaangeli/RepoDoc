[Accueil](../index.md) › [firebase/firestore](package-summary.md) › setDoc

# setDoc

*Fonction — `firebase/firestore` · Écriture*

**Import**
```ts
import { setDoc } from 'firebase/firestore'
```

**Signatures**
```ts
function setDoc<A, D>(reference: DocumentReference<A, D>, data: WithFieldValue<A>): Promise<void>
function setDoc<A, D>(reference: DocumentReference<A, D>, data: PartialWithFieldValue<A>, options: SetOptions): Promise<void>
```

**Description**
Écrit un document **à un id que tu choisis**. S'il existe déjà :
- sans `options` : il est **entièrement remplacé** ;
- avec `{ merge: true }` : seuls les champs fournis sont modifiés, les autres sont gardés.

Pour la règle Firestore, c'est une création si le document n'existait pas, une modification sinon.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `reference` | `DocumentReference` | Document cible (id choisi) |
| `data` | objet | Champs à écrire |
| `options` | `{ merge: true }` (facultatif) | Fusion au lieu de remplacement |

**Coût** : 1 écriture.

**Exemple** (profil dont l'id est l'uid)
```ts
const uid = auth.currentUser!.uid
await setDoc(doc(db, 'users', uid), { name: 'Rado' })
await setDoc(doc(db, 'users', uid), { name: 'Rado R.' }, { merge: true })
```

---

← [addDoc](addDoc.md) · [Résumé du package](package-summary.md) · [updateDoc](updateDoc.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
