[Accueil](../index.md) › [firebase/firestore](package-summary.md) › startAfter

# startAfter

*Fonction — `firebase/firestore` · Requêtes*

**Import**
```ts
import { startAfter } from 'firebase/firestore'
```

**Signatures**
```ts
function startAfter<A, D>(snapshot: DocumentSnapshot<A, D>): QueryStartAtConstraint
function startAfter(...fieldValues: unknown[]): QueryStartAtConstraint
```

**Description**
Pagination : commence **après** le document donné (en général le dernier de la page précédente). Doit suivre le même `orderBy` que la page précédente.

**Exemple**
```ts
const uid = auth.currentUser!.uid
const base = [where('owner', '==', uid), orderBy('createdAt', 'desc')] as const
const page1 = await getDocs(query(notesRead, ...base, limit(20)))
const dernier = page1.docs.at(-1)
if (dernier) {
  const page2 = await getDocs(query(notesRead, ...base, startAfter(dernier), limit(20)))
  console.log(page2.size)
}
```

---

← [limit](limit.md) · [Résumé du package](package-summary.md) · [addDoc](addDoc.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
