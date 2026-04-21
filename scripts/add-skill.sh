#!/usr/bin/env bash
# add-skill.sh — Agrega una skill a data/skills.json
# Uso: ./add-skill.sh "categoría" "nombre_skill" "descripción" "bundled|optional" ["github_path"]
# Categorías: software-development, autonomous-ai-agents, creative, data-science,
#   devops, email, github, media, mlops, note-taking, productivity, research,
#   smart-home, social-media, dogfood, red-teaming, gaming, leisure, mcp
# Ejemplo: ./add-skill.sh "devops" "mi-skill" "Hace algo útil" "optional" "devops/mi-skill"

set -euo pipefail
cd "$(dirname "$0")/.."

CAT="${1:?Uso: add-skill.sh CATEGORÍA NOMBRE DESC BADDE [GH_PATH]}"
NAME="${2:?Falta nombre}"
DESC="${3:?Falta descripción}"
BADGE="${4:-optional}"
GH_PATH="${5:-$CAT/$NAME}"

FILE="data/skills.json"

command -v jq >/dev/null 2>&1 || { echo "❌ jq no está instalado. Instalá con: brew install jq"; exit 1; }

# Buscar la categoría en el array
CAT_INDEX=$(jq "map(.cat == \"$CAT\") | index(true)" "$FILE")

if [ "$CAT_INDEX" = "null" ]; then
  echo "❌ Categoría '$CAT' no encontrada en skills.json"
  echo "   Categorías disponibles:"
  jq -r '.[].cat' "$FILE"
  exit 1
fi

# Agregar la skill al array de skills de esa categoría
jq --arg cat_idx "$CAT_INDEX" \
   --arg name "$NAME" \
   --arg desc "$DESC" \
   --arg badge "$BADGE" \
   --arg gh "$GH_PATH" \
   ".[$CAT_INDEX].skills += [{\"name\": \$name, \"desc\": \$desc, \"badge\": \$badge, \"gh\": \$gh}]" \
   "$FILE" > "${FILE}.tmp" && mv "${FILE}.tmp" "$FILE"

echo "✅ Skill agregada: $NAME (cat: $CAT, badge: $BADGE)"
echo "   Recordá hacer commit: git add data/skills.json && git commit -m 'feat: add skill $NAME'"