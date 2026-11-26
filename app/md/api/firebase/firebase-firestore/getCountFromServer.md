[Accueil](../index.md) › [firebase/firestore](package-summary.md) › getCountFromServer

# getCountFromServer

*Fonction — `firebase/firestore` · Lecture*

**Import**
```ts
import { getCountFromServer } from 'firebase/firestore'
```

**Signature**
```ts
function getCountFromServer<A, D>(query: Query<A, D>): Promise<AggregateQuerySnapshot<{ count: AggregateField<number> }, A, D>>
```

**Description**
Compte les documents d'une requête **sans les télécharger**.

**Retour** : un objet dont `.data().count` est le nombre.

**Coût** : 1 lecture par tranche de 1 000 documents comptés.

**Exemple**
```ts
const uid = auth.currentUser!.uid
const res = await getCountFromServer(query(notesRead, where('owner', '==', uid)))
console.log(res.data().count)
```

---

← [onSnapshot](onSnapshot.md) · [Résumé du package](package-summary.md) · [query](query.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
