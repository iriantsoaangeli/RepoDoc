[Accueil](../index.md) › [firebase/firestore](package-summary.md) › addDoc

# addDoc

*Fonction — `firebase/firestore` · Écriture*

**Import**
```ts
import { addDoc } from 'firebase/firestore'
```

**Signature**
```ts
function addDoc<A, D>(reference: CollectionReference<A, D>, data: WithFieldValue<A>): Promise<DocumentReference<A, D>>
```

**Description**
Crée un document avec un **id généré automatiquement**.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `reference` | `CollectionReference` | La collection où créer |
| `data` | `WithFieldValue<A>` | Les champs ; les valeurs spéciales comme `serverTimestamp()` sont acceptées |

**Retour** : `DocumentReference` du nouveau document (`.id` = l'id généré).

**Erreurs** : `permission-denied` (données refusées par les règles).

**Coût** : 1 écriture.

**Remarque** : avec une collection munie d'un convertisseur, `data` passe par `toFirestore`. Dans ce projet, on écrit donc sur la collection **sans** convertisseur (`notesWrite`), avec un objet vérifié par `NoteCreate`.

**Exemple**
```ts
const data: NoteCreate = {
  owner: auth.currentUser!.uid,
  title: 'Courses',
  text: 'pain, lait',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
}
const ref = await addDoc(notesWrite, data)
console.log('créé :', ref.id)
```

---

← [startAfter](startAfter.md) · [Résumé du package](package-summary.md) · [setDoc](setDoc.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
