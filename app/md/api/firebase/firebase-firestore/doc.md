[Accueil](../index.md) › [firebase/firestore](package-summary.md) › doc

# doc

*Fonction — `firebase/firestore` · Références*

**Import**
```ts
import { doc } from 'firebase/firestore'
```

**Signatures**
```ts
function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference<DocumentData, DocumentData>
function doc<A, D>(reference: CollectionReference<A, D>, path?: string, ...pathSegments: string[]): DocumentReference<A, D>
```

**Description**
Crée une **référence** vers un document précis. Ne lit rien.
- Forme 1 : à partir de `db` et du chemin complet.
- Forme 2 : à partir d'une collection. Sans `path`, Firestore **génère un id** (utile pour connaître l'id avant d'écrire).

**Retour** : `DocumentReference` (`.id` = l'id, `.path` = le chemin complet).

**Exemple**
```ts
const ref1 = doc(db, 'notes', 'aB3x')          // notes/aB3x
const ref2 = doc(collection(db, 'notes'))      // nouvel id généré
console.log(ref1.path, ref2.id)
```

---

← [collection](collection.md) · [Résumé du package](package-summary.md) · [withConverter](withConverter.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
