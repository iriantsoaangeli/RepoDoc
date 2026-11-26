[Accueil](../index.md) › [@/models/base](package-summary.md) › makeConverter

# makeConverter

*Fonction — `@/models/base`*

**Signature**
```ts
function makeConverter<T extends DocumentData>(): FirestoreDataConverter<App<T>, Db<T>>
```

**Description**
Fabrique le convertisseur d'une collection.
- `fromFirestore` : ajoute `id`, convertit `createdAt` et `updatedAt` en `Date` (avec `serverTimestamps: 'estimate'`).
- `toFirestore` : **lève une erreur** volontairement. On écrit avec `Create<T>` / `Update<T>` sur la référence `write`.

**Paramètres de type** : `T` = champs propres (doit être un objet).

**Retour** : `FirestoreDataConverter<App<T>, Db<T>>`.

---

← [`Update<T, Fixed>`](Update.md) · [Résumé du package](package-summary.md) · [makeCollection](makeCollection.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
