#!/usr/bin/env bash
# add-news.sh — Agrega una entrada de novedades a VERSIONS_DATA en app.js
# Uso: ./add-news.sh " vX.Y.Z" "fecha" "resumen" "detalle1" "detalle2" ...
# Ejemplo: ./add-news.sh "0.11.0" "2026-05-01" "Nuevas tools y mejoras de performance" "+15 tools integradas" "Mejora 50% en velocidad"

set -euo pipefail
cd "$(dirname "$0")/.."

VER="${1:?Uso: add-news.sh VERSION FECHA RESUMEN [DETALLES...]}"
DATE="${2:?Falta fecha (YYYY-MM-DD)}"
SUMMARY="${3:?Falta resumen}"
shift 3

APP="app.js"

# Build features array
FEATURES=""
for detail in "$@"; do
  if [ -n "$FEATURES" ]; then
    FEATURES="$FEATURES,"
  fi
  FEATURES="$FEATURES'$detail'"
done

# Si no hay detalles, poner el resumen como feature
if [ -z "$FEATURES" ]; then
  FEATURES="'$SUMMARY'"
fi

# Insertar al inicio de VERSIONS_DATA (después de la línea de apertura)
OPEN_LINE=$(grep -n "^const VERSIONS_DATA" "$APP" | head -1 | cut -d: -f1)

ENTRY="  { version: 'v$VER', date: '$DATE', summary: '$SUMMARY', features: [$FEATURES] },"

# Insertar después de la línea de apertura +1
INSERT_LINE=$((OPEN_LINE + 1))

sed -i '' "${INSERT_LINE}i\\
$ENTRY
" "$APP"

# Actualizar versión del sitio
echo ""
echo "✅ Novedad agregada: v$VER ($DATE)"
echo "   No olvides actualizar version.js y HR_VER en app.js si es un release nuevo."
echo "   Recordá hacer commit: git add app.js && git commit -m 'feat: add news v$VER'"