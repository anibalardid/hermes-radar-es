#!/usr/bin/env bash
# Hermes Updates Monitor - Checks for new Hermes Agent versions
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EXPORT_DIR="$BASE_DIR/data/hermes-updates"

echo "=== Hermes Updates Started: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="

curl -s "https://api.github.com/repos/NousResearch/hermes-agent/releases?per_page=5" \
  > "$EXPORT_DIR/github_releases.json" 2>/dev/null || echo "WARN: releases fetch failed"

curl -s "https://api.github.com/repos/NousResearch/hermes-agent/tags?per_page=10" \
  > "$EXPORT_DIR/github_tags.json" 2>/dev/null || echo "WARN: tags fetch failed"

curl -s "https://api.github.com/repos/NousResearch/hermes-agent/commits?per_page=10" \
  > "$EXPORT_DIR/github_commits.json" 2>/dev/null || echo "WARN: commits fetch failed"

# Merge datos al sitio e intentar push si hay cambios
cd "$BASE_DIR" && python3 scripts/merge-data.py versions
CHANGES=$(git diff --name-only || true)
if echo "$CHANGES" | grep -q "versions.json"; then
  git add data/versions.json data/hermes-updates/ version.js data/config.json 2>/dev/null || true
  git commit -m "data: sync versions from hermes-agent release" || true
  git push origin main || true
  echo "[hermes-updates] Versions sync pushed"
fi

echo "=== Hermes Updates Complete: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="