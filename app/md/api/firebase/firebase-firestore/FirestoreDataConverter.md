[Accueil](../index.md) › [firebase/firestore](package-summary.md) › FirestoreDataConverter

# FirestoreDataConverter

*Interface — `firebase/firestore` · Types*

**Import**
```ts
import type { FirestoreDataConverter } from 'firebase/firestore'
```

**Signature (simplifiée)**
```ts
interface FirestoreDataConverter<A, D extends DocumentData = DocumentData> {
  toFirestore(modelObject: WithFieldValue<A>): WithFieldValue<D>
  toFirestore(modelObject: PartialWithFieldValue<A>, options: SetOptions): PartialWithFieldValue<D>
  fromFirestore(snapshot: QueryDocumentSnapshot<D, D>, options?: SnapshotOptions): A
}
```

**Description**
Objet qui traduit entre la forme stockée `D` et la forme de l'app `A`. On le branche avec [withConverter](withConverter.md).
- `fromFirestore` : appelée à **chaque lecture** ;
- `toFirestore` : appelée à chaque écriture sur une référence munie du convertisseur.

**Exemple** : voir `noteConverter` dans `src/models/note.ts`, ou [makeConverter](../projet-models-base/makeConverter.md).

---

← [FieldValue](FieldValue.md) · [Résumé du package](package-summary.md) · [WithFieldValue / PartialWithFieldValue / UpdateData](WithFieldValue-PartialWithFieldValue-UpdateData.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
