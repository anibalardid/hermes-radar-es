#!/usr/bin/env bash
# add-tip.sh — Agrega un truco a data/trucos.json
# Uso: ./add-tip.sh "categoría" "Título" "Descripción" "código"
# Categorías: Configuración, Automatización, Memoria y Skills, Plataformas, DevOps, Tips ocultos
# Ejemplo: ./add-tip.sh "Configuración" "Mi truco" "Hace algo cool" "hermes config set key value"

set -euo pipefail
cd "$(dirname "$0")/.."

CAT="${1:?Uso: add-tip.sh CATEGORÍA TITULO DESC CÓDIGO}"
TITLE="${2:?Falta título}"
DESC="${3:?Falta descripción}"
CODE="${4:?Falta código}"

FILE="data/trucos.json"

command -v jq >/dev/null 2>&1 || { echo "❌ jq no está instalado. Instalá con: brew install jq"; exit 1; }

# Agregar el tip al final del array
jq --arg cat "$CAT" \
   --arg title "$TITLE" \
   --arg desc "$DESC" \
   --arg code "$CODE" \
   '. += [{"cat": $cat, "title": $title, "desc": $desc, "code": $code}]' \
   "$FILE" > "${FILE}.tmp" && mv "${FILE}.tmp" "$FILE"

echo "✅ Truco agregado: $TITLE (cat: $CAT)"
echo "   Recordá hacer commit: git add data/trucos.json && git commit -m 'feat: add tip $TITLE'"