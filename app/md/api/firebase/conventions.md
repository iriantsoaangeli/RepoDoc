[Accueil](index.md) › Conventions

# Conventions de lecture

Chaque entrée suit le même plan :

| Rubrique | Contenu |
|---|---|
| **Import** | La ligne à écrire en haut du fichier |
| **Signature** | La déclaration TypeScript (simplifiée quand c'est précisé) |
| **Description** | Ce que fait la fonction |
| **Paramètres** | Nom, type, rôle |
| **Retour** | Ce que la fonction renvoie |
| **Erreurs** | Codes d'erreur possibles (voir [FirestoreError](firebase-firestore/FirestoreError.md)) |
| **Coût** | Opérations comptées dans les quotas gratuits |
| **Exemple** | Code d'utilisation |

**Les deux paramètres de type de Firestore.** La plupart des fonctions Firestore ont la forme `fonction<AppModelType, DbModelType>` :
- `AppModelType` = la forme des données **dans l'app** (ex. `Note`) ;
- `DbModelType` = la forme des données **stockées** (ex. `NoteDb`).

Sans convertisseur, les deux valent `DocumentData`. Avec un convertisseur ([withConverter](firebase-firestore/withConverter.md)), ils prennent tes types. Dans les signatures ci-dessous, `A` = `AppModelType` et `D` = `DbModelType`.

**`Promise<X>`** = la fonction est asynchrone : utilise `await` pour obtenir `X`.

**Contexte des exemples.** Ils supposent ces imports du projet :

```ts
import { auth, db } from '@/firebase'
import { notesRead, notesWrite, noteDoc, noteDocRead, type Note, type NoteCreate } from '@/models/note'
```
