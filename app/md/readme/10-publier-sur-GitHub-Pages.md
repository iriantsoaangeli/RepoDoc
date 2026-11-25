# Publier sur GitHub Pages

Une seule fois, dans le dépôt GitHub :

1. **Settings → Pages**
2. **Source** : *Deploy from a branch*
3. **Branch** : `main`, dossier `/ (root)`

Le fichier `index.html` à la racine redirige vers `app/html/`, et `.nojekyll` empêche GitHub de transformer les fichiers.

Ensuite, chaque `git push` sur `main` met le site à jour en une à deux minutes. Le suivi du déploiement est dans l'onglet **Actions** du dépôt (« pages build and deployment »).

## Comment le site trouve les fichiers

En ligne, le site demande la liste des fichiers du dossier `app/md` à l'**API GitHub**, puis télécharge les pages depuis GitHub Pages. La liste est gardée dans le navigateur : à chaque ouverture, le site demande seulement « a-t-elle changé ? » (réponse vide si non). Conséquences :

- un fichier n'apparaît qu'une fois **poussé** sur `main` ;
- l'API GitHub limite à **60 requêtes par heure** et par adresse IP ; une réponse « rien n'a changé » ne compte pas. En cas de dépassement, le site utilise la dernière liste connue, ou affiche un message s'il n'en a pas.
