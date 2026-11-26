[Accueil](../index.md) › [firebase/firestore](package-summary.md) › where

# where

*Fonction — `firebase/firestore` · Requêtes*

**Import**
```ts
import { where } from 'firebase/firestore'
```

**Signature**
```ts
function where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown): QueryFieldFilterConstraint
```

**Description**
Filtre : ne garde que les documents dont le champ respecte la condition.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `fieldPath` | `string` | Nom du champ, ex. `'owner'` |
| `opStr` | [WhereFilterOp](WhereFilterOp.md) | Opérateur : `'=='`, `'<'`, `'array-contains'`… |
| `value` | `unknown` | Valeur à comparer |

**Remarques**
- Les règles de lecture « seulement ses notes » **exigent** `where('owner', '==', uid)`.
- `where` sur un champ + `orderBy` sur un autre ⇒ index composite.

**Exemple**
```ts
const uid = auth.currentUser!.uid
const q = query(notesRead, where('owner', '==', uid), where('title', '!=', ''))
```

---

← [query](query.md) · [Résumé du package](package-summary.md) · [orderBy](orderBy.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
