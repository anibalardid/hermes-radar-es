#!/usr/bin/env bash
# add-video.sh — Agrega un video de YouTube a data/videos.json
# Uso: ./add-video.sh "Título del video" "VIDEO_ID" "Canal" "Vistas" "Descripción"
# Ejemplo: ./add-video.sh "Hermes Agent Tutorial" "dQw4w9WgXcQ" "Hermes Dev" "12K" "Tutorial completo"

set -euo pipefail
cd "$(dirname "$0")/.."

TITLE="${1:?Uso: add-video.sh TITULO VIDEO_ID CANAL VISTAS DESCRIPCION}"
VID_ID="${2:?Falta VIDEO_ID de YouTube}"
CHANNEL="${3:?Falta canal}"
VIEWS="${4:-}"
DESC="${5:-Video sobre Hermes Agent}"

FILE="data/videos.json"

# Verificar que jq está instalado
command -v jq >/dev/null 2>&1 || { echo "❌ jq no está instalado. Instalá con: brew install jq"; exit 1; }

# Agregar el video al inicio del array
jq --arg id "$VID_ID" \
   --arg title "$TITLE" \
   --arg channel "$CHANNEL" \
   --arg views "$VIEWS" \
   --arg desc "$DESC" \
   '. += [{"id": $id, "title": $title, "channel": $channel, "views": $views, "desc": $desc}]' \
   "$FILE" > "${FILE}.tmp" && mv "${FILE}.tmp" "$FILE"

echo "✅ Video agregado: $TITLE ($VID_ID)"
echo "   Recordá hacer commit: git add data/videos.json && git commit -m 'feat: add video $VID_ID'"