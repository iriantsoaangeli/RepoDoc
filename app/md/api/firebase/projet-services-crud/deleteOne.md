[Accueil](../index.md) › [@/services/crud](package-summary.md) › deleteOne

# deleteOne

*Fonction — `@/services/crud`*

**Signature**
```ts
function deleteOne<T extends DocumentData>(col: Col<T>, id: string): Promise<void>
```

**Description**
Supprime un document. Ne supprime ni ses sous-collections ni une éventuelle photo liée.

**Coût** : 1 suppression.

**Exemple**
```ts
await deleteOne(taches, 'xY12')
```

---

← [updateOne](updateOne.md) · [Résumé du package](package-summary.md)  
[Conventions de lecture et contexte des exemples](../conventions.md)
