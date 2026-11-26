[Accueil](../index.md) › [firebase/firestore](package-summary.md) › persistentLocalCache

# persistentLocalCache

*Fonction — `firebase/firestore` · Initialisation*

**Import**
```ts
import { persistentLocalCache } from 'firebase/firestore'
```

**Signature**
```ts
function persistentLocalCache(settings?: PersistentCacheSettings): PersistentLocalCache
```

**Description**
Garde les documents lus sur l'appareil (IndexedDB). Effets : l'app affiche des données hors ligne, et [getDocFromCache](getDocFromCache.md) peut relire un document sans rien consommer.

---

← [initializeFirestore](initializeFirestore.md) · [Résumé du package](package-summary.md) · [connectFirestoreEmulator](connectFirestoreEmulator.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
