[Accueil](../index.md) › [firebase/firestore](package-summary.md) › serverTimestamp

# serverTimestamp

*Fonction — `firebase/firestore` · Valeurs spéciales*

**Import**
```ts
import { serverTimestamp } from 'firebase/firestore'
```

**Signature**
```ts
function serverTimestamp(): FieldValue
```

**Description**
Valeur spéciale : « mets l'heure du serveur dans ce champ ». Avec la règle `champ == request.time`, c'est la seule valeur acceptée. Juste après l'écriture, la lecture locale donne `null`, sauf avec l'option `serverTimestamps: 'estimate'` (voir [DocumentSnapshot](DocumentSnapshot.md)).

---

← [writeBatch](writeBatch.md) · [Résumé du package](package-summary.md) · [increment](increment.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
