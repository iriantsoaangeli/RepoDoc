# Ajouter une page en 30 secondes

```bash
# 1. Créer le fichier dans un thème et un sujet
mkdir -p app/md/outils/git
nano app/md/outils/git/SSH.md

# 2. Pousser
git add app/md/outils/git/SSH.md
git commit -m "notes ssh"
git push
```

Une à deux minutes plus tard (le temps que GitHub Pages se mette à jour), la page est en ligne à l'adresse :

```
https://<compte>.github.io/<dépôt>/app/html/#/outils/git/SSH.md
```

Si elle n'apparaît pas tout de suite, cliquer sur le bouton **⟳ (Recharger le contenu)** en haut à droite du site : la liste des fichiers est gardée en cache pendant la session.
