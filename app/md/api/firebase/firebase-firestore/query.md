[Accueil](../index.md) › [firebase/firestore](package-summary.md) › query

# query

*Fonction — `firebase/firestore` · Requêtes*

**Import**
```ts
import { query } from 'firebase/firestore'
```

**Signature**
```ts
function query<A, D>(query: Query<A, D>, ...queryConstraints: QueryConstraint[]): Query<A, D>
```

**Description**
Construit une requête à partir d'une collection et de contraintes ([where](where.md), [orderBy](orderBy.md), [limit](limit.md), [startAfter](startAfter.md)). Ne lit rien : il faut ensuite [getDocs](getDocs.md) ou [onSnapshot](onSnapshot.md).

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `query` | `CollectionReference` ou `Query` | Point de départ |
| `queryConstraints` | `QueryConstraint[]` | Autant de contraintes que nécessaire, dans l'ordre : filtres, tri, curseur, limite |

**Retour** : `Query<A, D>` (garde le typage du convertisseur).

**Exemple**
```ts
const uid = auth.currentUser!.uid
const q = query(notesRead, where('owner', '==', uid), orderBy('createdAt', 'desc'), limit(20))
```

---

← [getCountFromServer](getCountFromServer.md) · [Résumé du package](package-summary.md) · [where](where.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
