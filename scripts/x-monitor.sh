#!/usr/bin/env bash
# X/Twitter Monitor - Fetches latest tweets from @Teknium & Hermes community
# Requires: AUTH_TOKEN and CT0 env vars (set in profile .env)
set -euo pipefail

# Load credentials from profile .env if available
PROFILE_ENV="$HOME/.hermes/profiles/hermes-radar/.env"
if [ -f "$PROFILE_ENV" ]; then
  set -a
  # shellcheck source=/dev/null
  . "$PROFILE_ENV"
  set +a
fi

BASE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EXPORT_DIR="$BASE_DIR/data/x-monitoring"

if [ -z "${AUTH_TOKEN:-}" ] || [ -z "${CT0:-}" ]; then
  echo "ERROR: AUTH_TOKEN and CT0 must be set as environment variables"
  echo "They are configured in ~/.hermes/profiles/hermes-radar/.env"
  exit 1
fi

echo "=== X Monitor Started: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="

bird user-tweets @Teknium -n 20 2>/dev/null > "$EXPORT_DIR/teknium_raw.txt" || echo "WARN: bird user-tweets failed"
bird search "hermes agent" -n 20 2>/dev/null > "$EXPORT_DIR/search_raw.txt" || echo "WARN: bird search failed"

echo "=== X Monitor Complete: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="