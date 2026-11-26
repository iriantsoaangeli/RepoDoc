[Accueil](../index.md) › [firebase/firestore](package-summary.md) › QuerySnapshot

# QuerySnapshot

*Classe — `firebase/firestore` · Classes*

**Description**
Résultat d'une requête (`getDocs`, `onSnapshot` sur une requête).

**Membres**

| Membre | Type | Rôle |
|---|---|---|
| `docs` | `QueryDocumentSnapshot<A, D>[]` | Les documents |
| `size` | `number` | Leur nombre |
| `empty` | `boolean` | Vrai si aucun résultat |
| `forEach(cb)` | `void` | Parcourt les documents |

**Exemple**
```ts
const snap = await getDocs(query(notesRead, where('owner', '==', auth.currentUser!.uid), limit(20)))
if (!snap.empty) console.log(snap.size, snap.docs[0]?.id)
```

---

← [DocumentSnapshot](DocumentSnapshot.md) · [Résumé du package](package-summary.md) · [Timestamp](Timestamp.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
