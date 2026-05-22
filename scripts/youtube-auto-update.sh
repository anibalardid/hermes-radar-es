#!/usr/bin/env bash
# Auto-updater: combina youtube-monitor + append a videos.json + bump version + push
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$BASE_DIR"

DISCOVERIES="data/youtube-monitoring/discoveries.json"
VIDEOS="data/videos.json"
CONFIG="data/config.json"

# 1. Correr monitor
bash scripts/youtube-monitor.sh

# 2. Verificar si hay descubrimientos nuevos
if [ ! -f "$DISCOVERIES" ]; then
  echo "[auto-update] No discoveries file; aborting."
  exit 0
fi

count=$(jq 'length' "$DISCOVERIES")
if [ "$count" -eq 0 ]; then
  echo "[auto-update] Zero new videos found; nothing to update."
  exit 0
fi

echo "[auto-update] $count new video candidates found."

# 3. Filtrar solo los que no existen en videos.json
existing_ids=$(jq -r '.[].id // empty' "$VIDEOS" 2>/dev/null || true)
new_videos="[]"
for i in $(seq 0 $((count-1))); do
  entry=$(jq -c ".[$i]" "$DISCOVERIES")
  id=$(echo "$entry" | jq -r '.id // empty')
  already="false"
  for eid in $existing_ids; do
    if [ "$eid" = "$id" ]; then already="true"; break; fi
  done
  if [ "$already" = "false" ]; then
    new_videos=$(echo "$new_videos" | jq --argjson new "$entry" '. + [$new]')
  fi
done

new_count=$(echo "$new_videos" | jq 'length')
if [ "$new_count" -eq 0 ]; then
  echo "[auto-update] All candidates already present in videos.json; nothing to update."
  exit 0
fi

echo "[auto-update] Adding $new_count genuinely new videos."
echo "$new_videos" | jq -r '.[] | "\(.upload_date) \(.title)"'

# 4. Merge: poner los nuevos arriba del todo
current=$(cat "$VIDEOS")
merged=$(echo "$new_videos" "$current" | jq -s 'add // []')
echo "$merged" > "$VIDEOS"

# 5. Bump version patch
current_ver=$(jq -r '.HR_VER // "0.0.0"' "$CONFIG")
m="$(echo "$current_ver" | cut -d. -f1)"
n="$(echo "$current_ver" | cut -d. -f2)"
p="$(echo "$current_ver" | cut -d. -f3)"
newp=$((p+1))
new_ver="${m}.${n}.${newp}"
jq ".HR_VER = \"$new_ver\"" "$CONFIG" > "$CONFIG.tmp" && mv "$CONFIG.tmp" "$CONFIG"

# actualizar version.js
sed -i.bak "s/HR_VERSION = '.*'/HR_VERSION = '$new_ver'/" version.js && rm -f version.js.bak

# 6. Commit + push
git add -A
if git diff --cached --quiet; then
  echo "[auto-update] Nothing to commit."
  exit 0
fi

git commit -m "youtube: add $new_count new videos ($new_ver)" || true
git push origin main || true

echo "[auto-update] Done. Version bumped to $new_ver, $new_count videos added."
