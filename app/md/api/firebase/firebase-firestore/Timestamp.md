[Accueil](../index.md) › [firebase/firestore](package-summary.md) › Timestamp

# Timestamp

*Classe — `firebase/firestore` · Classes*

**Import**
```ts
import { Timestamp } from 'firebase/firestore'
```

**Description**
Type « date » de Firestore (précision à la nanoseconde). C'est ce qu'on lit dans un champ date.

**Membres**

| Membre | Rôle |
|---|---|
| `Timestamp.now()` | Heure actuelle **de l'appareil** (⚠️ refusée par une règle `== request.time` ; utilise `serverTimestamp()`) |
| `Timestamp.fromDate(date)` | Depuis une `Date` JavaScript |
| `Timestamp.fromMillis(ms)` | Depuis des millisecondes |
| `ts.toDate()` | Vers une `Date` JavaScript (pour l'affichage) |
| `ts.toMillis()` | Vers des millisecondes (pour comparer) |

**Exemple**
```ts
const ilYa30Jours = Timestamp.fromMillis(Date.now() - 30 * 24 * 3600 * 1000)
const q = query(notesRead, where('owner', '==', auth.currentUser!.uid), where('createdAt', '<', ilYa30Jours))
console.log(ilYa30Jours.toDate().toLocaleString())
```

---

← [QuerySnapshot](QuerySnapshot.md) · [Résumé du package](package-summary.md) · [FirestoreError](FirestoreError.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
