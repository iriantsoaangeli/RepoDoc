[Accueil](../index.md) › [@/models/base](package-summary.md) › `Update<T, Fixed>`

# Update\<T, Fixed>

*Type — `@/models/base`*

**Signature**
```ts
type Update<T, Fixed extends keyof T = never> = Partial<Omit<T, Fixed>> & { updatedAt: FieldValue }
```

**Description**
Forme **envoyée à la modification** : tous les champs propres facultatifs, sauf ceux de `Fixed` qui sont retirés, plus `updatedAt` obligatoire.

**Paramètres de type**

| Nom | Contrainte | Défaut | Rôle |
|---|---|---|---|
| `T` | — | — | Champs propres |
| `Fixed` | doit être un nom de champ de `T` (`keyof T`) | `never` (aucun) | Champs interdits à la modification |

**Exemple**
```ts
type U1 = Update<NoteFields>           // { title?, text?, thumb?, photoId?, updatedAt }
type U2 = Update<NoteFields, 'title'>  // { text?, thumb?, photoId?, updatedAt }
```

---

← [`Create<T>`](Create.md) · [Résumé du package](package-summary.md) · [makeConverter](makeConverter.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
