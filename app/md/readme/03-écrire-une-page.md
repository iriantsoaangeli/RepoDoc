# Écrire une page

Une page est un fichier Markdown classique (syntaxe GitHub).

## Titre

Le **premier `# Titre`** du fichier devient le grand titre de la page. S'il n'y en a pas, c'est le nom du fichier qui sert de titre.

```markdown
# Le protocole TCP

Texte d'introduction…
```

## Table des matières

Les titres `##` et `###` forment automatiquement la table des matières **« Sur cette page »** à gauche. Le titre en cours de lecture y est surligné.

Inutile d'écrire un sommaire à la main en haut du fichier.

## Ce qui est pris en charge

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

## Ancres de titres

Chaque titre reçoit un identifiant au **format GitHub / Obsidian** : en minuscules, accents conservés, ponctuation supprimée, espaces remplacés par `-`.

| Titre | Ancre |
|---|---|
| `## 2. Récupérer l'image` | `#2-récupérer-limage` |
| `## Poignée de main` | `#poignée-de-main` |

Un lien `[voir](#2-récupérer-limage)` écrit dans GitHub ou Obsidian marche donc tel quel. Une ancre écrite sans les accents (`#2-recuperer-l-image`) mène aussi au bon titre.
