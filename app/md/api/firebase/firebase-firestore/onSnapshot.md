[Accueil](../index.md) › [firebase/firestore](package-summary.md) › onSnapshot

# onSnapshot

*Fonction — `firebase/firestore` · Lecture*

**Import**
```ts
import { onSnapshot } from 'firebase/firestore'
```

**Signature (forme la plus courante)**
```ts
function onSnapshot<A, D>(
  query: Query<A, D>,
  onNext: (snapshot: QuerySnapshot<A, D>) => void,
  onError?: (error: FirestoreError) => void,
): Unsubscribe
```
(Existe aussi avec une `DocumentReference` à la place de `query`.)

**Description**
**Temps réel** : appelle `onNext` tout de suite avec le résultat, puis à chaque changement.

**Retour** : `Unsubscribe`, à appeler pour arrêter l'écoute (par exemple dans `onUnmounted` d'un composant Vue).

**Coût** : 1 lecture par document au départ, puis 1 lecture par document ajouté ou modifié. ⚠️ À éviter sur des listes qui contiennent des photos base64.

**Exemple**
```ts
const uid = auth.currentUser!.uid
const stop = onSnapshot(
  query(notesRead, where('owner', '==', uid), limit(20)),
  (snap) => console.log(snap.docs.map((d) => d.data().title)),
  (err) => console.error(err.code),
)
stop()
```

---

← [getDocs](getDocs.md) · [Résumé du package](package-summary.md) · [getCountFromServer](getCountFromServer.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
