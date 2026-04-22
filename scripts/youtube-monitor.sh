#!/usr/bin/env bash
# YouTube Monitor - Busca videos nuevos de Hermes Agent en YouTube
# Filtra por fecha (>= 2025-03) y verifica idioma/subtitulos/heuristic espanol
# Requiere: yt-dlp, jq
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EXPORT_DIR="$BASE_DIR/data/youtube-monitoring"
mkdir -p "$EXPORT_DIR"

QUERIES=(
  "Hermes Agent"
  "Hermes Agent tutorial"
  "Hermes Agent setup"
  "agente Hermes"
  "tutorial Hermes Agent español"
  "Cómo usar Hermes Agent"
)

MAX_PER_QUERY=5
RAW_FILE="$EXPORT_DIR/searches_raw.json"
OUTPUT_FILE="$EXPORT_DIR/discoveries.json"
EXISTING_VIDEOS="$BASE_DIR/data/videos.json"

echo "=== YouTube Monitor Started: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="

# 1. Buscar
all_entries="[]"
for query in "${QUERIES[@]}"; do
  echo "[yt-dlp] search: $query"
  result=$(yt-dlp --dump-single-json \
    --skip-download \
    --playlist-items "1-$MAX_PER_QUERY" \
    --default-search "ytsearch" \
    --match-filter "duration > 180" \
    "ytsearch$MAX_PER_QUERY:$query" 2>/dev/null || true)
  if [ -n "$result" ]; then
    entries=$(echo "$result" | jq -c '.entries // []')
    all_entries=$(echo "$all_entries" "$entries" | jq -s 'add')
  fi
  sleep 1
done

all_entries=$(echo "$all_entries" | jq 'unique_by(.id)')

# 2. Ids existentes
existing_ids=""
if [ -f "$EXISTING_VIDEOS" ]; then
  existing_ids=$(jq -r '.[].id // empty' "$EXISTING_VIDEOS" 2>/dev/null | tr '\n' ' ')
fi

echo "[filter] filtrando por fecha + verificando contenido en espanol..."

# 3. Para cada video, filtrar y verificar idioma/subtitulos/heuristic
filtered="[]"
total=$(echo "$all_entries" | jq 'length')
for i in $(seq 0 $((total-1))); do
  entry=$(echo "$all_entries" | jq -c ".[$i]")
  id=$(echo "$entry" | jq -r '.id // empty')
  [ -z "$id" ] && continue

  # Saltar si ya esta
  if echo "$existing_ids" | grep -qw "$id"; then continue; fi

  # Fecha
  upload_date_raw=$(echo "$entry" | jq -r '.upload_date // empty')
  [ -z "$upload_date_raw" ] && continue
  if [ "${#upload_date_raw}" -eq 8 ]; then
    upload_date="${upload_date_raw:0:4}-${upload_date_raw:4:2}-${upload_date_raw:6:2}"
  else
    upload_date="$upload_date_raw"
  fi
  [[ "$upload_date" < "2025-03-01" ]] && continue

  # Texto combinado para heuristic
  text=$(echo "$entry" | jq -r '[ (.title // "") , (.description // "") , (.uploader // "") ] | add')

  has_es="false"

  # Heuristic: texto menciona espanol
  if echo "$text" | grep -Eqi 'español|spanish|en español|españa|española'; then
    has_es="true"
  fi

  # Tituclo contiene terminos indicativos de espanol
  title=$(echo "$entry" | jq -r '.title // ""')
  if echo "$title" | grep -Eqi 'como (usar|instalar|configurar)|tutorial en español|review español|español|agente hermes|cómo usar|como usar'; then
    has_es="true"
  fi

  # Idioma declarado
  lang=$(echo "$entry" | jq -r '.language // empty')
  if [ "$lang" = "es" ] || [ "$lang" = "es-ES" ] || [ "$lang" = "es-MX" ] || [ "$lang" = "es-419" ] || [ "$lang" = "espanol" ]; then
    has_es="true"
  fi

  # Verificar subtitulos
  subs_output=$(echo "$(yt-dlp --no-update --list-subs --skip-download \"https://youtube.com/watch?v=$id\" 2>/dev/null || true)")
  if [ -n "$subs_output" ]; then
    if echo "$subs_output" | grep -Eq '[[:space:]]?es[._-]?'; then
      has_es="true"
    fi
    if echo "$subs_output" | grep -Eq '[[:space:]]?spanish[[:space:]]?'; then
      has_es="true"
    fi
  fi

  [ "$has_es" != "true" ] && continue

  # Construir objeto
  views_raw=$(echo "$entry" | jq -r '.view_count // empty')
  hviews="—"
  if [ -n "$views_raw" ] && [ "$views_raw" != "null" ] && [ "$views_raw" -gt 0 ] 2>/dev/null; then
    if command -v bc >/dev/null 2>&1 && [ "$views_raw" -ge 1000 ]; then
      if [ "$views_raw" -ge 1000000 ]; then
        hviews="$(printf "%.1fM" $(echo "scale=1; $views_raw/1000000" | bc))"
      else
        hviews="$(printf "%dK" $((views_raw/1000)))"
      fi
    else
      hviews="$views_raw"
    fi
  fi

  channel=$(echo "$entry" | jq -r '.uploader // .channel // .uploader_id // "—"')
  desc_raw="$(echo "$entry" | jq -r '.description // ""' | tr '\n' ' ' | sed 's/  */ /g')"
  [ "${#desc_raw}" -gt 280 ] && desc_raw="${desc_raw:0:277}..."

  obj=$(jq -n \
    --arg id "$id" \
    --arg title "$title" \
    --arg channel "$channel" \
    --arg views "$hviews" \
    --arg upload_date "$upload_date" \
    --arg desc "$desc_raw" \
    '{id:$id, title:$title, channel:$channel, views:$views, upload_date:$upload_date, desc:$desc}')
  filtered=$(echo "$filtered" | jq --argjson newObj "$obj" '. + [$newObj]')
  echo "  + MATCH: [$id] $title"
done

# 4. Guardar
echo "$all_entries" > "$RAW_FILE"
echo "$filtered" | jq 'unique_by(.id) | sort_by(.upload_date) | reverse' > "$OUTPUT_FILE"

count=$(echo "$filtered" | jq 'length')
echo "=== YouTube Monitor Complete: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
echo "Descubiertos: $count videos con contenido en espanol"
echo "Guardado en: $OUTPUT_FILE"

if [ "$count" -gt 0 ]; then
  echo "---"
  echo "$filtered" | jq -r '.[] | "\(.upload_date) | \(.title[:60])… | \(.channel)"'
fi
