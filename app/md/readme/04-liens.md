# Liens

Au moment d'afficher une page, le site **remplace chaque lien vers un fichier par l'adresse de la page correspondante**. Si aucun fichier ne correspond, le lien est **affiché comme du texte simple** (pas de lien cassé vers une page 404).

## Les formes acceptées

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

## Espaces dans un lien

En Markdown, un lien ne peut pas contenir d'espace brut. Deux écritures possibles :

```markdown
[Mise en pratique](Mise%20en%20pratique%20Corba.md)
[Mise en pratique](<Mise en pratique Corba.md>)
```

Les liens Obsidian `[[Nom de la page]]` ne sont **pas** reconnus : les convertir en `[Nom de la page](<Nom de la page.md>)`.
