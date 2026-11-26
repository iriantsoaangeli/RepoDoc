# 04 — Photos en base64 dans Firestore

## Le principe

Pas de Cloud Storage en Spark → la photo est **convertie en texte (base64)** et rangée dans un champ d'un document Firestore. L'app la ré-affiche avec `<img src="data:image/jpeg;base64,...">`.

## Les contraintes

| Contrainte | Valeur | Conséquence |
|---|---|---|
| Taille max d'un document | **1 Mio** (1 048 576 octets) | La photo **doit** être compressée |
| Le base64 grossit le fichier | **+33 %** | 510 Ko de JPEG → ~700 000 caractères |
| Stockage total gratuit | **1 Gio** (photos + données + index) | Budget de ~3 000 photos à ~300 Ko |
| Téléchargement gratuit | **10 Gio/mois** | Chaque affichage d'une photo pleine taille consomme sa taille |
| Lectures | 1 document = 1 lecture, **quelle que soit sa taille** | Une photo coûte 1 lecture comme une annonce |

**Photos seulement.** Un PDF de quelques Mo ne tient pas dans 1 Mio : pas de documents dans cette version.

## Les 3 choix qui rendent ça viable

### 1. Deux tailles

| Version | Taille | Où | Quand elle est lue |
|---|---|---|---|
| **Miniature** | 240 px, ≤ 30 000 caractères (~22 Ko) | Champ `thumb` **dans l'annonce** | Avec la liste (0 lecture en plus) |
| **Pleine taille** | 1 280 px, ≤ 700 000 caractères (~510 Ko) | Document **à part** `photos/{id}` | Seulement à l'ouverture du détail |

Pourquoi : si la grande photo était dans l'annonce, la liste de 20 annonces téléchargerait ~10 Mo à chaque ouverture et épuiserait les 10 Gio/mois en ~1 000 ouvertures.

### 2. Compression automatique

`imageToBase64()` (doc 06) redimensionne puis baisse la qualité JPEG (0,8 → 0,5), puis réduit encore les dimensions, jusqu'à passer sous la limite. Une photo de téléphone de plusieurs Mo sort en général à quelques centaines de Ko (ça dépend de la photo).

### 3. Cache local

Une photo ne change jamais (on en crée une nouvelle au lieu de la modifier). `getPhoto()` lit donc **d'abord le cache du téléphone** (gratuit, 0 lecture, 0 téléchargement), et seulement sinon Firestore.

## Pourquoi exclure les champs base64 de l'indexation

Par défaut, Firestore indexe tous les champs (les valeurs de plus de 1 500 octets sont tronquées dans l'index). Indexer un champ base64 ne sert à rien (on ne fait jamais `where("b64", "==", ...)`), et l'index prend de la place sur ton 1 Gio. Le fichier d'index du doc 05 exclut `photos.b64`, `items.thumb` et `favorites.thumb`.

## Budget à surveiller

| Taille moyenne d'une photo | Photos possibles dans 1 Gio |
|---|---|
| 500 Ko | ~2 000 |
| 300 Ko | ~3 000 |
| 150 Ko | ~6 000 |

Pour gagner de la place : baisse `PHOTO_MAX_CHARS` et la dimension 1 280 dans `src/photos.ts`, **et** la limite `b64.size() <= 700000` dans les règles (les deux doivent rester d'accord).

➡️ Suite : `05-regles-et-index.md`
