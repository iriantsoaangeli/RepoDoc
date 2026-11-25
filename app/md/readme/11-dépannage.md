# Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| Une nouvelle page n'apparaît pas | cache de session, ou déploiement en cours | bouton **⟳**, puis vérifier l'onglet **Actions** |
| « Page introuvable » | fichier déplacé, renommé, caché, ou plus de 3 niveaux | vérifier le chemin et les `hidden` |
| Un lien s'affiche en texte | aucun fichier ne correspond | vérifier le nom ; un lien avec espaces doit utiliser `%20` ou `<…>` |
| « API GitHub : erreur 404 » | `repo` mal renseigné dans `config.yaml` | mettre `compte/dépôt`, ou laisser vide |
| « Limite de l'API GitHub atteinte » | plus de 60 requêtes/heure | attendre quelques minutes |
| Le déploiement échoue (`No url found for submodule path`) | un dossier contenant son propre `.git` a été commité | `git rm --cached <dossier>`, l'ajouter au `.gitignore`, recommiter |
| Le PDF ne s'affiche pas dans la page (mobile) | le navigateur n'a pas de lecteur intégré | lien **Ouvrir dans un nouvel onglet** |
| Une page avec `?` ou `#` dans son nom ne charge pas | ces caractères coupent l'adresse | renommer le fichier |
| Le titre de la page est un lien bizarre | le fichier commence par `# [[…]]` (Obsidian) | remplacer par un vrai `# Titre` |
