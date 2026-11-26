# 01 — Plan Spark : ce qui est gratuit, ce qui est impossible

## Ce que tu utilises (et ses quotas gratuits)

| Service | Quota Spark |
|---|---|
| **Firestore** (base de données, édition Standard) | 1 Gio stocké · 50 000 lectures/jour · 20 000 écritures/jour · 20 000 suppressions/jour · 10 Gio de données téléchargées/mois |
| **Authentication** | 50 000 utilisateurs actifs/mois (anonyme, email, Google… ; pas de SMS) |

Les quotas journaliers repartent à zéro **vers minuit heure du Pacifique**, soit **vers 10h-11h à Madagascar** (selon l'heure d'été américaine).

Le quota gratuit ne s'applique qu'**à une seule base Firestore par projet** : garde la base `(default)`, n'en crée pas d'autre.

## Ce qui est impossible en Spark

| Impossible | Conséquence pour toi | Ce qu'on fait à la place |
|---|---|---|
| Cloud Functions (code serveur) | Pas d'API, pas de logique cachée côté serveur | SDK + règles de sécurité (docs 05-06) |
| Cloud Storage (fichiers) | Pas d'upload de fichiers classique | Photos en base64 dans Firestore (doc 04) |
| Tâches planifiées | Pas de nettoyage automatique la nuit | Suppression faite par l'app au moment voulu (doc 06) |
| Notifs push automatiques | L'app ne peut pas notifier un autre utilisateur | Abandonné |
| Compteurs/copies tenus par le serveur | — | `getCountFromServer` + mise à jour des copies par l'app (doc 03) |

## Quand on dépasse un quota en Spark

- **Aucune facture** : il n'y a pas de compte de facturation.
- Les opérations concernées **échouent** (erreur `resource-exhausted` / « quota exceeded ») jusqu'à la remise à zéro.
- Exemple : 50 000 lectures atteintes à 15h → plus aucune lecture jusqu'au lendemain ~10h-11h.

## Ce que ça représente

| Quota | Concrètement |
|---|---|
| 50 000 lectures/jour | Écran d'accueil de 20 annonces = 20 lectures → **2 500 ouvertures/jour** |
| 20 000 écritures/jour | 1 annonce avec photo = 2 écritures (annonce + photo) |
| 1 Gio stocké | Photos à ~300 Ko → **~3 000 photos** (doc 04) |
| 10 Gio téléchargés/mois | ~35 000 affichages de photo pleine taille/mois (les photos déjà vues viennent du cache, gratuit) |

## ⚠️ La seule règle d'or

**Ne clique jamais sur « Upgrade » / « Modify plan » / « Blaze »**, même si la console te le propose (elle le fera, par exemple dans le menu Storage ou Functions). C'est le seul moyen d'avoir une facture.
