[Accueil](../index.md) › [firebase/auth](package-summary.md) › Auth.authStateReady

# Auth.authStateReady

*Méthode — `firebase/auth`*

**Signature**
```ts
auth.authStateReady(): Promise<void>
```

**Description**
Attend que Firebase ait relu la session sauvegardée. Avant cette attente, `auth.currentUser` peut valoir `null` alors que l'utilisateur est déjà connecté.

**Retour** : `Promise<void>`, terminée quand l'état de connexion est connu.

**Exemple**
```ts
await auth.authStateReady()
console.log(auth.currentUser?.uid)
```

---

← [indexedDBLocalPersistence](indexedDBLocalPersistence.md) · [Résumé du package](package-summary.md) · [Auth.currentUser](Auth.currentUser.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
