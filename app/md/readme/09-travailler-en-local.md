# Travailler en local

Prérequis : **Node.js 22.18+ ou 24.12+**.

## Prévisualiser le contenu

```bash
cd vue-project
npm install          # la première fois
npm run dev
```

Ouvrir l'adresse affichée (en général `http://localhost:5173/`). En local, le site lit directement les fichiers de `app/md/` sur le disque : pas besoin de pousser, un rafraîchissement de la page suffit pour voir les modifications.

## Reconstruire l'application

À faire **seulement si le code** (`vue-project/`) ou le style (`template/style.css`) a changé, pas pour du contenu :

```bash
./build.sh
```

Le script installe les dépendances si besoin, vérifie les types, compile l'application dans `app/html/`, génère `sw.js` à la racine (le service worker, voir [Hors ligne](08-lire-le-site.md#hors-ligne)), et crée `app/md/config.yaml` s'il n'existe pas (il ne touche jamais au contenu existant). Commiter ensuite `app/html/` et `sw.js` avec le reste.
