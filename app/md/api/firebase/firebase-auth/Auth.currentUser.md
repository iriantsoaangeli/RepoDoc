[Accueil](../index.md) › [firebase/auth](package-summary.md) › Auth.currentUser

# Auth.currentUser

*Propriété — `firebase/auth`*

**Signature**
```ts
auth.currentUser: User | null
```

**Description**
L'utilisateur connecté, ou `null`. Ses propriétés utiles : `uid` (identifiant unique, utilisé dans les règles) et `isAnonymous`.

**Exemple**
```ts
const uid = auth.currentUser?.uid ?? null
```

---

← [Auth.authStateReady](Auth.authStateReady.md) · [Résumé du package](package-summary.md) · [signInAnonymously](signInAnonymously.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
