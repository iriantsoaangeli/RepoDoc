[Accueil](../index.md) › [firebase/firestore](package-summary.md) › DocumentSnapshot

# DocumentSnapshot

*Classe — `firebase/firestore` · Classes*

**Description**
Un document lu, renvoyé par `getDoc`, `getDocFromCache` et `onSnapshot` (sur un document). Pour une requête, chaque élément de `QuerySnapshot.docs` est un `QueryDocumentSnapshot` (un `DocumentSnapshot` qui existe forcément).

**Membres**

| Membre | Type | Rôle |
|---|---|---|
| `id` | `string` | Id du document |
| `ref` | `DocumentReference<A, D>` | Sa référence (pour `updateDoc`, `deleteDoc`) |
| `exists()` | `boolean` | Vrai si le document existe. Après ce test, TypeScript sait que `data()` n'est pas `undefined` |
| `data(options?)` | `A \| undefined` | Les données, converties si la référence a un convertisseur |
| `get(champ, options?)` | `any` | La valeur d'un seul champ |

**`options` de `data()` / `get()`** : `{ serverTimestamps: 'estimate' | 'previous' | 'none' }`, c'est-à-dire ce qu'on renvoie pour un `serverTimestamp()` pas encore confirmé : une estimation locale, l'ancienne valeur, ou `null` (par défaut).

**Exemple**
```ts
const snap = await getDoc(noteDoc('aB3x'))
if (snap.exists()) {
  console.log(snap.id, snap.get('title'), snap.data({ serverTimestamps: 'estimate' }))
}
```

---

← [arrayUnion / arrayRemove](arrayUnion-arrayRemove.md) · [Résumé du package](package-summary.md) · [QuerySnapshot](QuerySnapshot.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
