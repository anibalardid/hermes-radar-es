#!/usr/bin/env bash
# X/Twitter Monitor - Detecta tweets nuevos de @Teknium y comunidad Hermes
# Requiere: bird, jq
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EXPORT_DIR="$BASE_DIR/data/x-monitoring"
mkdir -p "$EXPORT_DIR"

# Cargar credenciales (quitar comillas si las hay)
PROFILE_ENV="$HOME/.hermes/profiles/hermes-radar/.env"
if [ -f "$PROFILE_ENV" ]; then
  AUTH_TOKEN="$(grep -E '^AUTH_TOKEN' "$PROFILE_ENV" 2>/dev/null | head -1 | sed 's/^[^=]*=//' | sed 's/^[ \t]*"//' | sed 's/"$//')"
  CT0="$(grep -E '^CT0' "$PROFILE_ENV" 2>/dev/null | head -1 | sed 's/^[^=]*=//' | sed 's/^[ \t]*"//' | sed 's/"$//')"
fi

if [ -z "${AUTH_TOKEN:-}" ] || [ -z "${CT0:-}" ]; then
  echo "ERROR: AUTH_TOKEN y CT0 requeridos"
  echo "Setear en ~/.hermes/profiles/hermes-radar/.env"
  exit 1
fi

# Exportar para que bird las tome
export AUTH_TOKEN CT0

# --- 1. Buscar tweets actuales ---
echo "=== X Monitor Started: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="

TEK_FILE="$EXPORT_DIR/teknium_raw.txt"
SEARCH_FILE="$EXPORT_DIR/search_raw.txt"

bird user-tweets @Teknium -n 20 > "$TEK_FILE" 2>/dev/null || { echo "WARN: bird user-tweets fallo"; }
bird search "hermes agent" -n 20 > "$SEARCH_FILE" 2>/dev/null || { echo "WARN: bird search fallo"; }

# --- 2. Extraer IDs de tweets ---
extract_ids() {
  local f="${1:-}"
  if [ ! -f "$f" ]; then return; fi
  grep -oE 'https://x\.com/[^/]+/status/[0-9]+' "$f" 2>/dev/null | sed 's/.*status\///' | sort -u
}

# --- 3. Archivos de referencia ---
LAST_TEK="$EXPORT_DIR/.last_teknium.ids"
LAST_SEARCH="$EXPORT_DIR/.last_search.ids"

NEW_TEK=""
NEW_SEARCH=""

if [ -f "$LAST_TEK" ] && [ -s "$LAST_TEK" ]; then
  NEW_TEK=$(comm -23 <(extract_ids "$TEK_FILE" | sort) <(sort "$LAST_TEK") | tr '\n' ' ')
else
  NEW_TEK=$(extract_ids "$TEK_FILE" | tr '\n' ' ')
fi

if [ -f "$LAST_SEARCH" ] && [ -s "$LAST_SEARCH" ]; then
  NEW_SEARCH=$(comm -23 <(extract_ids "$SEARCH_FILE" | sort) <(sort "$LAST_SEARCH") | tr '\n' ' ')
else
  NEW_SEARCH=$(extract_ids "$SEARCH_FILE" | tr '\n' ' ')
fi

# Guardar IDs actuales
extract_ids "$TEK_FILE" > "$LAST_TEK" || true
extract_ids "$SEARCH_FILE" > "$LAST_SEARCH" || true

# --- 4. Reportar ---
found_tek=$(echo "$NEW_TEK" | tr ' ' '\n' | grep -c '.' 2>/dev/null | tr -d ' \n' || echo 0)
found_search=$(echo "$NEW_SEARCH" | tr ' ' '\n' | grep -c '.' 2>/dev/null | tr -d ' \n' || echo 0)

if [ "$found_tek" -gt 0 ] || [ "$found_search" -gt 0 ]; then
  echo "Novedades detectadas:"
  if [ "$found_tek" -gt 0 ]; then
    echo "  - @Teknium: $found_tek tweets nuevos"
    echo "$NEW_TEK" | tr ' ' '\n' | grep '.' | while read -r tid; do
      [ -n "$tid" ] && echo "    * https://x.com/status/$tid"
    done
  fi
  if [ "$found_search" -gt 0 ]; then
    echo "  - Busqueda: $found_search tweets nuevos"
    echo "$NEW_SEARCH" | tr ' ' '\n' | grep '.' | head -5 | while read -r tid; do
      [ -n "$tid" ] && echo "    * https://x.com/status/$tid"
    done
  fi
  {
    echo "# X Monitor — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "## Nuevos tweets @Teknium"
    echo "$NEW_TEK" | tr ' ' '\n' | grep '.' || true
    echo ""
    echo "## Nuevos tweets busqueda"
    echo "$NEW_SEARCH" | tr ' ' '\n' | grep '.' || true
  } > "$EXPORT_DIR/last_run_report.md"
  echo "=== EXIT 1 (hay novedades) ==="
  exit 1
fi

echo "Sin novedades."
echo "=== EXIT 0 (ok) ==="
exit 0
