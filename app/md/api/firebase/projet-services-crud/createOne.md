[Accueil](../index.md) › [@/services/crud](package-summary.md) › createOne

# createOne

*Fonction — `@/services/crud`*

**Signature**
```ts
function createOne<T extends DocumentData>(col: Col<T>, fields: T): Promise<string>
```

**Description**
Crée un document. Ajoute automatiquement `owner` (uid connecté, créé en anonyme si besoin), `createdAt` et `updatedAt` (`serverTimestamp()`).

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `col` | `Col<T>` | La collection |
| `fields` | `T` | Les champs propres uniquement. Champ manquant ou de mauvais type = erreur de compilation |

**Retour** : `Promise<string>`, l'id du document créé.

**Erreurs** : `permission-denied` (règles), `resource-exhausted` (quota).

**Coût** : 1 écriture.

**Exemple**
```ts
const id = await createOne(taches, { titre: 'Appeler', faite: false })
```

---

← [`Col<T>`](Col.md) · [Résumé du package](package-summary.md) · [listMine](listMine.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
