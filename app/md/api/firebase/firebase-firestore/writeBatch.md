[Accueil](../index.md) › [firebase/firestore](package-summary.md) › writeBatch

# writeBatch

*Fonction — `firebase/firestore` · Écriture*

**Import**
```ts
import { writeBatch } from 'firebase/firestore'
```

**Signature**
```ts
function writeBatch(firestore: Firestore): WriteBatch
```

**Description**
Regroupe plusieurs écritures appliquées **toutes ensemble ou pas du tout**.

Limites :
- pas de nombre d'opérations fixe documenté pour un batch, mais un batch de plusieurs centaines de documents peut dépasser la taille maximale d'une transaction → reste raisonnable (quelques dizaines) ;
- côté règles de sécurité : 20 accès à des documents (`get()` / `getAfter()` / `exists()`) au maximum pour **tout** le batch.

**Méthodes de `WriteBatch`**

| Méthode | Rôle |
|---|---|
| `set(ref, data, options?)` | Comme `setDoc` |
| `update(ref, data)` | Comme `updateDoc` |
| `delete(ref)` | Comme `deleteDoc` |
| `commit(): Promise<void>` | Envoie tout |

**Coût** : chaque opération compte (1 écriture ou 1 suppression).

**Exemple**
```ts
const batch = writeBatch(db)
batch.update(noteDoc('aB3x'), { title: 'A', updatedAt: serverTimestamp() })
batch.delete(noteDoc('cD4y'))
await batch.commit()
```

---

← [deleteDoc](deleteDoc.md) · [Résumé du package](package-summary.md) · [serverTimestamp](serverTimestamp.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
