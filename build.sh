#!/usr/bin/env bash
# Construit le site :
#   app/html/ : l'application Vue compilée (regénérée à chaque build)
#   app/md/   : le contenu en Markdown (jamais écrasé, créé s'il n'existe pas)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT/vue-project"

# Dépendances : installées seulement si absentes
[ -d node_modules ] || npm ci

# Type-check + build Vite (sortie dans app/html, voir vite.config.ts)
npm run build

# Dossier du contenu : on ne touche pas à ce qui existe déjà
MD="$ROOT/app/md"
mkdir -p "$MD"
if [ ! -f "$MD/config.yaml" ]; then
  cat > "$MD/config.yaml" <<'YAML'
# Config globale du site
# repo et url : laissés vides, ils sont déduits de l'URL github.io
repo:
url:
# Thèmes ou pages à ne pas afficher (tout est affiché par défaut)
hidden: []
YAML
  echo "Créé : app/md/config.yaml"
fi

echo "Build terminé : app/html/ et app/md/"
