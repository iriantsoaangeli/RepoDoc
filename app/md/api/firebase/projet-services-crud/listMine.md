[Accueil](../index.md) › [@/services/crud](package-summary.md) › listMine

# listMine

*Fonction — `@/services/crud`*

**Signature**
```ts
function listMine<T extends DocumentData>(col: Col<T>, max?: number): Promise<App<T>[]>
```

**Description**
Renvoie les documents de l'utilisateur connecté (`owner == uid`), du plus récent au plus ancien.

**Paramètres**

| Nom | Type | Défaut | Rôle |
|---|---|---|---|
| `col` | `Col<T>` | — | La collection |
| `max` | `number` | `20` | Nombre maximum de documents |

**Retour** : `Promise<App<T>[]>`.

**Erreurs** : `failed-precondition` si l'index composite `owner` + `createdAt` de cette collection n'est pas déployé.

**Coût** : 1 lecture par document renvoyé.

**Exemple**
```ts
const mesTaches = await listMine(taches, 50)
```

---

← [createOne](createOne.md) · [Résumé du package](package-summary.md) · [getOne](getOne.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
