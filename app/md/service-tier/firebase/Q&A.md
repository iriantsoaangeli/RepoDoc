# Q&A — Questions fréquentes (version Spark, sans carte)

## Sommaire

1. [Pourquoi jamais Blaze ? Qu'est-ce qu'on perd ?](#1-pourquoi-jamais-blaze--quest-ce-quon-perd-)
2. [Je peux recevoir une facture ?](#2-je-peux-recevoir-une-facture-)
3. [Que se passe-t-il quand un quota est dépassé ?](#3-que-se-passe-t-il-quand-un-quota-est-dépassé-)
4. [Faut-il écrire une API ?](#4-faut-il-écrire-une-api-)
5. [Firestore, c'est quoi exactement ?](#5-firestore-cest-quoi-exactement-)
6. [NoSQL, ça veut dire quoi ?](#6-nosql-ça-veut-dire-quoi-)
7. [Comment je « crée la base de données » ?](#7-comment-je-crée-la-base-de-données-)
8. [Sans serveur, où se fait la validation ?](#8-sans-serveur-où-se-fait-la-validation-)
9. [Pourquoi les photos en base64 ? Quelles limites ?](#9-pourquoi-les-photos-en-base64--quelles-limites-)
10. [Pourquoi la photo n'est pas directement dans l'annonce ?](#10-pourquoi-la-photo-nest-pas-directement-dans-lannonce-)
11. [Et les PDF / documents ?](#11-et-les-pdf--documents-)
12. [Sans serveur, comment compter et tenir les copies à jour ?](#12-sans-serveur-comment-compter-et-tenir-les-copies-à-jour-)
13. [C'est quoi un index composite ? Et `fieldOverrides` ?](#13-cest-quoi-un-index-composite--et-fieldoverrides-)
14. [La clé `apiKey` dans l'APK, c'est grave ?](#14-la-clé-apikey-dans-lapk-cest-grave-)
15. [Et si plus tard je veux des notifs push ou des tâches planifiées ?](#15-et-si-plus-tard-je-veux-des-notifs-push-ou-des-tâches-planifiées-)

---

## 1. Pourquoi jamais Blaze ? Qu'est-ce qu'on perd ?

Spark = aucune carte, aucune facture possible. En échange, ces services sont indisponibles :

| Perdu | Remplacé par |
|---|---|
| Cloud Functions (code serveur) | SDK + règles de sécurité |
| Cloud Storage (fichiers) | Photos en base64 dans Firestore |
| Tâches planifiées | Rien (nettoyage fait par l'app au moment des suppressions) |
| Notifs push automatiques | Rien |

## 2. Je peux recevoir une facture ?

Non, tant qu'aucun compte de facturation n'est lié au projet. Le seul moyen d'en avoir une : cliquer sur **Upgrade / Modify plan / Blaze** et ajouter une carte. Ne le fais pas.

## 3. Que se passe-t-il quand un quota est dépassé ?

Les opérations concernées échouent (code `resource-exhausted`) jusqu'à la remise à zéro, **vers minuit heure du Pacifique = vers 10h-11h à Madagascar**. Le stockage (1 Gio) et le téléchargement (10 Gio/mois) ne se remettent pas à zéro chaque jour : le stockage dépend de ce que tu gardes, le téléchargement repart chaque mois. Gestion de l'erreur dans l'app : doc 07.

## 4. Faut-il écrire une API ?

Non, et en Spark tu ne peux pas (pas de Cloud Functions).

- Google fait tourner Firestore, qui sait déjà **lire, créer, modifier, supprimer, filtrer, trier** dans n'importe quelle collection. C'est une boîte noire : tu ne vois ni ne modifies son code.
- Le **SDK** (`firebase/firestore`) remplace ton `fetch` : `addDoc(...)` envoie la requête.
- Les **règles** (`firestore.rules`) remplacent ton code de contrôle.

```
App ──SDK──► Firestore (Google) ◄── firestore.rules
```

## 5. Firestore, c'est quoi exactement ?

Une **base de données hébergée par Google** :
- rien à installer ni à maintenir ;
- **NoSQL orientée documents** (des objets JSON, question 6) ;
- accessible directement depuis l'app, protégée par les règles ;
- temps réel possible (`onSnapshot`) ;
- comptée **à l'opération** : 1 document lu = 1 lecture, quelle que soit sa taille.

## 6. NoSQL, ça veut dire quoi ?

Mêmes données dans les deux mondes :

**SQL** — tables à colonnes fixes, reliées par des id :

```
users                      annonces
id | nom                   id | titre | prix | user_id
1  | Rado                  10 | Vélo  | 50   | 1
```

Afficher « Vélo, 50, par Rado » → `JOIN`.

**Firestore** — collections de documents JSON :

```
users/1        → { name: "Rado" }
items/10       → { title: "Vélo", price: 50, owner: "1", ownerName: "Rado" }
```

| | SQL | Firestore |
|---|---|---|
| Structure | Fixe, déclarée avant | Libre, par document |
| Relations | `JOIN` | **Pas de JOIN** : on recopie (`ownerName`) ou on fait 2 lectures |
| Recopier | À éviter | Normal : 1 lecture suffit pour afficher |
| Revers | — | Mettre à jour les copies (`renameProfile`) |
| Listes | Table séparée | Tableau dans le doc ou sous-collection |
| Requêtes | Tout | Égalité, comparaisons, tri, limite ; pas de plein texte, pas de JOIN |
| Conception | « Quelles entités ? » | « **Chaque écran lit quoi ?** » |

Méthode complète : doc 03.

## 7. Comment je « crée la base de données » ?

1. Une fois dans la console (doc 02, étape 2), région `europe-west1`, définitive.
2. **Pas de tables à créer** : une collection apparaît au premier document écrit.
3. La structure est définie par ton code (`db.ts`) et vérifiée par les règles (`validItem`, `hasOnly`).

## 8. Sans serveur, où se fait la validation ?

Dans `firestore.rules` (doc 05) : champs autorisés (`hasOnly`), types (`is string`, `is number`), tailles (`size() <= 200`). Une écriture invalide est refusée par Google avant d'arriver en base. Valider aussi dans l'app sert à afficher un message clair, mais **seules les règles protègent** : n'importe qui peut appeler Firestore sans passer par ton app.

## 9. Pourquoi les photos en base64 ? Quelles limites ?

Cloud Storage n'existe pas en Spark. La photo devient du texte dans un champ Firestore.

| Limite | Valeur |
|---|---|
| Document | 1 Mio max |
| Gonflement base64 | +33 % → photo ≤ ~510 Ko de JPEG |
| Stockage total | 1 Gio → ~3 000 photos de 300 Ko |
| Téléchargement | 10 Gio/mois |

Détails : doc 04.

## 10. Pourquoi la photo n'est pas directement dans l'annonce ?

Une liste de 20 annonces avec chacune une photo de 500 Ko = ~10 Mo téléchargés à chaque ouverture de l'écran → les 10 Gio/mois partent en ~1 000 ouvertures. Donc :
- **miniature** (~20 Ko) dans l'annonce → la liste reste légère ;
- **grande photo** dans `photos/{id}` → lue seulement quand on ouvre le détail, et ensuite depuis le cache.

## 11. Et les PDF / documents ?

Pas dans cette version : un document de plusieurs Mo ne tient pas dans 1 Mio. Il faudrait le découper en morceaux sur plusieurs documents, ce qui consomme vite le 1 Gio. Choix fait : photos seulement.

## 12. Sans serveur, comment compter et tenir les copies à jour ?

| Besoin | Solution Spark |
|---|---|
| Nombre d'annonces | `getCountFromServer` : Firestore compte, 1 lecture par tranche de 1 000 documents |
| `ownerName` à jour après renommage | `renameProfile()` met à jour le profil et les annonces ; les règles vérifient que la copie = nouveau nom |
| Commentaires d'une annonce supprimée | `deleteItem()` les supprime avant l'annonce |

Limites : les noms dans les commentaires ne sont pas mis à jour ; une suppression interrompue peut laisser des orphelins.

## 13. C'est quoi un index composite ? Et `fieldOverrides` ?

- **Index composite** : nécessaire quand une requête filtre sur un champ et trie sur un autre (`owner == moi` trié par `createdAt`). Déclaré dans `firestore.indexes.json`. Si tu l'oublies, l'erreur contient un lien qui le crée.
- **`fieldOverrides` avec `indexes: []`** : désactive l'indexation d'un champ. Utilisé pour les champs base64 : ça ne sert à rien de les indexer et ça prend de la place sur le 1 Gio.

## 14. La clé `apiKey` dans l'APK, c'est grave ?

Non. Elle identifie ton projet, ce n'est pas un mot de passe. **La sécurité vient des règles**, d'où leur importance. Ce qui peut arriver au pire avec de bonnes règles : quelqu'un épuise tes lectures du jour (aucun coût, l'app est en pause jusqu'au lendemain). Protection possible plus tard : App Check.

## 15. Et si plus tard je veux des notifs push ou des tâches planifiées ?

Ça nécessite du code serveur, donc Cloud Functions, donc **Blaze** (carte bancaire, avec des quotas gratuits). Les données et les règles de cette version restent valables : il suffirait d'ajouter des fonctions à côté. Les photos pourraient alors passer sur Cloud Storage.
