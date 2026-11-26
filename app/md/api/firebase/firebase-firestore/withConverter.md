[Accueil](../index.md) › [firebase/firestore](package-summary.md) › withConverter

# withConverter

*Méthode — `firebase/firestore` · Références*

**Signature**
```ts
collectionRef.withConverter<A, D>(converter: FirestoreDataConverter<A, D>): CollectionReference<A, D>
documentRef.withConverter<A, D>(converter: FirestoreDataConverter<A, D>): DocumentReference<A, D>
query.withConverter<A, D>(converter: FirestoreDataConverter<A, D>): Query<A, D>
```

**Description**
Renvoie la même référence, mais **typée** : les lectures passent par le convertisseur et renvoient des objets de type `A` (ex. `Note`). Voir [FirestoreDataConverter](FirestoreDataConverter.md).

**Exemple**
```ts
const notesTypees = collection(db, 'notes').withConverter(noteConverter)
// getDocs(query(notesTypees, ...)) → des Note
```

---

← [doc](doc.md) · [Résumé du package](package-summary.md) · [getDoc](getDoc.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
