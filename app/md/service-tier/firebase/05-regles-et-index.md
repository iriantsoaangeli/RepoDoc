# 05 — Règles de sécurité et index

## Pourquoi c'est le fichier le plus important

Sans serveur, **les règles sont ta seule protection** : la config Firebase (`apiKey`, `projectId`) est lisible dans l'APK, donc n'importe qui peut appeler ta base sans passer par ton app. Les règles font à la fois :
- le contrôle d'accès (qui lit/écrit quoi) ;
- la validation des données (champs autorisés, types, tailles).

## ✅ Checklist

- [ ] 1. Coller `firestore.rules`
- [ ] 2. Coller `firestore.indexes.json`
- [ ] 3. Tester sur l'émulateur (doc 06, étape 5)
- [ ] 4. Déployer

---

## 1. `firestore.rules`

Correspond au modèle du doc 03.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function isOwner(uid) { return signedIn() && request.auth.uid == uid; }
    function validStr(v, max) { return v is string && v.size() > 0 && v.size() <= max; }
    function userPath() { return /databases/$(database)/documents/users/$(request.auth.uid); }
    function myName() { return get(userPath()).data.name; }           // nom AVANT l'écriture
    function myNameAfter() { return getAfter(userPath()).data.name; } // nom APRÈS le batch

    // ---------- Profils : users/{uid} ----------
    match /users/{uid} {
      allow read: if signedIn();
      allow create, update: if isOwner(uid)
                            && request.resource.data.keys().hasOnly(['name'])
                            && validStr(request.resource.data.name, 50);

      // Favoris : privés
      match /favorites/{itemId} {
        allow read, delete: if isOwner(uid);
        allow create, update: if isOwner(uid)
                              && request.resource.data.keys().hasOnly(['title', 'price', 'thumb'])
                              && (!('thumb' in request.resource.data)
                                  || (request.resource.data.thumb is string
                                      && request.resource.data.thumb.size() <= 30000));
      }
    }

    // ---------- Photos en base64 : photos/{photoId} ----------
    match /photos/{photoId} {
      allow read:   if signedIn();
      allow create: if isOwner(request.resource.data.owner)
                    && request.resource.data.keys().hasOnly(['owner', 'b64', 'createdAt'])
                    && request.resource.data.b64 is string
                    && request.resource.data.b64.size() <= 700000
                    && request.resource.data.createdAt == request.time;
      allow delete: if isOwner(resource.data.owner);
      // pas de update : une photo ne se modifie pas, on en crée une nouvelle
    }

    // ---------- Annonces : items/{itemId} ----------
    function validItem(d) {
      return d.keys().hasAll(['title', 'price', 'owner', 'ownerName', 'createdAt'])
          && d.keys().hasOnly(['title', 'price', 'owner', 'ownerName', 'createdAt', 'thumb', 'photoId', 'tags'])
          && validStr(d.title, 200)
          && d.price is number && d.price >= 0
          && (!('thumb' in d) || (d.thumb is string && d.thumb.size() <= 30000))
          && (!('photoId' in d) || d.photoId is string)
          && (!('tags' in d) || (d.tags is list && d.tags.size() <= 10));
    }

    match /items/{itemId} {
      allow read:   if signedIn();
      allow create: if isOwner(request.resource.data.owner)
                    && validItem(request.resource.data)
                    && request.resource.data.createdAt == request.time
                    && request.resource.data.ownerName == myName();
      allow update: if isOwner(resource.data.owner)
                    && validItem(request.resource.data)
                    && request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['title', 'price', 'thumb', 'photoId', 'tags', 'ownerName'])
                    && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['ownerName'])
                        || request.resource.data.ownerName == myNameAfter());
      allow delete: if isOwner(resource.data.owner);

      // Commentaires : sous-collection
      match /comments/{commentId} {
        allow read:   if signedIn();
        allow create: if isOwner(request.resource.data.owner)
                      && request.resource.data.keys().hasOnly(['text', 'owner', 'ownerName', 'createdAt'])
                      && validStr(request.resource.data.text, 500)
                      && request.resource.data.createdAt == request.time
                      && request.resource.data.ownerName == myName();
        // l'auteur du commentaire OU le propriétaire de l'annonce
        allow delete: if isOwner(resource.data.owner)
                      || isOwner(get(/databases/$(database)/documents/items/$(itemId)).data.owner);
      }
    }
  }
}
```

### Ce que font ces règles

| Règle | Effet |
|---|---|
| Rien n'est autorisé sans `match` | Toute collection non listée est interdite. |
| `signedIn()` pour lire | Il faut être connecté (anonyme suffit) pour lire. |
| `keys().hasOnly([...])` | Refuse tout champ non prévu. **C'est ta validation de données.** |
| `b64.size() <= 700000` / `thumb.size() <= 30000` | Personne ne peut remplir ton 1 Gio avec des photos géantes. Doit correspondre aux limites de `src/photos.ts`. |
| `createdAt == request.time` | Oblige l'app à utiliser `serverTimestamp()`, pas une date trafiquée. |
| `ownerName == myName()` | Impossible de publier sous un faux nom. Coût : 1 lecture en plus par création. |
| `ownerName == myNameAfter()` | Au renommage, la copie doit correspondre au **nouveau** nom (`getAfter` lit l'état après le batch). |
| `diff(...).affectedKeys().hasOnly(...)` | Liste exacte des champs modifiables : `owner` et `createdAt` sont figés. |
| Pas de `update` sur `photos` | Une photo ne se modifie pas. |
| `delete` des commentaires | L'auteur, **ou** le propriétaire de l'annonce (nécessaire pour que `deleteItem()` nettoie). |
| `match /comments` **dans** `match /items` | Les règles d'une sous-collection s'écrivent dans le bloc du parent. |
| Profil obligatoire avant de publier | `myName()` lit `users/{uid}` : s'il n'existe pas, la création est refusée. |

Vocabulaire : `resource.data` = le document **en base**, `request.resource.data` = le document **après** l'écriture.

Limite technique : une écriture groupée (batch) peut faire au maximum 20 appels `get()` / `getAfter()`. C'est pour ça que `renameProfile()` et `deleteItem()` travaillent **par paquets de 10**.

## 2. `firestore.indexes.json`

```json
{
  "indexes": [
    {
      "collectionGroup": "items",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "owner", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": [
    { "collectionGroup": "photos", "fieldPath": "b64", "indexes": [] },
    { "collectionGroup": "items", "fieldPath": "thumb", "indexes": [] },
    { "collectionGroup": "favorites", "fieldPath": "thumb", "indexes": [] }
  ]
}
```

| Partie | Pourquoi |
|---|---|
| `indexes` : `owner` + `createdAt` | Requête « mes annonces triées par date » (filtre et tri sur deux champs différents). Sans lui : erreur avec un lien pour le créer. |
| `fieldOverrides` avec `indexes: []` | Désactive l'indexation des champs base64 (doc 04) : place économisée sur le 1 Gio. |

## 3. Tester avant de déployer

Voir doc 06, étape 5. Tests minimum :

| Test | Résultat attendu |
|---|---|
| Publier sans profil | ❌ refusé |
| Publier avec profil | ✅ |
| Modifier l'annonce d'un autre | ❌ refusé |
| Changer `owner` de son annonce | ❌ refusé |
| Photo de plus de 700 000 caractères | ❌ refusé |
| Supprimer son annonce (avec commentaires d'autres utilisateurs) | ✅ |

## 4. Déployer

```bash
$ firebase deploy --only firestore
```

Déploie règles + index (gratuit en Spark). La construction de l'index prend quelques minutes : 🔗 `https://console.firebase.google.com/project/PROJECT_ID/firestore/indexes`

Vérifier les règles en ligne : 🔗 `https://console.firebase.google.com/project/PROJECT_ID/firestore/rules`

➡️ Suite : `06-code-app.md`
