

> **Principe** : 1 script = 1 scénario. Tu es déjà dans la console `psql` : modifie le bloc `VARIABLES` en haut, puis colle tout le script.
> 
> **Variables psql** :
> 
> - `\set nom 'valeur'` déclare une variable.
> - `:"nom"` l'insère comme **nom** (table, utilisateur, base).
> - `:'nom'` l'insère comme **texte** (mot de passe, chemin).
> - `:nom` l'insère brut (dans les commandes `\c`, `\i`…).
> 
> Ouvrir la console (depuis le terminal) : `psql -U postgres` (local) ou `psql -h <hôte> -p 5432 -U <utilisateur> -d <base>`.

---

## Sommaire

1. [Explorer : bases, tables, utilisateurs](#1-explorer--bases-tables-utilisateurs)
2. [Créer un utilisateur + une base](#2-cr%C3%A9er-un-utilisateur--une-base)
3. [Créer un utilisateur en lecture seule](#3-cr%C3%A9er-un-utilisateur-en-lecture-seule)
4. [Créer une table + opérations courantes (CRUD)](#4-cr%C3%A9er-une-table--op%C3%A9rations-courantes-crud)
5. [Exporter / importer un CSV](#5-exporter--importer-un-csv)
6. [Exécuter un fichier SQL / enregistrer un résultat](#6-ex%C3%A9cuter-un-fichier-sql--enregistrer-un-r%C3%A9sultat)
7. [Changer un mot de passe](#7-changer-un-mot-de-passe)
8. [Supprimer un utilisateur](#8-supprimer-un-utilisateur)
9. [Supprimer une base](#9-supprimer-une-base)
10. [Sauvegarder une base](#10-sauvegarder-une-base)
11. [Restaurer une base](#11-restaurer-une-base)
12. [Aide-mémoire psql](#12-aide-m%C3%A9moire-psql)

---

## 1. Explorer : bases, tables, utilisateurs

```sql
-- ===== VARIABLES =====
\set db 'appdb'
\set table 'clients'
-- =====================

\c :db
\conninfo
\l
\du
\dn
\dt
\d :table
```

---

## 2. Créer un utilisateur + une base

L'utilisateur devient **propriétaire** de la base. Peut être relancé sans erreur (ne recrée pas ce qui existe). À lancer connecté en `postgres`.

```sql
-- ===== VARIABLES =====
\set user 'appuser'
\set pwd 'change-moi'
\set db 'appdb'
-- =====================

SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'user', :'pwd')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'user')\gexec

SELECT format('CREATE DATABASE %I OWNER %I', :'db', :'user')
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'db')\gexec

\c :db
GRANT ALL ON SCHEMA public TO :"user";

\du
\l
```

---

## 3. Créer un utilisateur en lecture seule

Accès `SELECT` à toutes les tables d'un schéma, y compris celles que `owner` créera plus tard. À lancer connecté en `postgres`.

```sql
-- ===== VARIABLES =====
\set ro 'lecteur'
\set pwd 'change-moi'
\set db 'appdb'
\set schema 'public'
\set owner 'appuser'
-- =====================

SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'ro', :'pwd')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'ro')\gexec

\c :db
GRANT CONNECT ON DATABASE :"db" TO :"ro";
GRANT USAGE ON SCHEMA :"schema" TO :"ro";
GRANT SELECT ON ALL TABLES IN SCHEMA :"schema" TO :"ro";
GRANT SELECT ON ALL SEQUENCES IN SCHEMA :"schema" TO :"ro";
ALTER DEFAULT PRIVILEGES FOR ROLE :"owner" IN SCHEMA :"schema" GRANT SELECT ON TABLES TO :"ro";

\dp
```

---

## 4. Créer une table + opérations courantes (CRUD)

À lancer connecté avec l'utilisateur propriétaire (ex. `psql -U appuser -d appdb`).

```sql
-- ===== VARIABLES =====
\set table 'clients'
\set id 1
-- =====================

-- Créer
CREATE TABLE IF NOT EXISTS :"table" (
  id       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nom      VARCHAR(100) NOT NULL,
  email    VARCHAR(150) UNIQUE,
  cree_le  TIMESTAMP DEFAULT now()
);

-- Insérer
INSERT INTO :"table" (nom, email) VALUES
  ('Rakoto', 'rakoto@exemple.mg'),
  ('Rabe',   'rabe@exemple.mg')
ON CONFLICT (email) DO NOTHING;

-- Lire
SELECT * FROM :"table" ORDER BY id;

-- Modifier
UPDATE :"table" SET nom = 'Rakoto Jean' WHERE id = :id;

-- Supprimer
DELETE FROM :"table" WHERE id = :id;

SELECT * FROM :"table" ORDER BY id;
```

> Dans psql, chaque requête est validée immédiatement (auto-commit). Pour pouvoir annuler : `BEGIN;` … puis `COMMIT;` ou `ROLLBACK;`.

---

## 5. Exporter / importer un CSV

Le fichier est lu/écrit **sur la machine où tourne psql**. Mets les mêmes `colonnes` à l'export et à l'import.

**Export**

```sql
-- ===== VARIABLES =====
\set table 'clients'
\set colonnes 'nom, email'
\set csv '/tmp/clients.csv'
-- =====================

COPY :"table" (:colonnes) TO STDOUT WITH (FORMAT csv, HEADER) \g :csv
```

> Le chemin `csv` ne doit pas contenir d'espaces.

**Import**

`\copy` ne lit pas les variables psql : on passe par le shell (`\setenv` + `\!`), avec la même connexion que psql.

```sql
-- ===== VARIABLES =====
\set table 'clients'
\set colonnes 'nom, email'
\set csv '/tmp/clients.csv'
-- =====================

\setenv PGDATABASE :DBNAME
\setenv PGUSER :USER
\setenv PGHOST :HOST
\setenv PGPORT :PORT
\setenv CSV_TABLE :table
\setenv CSV_COLS :colonnes
\setenv CSV_FILE :csv
\! psql -X -c "\copy \"$CSV_TABLE\" ($CSV_COLS) FROM '$CSV_FILE' WITH (FORMAT csv, HEADER)"

SELECT count(*) FROM :"table";
```

> Pour une table avec `id GENERATED ALWAYS`, n'importe pas la colonne `id` (elle est générée automatiquement).

---

## 6. Exécuter un fichier SQL / enregistrer un résultat

```sql
-- ===== VARIABLES =====
\set script '/tmp/script.sql'
\set sortie '/tmp/resultat.txt'
\set table 'clients'
-- =====================

-- Exécuter un fichier
\i :script

-- Enregistrer le résultat d'une requête dans un fichier
\o :sortie
SELECT * FROM :"table";
\o

\! cat /tmp/resultat.txt
```

> Mets le même chemin dans `\! cat` que dans `sortie` (les commandes shell `\!` ne lisent pas les variables psql).

---

## 7. Changer un mot de passe

```sql
-- ===== VARIABLES =====
\set user 'appuser'
\set pwd 'nouveau-mdp'
-- =====================

ALTER ROLE :"user" PASSWORD :'pwd';
```

> Alternative sans écrire le mot de passe en clair : `\password appuser` (psql le demande deux fois).

---

## 8. Supprimer un utilisateur

⚠️ Supprime aussi les objets qu'il possède dans `db`.

```sql
-- ===== VARIABLES =====
\set user 'lecteur'
\set db 'appdb'
-- =====================

\c :db
DROP OWNED BY :"user";
\c postgres
DROP ROLE IF EXISTS :"user";
\du
```

> Si l'utilisateur possède des objets dans plusieurs bases, répète `\c <base>` + `DROP OWNED BY` pour chacune avant `DROP ROLE`.

---

## 9. Supprimer une base

⚠️ Suppression définitive, les connexions ouvertes sont coupées.

```sql
-- ===== VARIABLES =====
\set db 'appdb'
-- =====================

\c postgres
DROP DATABASE IF EXISTS :"db" WITH (FORCE);
\l
```

---

## 10. Sauvegarder une base

`pg_dump` est un outil du terminal : on le lance depuis psql avec `\!`. Les variables sont passées au shell avec `\setenv`, et la connexion réutilise celle de psql.

```sql
-- ===== VARIABLES =====
\set db 'appdb'
\set dossier '/tmp/backups'
-- =====================

\setenv PGDATABASE :db
\setenv PGUSER :USER
\setenv PGHOST :HOST
\setenv PGPORT :PORT
\setenv BK_DIR :dossier
\! mkdir -p "$BK_DIR" && pg_dump -Fc -f "$BK_DIR/${PGDATABASE}_$(date +%Y%m%d_%H%M%S).dump" && ls -lh "$BK_DIR"
```

> Format `-Fc` = compressé, à restaurer avec `pg_restore` (scénario 11). Pour un `.sql` lisible : remplace `-Fc` par `-Fp` et `.dump` par `.sql`. Pour sauvegarder **tout le serveur** (toutes les bases + utilisateurs) : `\! pg_dumpall > /tmp/backups/tout.sql`.

---

## 11. Restaurer une base

⚠️ La base `db` est supprimée puis recréée. À lancer connecté en `postgres`.

```sql
-- ===== VARIABLES =====
\set db 'appdb'
\set owner 'appuser'
\set fichier '/tmp/backups/appdb_20261110_103000.dump'
-- =====================

\c postgres
DROP DATABASE IF EXISTS :"db" WITH (FORCE);
CREATE DATABASE :"db" OWNER :"owner";

\setenv PGUSER :USER
\setenv PGHOST :HOST
\setenv PGPORT :PORT
\setenv RS_DB :db
\setenv RS_OWNER :owner
\setenv RS_FILE :fichier
\! pg_restore -d "$RS_DB" --no-owner --role="$RS_OWNER" "$RS_FILE" && echo "Restauration terminée."

\c :db
\dt
```

> Pour un fichier `.sql` (format texte) : après `CREATE DATABASE`, remplace les lignes `\setenv`/`\!` par `\c :db` puis `\i :fichier`.

---

## 12. Aide-mémoire psql

|Commande|Effet|
|---|---|
|`\l`|lister les bases|
|`\c appdb`|changer de base|
|`\dt` / `\dt *.*`|tables du schéma courant / de tous les schémas|
|`\d clients`|structure d'une table|
|`\du`|utilisateurs|
|`\dn`|schémas|
|`\dp`|droits sur les tables|
|`\df` / `\dv`|fonctions / vues|
|`\x`|affichage vertical (lignes longues)|
|`\timing`|durée des requêtes|
|`\i fichier.sql`|exécuter un fichier|
|`\o fichier.txt` … `\o`|rediriger les résultats vers un fichier|
|`\e`|éditer la dernière requête dans un éditeur|
|`\set`|voir les variables définies|
|`\conninfo`|connexion actuelle|
|`\! commande`|lancer une commande du terminal|
|`\?` / `\h CREATE TABLE`|aide psql / aide SQL|
|`\q`|quitter|