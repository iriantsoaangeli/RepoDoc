[Accueil](../index.md) › [@/services/crud](package-summary.md) › getOne

# getOne

*Fonction — `@/services/crud`*

**Signature**
```ts
function getOne<T extends DocumentData>(col: Col<T>, id: string): Promise<App<T> | null>
```

**Description**
Lit un document par son id.

**Retour** : l'objet, ou `null` s'il n'existe pas.

**Coût** : 1 lecture.

**Exemple**
```ts
const t = await getOne(taches, 'xY12')
```

---

← [listMine](listMine.md) · [Résumé du package](package-summary.md) · [updateOne](updateOne.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
