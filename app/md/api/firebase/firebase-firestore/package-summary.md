[Accueil](../index.md) › firebase/firestore

# Package `firebase/firestore`

## Initialisation

| Nom | Nature | Description |
|---|---|---|
| [initializeFirestore](initializeFirestore.md) | Fonction | Crée la connexion à la base avec des réglages (notamment le cache local). |
| [persistentLocalCache](persistentLocalCache.md) | Fonction | Garde les documents lus sur l'appareil (IndexedDB). |
| [connectFirestoreEmulator](connectFirestoreEmulator.md) | Fonction | Redirige Firestore vers l'émulateur local. |

## Références

| Nom | Nature | Description |
|---|---|---|
| [collection](collection.md) | Fonction | Crée une **référence** (un chemin) vers une collection. |
| [doc](doc.md) | Fonction | Crée une **référence** vers un document précis. |
| [withConverter](withConverter.md) | Méthode | Renvoie la même référence, mais **typée** : les lectures passent par le convertisseur et renvoient des objets de type `A` (ex. `Note`). |

## Lecture

| Nom | Nature | Description |
|---|---|---|
| [getDoc](getDoc.md) | Fonction | Lit un document. |
| [getDocFromCache](getDocFromCache.md) | Fonction | Lit un document **uniquement depuis le cache de l'appareil**, sans contacter le serveur. |
| [getDocs](getDocs.md) | Fonction | Exécute une requête (ou lit toute une collection si on lui passe une `CollectionReference`, ⚠️ à éviter sans `limit`). |
| [onSnapshot](onSnapshot.md) | Fonction | **Temps réel** : appelle `onNext` tout de suite avec le résultat, puis à chaque changement. |
| [getCountFromServer](getCountFromServer.md) | Fonction | Compte les documents d'une requête **sans les télécharger**. |

## Requêtes

| Nom | Nature | Description |
|---|---|---|
| [query](query.md) | Fonction | Construit une requête à partir d'une collection et de contraintes ([where](where.md), [orderBy](orderBy.md), [limit](limit.md), [startAfter](startAfter.md)). |
| [where](where.md) | Fonction | Filtre : ne garde que les documents dont le champ respecte la condition. |
| [orderBy](orderBy.md) | Fonction | Trie les résultats. |
| [limit](limit.md) | Fonction | Nombre maximum de documents renvoyés. |
| [startAfter](startAfter.md) | Fonction | Pagination : commence **après** le document donné (en général le dernier de la page précédente). |

## Écriture

| Nom | Nature | Description |
|---|---|---|
| [addDoc](addDoc.md) | Fonction | Crée un document avec un **id généré automatiquement**. |
| [setDoc](setDoc.md) | Fonction | Écrit un document **à un id que tu choisis**. |
| [updateDoc](updateDoc.md) | Fonction | Modifie **certains champs** d'un document **existant**. |
| [deleteDoc](deleteDoc.md) | Fonction | Supprime un document. |
| [writeBatch](writeBatch.md) | Fonction | Regroupe plusieurs écritures appliquées **toutes ensemble ou pas du tout**. |

## Valeurs spéciales

| Nom | Nature | Description |
|---|---|---|
| [serverTimestamp](serverTimestamp.md) | Fonction | Valeur spéciale : « mets l'heure du serveur dans ce champ ». |
| [increment](increment.md) | Fonction | Ajoute `n` à un champ numérique côté serveur, sans relire la valeur. |
| [deleteField](deleteField.md) | Fonction | Supprime **un champ** d'un document (avec `updateDoc` ou `setDoc(..., { merge: true })`). |
| [arrayUnion / arrayRemove](arrayUnion-arrayRemove.md) | Fonction | Ajoute des éléments à un tableau (sans doublon), ou en retire toutes les occurrences, côté serveur. |

## Classes

| Nom | Nature | Description |
|---|---|---|
| [DocumentSnapshot](DocumentSnapshot.md) | Classe | Un document lu, renvoyé par `getDoc`, `getDocFromCache` et `onSnapshot` (sur un document). |
| [QuerySnapshot](QuerySnapshot.md) | Classe | Résultat d'une requête (`getDocs`, `onSnapshot` sur une requête). |
| [Timestamp](Timestamp.md) | Classe | Type « date » de Firestore (précision à la nanoseconde). |
| [FirestoreError](FirestoreError.md) | Classe | Erreur levée par les fonctions Firestore. |

## Types

| Nom | Nature | Description |
|---|---|---|
| [DocumentData](DocumentData.md) | Interface | « N'importe quel objet » : type des données quand il n'y a pas de convertisseur. |
| [FieldValue](FieldValue.md) | Type | Type des valeurs spéciales renvoyées par `serverTimestamp()`, `increment()`, `deleteField()`, `arrayUnion()` et `arrayRemove()`. |
| [FirestoreDataConverter](FirestoreDataConverter.md) | Interface | Objet qui traduit entre la forme stockée `D` et la forme de l'app `A`. |
| [WithFieldValue / PartialWithFieldValue / UpdateData](WithFieldValue-PartialWithFieldValue-UpdateData.md) | Type | Types génériques du SDK pour les données envoyées à `addDoc`, `setDoc` et `updateDoc`. |
| [WhereFilterOp](WhereFilterOp.md) | Type | Les opérateurs de comparaison acceptés par `where` (`==`, `<`, `array-contains`, `in`…). |
| [OrderByDirection](OrderByDirection.md) | Type | Sens du tri pour `orderBy` : `'asc'` ou `'desc'`. |

