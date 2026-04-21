#!/usr/bin/env bash
# Hermes Updates Monitor - Checks for new Hermes Agent versions
set -euo pipefail

EXPORT_DIR="$HOME/.hermes/profiles/hermes-radar/home/projects/hermes-radar-es/data/hermes-updates"

echo "=== Hermes Updates Started: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="

curl -s "https://api.github.com/repos/NousResearch/hermes-agent/releases?per_page=5" \
  > "$EXPORT_DIR/github_releases.json" 2>/dev/null || echo "WARN: releases fetch failed"

curl -s "https://api.github.com/repos/NousResearch/hermes-agent/tags?per_page=10" \
  > "$EXPORT_DIR/github_tags.json" 2>/dev/null || echo "WARN: tags fetch failed"

curl -s "https://api.github.com/repos/NousResearch/hermes-agent/commits?per_page=10" \
  > "$EXPORT_DIR/github_commits.json" 2>/dev/null || echo "WARN: commits fetch failed"

echo "=== Hermes Updates Complete: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="