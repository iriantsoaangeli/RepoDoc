[Accueil](../index.md) › [firebase/firestore](package-summary.md) › updateDoc

# updateDoc

*Fonction — `firebase/firestore` · Écriture*

**Import**
```ts
import { updateDoc } from 'firebase/firestore'
```

**Signatures**
```ts
function updateDoc<A, D>(reference: DocumentReference<A, D>, data: UpdateData<D>): Promise<void>
function updateDoc<A, D>(reference: DocumentReference<A, D>, field: string | FieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): Promise<void>
```

**Description**
Modifie **certains champs** d'un document **existant**. Les autres champs ne bougent pas.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `reference` | `DocumentReference` | Document à modifier |
| `data` | `UpdateData<D>` | Champs à changer. Sur une référence typée, TypeScript vérifie les noms et types par rapport à `D` |

**Erreurs** : `not-found` (le document n'existe pas), `permission-denied`.

**Coût** : 1 écriture.

**Exemple**
```ts
await updateDoc(noteDoc('aB3x'), { title: 'Nouveau titre', updatedAt: serverTimestamp() })
```

---

← [setDoc](setDoc.md) · [Résumé du package](package-summary.md) · [deleteDoc](deleteDoc.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
