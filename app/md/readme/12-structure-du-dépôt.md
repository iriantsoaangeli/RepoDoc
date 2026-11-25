# Structure du dépôt

```
.
├── app/
│   ├── html/          application compilée (générée par build.sh, à commiter)
│   └── md/            le contenu : thèmes, leçons, pages, PDF
├── vue-project/       code source de l'application (Vue 3 + Ionic)
│   └── src/
│       ├── lecteur/   lecture de la config, des fichiers, table des routes (MdRouter)
│       ├── markdown/  découpe du Markdown, ancres, coloration du code
│       ├── components/
│       └── views/     accueil / sommaire de thème, page
├── template/          maquette HTML et style.css (le style du site)
├── conception/        notes de conception
├── build.sh           compile l'application dans app/html/
├── index.html         redirection de la racine vers app/html/
├── sw.js              service worker (généré par build.sh, à commiter)
└── .nojekyll
```
