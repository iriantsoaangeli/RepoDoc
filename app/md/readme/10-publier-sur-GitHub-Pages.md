# Publier sur GitHub Pages

Une seule fois, dans le dépôt GitHub :

1. **Settings → Pages**
2. **Source** : *Deploy from a branch*
3. **Branch** : `main`, dossier `/ (root)`

Le fichier `index.html` à la racine redirige vers `app/html/`, et `.nojekyll` empêche GitHub de transformer les fichiers.

Ensuite, chaque `git push` sur `main` met le site à jour en une à deux minutes. Le suivi du déploiement est dans l'onglet **Actions** du dépôt (« pages build and deployment »).

## Comment le site trouve les fichiers

En ligne, le site demande la liste des fichiers à l'**API GitHub** (une requête au chargement, gardée en cache pendant la session), puis télécharge chaque page depuis GitHub Pages. Conséquences :

- un fichier n'apparaît qu'une fois **poussé** sur `main` ;
- l'API GitHub limite à **60 requêtes par heure** et par adresse IP. Grâce au cache, c'est largement suffisant pour un usage normal ; en cas de dépassement, le site affiche un message, il suffit d'attendre.
