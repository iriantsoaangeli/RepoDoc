[Accueil](../index.md) › [firebase/firestore](package-summary.md) › limit

# limit

*Fonction — `firebase/firestore` · Requêtes*

**Import**
```ts
import { limit } from 'firebase/firestore'
```

**Signature**
```ts
function limit(limit: number): QueryLimitConstraint
```

**Description**
Nombre maximum de documents renvoyés. **À mettre dans toutes les requêtes** : c'est ce qui borne le nombre de lectures.

**Exemple**
```ts
const q = query(notesRead, orderBy('createdAt', 'desc'), limit(20))
```

---

← [orderBy](orderBy.md) · [Résumé du package](package-summary.md) · [startAfter](startAfter.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
