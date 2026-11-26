[Accueil](../index.md) › [firebase/firestore](package-summary.md) › increment

# increment

*Fonction — `firebase/firestore` · Valeurs spéciales*

**Import**
```ts
import { increment } from 'firebase/firestore'
```

**Signature**
```ts
function increment(n: number): FieldValue
```

**Description**
Ajoute `n` à un champ numérique côté serveur, sans relire la valeur. `increment(-1)` retire 1.

**Exemple**
```ts
await updateDoc(doc(db, 'users', auth.currentUser!.uid), { nbNotes: increment(1) })
```

---

← [serverTimestamp](serverTimestamp.md) · [Résumé du package](package-summary.md) · [deleteField](deleteField.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
