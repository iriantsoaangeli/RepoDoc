# 07 — Garde-fous : ne pas épuiser les quotas

En Spark il n'y a **aucune facture possible**. Le risque, c'est que l'app **arrête de marcher** jusqu'au lendemain ~10h-11h (heure de Madagascar) quand un quota est atteint.

## ✅ Checklist

- [ ] 1. Vérifier que le projet est bien en Spark
- [ ] 2. Respecter les 6 réflexes dans le code
- [ ] 3. Gérer l'erreur « quota dépassé » dans l'app
- [ ] 4. Savoir où regarder la consommation

---

## 1. Vérifier le plan

🔗 `https://console.firebase.google.com/project/PROJECT_ID/usage/details` → doit afficher **Spark**.

Ne clique jamais sur **Modify plan / Upgrade**.

## 2. Les 6 réflexes

| Réflexe | Quota protégé |
|---|---|
| `limit()` sur **toutes** les requêtes + pagination | Lectures |
| Grande photo dans un document à part, lue à la demande | Téléchargement (10 Gio/mois) |
| `getPhoto()` passe par le cache | Lectures + téléchargement |
| Pas de `onSnapshot` (temps réel) sur les listes avec photos | Lectures : chaque changement relit des documents |
| Compression des photos + limite dans les règles | Stockage (1 Gio) |
| Tout tester sur les **émulateurs** | Tout : une boucle infinie en dev peut vider 50 000 lectures en quelques minutes |

## 3. Gérer l'erreur dans l'app

```ts
import { FirestoreError } from "firebase/firestore";

try {
  await createItem(title, price, file);
} catch (e) {
  if (e instanceof FirestoreError && e.code === "resource-exhausted") {
    alert("Limite du jour atteinte, réessaie demain.");
  } else if (e instanceof FirestoreError && e.code === "permission-denied") {
    alert("Action non autorisée.");
  } else {
    throw e;
  }
}
```

## 4. Où regarder la consommation

| Quoi | Lien |
|---|---|
| Lectures / écritures / suppressions Firestore | 🔗 `https://console.firebase.google.com/project/PROJECT_ID/firestore/usage` |
| Vue globale du projet | 🔗 `https://console.firebase.google.com/project/PROJECT_ID/usage` |

Les premières semaines, regarde une fois par semaine.

## 5. Abus volontaire

Quelqu'un qui récupère ta config peut créer des comptes anonymes et lire en boucle → il peut épuiser tes lectures du jour (sans te coûter d'argent). Pour du perso/test, c'est acceptable. Si ça devient un problème : **App Check** (vérifie que les requêtes viennent de ton app) — à étudier plus tard.
