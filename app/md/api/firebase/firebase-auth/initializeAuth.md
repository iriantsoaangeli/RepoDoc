[Accueil](../index.md) › [firebase/auth](package-summary.md) › initializeAuth

# initializeAuth

*Fonction — `firebase/auth`*

**Import**
```ts
import { initializeAuth } from 'firebase/auth'
```

**Signature**
```ts
function initializeAuth(app: FirebaseApp, deps?: Dependencies): Auth
```

**Description**
Crée le service d'authentification avec des réglages précis. À préférer à `getAuth()` dans une app Capacitor, pour choisir le stockage de la session.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `app` | `FirebaseApp` | Renvoyé par `initializeApp` |
| `deps` | `Dependencies` (facultatif) | Réglages ; le principal est `persistence` (où garder la session) |

**Retour** : `Auth`, le service d'authentification.

**Exemple**
```ts
const auth = initializeAuth(app, { persistence: indexedDBLocalPersistence })
```

---

[Résumé du package](package-summary.md) · [indexedDBLocalPersistence](indexedDBLocalPersistence.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
