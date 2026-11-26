# Firebase 100 % gratuit (plan Spark, sans carte) pour une app Vue + Capacitor — TL;DR

Dernière vérification des quotas : **26 nov. 2026** (https://firebase.google.com/pricing et https://firebase.google.com/docs/firestore/quotas). Revérifie avant la prod, Google les change parfois.

## La réponse courte

1. **Plan Spark uniquement. Tu ne passes jamais en Blaze, tu n'ajoutes jamais de carte.** → aucune facture possible.
2. **Pas d'API à écrire.** L'app parle directement à Firestore avec le SDK Firebase. Les **règles de sécurité** décident qui peut lire/écrire quoi.
3. **Les photos sont stockées en base64 dans Firestore** (Cloud Storage n'existe pas en Spark).
4. **Ce que tu n'as pas** : notifs push automatiques, tâches planifiées, code serveur, fichiers PDF/documents. C'est le prix du « jamais Blaze ».

## Architecture

```
App Vue (APK Capacitor)
   │
   └── SDK Firebase ──► Firestore (serveurs Google)      ◄── firestore.rules (sécurité + validation)
         │                ├─ users/{uid}                 profils
         │                ├─ items/{id}                  annonces + miniature base64 (~20 Ko)
         │                │    └─ comments/{id}          commentaires
         │                ├─ photos/{id}                 photo pleine taille base64 (≤ ~510 Ko)
         │                └─ users/{uid}/favorites/{id}  favoris
         │
         └── Auth anonyme (un uid par installation, sans écran de login)
```

## Ordre de lecture / checklist globale

| # | Doc | Ce que tu fais | Temps |
|---|-----|----------------|-------|
| 1 | `Q&A.md` | Comprendre Firestore, NoSQL, pourquoi pas d'API | 10 min |
| 2 | `01-spark-ce-qui-est-gratuit.md` | Les quotas et ce qui est impossible | 5 min |
| 3 | `02-creer-projet.md` | Projet, Firestore, auth anonyme, app Web, outils | 20 min |
| 4 | `03-modeliser-ses-donnees.md` | Décider comment ranger tes données | 20 min |
| 5 | `04-photos-base64.md` | Comprendre le stockage des photos et ses limites | 10 min |
| 6 | `05-regles-et-index.md` | Écrire et déployer la sécurité | 20 min |
| 7 | `06-code-app.md` | Code Vue : connexion, photos, CRUD, test, APK | 30 min |
| 8 | `07-garde-fous-quotas.md` | Ne pas épuiser les quotas, que faire si ça arrive | 10 min |

## Convention

- `PROJECT_ID` = l'identifiant de ton projet (ex : `mon-app-4f2a1`). Remplace-le partout.
- 🔗 = **lien direct** vers la bonne page de la console (plus fiable que les menus, qui changent souvent).
- 🖱️ = clic à faire, texte exact du bouton (console en anglais).
- `$` = commande terminal Linux.
