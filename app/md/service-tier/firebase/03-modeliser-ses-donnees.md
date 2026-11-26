# 03 — Modéliser ses données (NoSQL avec Firestore)

**Quand :** après le doc 02, **avant** d'écrire les règles (05) et le code (06) : les deux en découlent.

## Le principe

En SQL, tu pars des données (« utilisateurs, annonces → 2 tables »).
En Firestore, tu pars **des écrans** : « l'écran X affiche quoi → je range les données pour qu'il se charge en lisant le moins de documents possible ».

Pourquoi : chaque document lu compte dans les 50 000/jour, et **il n'y a pas de JOIN**.

## ✅ Checklist

- [ ] 1. Lister les écrans
- [ ] 2. Pour chaque écran : ce qu'il affiche → la requête
- [ ] 3. Dessiner les documents (recopier ce qui s'affiche ensemble)
- [ ] 4. Compter les lectures par écran (objectif ≤ 20-30)
- [ ] 5. Écrire les règles (doc 05)
- [ ] 6. Lister les index composites (doc 05)
- [ ] 7. Lister ce que **l'app** doit tenir à jour elle-même (copies) — pas de serveur en Spark

---

## Exemple complet : app d'annonces (celui implémenté dans les docs 05-06)

### Écrans → requêtes

| Écran | Affiche | Requête |
|---|---|---|
| Accueil | 20 dernières annonces : **miniature**, titre, prix, nom du vendeur | `items` trié par `createdAt` desc, limit 20 |
| Détail | Photo pleine taille + commentaires | 1 doc `photos/{photoId}` + `items/{id}/comments` limit 20 |
| Mes annonces | Mes annonces + leur nombre | `items` où `owner == moi` + `getCountFromServer` |
| Mes favoris | Miniature, titre, prix | `users/{moi}/favorites` |
| Profil | Nom | 1 doc `users/{uid}` |

### Documents

```
users/{uid}                                   ← id = uid
  { name: "Rado" }

users/{uid}/favorites/{itemId}                ← id = id de l'annonce (pas de doublon)
  { title: "Vélo", price: 50, thumb: "<base64 ~20 Ko>" }        ← RECOPIÉ

items/{itemId}
  { title: "Vélo", price: 50, tags: ["vélo", "sport"],
    owner: "abc", ownerName: "Rado",                             ← RECOPIÉ depuis users
    thumb: "<base64 ~20 Ko>",                                    ← miniature pour la liste
    photoId: "p123",                                             ← lien vers la grande photo
    createdAt: <date> }

items/{itemId}/comments/{commentId}           ← sous-collection
  { text: "Toujours dispo ?", owner: "xyz", ownerName: "Hery", createdAt: <date> }

photos/{photoId}                              ← à part : lue seulement à l'ouverture du détail
  { owner: "abc", b64: "<base64 ≤ 700 000 caractères>", createdAt: <date> }
```

### Lectures par écran

| Écran | Lectures | Façon SQL (sans recopie) |
|---|---|---|
| Accueil | 20 | 20 + 20 profils = 40 |
| Détail | 1 photo (0 si déjà en cache) + 20 commentaires | + 20 profils |
| Mes annonces (nombre) | 1 par tranche de 1 000 annonces comptées | — |
| Favoris | 1 par favori | + 1 annonce par favori |

## Les patterns

| Besoin | SQL | Firestore | Dans l'exemple |
|---|---|---|---|
| Info d'un autre document | `JOIN` | **Recopier** le champ | `ownerName` |
| Liste courte et bornée | Table | **Tableau** dans le document | `tags` (max 10) |
| Liste longue / sans limite | Table | **Sous-collection** | `comments` |
| Plusieurs-à-plusieurs | Table de liaison | Sous-collection chez l'un des deux | `favorites` |
| Compter | `COUNT(*)` | `getCountFromServer` (1 lecture / 1 000 docs) | `countMyItems()` |
| 1 doc par utilisateur | `WHERE user_id=?` | **id = uid** → lecture directe | `users/{uid}` |
| Pas de doublon | `UNIQUE` | **id choisi** au lieu d'un id auto | `favorites/{itemId}` |
| Gros contenu rarement affiché | Colonne BLOB | **Document séparé** | `photos/{id}` |
| Filtrer sur un tag | `JOIN tags` | `array-contains` | `itemsWithTag()` |

## Sans serveur : qui tient les copies à jour ?

L'app, et les règles vérifient qu'elle le fait correctement.

| Copie / effet | Fait par | Vérifié par la règle |
|---|---|---|
| `ownerName` à la création | `createItem()` lit le profil et recopie le nom | `ownerName == myName()` |
| `ownerName` au renommage | `renameProfile()` met à jour le profil + toutes mes annonces, par paquets de 10 | `ownerName == myNameAfter()` |
| Commentaires et photo d'une annonce supprimée | `deleteItem()` les supprime avant l'annonce | Le propriétaire de l'annonce peut supprimer ses commentaires |

Limites assumées (pas de serveur pour les rattraper) :
- `ownerName` dans les **commentaires** n'est pas mis à jour au renommage.
- Si l'app est coupée au milieu d'une suppression, il peut rester des commentaires orphelins.
- Un favori garde l'ancien titre/prix si l'annonce change ou disparaît → à l'ouverture d'un favori, lis l'annonce et supprime le favori si elle n'existe plus.

## Les limites de Firestore

| Limite | Conséquence |
|---|---|
| **1 Mio max par document** | Photo pleine taille ≤ ~510 Ko (doc 04). Rien qui grossit sans fin dans un document. |
| ~1 écriture/seconde soutenue sur **un même** document | OK pour du perso/test. |
| Supprimer un document **ne supprime pas** ses sous-collections | D'où `deleteItem()`. |
| Pas de recherche plein texte | Tableau de mots-clés + `array-contains`. |
| Filtre + tri sur deux champs différents | Index composite (doc 05). |

## Grille vierge pour TON app

**Écrans**

| Écran | Affiche (champs) | Filtre / tri | Nb max d'éléments |
|---|---|---|---|
| | | | |

**Documents**

| Chemin | Champs | Champs recopiés (depuis où) | Qui lit | Qui écrit |
|---|---|---|---|---|
| | | | | |

**Copies à tenir à jour par l'app**

| Copie | Quand la mettre à jour |
|---|---|
| | |

➡️ Suite : `04-photos-base64.md`
