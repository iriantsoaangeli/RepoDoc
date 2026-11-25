# Cacher une page ou un dossier

Tout est affiché par défaut. Pour cacher quelque chose, l'ajouter à la liste `hidden` d'un `config.yaml`. Les chemins sont **relatifs au dossier du `config.yaml`**.

```yaml
# app/md/reseaux/config.yaml
hidden:
  - brouillon.md          # une page
  - 03-en-cours           # une leçon entière
```

```yaml
# app/md/config.yaml (global)
hidden:
  - framework             # un thème entier
  - cours/gestion-rh/contrat-de-travail-model/cdd.pdf
```

Un élément caché disparaît de la navigation, du sommaire, et **les liens vers lui sont affichés en texte**.

> Cacher n'est pas protéger : le fichier reste lisible dans le dépôt GitHub public.
