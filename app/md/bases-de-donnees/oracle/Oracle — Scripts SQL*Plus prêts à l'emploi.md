
> **Principe** : 1 script = 1 scénario. Tu es déjà dans la console `sqlplus` : modifie le bloc `VARIABLES` en haut, puis colle tout le script.
> 
> **Variables SQL*Plus** :
> 
> - `DEFINE nom = "valeur"` déclare une variable.
> - `&nom` l'insère dans la commande.
> - Un point termine le nom : `&fichier..dmp` → `sauvegarde.dmp`, `&fichier._log` → `sauvegarde_log`.
> - `SET VERIFY OFF` (en tête de chaque script) évite l'affichage des lignes `old`/`new`.
> - Ne mets jamais de `&` dans tes données : SQL*Plus le prend pour une variable (ou désactive avec `SET DEFINE OFF`).
> 
> **Ouvrir la console** (depuis le terminal) :
> 
> - `sqlplus utilisateur/"motdepasse"@//hote:1521/SERVICE`
> - sur le serveur, en administrateur : `sqlplus / as sysdba` puis `ALTER SESSION SET CONTAINER = FREEPDB1;`
> 
> **Nom du service (PDB)** selon l'édition : `FREEPDB1` (23ai Free), `XEPDB1` (XE 18c/21c), sinon celui défini par ton administrateur.
> 
> ⚠️ Dans Oracle, **utilisateur = schéma** : les tables appartiennent à l'utilisateur qui les crée. Les noms sont stockés en **MAJUSCULES**. ⚠️ Pas d'auto-commit : après `INSERT`/`UPDATE`/`DELETE`, fais `COMMIT;`.

---

## Sommaire

1. [Explorer : utilisateur, tables, structure](#1-explorer--utilisateur-tables-structure)
2. [Créer un utilisateur (schéma)](#2-cr%C3%A9er-un-utilisateur-sch%C3%A9ma)
3. [Créer un utilisateur en lecture seule (23ai)](#3-cr%C3%A9er-un-utilisateur-en-lecture-seule-23ai)
4. [Créer un utilisateur en lecture seule (avant 23ai)](#4-cr%C3%A9er-un-utilisateur-en-lecture-seule-avant-23ai)
5. [Créer une table + opérations courantes (CRUD)](#5-cr%C3%A9er-une-table--op%C3%A9rations-courantes-crud)
6. [Exporter une table en CSV](#6-exporter-une-table-en-csv)
7. [Exécuter un fichier SQL / enregistrer un résultat](#7-ex%C3%A9cuter-un-fichier-sql--enregistrer-un-r%C3%A9sultat)
8. [Changer un mot de passe / débloquer un compte](#8-changer-un-mot-de-passe--d%C3%A9bloquer-un-compte)
9. [Lister les utilisateurs](#9-lister-les-utilisateurs)
10. [Supprimer un utilisateur et ses tables](#10-supprimer-un-utilisateur-et-ses-tables)
11. [Sauvegarder un schéma (Data Pump)](#11-sauvegarder-un-sch%C3%A9ma-data-pump)
12. [Restaurer un schéma (Data Pump)](#12-restaurer-un-sch%C3%A9ma-data-pump)
13. [Aide-mémoire SQL*Plus](#13-aide-m%C3%A9moire-sqlplus)

---

## 1. Explorer : utilisateur, tables, structure

```sql
-- ===== VARIABLES =====
SET VERIFY OFF
DEFINE table_nom = "CLIENTS"
-- =====================

SET LINESIZE 200 PAGESIZE 100
SHOW USER
SHOW CON_NAME
SELECT table_name FROM user_tables ORDER BY 1;
SELECT view_name FROM user_views ORDER BY 1;
DESC &table_nom
```

---

## 2. Créer un utilisateur (schéma)

À lancer connecté en `SYS` ou `SYSTEM`, **dans la PDB** (`SHOW CON_NAME` ne doit pas afficher `CDB$ROOT`).

```sql
-- ===== VARIABLES =====
SET VERIFY OFF
DEFINE utilisateur = "appuser"
DEFINE mdp = "ChangeMoi123"
DEFINE tbs = "USERS"
-- =====================

CREATE USER &utilisateur IDENTIFIED BY "&mdp"
  DEFAULT TABLESPACE &tbs
  QUOTA UNLIMITED ON &tbs;

GRANT CREATE SESSION, CREATE TABLE, CREATE VIEW, CREATE SEQUENCE,
      CREATE PROCEDURE, CREATE TRIGGER, CREATE SYNONYM
  TO &utilisateur;

SELECT username, account_status, default_tablespace
FROM dba_users
WHERE username = UPPER('&utilisateur');
```

> Sur 23ai, le rôle `DB_DEVELOPER_ROLE` regroupe les droits de développement : `GRANT DB_DEVELOPER_ROLE TO appuser;`.

---

## 3. Créer un utilisateur en lecture seule (23ai)

Le privilège de schéma couvre toutes les tables de `proprio`, y compris celles créées plus tard. À lancer en `SYS` ou `SYSTEM` dans la PDB.

```sql
-- ===== VARIABLES =====
SET VERIFY OFF
DEFINE lecteur = "lecteur"
DEFINE mdp = "ChangeMoi123"
DEFINE proprio = "appuser"
-- =====================

CREATE USER &lecteur IDENTIFIED BY "&mdp";
GRANT CREATE SESSION TO &lecteur;
GRANT SELECT ANY TABLE ON SCHEMA &proprio TO &lecteur;
```

> Le lecteur doit préfixer les tables : `SELECT * FROM appuser.clients;`

---

## 4. Créer un utilisateur en lecture seule (avant 23ai)

Donne `SELECT` sur chaque table **existante** de `proprio`. À relancer après création de nouvelles tables.

```sql
-- ===== VARIABLES =====
SET VERIFY OFF
DEFINE lecteur = "lecteur"
DEFINE mdp = "ChangeMoi123"
DEFINE proprio = "appuser"
-- =====================

CREATE USER &lecteur IDENTIFIED BY "&mdp";
GRANT CREATE SESSION TO &lecteur;

BEGIN
  FOR t IN (SELECT owner, table_name FROM dba_tables WHERE owner = UPPER('&proprio')) LOOP
    EXECUTE IMMEDIATE 'GRANT SELECT ON "' || t.owner || '"."' || t.table_name || '" TO &lecteur';
  END LOOP;
END;
/
```

> Si le lecteur existe déjà, l'erreur `ORA-01920` sur `CREATE USER` est sans gravité : la suite s'exécute quand même.

---

## 5. Créer une table + opérations courantes (CRUD)

À lancer connecté avec l'utilisateur propriétaire (ex. `appuser`).

```sql
-- ===== VARIABLES =====
SET VERIFY OFF
DEFINE table_nom = "clients"
DEFINE id = "1"
-- =====================

SET LINESIZE 200 PAGESIZE 100

-- Créer
CREATE TABLE &table_nom (
  id       NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nom      VARCHAR2(100) NOT NULL,
  email    VARCHAR2(150) UNIQUE,
  cree_le  DATE DEFAULT SYSDATE
);

-- Insérer
INSERT INTO &table_nom (nom, email) VALUES ('Rakoto', 'rakoto@exemple.mg');
INSERT INTO &table_nom (nom, email) VALUES ('Rabe', 'rabe@exemple.mg');
COMMIT;

-- Lire
SELECT * FROM &table_nom ORDER BY id;

-- Modifier
UPDATE &table_nom SET nom = 'Rakoto Jean' WHERE id = &id;

-- Supprimer
DELETE FROM &table_nom WHERE id = &id;
COMMIT;

SELECT * FROM &table_nom ORDER BY id;
```

> `GENERATED ... AS IDENTITY` existe depuis Oracle 12c. Si la table existe déjà, `CREATE TABLE` renvoie `ORA-00955` et la suite s'exécute quand même.

---

## 6. Exporter une table en CSV

Le fichier est écrit **sur la machine où tourne sqlplus**. Nécessite Oracle 12.2 ou plus (`SET MARKUP CSV`).

```sql
-- ===== VARIABLES =====
SET VERIFY OFF
DEFINE table_nom = "clients"
DEFINE colonnes = "nom, email"
DEFINE csv = "/tmp/clients.csv"
-- =====================

SET FEEDBACK OFF
SET MARKUP CSV ON
SPOOL &csv
SELECT &colonnes FROM &table_nom;
SPOOL OFF
SET MARKUP CSV OFF
SET FEEDBACK ON

HOST head -5 &csv
```

> Si le fichier contient aussi des lignes `SQL> ...` (texte tapé dans la console), enregistre ce bloc dans un fichier `export.sql` et lance-le avec `@export.sql` : le fichier CSV ne contiendra que les données.
> 
> **Importer un CSV** : SQL_Plus n'a pas de commande d'import. Les outils prévus pour ça sont SQL_Loader (`sqlldr`) ou la commande `LOAD` de SQLcl.

---

## 7. Exécuter un fichier SQL / enregistrer un résultat

```sql
-- ===== VARIABLES =====
SET VERIFY OFF
DEFINE script = "/tmp/script.sql"
DEFINE sortie = "/tmp/resultat.txt"
DEFINE table_nom = "clients"
-- =====================

-- Exécuter un fichier
@&script

-- Enregistrer le résultat d'une requête dans un fichier
SET LINESIZE 200 PAGESIZE 100
SPOOL &sortie
SELECT * FROM &table_nom;
SPOOL OFF

HOST cat &sortie
```

---

## 8. Changer un mot de passe / débloquer un compte

À lancer en `SYS` ou `SYSTEM` dans la PDB.

```sql
-- ===== VARIABLES =====
SET VERIFY OFF
DEFINE utilisateur = "appuser"
DEFINE mdp = "NouveauMdp123"
-- =====================

ALTER USER &utilisateur IDENTIFIED BY "&mdp" ACCOUNT UNLOCK;

SELECT username, account_status FROM dba_users WHERE username = UPPER('&utilisateur');
```

> Pour changer **ton propre** mot de passe sans l'écrire en clair : tape `PASSWORD` (SQL*Plus le demande).

---

## 9. Lister les utilisateurs

À lancer en `SYS` ou `SYSTEM` dans la PDB. N'affiche pas les comptes internes d'Oracle (12c et plus).

```sql
SET LINESIZE 200 PAGESIZE 100
COLUMN username FORMAT A25
COLUMN account_status FORMAT A20

SELECT username, account_status, created
FROM dba_users
WHERE oracle_maintained = 'N'
ORDER BY username;
```

---

## 10. Supprimer un utilisateur et ses tables

⚠️ Suppression définitive de l'utilisateur **et de tous ses objets** (`CASCADE`). À lancer en `SYS` ou `SYSTEM` dans la PDB.

```sql
-- ===== VARIABLES =====
SET VERIFY OFF
DEFINE utilisateur = "lecteur"
-- =====================

DROP USER &utilisateur CASCADE;
```

> Si Oracle répond `ORA-01940` (utilisateur connecté), ferme ses sessions puis relance.

---

## 11. Sauvegarder un schéma (Data Pump)

`expdp` est un outil du terminal : on le lance depuis sqlplus avec `HOST`. À lancer connecté en **`SYSTEM`**, sur la machine du serveur Oracle (le dossier doit exister sur le serveur).

```sql
-- ===== VARIABLES =====
SET VERIFY OFF
DEFINE schemas = "APPUSER"
DEFINE fichier = "appuser_sauvegarde"
DEFINE dossier = "/tmp/dpdump"
DEFINE dir_nom = "DP_DIR"
DEFINE system_mdp = "ChangeMoi123"
DEFINE service = "localhost:1521/FREEPDB1"
-- =====================

HOST mkdir -p &dossier
CREATE OR REPLACE DIRECTORY &dir_nom AS '&dossier';

HOST expdp system/&system_mdp@//&service schemas=&schemas directory=&dir_nom dumpfile=&fichier..dmp logfile=&fichier._exp.log

HOST ls -lh &dossier
```

> Le dossier doit être accessible en écriture par l'utilisateur système `oracle` du serveur. ⚠️ Le mot de passe apparaît dans la ligne de commande `expdp` : évite-le sur une machine partagée.

---

## 12. Restaurer un schéma (Data Pump)

À lancer connecté en **`SYSTEM`**, sur la machine du serveur Oracle. Le fichier `.dmp` doit être dans `dossier`.

```sql
-- ===== VARIABLES =====
SET VERIFY OFF
DEFINE schemas = "APPUSER"
DEFINE fichier = "appuser_sauvegarde"
DEFINE dossier = "/tmp/dpdump"
DEFINE dir_nom = "DP_DIR"
DEFINE system_mdp = "ChangeMoi123"
DEFINE service = "localhost:1521/FREEPDB1"
DEFINE si_existe = "REPLACE"
-- =====================

CREATE OR REPLACE DIRECTORY &dir_nom AS '&dossier';

HOST impdp system/&system_mdp@//&service schemas=&schemas directory=&dir_nom dumpfile=&fichier..dmp logfile=&fichier._imp.log table_exists_action=&si_existe
```

> `si_existe` : `SKIP` (ignorer), `APPEND` (ajouter les lignes), `TRUNCATE` (vider puis remplir), `REPLACE` (recréer la table).
> 
> Pour restaurer sous **un autre nom de schéma**, ajoute à la ligne `impdp` : `remap_schema=APPUSER:APPUSER_TEST`.
> 
> Si le schéma n'existe pas, `impdp` le recrée (avec son mot de passe d'origine).

---

## 13. Aide-mémoire SQL*Plus

|Commande|Effet|
|---|---|
|`CONNECT user/"mdp"@//hote:1521/SERVICE`|changer de connexion|
|`SHOW USER` / `SHOW CON_NAME`|utilisateur / PDB courants|
|`SHOW PDBS`|lister les PDB (en SYSDBA)|
|`ALTER SESSION SET CONTAINER = FREEPDB1;`|aller dans une PDB (en SYSDBA)|
|`SELECT table_name FROM user_tables;`|mes tables|
|`DESC clients`|structure d'une table|
|`@/tmp/script.sql`|exécuter un fichier|
|`SPOOL fichier.txt` … `SPOOL OFF`|enregistrer la sortie dans un fichier|
|`SET LINESIZE 200 PAGESIZE 100`|affichage plus lisible|
|`COLUMN nom FORMAT A30`|largeur d'une colonne texte|
|`DEFINE`|voir les variables définies|
|`UNDEFINE nom`|supprimer une variable|
|`SET DEFINE OFF`|désactiver `&` (pour insérer du texte qui en contient)|
|`HOST commande`|lancer une commande du terminal|
|`/`|réexécuter la dernière requête|
|`COMMIT;` / `ROLLBACK;`|valider / annuler|
|`EXIT`|quitter|

Chaînes de connexion utiles :

|Usage|Format|
|---|---|
|SQL*Plus|`//hote:1521/FREEPDB1`|
|JDBC (Java/JSP)|`jdbc:oracle:thin:@//hote:1521/FREEPDB1`|