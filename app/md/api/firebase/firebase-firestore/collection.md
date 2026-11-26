[Accueil](../index.md) › [firebase/firestore](package-summary.md) › collection

# collection

*Fonction — `firebase/firestore` · Références*

**Import**
```ts
import { collection } from 'firebase/firestore'
```

**Signature**
```ts
function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference<DocumentData, DocumentData>
```

**Description**
Crée une **référence** (un chemin) vers une collection. Ne lit rien et ne consomme rien : c'est juste une adresse.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `firestore` | `Firestore` | L'objet `db` |
| `path` | `string` | Nom de la collection, ex. `'notes'` |
| `pathSegments` | `string[]` | Segments suivants pour une sous-collection, ex. `collection(db, 'notes', noteId, 'commentaires')` |

**Retour** : `CollectionReference`. À passer à `addDoc`, `query`, `getDocs`, ou à `.withConverter()`.

**Exemple**
```ts
const notesRef = collection(db, 'notes')
const commentairesRef = collection(db, 'notes', 'aB3x', 'commentaires')
```

---

← [connectFirestoreEmulator](connectFirestoreEmulator.md) · [Résumé du package](package-summary.md) · [doc](doc.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
