[Accueil](../index.md) › [firebase/auth](package-summary.md) › signInAnonymously

# signInAnonymously

*Fonction — `firebase/auth`*

**Import**
```ts
import { signInAnonymously } from 'firebase/auth'
```

**Signature**
```ts
function signInAnonymously(auth: Auth): Promise<UserCredential>
```

**Description**
Connecte l'utilisateur sans email ni mot de passe. S'il est déjà connecté en anonyme, renvoie le même utilisateur. Le fournisseur « Anonymous » doit être activé dans la console.

**Retour** : `Promise<UserCredential>`, dont `.user` est l'utilisateur.

**Erreurs** : `auth/operation-not-allowed` (fournisseur non activé), `auth/network-request-failed`.

**Exemple**
```ts
await auth.authStateReady()
if (!auth.currentUser) await signInAnonymously(auth)
```

---

← [Auth.currentUser](Auth.currentUser.md) · [Résumé du package](package-summary.md) · [onAuthStateChanged](onAuthStateChanged.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
