[Accueil](../index.md) › [@/models/base](package-summary.md) › `App<T>`

# App\<T>

*Type — `@/models/base`*

**Signature**
```ts
type App<T> = T & { id: string; owner: string; createdAt: Date | null; updatedAt: Date | null }
```

**Description**
Forme **affichée** dans l'app : `id` ajouté, dates converties en `Date` JavaScript (`null` si inconnues).

---

← [`Db<T>`](Db.md) · [Résumé du package](package-summary.md) · [`Create<T>`](Create.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
