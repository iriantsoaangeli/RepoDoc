[Accueil](../index.md) › [firebase/firestore](package-summary.md) › initializeFirestore

# initializeFirestore

*Fonction — `firebase/firestore` · Initialisation*

**Import**
```ts
import { initializeFirestore } from 'firebase/firestore'
```

**Signature**
```ts
function initializeFirestore(app: FirebaseApp, settings: FirestoreSettings, databaseId?: string): Firestore
```

**Description**
Crée la connexion à la base avec des réglages (notamment le cache local). À préférer à `getFirestore()` pour activer le cache. Une seule fois au démarrage.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `app` | `FirebaseApp` | Renvoyé par `initializeApp` |
| `settings` | `FirestoreSettings` | Réglages ; le principal est `localCache` |
| `databaseId` | `string` (facultatif) | Autre base que `(default)`. Ne l'utilise pas : le quota gratuit ne vaut que pour une base |

**Retour** : `Firestore`, l'objet `db` passé à toutes les autres fonctions.

**Exemple**
```ts
const db = initializeFirestore(app, { localCache: persistentLocalCache() })
```

---

[Résumé du package](package-summary.md) · [persistentLocalCache](persistentLocalCache.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
