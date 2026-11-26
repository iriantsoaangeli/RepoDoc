[Accueil](../index.md) › [firebase/auth](package-summary.md) › connectAuthEmulator

# connectAuthEmulator

*Fonction — `firebase/auth`*

**Import**
```ts
import { connectAuthEmulator } from 'firebase/auth'
```

**Signature**
```ts
function connectAuthEmulator(auth: Auth, url: string, options?: { disableWarnings: boolean }): void
```

**Description**
Redirige l'authentification vers l'émulateur local. À appeler juste après `initializeAuth`, avant toute connexion.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `auth` | `Auth` | Le service |
| `url` | `string` | Adresse de l'émulateur, par défaut `'http://127.0.0.1:9099'` |
| `options.disableWarnings` | `boolean` (facultatif) | Masque le bandeau d'avertissement |

**Exemple**
```ts
if (import.meta.env.VITE_USE_EMULATORS === '1') connectAuthEmulator(auth, 'http://127.0.0.1:9099')
```

---

← [signOut](signOut.md) · [Résumé du package](package-summary.md)  
[Conventions de lecture et contexte des exemples](../conventions.md)
