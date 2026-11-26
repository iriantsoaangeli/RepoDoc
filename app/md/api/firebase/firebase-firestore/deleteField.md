[Accueil](../index.md) › [firebase/firestore](package-summary.md) › deleteField

# deleteField

*Fonction — `firebase/firestore` · Valeurs spéciales*

**Import**
```ts
import { deleteField } from 'firebase/firestore'
```

**Signature**
```ts
function deleteField(): FieldValue
```

**Description**
Supprime **un champ** d'un document (avec `updateDoc` ou `setDoc(..., { merge: true })`).

**Exemple**
```ts
await updateDoc(noteDoc('aB3x'), { thumb: deleteField(), photoId: deleteField(), updatedAt: serverTimestamp() })
```

---

← [increment](increment.md) · [Résumé du package](package-summary.md) · [arrayUnion / arrayRemove](arrayUnion-arrayRemove.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
