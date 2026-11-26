[Accueil](../index.md) › [firebase/firestore](package-summary.md) › WithFieldValue / PartialWithFieldValue / UpdateData

# WithFieldValue / PartialWithFieldValue / UpdateData

*Type — `firebase/firestore` · Types*

Types génériques fournis par le SDK :

| Type | Signifie | Utilisé par |
|---|---|---|
| `WithFieldValue<T>` | `T`, où chaque champ peut aussi être un `FieldValue` | `addDoc`, `setDoc` |
| `PartialWithFieldValue<T>` | Pareil, mais tous les champs facultatifs | `setDoc(..., { merge: true })` |
| `UpdateData<T>` | Champs facultatifs + `FieldValue` + chemins imbriqués `'a.b'` | `updateDoc` |

Ils sont **moins stricts** que `Create<T>` / `Update<T>` du projet : ils acceptent par exemple `deleteField()` sur un champ obligatoire.

---

← [FirestoreDataConverter](FirestoreDataConverter.md) · [Résumé du package](package-summary.md) · [WhereFilterOp](WhereFilterOp.md) →  
[Conventions de lecture et contexte des exemples](../conventions.md)
