[Accueil](../index.md) › [@/models/base](package-summary.md) › makeCollection

# makeCollection

*Fonction — `@/models/base`*

**Signature**
```ts
function makeCollection<T extends DocumentData>(name: string): {
  name: string
  read: CollectionReference<App<T>, Db<T>>
  write: CollectionReference<DocumentData, DocumentData>
  doc: (id: string) => DocumentReference<DocumentData, DocumentData>
  docRead: (id: string) => DocumentReference<App<T>, Db<T>>
}
```

**Description**
Crée toutes les références typées d'une collection en une ligne.

**Paramètres**

| Nom | Type | Rôle |
|---|---|---|
| `name` | `string` | Nom de la collection, **identique** au `match /nom/{id}` des règles |

**Retour**

| Propriété | Rôle |
|---|---|
| `name` | Le nom |
| `read` | Collection typée, pour `query` / `getDocs` → `App<T>` |
| `write` | Collection brute, pour `addDoc` avec un `Create<T>` |
| `doc(id)` | Référence brute d'un document, pour `updateDoc` / `deleteDoc` |
| `docRead(id)` | Référence typée, pour `getDoc` → `App<T>` |

**Exemple**
```ts
interface TacheFields { titre: string; faite: boolean }
const taches = makeCollection<TacheFields>('taches')
```

---

← [makeConverter](makeConverter.md) · [Résumé du package](package-summary.md)  
[Conventions de lecture et contexte des exemples](../conventions.md)
