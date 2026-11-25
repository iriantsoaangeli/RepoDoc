# Configuration globale

`app/md/config.yaml` :

```yaml
# Nom affiché dans le header
titre: Mes notes

# Dépôt GitHub au format "compte/dépôt".
# Vide = déduit de l'adresse du site (compte.github.io/dépôt).
repo:

# Chemin de ce dossier dans le dépôt (pour l'API GitHub)
dossier: app/md

# Thèmes ou pages à ne pas afficher
hidden: []
```

> `repo` attend **`compte/dépôt`**, pas une URL : `iriantsoaangeli/RepoDoc` et non `https://github.com/iriantsoaangeli/RepoDoc`. Dans le doute, laisser vide.
