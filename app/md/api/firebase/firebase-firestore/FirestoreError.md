[Accueil](../index.md) › [firebase/firestore](package-summary.md) › FirestoreError

# FirestoreError

*Classe — `firebase/firestore` · Classes*

**Import**
```ts
import { FirestoreError } from 'firebase/firestore'
```

**Description**
Erreur levée par les fonctions Firestore. Hérite de `FirebaseError` (import depuis `firebase/app`). Propriétés : `code` (voir le tableau) et `message`.

**Codes (`FirestoreErrorCode`)** — les plus fréquents en gras :

| Code | Signification |
|---|---|
| **`permission-denied`** | Refusé par les règles de sécurité |
| **`resource-exhausted`** | Quota gratuit atteint |
| **`unavailable`** | Serveur injoignable (hors ligne), ou document absent du cache pour `getDocFromCache` |
| **`failed-precondition`** | Index composite manquant (le message contient un lien pour le créer) |
| **`not-found`** | `updateDoc` sur un document qui n'existe pas |
| **`invalid-argument`** | Donnée invalide (ex. champ `undefined`, document > 1 Mio) |
| `unauthenticated` | Pas d'identifiants valides |
| `already-exists`, `aborted`, `cancelled`, `deadline-exceeded`, `out-of-range`, `unimplemented`, `internal`, `data-loss`, `unknown` | Rares |

**Exemple**
```ts
try {
  await deleteDoc(noteDoc('aB3x'))
} catch (e) {
  if (e instanceof FirestoreError && e.code === 'permission-denied') console.log('refusé par les règles')
  else throw e
}
```

---

← [Timestamp](Timestamp.md) · [Résumé du package](package-summary.md) · [DocumentData](DocumentData.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
