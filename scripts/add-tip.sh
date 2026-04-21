#!/usr/bin/env bash
# add-tip.sh — Agrega un truco a TRUCOS_DATA en app.js
# Uso: ./add-tip.sh "categoría" "Título" "Descripción" "código"
# Categorías: Configuración, Automatización, Memoria y Skills, Plataformas, DevOps, Tips ocultos
# Ejemplo: ./add-tip.sh "Configuración" "Mi truco" "Hace algo cool" "hermes config set key value"

set -euo pipefail
cd "$(dirname "$0")/.."

CAT="${1:?Uso: add-tip.sh CATEGORÍA TITULO DESC CÓDIGO}"
TITLE="${2:?Falta título}"
DESC="${3:?Falta descripción}"
CODE="${4:?Falta código}"

APP="app.js"

# Buscar la categoría en TRUCOS_DATA
CAT_LINE=$(grep -n "cat: '$CAT'" "$APP" | tail -1 | cut -d: -f1)

if [ -z "$CAT_LINE" ]; then
  echo "❌ Categoría '$CAT' no encontrada en TRUCOS_DATA"
  echo "Categorías válidas: Configuración, Automatización, Memoria y Skills, Plataformas, DevOps, Tips ocultos"
  exit 1
fi

# Encontrar la última entrada de esa categoría (siguiente cat: o ];)
NEXT_CAT=$(awk "NR>$CAT_LINE /cat:/{print NR; exit}" "$APP")
if [ -z "$NEXT_CAT" ]; then
  NEXT_CAT=$(grep -n "^];" "$APP" | head -3 | tail -1 | cut -d: -f1)
fi
INSERT_LINE=$((NEXT_CAT - 1))

# Escapar comillas simples en descripción y código
ESC_DESC=$(echo "$DESC" | sed "s/'/\\\\'/g")
ESC_CODE=$(echo "$CODE" | sed "s/'/\\\\'/g")

ENTRY="  { cat: '$CAT', title: '$TITLE', desc: '$ESC_DESC', code: '$ESC_CODE' },"

sed -i '' "${INSERT_LINE}a\\
$ENTRY
" "$APP"

echo "✅ Truco agregado: $TITLE (cat: $CAT)"
echo "   Recordá hacer commit: git add app.js && git commit -m 'feat: add tip $TITLE'"