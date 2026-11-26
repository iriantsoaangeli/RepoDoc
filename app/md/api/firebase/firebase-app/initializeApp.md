[Accueil](../index.md) › [firebase/app](package-summary.md) › initializeApp

# initializeApp

*Fonction — `firebase/app`*

**Import**
```ts
import { initializeApp } from 'firebase/app'
```

**Signature**
```ts
function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp
```

**Description**
Crée la connexion à ton projet Firebase. À appeler **une seule fois** au démarrage de l'app. L'objet renvoyé est ensuite passé à `initializeAuth` et à `initializeFirestore`.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `options` | `FirebaseOptions` | Objet de configuration copié depuis la console : `apiKey`, `authDomain`, `projectId`, `appId` (+ champs facultatifs) |
| `name` | `string` (facultatif) | Nom de l'instance, seulement si tu te connectes à plusieurs projets |

**Retour** : `FirebaseApp`, l'instance de l'app.

**Erreurs** : `app/duplicate-app` si tu l'appelles deux fois avec le même nom.

**Exemple**
```ts
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
})
```

---

[Résumé du package](package-summary.md)  
[Conventions de lecture et contexte des exemples](../conventions.md)
