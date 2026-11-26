[Accueil](../index.md) › [firebase/firestore](package-summary.md) › connectFirestoreEmulator

# connectFirestoreEmulator

*Fonction — `firebase/firestore` · Initialisation*

**Import**
```ts
import { connectFirestoreEmulator } from 'firebase/firestore'
```

**Signature**
```ts
function connectFirestoreEmulator(firestore: Firestore, host: string, port: number, options?: { mockUserToken?: EmulatorMockTokenOptions | string }): void
```

**Description**
Redirige Firestore vers l'émulateur local. À appeler avant toute lecture ou écriture.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `firestore` | `Firestore` | L'objet `db` |
| `host` | `string` | `'127.0.0.1'` |
| `port` | `number` | `8080` (valeur de `firebase.json`) |

**Exemple**
```ts
if (import.meta.env.VITE_USE_EMULATORS === '1') connectFirestoreEmulator(db, '127.0.0.1', 8080)
```

---

← [persistentLocalCache](persistentLocalCache.md) · [Résumé du package](package-summary.md) · [collection](collection.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
