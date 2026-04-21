#!/usr/bin/env bash
# add-news.sh — Agrega una entrada de novedades a data/versions.json
# Uso: ./add-news.sh "vX.Y.Z" "fecha" "nombre" "highlight1" "highlight2" ...
# Ejemplo: ./add-news.sh "v0.11.0" "1 mayo 2026" "The Next Release" "+15 tools integradas" "Mejora 50% en velocidad"

set -euo pipefail
cd "$(dirname "$0")/.."

VER="${1:?Uso: add-news.sh VERSION FECHA NOMBRE HIGHLIGHTS...}"
DATE="${2:?Falta fecha (ej: '1 mayo 2026')}"
NAME="${3:?Falta nombre del release}"
shift 3

FILE="data/versions.json"

command -v jq >/dev/null 2>&1 || { echo "❌ jq no está instalado. Instalá con: brew install jq"; exit 1; }

# Build highlights JSON array from remaining args
HIGHLIGHTS=$(printf '%s\n' "$@" | jq -R . | jq -s .)

# Poner current=false en todas las entradas existentes, y agregar la nueva al inicio
jq --arg ver "$VER" \
   --arg date "$DATE" \
   --arg name "$NAME" \
   --argjson highlights "$HIGHLIGHTS" \
   'map(.current = false) | [{"version": $ver, "tag": "", "date": $date, "name": $name, "current": true, "highlights": $highlights}] + .' \
   "$FILE" > "${FILE}.tmp" && mv "${FILE}.tmp" "$FILE"

echo ""
echo "✅ Novedad agregada: $VER ($DATE)"
echo "   No olvides actualizar version.js y config.json si es un release nuevo."
echo "   Recordá hacer commit: git add data/versions.json && git commit -m 'feat: add news $VER'"