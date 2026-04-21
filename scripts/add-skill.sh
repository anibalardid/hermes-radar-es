#!/usr/bin/env bash
# add-skill.sh — Agrega una skill al SKILLS_DATA en app.js
# Uso: ./add-skill.sh "categoría" "nombre_skill" "descripción" "bundled|optional" "github_path"
# Categorías (directorios): software-development, autonomous-ai-agents, creative, data-science,
#   devops, email, github, media, mlops, note-taking, productivity, research,
#   smart-home, social-media, dogfood, red-teaming, gaming, leisure, mcp
# Ejemplo: ./add-skill.sh "devops" "mi-skill" "Hace algo útil" "optional" "devops/mi-skill"

set -euo pipefail
cd "$(dirname "$0")/.."

CAT="${1:?Uso: add-skill.sh CATEGORÍA NOMBRE DESC BADGE GH_PATH}"
NAME="${2:?Falta nombre}"
DESC="${3:?Falta descripción}"
BADGE="${4:-optional}"
GH_PATH="${5:-$CAT/$NAME}"

APP="app.js"

# Buscar la categoría en SKILLS_DATA
CAT_LINE=$(grep -n "cat: '$CAT'" "$APP" | head -1 | cut -d: -f1)

if [ -z "$CAT_LINE" ]; then
  echo "❌ Categoría '$CAT' no encontrada en SKILLS_DATA"
  echo "Buscá las categorías disponibles en app.js bajo SKILLS_DATA"
  exit 1
fi

# Encontrar el cierre de skills de esa categoría
END_LINE=$(awk "NR>$CAT_LINE /^  ]/{print NR; exit}" "$APP")

# Determinar el campo gh según badge
if [ "$BADGE" = "bundled" ]; then
  ENTRY="    { name: '$NAME', desc: '$DESC', badge: 'bundled', gh: '$GH_PATH' },"
else
  ENTRY="    { name: '$NAME', desc: '$DESC', badge: 'optional', gh: '$GH_PATH' },"
fi

sed -i '' "${END_LINE}i\\
$ENTRY
" "$APP"

echo "✅ Skill agregada: $NAME (cat: $CAT, badge: $BADGE)"
echo "   Recordá hacer commit: git add app.js && git commit -m 'feat: add skill $NAME'"