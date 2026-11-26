[Accueil](../index.md) › [firebase/firestore](package-summary.md) › getDocs

# getDocs

*Fonction — `firebase/firestore` · Lecture*

**Import**
```ts
import { getDocs } from 'firebase/firestore'
```

**Signature**
```ts
function getDocs<A, D>(query: Query<A, D>): Promise<QuerySnapshot<A, D>>
```

**Description**
Exécute une requête (ou lit toute une collection si on lui passe une `CollectionReference`, ⚠️ à éviter sans `limit`).

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `query` | `Query` ou `CollectionReference` | Construite avec [query](query.md) |

**Retour** : `QuerySnapshot`. `.docs` est la liste des documents. Voir [QuerySnapshot](QuerySnapshot.md).

**Erreurs** : `permission-denied` (la requête n'est pas limitée à ce que les règles autorisent), `failed-precondition` (index composite manquant).

**Coût** : 1 lecture par document renvoyé (minimum 1 si le résultat est vide).

**Exemple**
```ts
const uid = auth.currentUser!.uid
const snap = await getDocs(query(notesRead, where('owner', '==', uid), limit(20)))
const notes: Note[] = snap.docs.map((d) => d.data())
```

---

← [getDocFromCache](getDocFromCache.md) · [Résumé du package](package-summary.md) · [onSnapshot](onSnapshot.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
