# Référence API — Firebase en TypeScript

**Version :** SDK `firebase` 13.4 (SDK « modulaire »), plan Spark. Signatures relevées dans les fichiers de types du SDK le 26 nov. 2026.
**Portée :** les fonctions et types utilisés par l'app « Mes notes », plus le module générique du projet (`@/models/base`, `@/services/crud`).
**Référence officielle complète :** https://firebase.google.com/docs/reference/js

## Packages

| Package | Contenu | Membres |
|---|---|---|
| [`firebase/app`](firebase-app/package-summary.md) | Connexion au projet Firebase | 1 |
| [`firebase/auth`](firebase-auth/package-summary.md) | Authentification (connexion anonyme) | 8 |
| [`firebase/firestore`](firebase-firestore/package-summary.md) | Base de données : références, lecture, requêtes, écriture, types | 35 |
| [`@/models/base`](projet-models-base/package-summary.md) | Types génériques du projet (Db, App, Create, Update) et fabriques | 7 |
| [`@/services/crud`](projet-services-crud/package-summary.md) | Opérations génériques du projet (createOne, listMine…) | 6 |

## Commencer

- [Conventions de lecture](conventions.md) : comment lire une page, les paramètres de type `A` / `D`, le contexte des exemples
- [Index alphabétique](index-alphabetique.md) : tous les membres
