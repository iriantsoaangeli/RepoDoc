# RepoDoc

Un site de documentation qui affiche des fichiers Markdown (et des PDF) comme des pages web, hébergé sur GitHub Pages.

Pour ajouter une page, il suffit de **pousser un fichier `.md`** dans `app/md/` : pas de build, pas d'index à tenir à jour. Le site découvre les fichiers tout seul au chargement.

Site en ligne : `https://<compte>.github.io/<dépôt>/`

---

## Sommaire

- [Ajouter une page en 30 secondes](#ajouter-une-page-en-30-secondes)
- [Organisation du contenu](#organisation-du-contenu)
- [Écrire une page](#écrire-une-page)
- [Liens](#liens)
- [PDF](#pdf)
- [Cacher une page ou un dossier](#cacher-une-page-ou-un-dossier)
- [Configuration globale](#configuration-globale)
- [Lire le site](#lire-le-site)
- [Travailler en local](#travailler-en-local)
- [Publier sur GitHub Pages](#publier-sur-github-pages)
- [Dépannage](#dépannage)
- [Structure du dépôt](#structure-du-dépôt)

---

## Ajouter une page en 30 secondes

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

---

## Organisation du contenu

Tout le contenu est dans `app/md/`. L'arborescence fait la navigation :

```
app/md/
├── config.yaml                 configuration globale (titre, dépôt, pages cachées)
├── intro.md                    texte de la page d'accueil
│
├── reseaux/                    ← THÈME   : un onglet dans le header
│   ├── intro.md                texte affiché en haut du sommaire du thème
│   ├── config.yaml             (facultatif) pages cachées de ce thème
│   ├── glossaire.md            ← PAGE posée directement dans le thème
│   │
│   ├── 01-couche-4/            ← LEÇON (sujet) : un bloc pliable dans la colonne de droite
│   │   ├── intro.md            première page de la leçon, nommée « Introduction »
│   │   ├── tcp.md              ← PAGE
│   │   └── udp.md
│   │
│   └── corba/
│       └── Mise en pratique Corba.md
│
└── cours/
    └── gestion-rh/
        ├── Gestion de resources humaines.md
        └── contrat-de-travail-model/     ← dossier de PDF (voir « PDF »)
            └── cdd.pdf
```

### Les trois niveaux

| Niveau | Ce que c'est | Où il apparaît |
|---|---|---|
| **Thème** | dossier de premier niveau | onglet dans le header, sommaire `#/theme` |
| **Leçon** (sujet) | sous-dossier d'un thème | bloc pliable dans la colonne de droite |
| **Page** | fichier `.md` dans un thème ou une leçon | lien dans la colonne de droite |

**Trois niveaux maximum** pour les `.md` : un fichier plus profond (`theme/lecon/sous-dossier/page.md`) est **ignoré**. Seuls les PDF peuvent être rangés plus profond.

### Les fichiers `intro.md`

| Emplacement | Rôle |
|---|---|
| `app/md/intro.md` | texte de la page d'accueil, au-dessus du sommaire complet |
| `theme/intro.md` | texte en haut du sommaire du thème ; pas de lien dans la colonne de droite |
| `theme/lecon/intro.md` | première page de la leçon, affichée sous le nom « Introduction » |

Tous sont facultatifs.

### Noms et ordre

Les libellés affichés viennent des **noms de fichiers et de dossiers** :

- les `-` et `_` deviennent des espaces, la première lettre passe en majuscule : `gestion-rh` → « Gestion rh », `tcp.md` → « Tcp » ;
- un **préfixe numérique fixe l'ordre** et n'est pas affiché : `01-couche-4` → « Couche 4 », placé avant `02-couche-7` ;
- sans préfixe, l'ordre est alphabétique.

Le nom du fichier est aussi le libellé dans la colonne de droite : choisir un nom lisible (`Guide d'utilisation de Maven.md` plutôt que `gm.md`).

> **À éviter dans les noms** : `?` et `#`. Ils coupent l'adresse du fichier et la page ne se charge pas. Les espaces, accents, apostrophes et parenthèses ne posent pas de problème.

---

## Écrire une page

Une page est un fichier Markdown classique (syntaxe GitHub).

### Titre

Le **premier `# Titre`** du fichier devient le grand titre de la page. S'il n'y en a pas, c'est le nom du fichier qui sert de titre.

```markdown
# Le protocole TCP

Texte d'introduction…
```

### Table des matières

Les titres `##` et `###` forment automatiquement la table des matières **« Sur cette page »** à gauche. Le titre en cours de lecture y est surligné.

Inutile d'écrire un sommaire à la main en haut du fichier.

### Ce qui est pris en charge

| Élément | Syntaxe | Rendu |
|---|---|---|
| Gras, italique, `code` | `**gras**`, `*italique*`, `` `code` `` | |
| Listes, listes numérotées | `- élément`, `1. élément` | sous-listes possibles |
| Cases à cocher | `- [x] fait`, `- [ ] à faire` | cases non cliquables |
| Tableaux | syntaxe GitHub `\| a \| b \|` | lignes alternées |
| Citations | `> texte` | encadré avec une barre orange |
| Blocs de code | ` ```python ` … ` ``` ` | coloration + bouton **Copier** |
| Images | `![légende](schema.png)` | chemin relatif au `.md` |
| Séparateur | `---` | |

La coloration des blocs de code reconnaît la plupart des langages courants (Python, Java, JavaScript, C/C++, SQL, Bash…).

### Ancres de titres

Chaque titre reçoit un identifiant au **format GitHub / Obsidian** : en minuscules, accents conservés, ponctuation supprimée, espaces remplacés par `-`.

| Titre | Ancre |
|---|---|
| `## 2. Récupérer l'image` | `#2-récupérer-limage` |
| `## Poignée de main` | `#poignée-de-main` |

Un lien `[voir](#2-récupérer-limage)` écrit dans GitHub ou Obsidian marche donc tel quel. Une ancre écrite sans les accents (`#2-recuperer-l-image`) mène aussi au bon titre.

---

## Liens

Au moment d'afficher une page, le site **remplace chaque lien vers un fichier par l'adresse de la page correspondante**. Si aucun fichier ne correspond, le lien est **affiché comme du texte simple** (pas de lien cassé vers une page 404).

### Les formes acceptées

| Écrit dans le `.md` | Cherché | Exemple |
|---|---|---|
| Chemin relatif | depuis le dossier du `.md` | `[UDP](udp.md)`, `[ORB](../termes-techniques/Une%20ORB,%20c'est%20quoi.md)` |
| Chemin absolu | depuis `app/md/` | `[SSH](/outils/git/SSH.md)` |
| Nom seul | n'importe où dans `app/md/` | `[SSH](SSH.md)` |
| Sans extension (style Obsidian) | comme ci-dessus, avec `.md` ajouté | `[SSH](SSH)` |
| `intro.md` d'un thème | mène au sommaire du thème | `[Réseaux](/reseaux/intro.md)` |
| Avec une ancre | la page puis le titre | `[Fermeture](tcp.md#fermeture)` |
| Ancre seule | titre de la même page | `[Plus bas](#comparaison)` |
| Lien externe | laissé tel quel, ouvert dans un nouvel onglet | `[MDN](https://developer.mozilla.org)` |

La recherche par **nom seul** ignore les majuscules et les accents. Si deux fichiers portent le même nom, le premier dans l'ordre alphabétique des chemins l'emporte : préférer alors un chemin relatif.

Grâce à la recherche par nom, un lien continue de marcher quand on **déplace un fichier** dans un autre dossier.

### Espaces dans un lien

En Markdown, un lien ne peut pas contenir d'espace brut. Deux écritures possibles :

```markdown
[Mise en pratique](Mise%20en%20pratique%20Corba.md)
[Mise en pratique](<Mise en pratique Corba.md>)
```

Les liens Obsidian `[[Nom de la page]]` ne sont **pas** reconnus : les convertir en `[Nom de la page](<Nom de la page.md>)`.

---

## PDF

Un PDF s'affiche **dans le site**, comme une page : header, fil d'Ariane et colonne des leçons restent autour, et seul le lecteur PDF défile.

### Ajouter un PDF

1. Ranger le fichier n'importe où dans un thème, par exemple dans un sous-dossier de la leçon :
   ```
   app/md/cours/gestion-rh/contrat-de-travail-model/cdd.pdf
   ```
2. Faire un lien vers lui depuis un `.md`, avec n'importe quelle forme de la section [Liens](#liens) :
   ```markdown
   [Modèle de CDD](cdd.pdf)
   [Modèle de CDD](contrat-de-travail-model/cdd.pdf)
   [Modèle de CDD](/cours/gestion-rh/contrat-de-travail-model/cdd.pdf)
   ```

Le lien ouvre la page `#/cours/gestion-rh/contrat-de-travail-model/cdd.pdf`.

### Bon à savoir

- Les PDF **n'apparaissent pas dans la colonne de droite** : on les ouvre depuis un lien dans une page.
- Le PDF s'ouvre ajusté à la largeur, avec le lecteur intégré du navigateur.
- Au-dessus du lecteur : **Ouvrir dans un nouvel onglet** et **Télécharger**. Utile sur mobile, où certains navigateurs n'affichent pas le PDF dans la page.
- Pas de « Précédent / Suivant » sur une page PDF.

---

## Cacher une page ou un dossier

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

---

## Configuration globale

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

---

## Lire le site

| Élément | Rôle |
|---|---|
| **Header** | un onglet par thème ; **Accueil** = sommaire complet |
| **Colonne de gauche** « Sur cette page » | titres de la page, celui en cours est surligné |
| **Colonne de droite** | pages du thème, leçons pliables (celle de la page ouverte est dépliée) |
| **Fil d'Ariane** | Thème › Leçon › Page |
| **Précédent / Suivant** | en bas de page, dans l'ordre du thème |
| **⟳** | recharge la liste des fichiers (après un `git push`) |
| **Mode sombre** | suit le réglage du système |

Sur mobile, les deux colonnes sont dans le menu **☰**.

### Adresses

L'adresse d'une page est le **chemin de son fichier** :

```
#/                                            accueil
#/reseaux                                     sommaire du thème
#/reseaux/01-couche-4/tcp.md                  une page
#/reseaux/01-couche-4/tcp.md#poignée-de-main  une section de la page
#/cours/gestion-rh/contrat-de-travail-model/cdd.pdf   un PDF
```

Pour partager une section avec quelqu'un, cliquer sur le titre dans « Sur cette page » puis copier l'adresse.

---

## Travailler en local

Prérequis : **Node.js 22.18+ ou 24.12+**.

### Prévisualiser le contenu

```bash
cd vue-project
npm install          # la première fois
npm run dev
```

Ouvrir l'adresse affichée (en général `http://localhost:5173/`). En local, le site lit directement les fichiers de `app/md/` sur le disque : pas besoin de pousser, un rafraîchissement de la page suffit pour voir les modifications.

### Reconstruire l'application

À faire **seulement si le code** (`vue-project/`) ou le style (`template/style.css`) a changé, pas pour du contenu :

```bash
./build.sh
```

Le script installe les dépendances si besoin, vérifie les types, compile l'application dans `app/html/`, et crée `app/md/config.yaml` s'il n'existe pas (il ne touche jamais au contenu existant). Commiter ensuite `app/html/` avec le reste.

---

## Publier sur GitHub Pages

Une seule fois, dans le dépôt GitHub :

1. **Settings → Pages**
2. **Source** : *Deploy from a branch*
3. **Branch** : `main`, dossier `/ (root)`

Le fichier `index.html` à la racine redirige vers `app/html/`, et `.nojekyll` empêche GitHub de transformer les fichiers.

Ensuite, chaque `git push` sur `main` met le site à jour en une à deux minutes. Le suivi du déploiement est dans l'onglet **Actions** du dépôt (« pages build and deployment »).

### Comment le site trouve les fichiers

En ligne, le site demande la liste des fichiers à l'**API GitHub** (une requête au chargement, gardée en cache pendant la session), puis télécharge chaque page depuis GitHub Pages. Conséquences :

- un fichier n'apparaît qu'une fois **poussé** sur `main` ;
- l'API GitHub limite à **60 requêtes par heure** et par adresse IP. Grâce au cache, c'est largement suffisant pour un usage normal ; en cas de dépassement, le site affiche un message, il suffit d'attendre.

---

## Dépannage

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

---

## Structure du dépôt

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
└── .nojekyll
```
