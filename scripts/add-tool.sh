#!/usr/bin/env bash
# add-tool.sh — Agrega una herramienta a data/herramientas.json
# Uso: ./add-tool.sh "nombre" "descripción" "categoría" "url" [tipo]
#   tipo: "native" (default) o "external"
# Ejemplo nativa:  ./add-tool.sh "nueva_tool" "Hace algo" "Categoría" "https://docs..."
# Ejemplo externa: ./add-tool.sh "MiProyecto" "Desc" "Plataformas" "https://github.com/..." external

set -euo pipefail
cd "$(dirname "$0")/.."

NAME="${1:?Uso: add-tool.sh NOMBRE DESC CATEGORIA URL [native|external]}"
DESC="${2:?Falta descripción}"
CAT="${3:?Falta categoría}"
URL="${4:?Falta URL}"
TYPE="${5:-native}"

FILE="data/herramientas.json"

command -v jq >/dev/null 2>&1 || { echo "❌ jq no está instalado. Instalá con: brew install jq"; exit 1; }

if [ "$TYPE" = "external" ]; then
  # Herramientas externas (grupo 1, índice 1 en el array)
  GROUP_INDEX=1
  STARS="${STARS:-}"
  LANG="${LANG:-}"

  jq --arg gi "$GROUP_INDEX" \
     --arg name "$NAME" \
     --arg desc "$DESC" \
     --arg cat "$CAT" \
     --arg url "$URL" \
     --arg stars "$STARS" \
     --arg lang "$LANG" \
     '.[$gi | tonumber].tools += [{"name": $name, "desc": $desc, "cat": $cat, "url": $url, "stars": $stars, "lang": $lang}]' \
     "$FILE" > "${FILE}.tmp" && mv "${FILE}.tmp" "$FILE"
else
  # Herramientas nativas (grupo 0)
  GROUP_INDEX=0

  jq --arg gi "$GROUP_INDEX" \
     --arg name "$NAME" \
     --arg desc "$DESC" \
     --arg cat "$CAT" \
     --arg url "$URL" \
     '.[$gi | tonumber].tools += [{"name": $name, "desc": $desc, "cat": $cat, "url": $url}]' \
     "$FILE" > "${FILE}.tmp" && mv "${FILE}.tmp" "$FILE"
fi

echo "✅ Herramienta agregada: $NAME ($TYPE)"
echo "   Recordá hacer commit: git add data/herramientas.json && git commit -m 'feat: add tool $NAME'"