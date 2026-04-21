#!/usr/bin/env bash
# add-tool.sh — Agrega una herramienta a HERRAMIENTAS_DATA en app.js
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

APP="app.js"

if [ "$TYPE" = "external" ]; then
  # Herramientas externas (con url, stars, lang)
  STARS="${STARS:-}"
  LANG="${LANG:-}"
  
  # Buscar la sección de herramientas externas (segundo grupo)
  # Insertar antes del cierre del segundo grupo
  LINE=$(grep -n "cat: 'Herramientas y plataformas externas'" "$APP" | head -1 | cut -d: -f1)
  END_LINE=$(awk "NR>$LINE /^    ]/{print NR; exit}" "$APP")
  
  ENTRY="      { name: '$NAME', desc: '$DESC', cat: '$CAT', url: '$URL', stars: '${STARS}', lang: '${LANG}' },"
  
  sed -i '' "${END_LINE}i\\
$ENTRY
" "$APP"
  
else
  # Herramientas nativas (primer grupo)
  # Insertar antes del cierre del primer grupo de tools
  LINE=$(grep -n "cat: 'Herramientas integradas'" "$APP" | head -1 | cut -d: -f1)
  END_LINE=$(awk "NR>$LINE /^    \]/{print NR; exit}" "$APP")
  
  ENTRY="      { name: '$NAME', desc: '$DESC', cat: '$CAT', url: '$URL' },"
  
  sed -i '' "${END_LINE}i\\
$ENTRY
" "$APP"
fi

echo "✅ Herramienta agregada: $NAME ($TYPE)"
echo "   Recordá hacer commit: git add app.js && git commit -m 'feat: add tool $NAME'"