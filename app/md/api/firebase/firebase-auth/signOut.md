[Accueil](../index.md) › [firebase/auth](package-summary.md) › signOut

# signOut

*Fonction — `firebase/auth`*

**Import**
```ts
import { signOut } from 'firebase/auth'
```

**Signature**
```ts
function signOut(auth: Auth): Promise<void>
```

**Description**
Déconnecte l'utilisateur. ⚠️ Avec un compte **anonyme**, la reconnexion crée un **nouvel** utilisateur : les anciennes notes deviennent inaccessibles (les règles filtrent par uid).

---

← [onAuthStateChanged](onAuthStateChanged.md) · [Résumé du package](package-summary.md) · [connectAuthEmulator](connectAuthEmulator.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
