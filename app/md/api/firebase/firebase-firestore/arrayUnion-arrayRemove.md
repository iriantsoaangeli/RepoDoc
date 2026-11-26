[Accueil](../index.md) › [firebase/firestore](package-summary.md) › arrayUnion / arrayRemove

# arrayUnion / arrayRemove

*Fonction — `firebase/firestore` · Valeurs spéciales*

**Import**
```ts
import { arrayUnion, arrayRemove } from 'firebase/firestore'
```

**Signatures**
```ts
function arrayUnion(...elements: unknown[]): FieldValue
function arrayRemove(...elements: unknown[]): FieldValue
```

**Description**
Ajoute des éléments à un tableau (sans doublon), ou en retire toutes les occurrences, côté serveur.

**Exemple**
```ts
await updateDoc(noteDoc('aB3x'), { tags: arrayUnion('urgent') })
await updateDoc(noteDoc('aB3x'), { tags: arrayRemove('urgent') })
```

---

← [deleteField](deleteField.md) · [Résumé du package](package-summary.md) · [DocumentSnapshot](DocumentSnapshot.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
