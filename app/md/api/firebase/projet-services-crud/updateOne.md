[Accueil](../index.md) › [@/services/crud](package-summary.md) › updateOne

# updateOne

*Fonction — `@/services/crud`*

**Signature**
```ts
function updateOne<T extends DocumentData, F extends keyof T = never>(
  col: Col<T>,
  id: string,
  changes: Omit<Update<T, F>, 'updatedAt'>,
): Promise<void>
```

**Description**
Modifie les champs donnés. Ajoute `updatedAt` automatiquement.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `col` | `Col<T>` | La collection |
| `id` | `string` | Id du document |
| `changes` | `Omit<Update<T, F>, 'updatedAt'>` | Les champs à changer (tous facultatifs) |

**Paramètres de type** : `F` = champs interdits (défaut : aucun). S'utilise en l'écrivant explicitement : `updateOne<TacheFields, 'titre'>(...)`.

**Erreurs** : `not-found`, `permission-denied`.

**Coût** : 1 écriture.

**Exemple**
```ts
await updateOne(taches, 'xY12', { faite: true })
```

---

← [getOne](getOne.md) · [Résumé du package](package-summary.md) · [deleteOne](deleteOne.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
