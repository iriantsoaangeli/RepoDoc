[Accueil](../index.md) › [firebase/firestore](package-summary.md) › deleteDoc

# deleteDoc

*Fonction — `firebase/firestore` · Écriture*

**Import**
```ts
import { deleteDoc } from 'firebase/firestore'
```

**Signature**
```ts
function deleteDoc<A, D>(reference: DocumentReference<A, D>): Promise<void>
```

**Description**
Supprime un document. ⚠️ Ses **sous-collections ne sont pas supprimées**. Ne signale pas d'erreur si le document n'existe pas.

**Coût** : 1 suppression.

**Exemple**
```ts
await deleteDoc(noteDoc('aB3x'))
```

---

← [updateDoc](updateDoc.md) · [Résumé du package](package-summary.md) · [writeBatch](writeBatch.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
