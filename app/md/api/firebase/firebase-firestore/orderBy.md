[Accueil](../index.md) › [firebase/firestore](package-summary.md) › orderBy

# orderBy

*Fonction — `firebase/firestore` · Requêtes*

**Import**
```ts
import { orderBy } from 'firebase/firestore'
```

**Signature**
```ts
function orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): QueryOrderByConstraint
```

**Description**
Trie les résultats. Les documents qui n'ont **pas** ce champ sont exclus.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `fieldPath` | `string` | Champ de tri |
| `directionStr` | `'asc' \| 'desc'` (facultatif) | Croissant (par défaut) ou décroissant |

**Exemple**
```ts
const q = query(notesRead, orderBy('createdAt', 'desc'))
```

---

← [where](where.md) · [Résumé du package](package-summary.md) · [limit](limit.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
