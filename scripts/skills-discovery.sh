#!/usr/bin/env bash
# Skills Discovery - Finds new Hermes skills, plugins, and themes
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EXPORT_DIR="$BASE_DIR/data/skills-discovery"

echo "=== Skills Discovery Started: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="

curl -s "https://api.github.com/search/repositories?q=hermes-agent+stars:%3E5&sort=stars&per_page=30" \
  > "$EXPORT_DIR/gh_skills.json" 2>/dev/null || echo "WARN: skills search failed"

curl -s "https://api.github.com/search/repositories?q=hermes+plugin+stars:%3E5&sort=stars&per_page=30" \
  > "$EXPORT_DIR/gh_plugins.json" 2>/dev/null || echo "WARN: plugins search failed"

curl -s "https://api.github.com/search/repositories?q=hermes+theme+OR+hermes+skin+stars:%3E3&sort=stars&per_page=20" \
  > "$EXPORT_DIR/gh_themes.json" 2>/dev/null || echo "WARN: themes search failed"

curl -s "https://api.github.com/search/repositories?q=hermes-workspace+OR+hermes-ui+OR+hermes-dashboard&sort=stars&per_page=20" \
  > "$EXPORT_DIR/gh_projects.json" 2>/dev/null || echo "WARN: projects search failed"

echo "=== Skills Discovery Complete: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="