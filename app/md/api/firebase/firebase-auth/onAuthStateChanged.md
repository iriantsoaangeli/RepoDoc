[Accueil](../index.md) › [firebase/auth](package-summary.md) › onAuthStateChanged

# onAuthStateChanged

*Fonction — `firebase/auth`*

**Import**
```ts
import { onAuthStateChanged } from 'firebase/auth'
```

**Signature**
```ts
function onAuthStateChanged(
  auth: Auth,
  nextOrObserver: NextOrObserver<User>,
  error?: ErrorFn,
  completed?: CompleteFn,
): Unsubscribe
```

**Description**
Appelle ta fonction à chaque connexion ou déconnexion, et une fois au démarrage.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `auth` | `Auth` | Le service d'authentification |
| `nextOrObserver` | `(user: User \| null) => void` | Appelée avec l'utilisateur, ou `null` |
| `error`, `completed` | fonctions (facultatives) | Rarement utiles |

**Retour** : `Unsubscribe`, une fonction à appeler pour arrêter l'écoute.

**Exemple**
```ts
const stop = onAuthStateChanged(auth, (user) => {
  console.log(user ? `connecté : ${user.uid}` : 'déconnecté')
})
stop() // arrête l'écoute
```

---

← [signInAnonymously](signInAnonymously.md) · [Résumé du package](package-summary.md) · [signOut](signOut.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
