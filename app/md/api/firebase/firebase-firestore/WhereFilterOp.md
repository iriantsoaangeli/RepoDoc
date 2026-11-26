[Accueil](../index.md) › [firebase/firestore](package-summary.md) › WhereFilterOp

# WhereFilterOp

*Type — `firebase/firestore` · Types*

```ts
type WhereFilterOp = '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in'
```

| Opérateur | Sens | Exemple |
|---|---|---|
| `==`, `!=` | Égal, différent | `where('owner', '==', uid)` |
| `<`, `<=`, `>`, `>=` | Comparaisons | `where('createdAt', '<', ts)` |
| `array-contains` | Le tableau contient la valeur | `where('tags', 'array-contains', 'urgent')` |
| `array-contains-any` | Le tableau contient au moins une des valeurs | `where('tags', 'array-contains-any', ['a', 'b'])` |
| `in`, `not-in` | La valeur est (n'est pas) dans la liste | `where('statut', 'in', ['ouvert', 'en cours'])` |

---

← [WithFieldValue / PartialWithFieldValue / UpdateData](WithFieldValue-PartialWithFieldValue-UpdateData.md) · [Résumé du package](package-summary.md) · [OrderByDirection](OrderByDirection.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
