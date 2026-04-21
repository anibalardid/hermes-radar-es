#!/usr/bin/env bash
# add-video.sh — Agrega un video de YouTube a app.js (VIDEOS_DATA)
# Uso: ./add-video.sh "Título del video" "VIDEO_ID" "Descripción" "Canal" "Duración"
# Ejemplo: ./add-video.sh "Hermes Agent Tutorial" "dQw4w9WgXcQ" "Tutorial completo" "Hermes Dev" "12:34"

set -euo pipefail
cd "$(dirname "$0")/.."

TITLE="${1:?Uso: add-video.sh TITULO VIDEO_ID DESCRIPCION CANAL DURACION}"
VID_ID="${2:?Falta VIDEO_ID de YouTube}"
DESC="${3:-Video sobre Hermes Agent}"
CHANNEL="${4:-Unknown}"
DURATION="${5:-??}"

APP="app.js"

# Buscar la posición del cierre de VIDEOS_DATA
LINE=$(grep -n "^];" "$APP" | head -3 | tail -1)

# Preparar la entrada
ENTRY="  { id: '$VID_ID', title: '$TITLE', channel: '$CHANNEL', duration: '$DURATION', desc: '$DESC' },"

# Insertar antes del cierre
sed -i '' "${LINE}i\\
$ENTRY
" "$APP"

echo "✅ Video agregado: $TITLE ($VID_ID)"
echo "   Recordá hacer commit: git add app.js && git commit -m 'feat: add video $VID_ID'"