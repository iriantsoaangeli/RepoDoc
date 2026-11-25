
Guide pour démarrer un conteneur Oracle Database à partir d'une image que tu as déjà (fichier `.tar` ou image présente en local).

> **Convention** : `<IMAGE>` = nom:tag de ton image (ex. `oracle-free:latest`). Remplace aussi `MonMotDePasse1` par ton mot de passe.
> Les variables d'environnement et les noms de services **dépendent de l'image** : voir l'étape 2 pour les vérifier.

## Sommaire

1. [Prérequis](#1-prérequis)
2. [Récupérer l'image](#2-récupérer-limage)
3. [Créer et lancer le conteneur](#3-créer-et-lancer-le-conteneur)
4. [Attendre que la base soit prête](#4-attendre-que-la-base-soit-prête)
5. [Se connecter](#5-se-connecter)
6. [Gérer le conteneur](#6-gérer-le-conteneur)
7. [Docker Compose](#7-docker-compose)
8. [Dépannage](#8-dépannage)
9. [Nettoyage](#9-nettoyage)
10. [Aide-mémoire](#10-aide-mémoire)

---

## 1. Prérequis

```bash
docker --version          # Docker installé ?
docker info               # Le démon tourne ?
```

- Espace disque : une image Oracle pèse plusieurs Go, la base aussi une fois initialisée.
- Mémoire : prévoir au moins 2 Go de RAM libres pour le conteneur (à vérifier dans la doc de ta version).
- Port **1521** libre sur la machine hôte (voir dépannage sinon).

## 2. Récupérer l'image

### Cas A : tu as un fichier `.tar`

```bash
docker load -i chemin/vers/image.tar
```

> `docker load` s'applique à une archive créée par `docker save`.
> Si l'archive vient de `docker export` (un conteneur exporté, pas une image), utilise plutôt :
> `docker import chemin/vers/archive.tar <IMAGE>`

### Cas B : l'image est déjà en local

```bash
docker images                       # liste les images
docker images | grep -i oracle      # filtrer
```

### Inspecter l'image (important)

Pour connaître les ports, volumes et variables prévus par l'image, au lieu de deviner :

```bash
docker image inspect <IMAGE> --format '{{json .Config.ExposedPorts}}'
docker image inspect <IMAGE> --format '{{json .Config.Volumes}}'
docker image inspect <IMAGE> --format '{{json .Config.Env}}'
docker image inspect <IMAGE> --format '{{json .Config.Cmd}} {{json .Config.Entrypoint}}'
```

Repères habituels (à confirmer avec l'inspection ci-dessus) :

| Élément | Valeur courante |
|---|---|
| Port listener | `1521` |
| Dossier de données | `/opt/oracle/oradata` |
| Variable mot de passe (images Oracle officielles) | `ORACLE_PWD` |
| Variable mot de passe (images `gvenzl/*`) | `ORACLE_PASSWORD` |
| Autres variables possibles | `ORACLE_SID`, `ORACLE_PDB`, `ORACLE_CHARACTERSET` |

## 3. Créer et lancer le conteneur

### Commande de base

```bash
docker run -d \
  --name oracle-db \
  -p 1521:1521 \
  -e ORACLE_PWD=MonMotDePasse1 \
  -v oracle-data:/opt/oracle/oradata \
  <IMAGE>
```

Explication des options :

| Option | Rôle |
|---|---|
| `-d` | Lance en arrière-plan |
| `--name oracle-db` | Nom du conteneur (plus pratique que l'ID) |
| `-p 1521:1521` | Hôte:conteneur. Pour changer le port hôte : `-p 1522:1521` |
| `-e ORACLE_PWD=...` | Mot de passe des comptes `SYS`, `SYSTEM`, `PDBADMIN` (images officielles) |
| `-v oracle-data:/opt/oracle/oradata` | Volume **nommé** : les données survivent à la suppression du conteneur |

> Pour une image `gvenzl/*`, remplace `-e ORACLE_PWD=...` par `-e ORACLE_PASSWORD=...`.

### Variantes utiles

```bash
# Avec création d'un utilisateur applicatif (images gvenzl/*)
docker run -d --name oracle-db -p 1521:1521 \
  -e ORACLE_PASSWORD=MonMotDePasse1 \
  -e APP_USER=monuser \
  -e APP_USER_PASSWORD=MonUserPass1 \
  -v oracle-data:/opt/oracle/oradata \
  <IMAGE>

# Redémarrage automatique avec le démon Docker
docker run -d --name oracle-db --restart unless-stopped -p 1521:1521 \
  -e ORACLE_PWD=MonMotDePasse1 -v oracle-data:/opt/oracle/oradata <IMAGE>

# Limiter la mémoire
docker run -d --name oracle-db -m 3g -p 1521:1521 \
  -e ORACLE_PWD=MonMotDePasse1 -v oracle-data:/opt/oracle/oradata <IMAGE>

# Dossier de l'hôte au lieu d'un volume nommé (bind mount) : voir dépannage « permission denied »
docker run -d --name oracle-db -p 1521:1521 \
  -e ORACLE_PWD=MonMotDePasse1 \
  -v "$(pwd)/oradata:/opt/oracle/oradata" <IMAGE>

# Image pour une autre architecture (ex. Mac Apple Silicon avec image amd64)
docker run -d --platform linux/amd64 --name oracle-db -p 1521:1521 \
  -e ORACLE_PWD=MonMotDePasse1 <IMAGE>
```

## 4. Attendre que la base soit prête

Au **premier démarrage**, Oracle crée la base : cela peut prendre plusieurs minutes.

```bash
docker logs -f oracle-db
```

Cherche une ligne du type `DATABASE IS READY TO USE!` (le texte exact peut varier selon l'image). `Ctrl+C` quitte le suivi des logs sans arrêter le conteneur.

Vérifier l'état :

```bash
docker ps                                   # conteneur en cours d'exécution ?
docker ps -a                                # y compris arrêtés
docker inspect -f '{{.State.Health.Status}}' oracle-db   # seulement si l'image définit un healthcheck
```

## 5. Se connecter

### Depuis le conteneur (sans rien installer sur l'hôte)

```bash
docker exec -it oracle-db sqlplus sys/MonMotDePasse1@//localhost:1521/<SERVICE> as sysdba
```

Ou sans mot de passe en clair dans la commande :

```bash
docker exec -it oracle-db sqlplus / as sysdba
```

### Noms de service courants (à confirmer avec `lsnrctl status`)

| Édition | CDB (conteneur racine) | PDB (base à utiliser pour les apps) |
|---|---|---|
| Oracle Database Free | `FREE` | `FREEPDB1` |
| Oracle XE 21c | `XE` | `XEPDB1` |

Lister les services réellement enregistrés :

```bash
docker exec -it oracle-db lsnrctl status
```

### Depuis l'hôte (client Oracle installé)

```bash
sqlplus system/MonMotDePasse1@//localhost:1521/<SERVICE_PDB>
```

### Chaîne JDBC (applications Java)

```
jdbc:oracle:thin:@//localhost:1521/<SERVICE_PDB>
```

Exemple : `jdbc:oracle:thin:@//localhost:1521/FREEPDB1`

### Requêtes de test

```sql
SELECT banner FROM v$version;
SHOW con_name;
SELECT name, open_mode FROM v$pdbs;
```

### Changer le mot de passe (images Oracle officielles)

```bash
docker exec oracle-db ./setPassword.sh NouveauMotDePasse1
```

## 6. Gérer le conteneur

```bash
docker stop oracle-db        # arrêt propre (laisse Oracle s'éteindre)
docker start oracle-db       # redémarrage (les données du volume sont conservées)
docker restart oracle-db
docker logs --tail 100 oracle-db
docker exec -it oracle-db bash      # shell dans le conteneur
docker stats oracle-db              # CPU / RAM
docker port oracle-db               # ports publiés
```

> Laisse à `docker stop` le temps de finir : un arrêt brutal (`docker kill`) peut forcer une récupération au prochain démarrage.

## 7. Docker Compose

Fichier `docker-compose.yml` :

```yaml
services:
  oracle:
    image: <IMAGE>
    container_name: oracle-db
    restart: unless-stopped
    ports:
      - "1521:1521"
    environment:
      ORACLE_PWD: ${ORACLE_PWD}        # pour gvenzl/* : ORACLE_PASSWORD
    volumes:
      - oracle-data:/opt/oracle/oradata
    shm_size: "1g"                      # optionnel, utile selon l'image
    healthcheck:
      # À adapter : le script dépend de l'image
      #   images Oracle officielles : /opt/oracle/checkDBStatus.sh
      #   images gvenzl/*           : healthcheck.sh
      test: ["CMD", "/opt/oracle/checkDBStatus.sh"]
      interval: 30s
      timeout: 10s
      retries: 20
      start_period: 120s

volumes:
  oracle-data:
```

Fichier `.env` (à côté du compose, **à ne pas versionner**) :

```env
ORACLE_PWD=MonMotDePasse1
```

Commandes :

```bash
docker compose up -d          # créer et démarrer
docker compose logs -f oracle
docker compose ps
docker compose stop           # arrêter
docker compose down           # supprimer le conteneur (garde le volume)
docker compose down -v        # supprimer aussi le volume = PERTE DES DONNÉES
```

> Avec Compose, `image:` doit pointer vers l'image déjà chargée en local (`docker load`). Aucun `build:` n'est nécessaire.

## 8. Dépannage

| Symptôme | Cause probable | Piste |
|---|---|---|
| `docker load` : erreur de format | Archive créée par `docker export` | Utiliser `docker import` |
| `Bind for 0.0.0.0:1521 failed: port is already allocated` | Port 1521 déjà utilisé | `-p 1522:1521` ou arrêter le service qui l'occupe |
| Le conteneur s'arrête tout de suite (`Exited`) | Variable manquante, mémoire insuffisante, volume incompatible | `docker logs oracle-db` |
| `docker: no matching manifest for linux/arm64` ou avertissement de plateforme | Image `amd64` sur machine ARM | `--platform linux/amd64` (peut être lent) |
| `permission denied` sur le volume monté | Un bind mount appartient à un autre utilisateur que celui d'Oracle dans le conteneur | Utiliser un volume nommé, ou ajuster les droits du dossier selon l'UID de l'utilisateur `oracle` de l'image (vérifier avec `docker exec oracle-db id oracle`) |
| `ORA-12541: TNS:no listener` | Base pas encore démarrée, ou port incorrect | Attendre `READY`, vérifier `docker port oracle-db` |
| `ORA-12514: listener does not currently know of service` | Mauvais nom de service | `docker exec -it oracle-db lsnrctl status`, utiliser le service listé |
| `ORA-01017: invalid username/password` | Mauvais mot de passe ou mauvaise variable (`ORACLE_PWD` vs `ORACLE_PASSWORD`) | Vérifier avec `docker image inspect`, ou `setPassword.sh` |
| Premier démarrage très long | Création de la base | Patienter, suivre `docker logs -f` |
| Changer le mot de passe via `-e` n'a pas d'effet | La base existe déjà dans le volume : la variable n'est lue qu'à l'initialisation | `setPassword.sh`, ou recréer le volume (perte des données) |
| `Name "/oracle-db" is already in use` | Un conteneur du même nom existe | `docker rm oracle-db` ou `docker start oracle-db` |

## 9. Nettoyage

```bash
docker stop oracle-db
docker rm oracle-db                 # supprime le conteneur (volume conservé)
docker volume ls
docker volume rm oracle-data        # supprime les données : IRRÉVERSIBLE
docker rmi <IMAGE>                  # supprime l'image (impossible tant qu'un conteneur l'utilise)
```

Nettoyage global (à utiliser avec précaution, affecte tout Docker) :

```bash
docker system df                    # voir l'espace utilisé
docker container prune              # conteneurs arrêtés
docker image prune                  # images « dangling »
docker volume prune                 # volumes non utilisés par un conteneur
```

### Sauvegarder les données avant suppression

```bash
docker run --rm -v oracle-data:/data -v "$(pwd)":/backup alpine \
  tar czf /backup/oracle-data-backup.tar.gz -C /data .
```

> Conteneur **arrêté** avant la sauvegarde pour avoir des fichiers cohérents.

## 10. Aide-mémoire

```bash
# 1. Charger l'image
docker load -i image.tar && docker images

# 2. Lancer
docker run -d --name oracle-db -p 1521:1521 \
  -e ORACLE_PWD=MonMotDePasse1 \
  -v oracle-data:/opt/oracle/oradata <IMAGE>

# 3. Attendre que la base soit prête
docker logs -f oracle-db

# 4. Se connecter
docker exec -it oracle-db sqlplus / as sysdba

# 5. Arrêter / relancer
docker stop oracle-db && docker start oracle-db

# 6. Tout supprimer (données incluses)
docker rm -f oracle-db && docker volume rm oracle-data && docker rmi <IMAGE>
```