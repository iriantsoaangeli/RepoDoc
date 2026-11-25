
> **Principe** : 1 script = 1 scénario. Modifie uniquement le bloc `VARIABLES` en haut de chaque script, puis copie-colle dans un terminal ou enregistre dans un fichier `.sh` (`bash mon_script.sh`).
> 
> Tous les scripts utilisent `set -euo pipefail` : ils s'arrêtent à la première erreur. Les scripts 1 et 15 ciblent **Debian / Ubuntu** (apt). Pour une autre distribution, voir la doc officielle : https://docs.docker.com/engine/install/

---

## Sommaire

1. [Installer Docker (Debian/Ubuntu)](#1-installer-docker-debianubuntu)
2. [Post-installation : Docker sans sudo + démarrage auto](#2-post-installation--docker-sans-sudo--d%C3%A9marrage-auto)
3. [Lancer un conteneur (port, volume, env, restart)](#3-lancer-un-conteneur)
4. [Construire une image depuis un Dockerfile et la lancer](#4-construire-une-image-et-la-lancer)
5. [Mettre à jour un conteneur (nouvelle version d'image)](#5-mettre-%C3%A0-jour-un-conteneur)
6. [Logs, shell et diagnostic](#6-logs-shell-et-diagnostic)
7. [Arrêter / supprimer un conteneur](#7-arr%C3%AAter--supprimer-un-conteneur)
8. [Sauvegarder un volume](#8-sauvegarder-un-volume)
9. [Restaurer un volume](#9-restaurer-un-volume)
10. [Réseau : app + base de données qui communiquent](#10-r%C3%A9seau--app--base-de-donn%C3%A9es)
11. [Docker Compose : démarrer / arrêter une stack](#11-docker-compose)
12. [Pousser une image vers un registry](#12-pousser-une-image-vers-un-registry)
13. [Exporter / importer une image hors-ligne](#13-exporter--importer-une-image-hors-ligne)
14. [Nettoyage de l'espace disque](#14-nettoyage)
15. [Désinstaller Docker complètement](#15-d%C3%A9sinstaller-docker)
16. [Aide-mémoire des commandes](#16-aide-m%C3%A9moire)

---

## 1. Installer Docker (Debian/Ubuntu)

Installe Docker Engine + Buildx + plugin Compose depuis le dépôt officiel.

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
DISTRO="ubuntu"          # "ubuntu" ou "debian"
CHANNEL="stable"         # canal du dépôt Docker
# =====================

sudo apt-get update
sudo apt-get install -y ca-certificates curl

sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL "https://download.docker.com/linux/${DISTRO}/gpg" -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

CODENAME="$(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")"
ARCH="$(dpkg --print-architecture)"

echo "deb [arch=${ARCH} signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/${DISTRO} ${CODENAME} ${CHANNEL}" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo docker run --rm hello-world
docker --version
docker compose version
```

---

## 2. Post-installation : Docker sans sudo + démarrage auto

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
TARGET_USER="${USER}"    # utilisateur à autoriser
# =====================

sudo groupadd -f docker
sudo usermod -aG docker "${TARGET_USER}"

sudo systemctl enable --now docker.service
sudo systemctl enable --now containerd.service

echo "OK. Déconnecte-toi / reconnecte-toi (ou lance 'newgrp docker') puis teste : docker run --rm hello-world"
```

> ⚠️ Le groupe `docker` donne des droits équivalents à root sur la machine.

---

## 3. Lancer un conteneur

Lance un service en arrière-plan avec port exposé, volume persistant, variable d'environnement et redémarrage automatique.

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
CONTAINER_NAME="mon-nginx"
IMAGE="nginx:latest"
HOST_PORT="8080"
CONTAINER_PORT="80"
VOLUME_NAME="nginx-data"
CONTAINER_PATH="/usr/share/nginx/html"
ENV_VARS=(-e "TZ=Indian/Antananarivo")   # ajoute : -e "CLE=valeur"
RESTART_POLICY="unless-stopped"           # no | always | unless-stopped | on-failure
# =====================

docker pull "${IMAGE}"
docker volume create "${VOLUME_NAME}" > /dev/null

docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart "${RESTART_POLICY}" \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  -v "${VOLUME_NAME}:${CONTAINER_PATH}" \
  "${ENV_VARS[@]}" \
  "${IMAGE}"

docker ps --filter "name=^${CONTAINER_NAME}$"
echo "Accessible sur http://localhost:${HOST_PORT}"
```

> Pour monter un dossier de l'hôte au lieu d'un volume nommé : remplace `VOLUME_NAME` par un chemin absolu, ex. `"$(pwd)/site"`.

---

## 4. Construire une image et la lancer

À lancer dans le dossier qui contient le `Dockerfile`.

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
BUILD_CONTEXT="."
DOCKERFILE="Dockerfile"
IMAGE_NAME="mon-app"
IMAGE_TAG="1.0.0"
CONTAINER_NAME="mon-app"
HOST_PORT="3000"
CONTAINER_PORT="3000"
NO_CACHE="false"          # "true" pour forcer une reconstruction complète
# =====================

BUILD_OPTS=()
[ "${NO_CACHE}" = "true" ] && BUILD_OPTS+=(--no-cache)

docker build "${BUILD_OPTS[@]}" -f "${BUILD_CONTEXT}/${DOCKERFILE}" -t "${IMAGE_NAME}:${IMAGE_TAG}" "${BUILD_CONTEXT}"

# Supprime l'ancien conteneur s'il existe
docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true

docker run -d \
  --name "${CONTAINER_NAME}" \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  "${IMAGE_NAME}:${IMAGE_TAG}"

docker logs --tail 20 "${CONTAINER_NAME}"
```

---

## 5. Mettre à jour un conteneur

Récupère la nouvelle image et recrée le conteneur **avec les mêmes options** (à reporter dans les variables). Les données dans un volume sont conservées.

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
CONTAINER_NAME="mon-nginx"
IMAGE="nginx:latest"
HOST_PORT="8080"
CONTAINER_PORT="80"
VOLUME_NAME="nginx-data"
CONTAINER_PATH="/usr/share/nginx/html"
RESTART_POLICY="unless-stopped"
REMOVE_OLD_IMAGES="true"
# =====================

OLD_ID="$(docker image inspect -f '{{.Id}}' "${IMAGE}" 2>/dev/null || echo none)"
docker pull "${IMAGE}"
NEW_ID="$(docker image inspect -f '{{.Id}}' "${IMAGE}")"

if [ "${OLD_ID}" = "${NEW_ID}" ]; then
  echo "Image déjà à jour, rien à faire."
  exit 0
fi

docker stop "${CONTAINER_NAME}" 2>/dev/null || true
docker rm "${CONTAINER_NAME}" 2>/dev/null || true

docker run -d \
  --name "${CONTAINER_NAME}" \
  --restart "${RESTART_POLICY}" \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  -v "${VOLUME_NAME}:${CONTAINER_PATH}" \
  "${IMAGE}"

[ "${REMOVE_OLD_IMAGES}" = "true" ] && docker image prune -f

docker ps --filter "name=^${CONTAINER_NAME}$"
```

---

## 6. Logs, shell et diagnostic

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
CONTAINER_NAME="mon-nginx"
LOG_LINES="100"
SHELL_CMD="sh"            # "bash" si disponible dans l'image
ACTION="logs"             # logs | follow | shell | inspect | stats | top | ports
# =====================

case "${ACTION}" in
  logs)    docker logs --tail "${LOG_LINES}" -t "${CONTAINER_NAME}" ;;
  follow)  docker logs -f --tail "${LOG_LINES}" "${CONTAINER_NAME}" ;;
  shell)   docker exec -it "${CONTAINER_NAME}" "${SHELL_CMD}" ;;
  inspect) docker inspect "${CONTAINER_NAME}" ;;
  stats)   docker stats --no-stream "${CONTAINER_NAME}" ;;
  top)     docker top "${CONTAINER_NAME}" ;;
  ports)   docker port "${CONTAINER_NAME}" ;;
  *) echo "ACTION inconnue : ${ACTION}" >&2; exit 1 ;;
esac
```

---

## 7. Arrêter / supprimer un conteneur

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
CONTAINER_NAME="mon-nginx"
REMOVE_CONTAINER="true"   # supprimer après arrêt
REMOVE_VOLUMES="false"    # "true" = supprime aussi les volumes anonymes (données perdues !)
# =====================

docker stop "${CONTAINER_NAME}"

if [ "${REMOVE_CONTAINER}" = "true" ]; then
  if [ "${REMOVE_VOLUMES}" = "true" ]; then
    docker rm -v "${CONTAINER_NAME}"
  else
    docker rm "${CONTAINER_NAME}"
  fi
fi

docker ps -a --filter "name=^${CONTAINER_NAME}$"
```

> Un volume **nommé** n'est jamais supprimé par `docker rm -v` : utilise `docker volume rm <nom>`.

---

## 8. Sauvegarder un volume

Crée une archive `.tar.gz` du contenu d'un volume via un conteneur temporaire.

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
VOLUME_NAME="nginx-data"
BACKUP_DIR="$HOME/docker-backups"
CONTAINER_TO_STOP=""      # nom du conteneur à arrêter pendant la sauvegarde (vide = aucun)
# =====================

mkdir -p "${BACKUP_DIR}"
BACKUP_FILE="${VOLUME_NAME}_$(date +%Y%m%d_%H%M%S).tar.gz"

[ -n "${CONTAINER_TO_STOP}" ] && docker stop "${CONTAINER_TO_STOP}"

docker run --rm \
  -v "${VOLUME_NAME}:/source:ro" \
  -v "${BACKUP_DIR}:/backup" \
  alpine tar czf "/backup/${BACKUP_FILE}" -C /source .

[ -n "${CONTAINER_TO_STOP}" ] && docker start "${CONTAINER_TO_STOP}"

ls -lh "${BACKUP_DIR}/${BACKUP_FILE}"
```

---

## 9. Restaurer un volume

⚠️ Écrase le contenu actuel du volume.

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
VOLUME_NAME="nginx-data"
BACKUP_FILE="$HOME/docker-backups/nginx-data_20261110_103000.tar.gz"
CONTAINER_TO_STOP=""      # conteneur utilisant le volume (vide = aucun)
# =====================

[ -f "${BACKUP_FILE}" ] || { echo "Fichier introuvable : ${BACKUP_FILE}" >&2; exit 1; }

BACKUP_DIR="$(dirname "${BACKUP_FILE}")"
BACKUP_NAME="$(basename "${BACKUP_FILE}")"

[ -n "${CONTAINER_TO_STOP}" ] && docker stop "${CONTAINER_TO_STOP}"

docker volume create "${VOLUME_NAME}" > /dev/null
docker run --rm \
  -v "${VOLUME_NAME}:/target" \
  -v "${BACKUP_DIR}:/backup:ro" \
  alpine sh -c "rm -rf /target/* /target/..?* /target/.[!.]* 2>/dev/null; tar xzf /backup/${BACKUP_NAME} -C /target"

[ -n "${CONTAINER_TO_STOP}" ] && docker start "${CONTAINER_TO_STOP}"

echo "Volume ${VOLUME_NAME} restauré depuis ${BACKUP_NAME}"
```

---

## 10. Réseau : app + base de données

Crée un réseau dédié ; les conteneurs se joignent par leur **nom** (ici l'app joint la base via l'hôte `ma-db`).

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
NETWORK_NAME="mon-reseau"

DB_NAME="ma-db"
DB_IMAGE="postgres:16"
DB_USER="appuser"
DB_PASSWORD="change-moi"
DB_DATABASE="appdb"
DB_VOLUME="pgdata"

APP_NAME="mon-app"
APP_IMAGE="mon-app:1.0.0"
APP_HOST_PORT="3000"
APP_CONTAINER_PORT="3000"
# =====================

docker network create "${NETWORK_NAME}" 2>/dev/null || echo "Réseau ${NETWORK_NAME} déjà existant"

docker run -d \
  --name "${DB_NAME}" \
  --network "${NETWORK_NAME}" \
  --restart unless-stopped \
  -e POSTGRES_USER="${DB_USER}" \
  -e POSTGRES_PASSWORD="${DB_PASSWORD}" \
  -e POSTGRES_DB="${DB_DATABASE}" \
  -v "${DB_VOLUME}:/var/lib/postgresql/data" \
  "${DB_IMAGE}"

docker run -d \
  --name "${APP_NAME}" \
  --network "${NETWORK_NAME}" \
  --restart unless-stopped \
  -p "${APP_HOST_PORT}:${APP_CONTAINER_PORT}" \
  -e DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_NAME}:5432/${DB_DATABASE}" \
  "${APP_IMAGE}"

docker network inspect -f '{{range .Containers}}{{.Name}} {{end}}' "${NETWORK_NAME}"
```

> La base n'expose aucun port sur l'hôte : elle n'est accessible que depuis le réseau Docker.

---

## 11. Docker Compose

À lancer dans le dossier contenant `compose.yaml` (ou `docker-compose.yml`).

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
PROJECT_DIR="."
COMPOSE_FILE="compose.yaml"
PROJECT_NAME="ma-stack"
ACTION="up"               # up | down | restart | pull | logs | ps | rebuild
SERVICE=""                # service ciblé (vide = tous)
# =====================

cd "${PROJECT_DIR}"
DC=(docker compose -f "${COMPOSE_FILE}" -p "${PROJECT_NAME}")

case "${ACTION}" in
  up)      "${DC[@]}" up -d ${SERVICE} ;;
  down)    "${DC[@]}" down ;;                      # ajoute -v pour supprimer les volumes
  restart) "${DC[@]}" restart ${SERVICE} ;;
  pull)    "${DC[@]}" pull ${SERVICE} && "${DC[@]}" up -d ${SERVICE} ;;
  logs)    "${DC[@]}" logs -f --tail 100 ${SERVICE} ;;
  ps)      "${DC[@]}" ps ;;
  rebuild) "${DC[@]}" up -d --build ${SERVICE} ;;
  *) echo "ACTION inconnue : ${ACTION}" >&2; exit 1 ;;
esac
```

Exemple minimal de `compose.yaml` :

```yaml
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - web-data:/usr/share/nginx/html
    restart: unless-stopped

volumes:
  web-data:
```

---

## 12. Pousser une image vers un registry

Fonctionne avec Docker Hub, GitHub (ghcr.io), GitLab ou un registry privé.

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
REGISTRY="docker.io"                 # docker.io | ghcr.io | registry.exemple.com
REGISTRY_USER="mon-utilisateur"
REGISTRY_TOKEN="${REGISTRY_TOKEN:-}" # export REGISTRY_TOKEN=... avant de lancer (évite l'historique)
LOCAL_IMAGE="mon-app:1.0.0"
REMOTE_REPO="mon-utilisateur/mon-app"
REMOTE_TAGS=("1.0.0" "latest")
# =====================

[ -n "${REGISTRY_TOKEN}" ] || { echo "REGISTRY_TOKEN non défini" >&2; exit 1; }

echo "${REGISTRY_TOKEN}" | docker login "${REGISTRY}" -u "${REGISTRY_USER}" --password-stdin

for TAG in "${REMOTE_TAGS[@]}"; do
  docker tag "${LOCAL_IMAGE}" "${REGISTRY}/${REMOTE_REPO}:${TAG}"
  docker push "${REGISTRY}/${REMOTE_REPO}:${TAG}"
done

docker logout "${REGISTRY}"
```

---

## 13. Exporter / importer une image hors-ligne

Pour transférer une image vers une machine sans accès Internet (clé USB, scp…).

**Export (machine source)**

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
IMAGES=("nginx:latest" "postgres:16")
OUTPUT_FILE="$HOME/images_$(date +%Y%m%d).tar.gz"
# =====================

docker save "${IMAGES[@]}" | gzip > "${OUTPUT_FILE}"
ls -lh "${OUTPUT_FILE}"
```

**Import (machine cible)**

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
INPUT_FILE="$HOME/images_20261110.tar.gz"
# =====================

gunzip -c "${INPUT_FILE}" | docker load
docker images
```

---

## 14. Nettoyage

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
LEVEL="safe"              # safe | images | full
OLDER_THAN="168h"         # ne touche qu'aux éléments plus vieux que (168h = 7 jours)
# =====================

echo "=== Avant ==="
docker system df

case "${LEVEL}" in
  safe)
    # conteneurs arrêtés, réseaux inutilisés, images "dangling", cache de build
    docker container prune -f --filter "until=${OLDER_THAN}"
    docker network prune -f --filter "until=${OLDER_THAN}"
    docker image prune -f --filter "until=${OLDER_THAN}"
    docker builder prune -f --filter "until=${OLDER_THAN}"
    ;;
  images)
    # + toutes les images non utilisées par un conteneur
    docker system prune -a -f --filter "until=${OLDER_THAN}"
    ;;
  full)
    # ⚠️ + volumes non utilisés (DONNÉES PERDUES)
    docker system prune -a -f
    docker volume prune -a -f
    ;;
  *) echo "LEVEL inconnu : ${LEVEL}" >&2; exit 1 ;;
esac

echo "=== Après ==="
docker system df
```

---

## 15. Désinstaller Docker

⚠️ `PURGE_DATA="true"` supprime **toutes** les images, conteneurs et volumes.

```bash
#!/usr/bin/env bash
set -euo pipefail

# ===== VARIABLES =====
PURGE_DATA="false"
# =====================

sudo systemctl stop docker.service docker.socket containerd.service 2>/dev/null || true

sudo apt-get purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
sudo apt-get autoremove -y

sudo rm -f /etc/apt/sources.list.d/docker.list /etc/apt/keyrings/docker.asc

if [ "${PURGE_DATA}" = "true" ]; then
  sudo rm -rf /var/lib/docker /var/lib/containerd
  echo "Données Docker supprimées."
fi
```

---

## 16. Aide-mémoire

|Besoin|Commande|
|---|---|
|Conteneurs actifs / tous|`docker ps` / `docker ps -a`|
|Images locales|`docker images`|
|Volumes / réseaux|`docker volume ls` / `docker network ls`|
|Démarrer / arrêter / redémarrer|`docker start\|stop\|restart <nom>`|
|Logs en direct|`docker logs -f <nom>`|
|Shell dans un conteneur|`docker exec -it <nom> sh`|
|Copier hôte → conteneur|`docker cp ./fichier <nom>:/chemin/`|
|Copier conteneur → hôte|`docker cp <nom>:/chemin/fichier ./`|
|Conso CPU/RAM|`docker stats`|
|Espace disque Docker|`docker system df`|
|Détails d'un objet|`docker inspect <nom>`|
|IP d'un conteneur|`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <nom>`|
|Conteneur jetable|`docker run --rm -it alpine sh`|
|Renommer|`docker rename <ancien> <nouveau>`|
|Historique des couches|`docker history <image>`|
|Infos du démon|`docker info`|
|Statut du service|`systemctl status docker`|