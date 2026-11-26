[Accueil](../index.md) › [@/models/base](package-summary.md) › `Create<T>`

# Create\<T>

*Type — `@/models/base`*

**Signature**
```ts
type Create<T> = T & { owner: string; createdAt: FieldValue; updatedAt: FieldValue }
```

**Description**
Forme **envoyée à la création** : les dates sont des `serverTimestamp()`.

---

← [`App<T>`](App.md) · [Résumé du package](package-summary.md) · [`Update<T, Fixed>`](Update.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
