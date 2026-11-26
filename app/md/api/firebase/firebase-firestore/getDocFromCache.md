[Accueil](../index.md) › [firebase/firestore](package-summary.md) › getDocFromCache

# getDocFromCache

*Fonction — `firebase/firestore` · Lecture*

**Import**
```ts
import { getDocFromCache } from 'firebase/firestore'
```

**Signature**
```ts
function getDocFromCache<A, D>(reference: DocumentReference<A, D>): Promise<DocumentSnapshot<A, D>>
```

**Description**
Lit un document **uniquement depuis le cache de l'appareil**, sans contacter le serveur. Nécessite [persistentLocalCache](persistentLocalCache.md).

**Erreurs** : lève une erreur (`unavailable`) si le document n'est pas en cache.

**Coût** : 0.

**Exemple**
```ts
let snap
try {
  snap = await getDocFromCache(noteDocRead('aB3x'))  // gratuit
} catch {
  snap = await getDoc(noteDocRead('aB3x'))           // 1 lecture
}
```

---

← [getDoc](getDoc.md) · [Résumé du package](package-summary.md) · [getDocs](getDocs.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
