[Accueil](../index.md) › [firebase/firestore](package-summary.md) › getDoc

# getDoc

*Fonction — `firebase/firestore` · Lecture*

**Import**
```ts
import { getDoc } from 'firebase/firestore'
```

**Signature**
```ts
function getDoc<A, D>(reference: DocumentReference<A, D>): Promise<DocumentSnapshot<A, D>>
```

**Description**
Lit un document. Va sur le serveur si possible, sinon utilise le cache (hors ligne).

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `reference` | `DocumentReference` | Le document à lire |

**Retour** : `DocumentSnapshot`. Teste `.exists()` puis utilise `.data()`. Voir [DocumentSnapshot](DocumentSnapshot.md).

**Erreurs** : `permission-denied` (règles), `unavailable` (hors ligne et pas en cache).

**Coût** : 1 lecture (même si le document n'existe pas).

**Exemple**
```ts
const snap = await getDoc(noteDocRead('aB3x'))
const note: Note | null = snap.exists() ? snap.data() : null
```

---

← [withConverter](withConverter.md) · [Résumé du package](package-summary.md) · [getDocFromCache](getDocFromCache.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
