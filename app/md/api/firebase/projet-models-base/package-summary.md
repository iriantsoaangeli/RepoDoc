[Accueil](../index.md) › @/models/base

# Package `@/models/base`

Fichier `src/models/base.ts`. Types et outils communs à toutes les collections.

| Nom | Nature | Description |
|---|---|---|
| [Meta](Meta.md) | Interface | Champs présents dans **tous** les documents du projet, en plus de leurs champs propres. |
| [`Db<T>`](Db.md) | Type | Forme **stockée** d'un document : champs propres `T` + `Meta`. |
| [`App<T>`](App.md) | Type | Forme **affichée** dans l'app : `id` ajouté, dates converties en `Date` JavaScript (`null` si inconnues). |
| [`Create<T>`](Create.md) | Type | Forme **envoyée à la création** : les dates sont des `serverTimestamp()`. |
| [`Update<T, Fixed>`](Update.md) | Type | Forme **envoyée à la modification** : tous les champs propres facultatifs, sauf ceux de `Fixed` qui sont retirés, plus `updatedAt` obligatoire. |
| [makeConverter](makeConverter.md) | Fonction | Fabrique le convertisseur d'une collection. |
| [makeCollection](makeCollection.md) | Fonction | Crée toutes les références typées d'une collection en une ligne. |

