#!/usr/bin/env bash
# bump-version.sh — Incrementa la versión del sitio (semver)
# Uso: ./bump-version.sh [major|minor|patch]
#   patch: 0.1.0 → 0.1.1 (default)
#   minor: 0.1.0 → 0.2.0
#   major: 0.1.0 → 1.0.0

set -euo pipefail
cd "$(dirname "$0")/.."

BUMP="${1:-patch}"

command -v jq >/dev/null 2>&1 || { echo "❌ jq no está instalado. Instalá con: brew install jq"; exit 1; }

# Leer versión actual desde config.json
CURRENT=$(jq -r '.HR_VER' data/config.json)

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

case "$BUMP" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
  *) echo "Uso: bump-version.sh [major|minor|patch]"; exit 1 ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"

echo "Bumping: $CURRENT → $NEW_VERSION"

# Actualizar config.json
jq --arg v "$NEW_VERSION" '.HR_VER = $v' data/config.json > data/config.json.tmp && mv data/config.json.tmp data/config.json

# Actualizar version.js
sed -i '' "s/var HR_VERSION = '${CURRENT}'/var HR_VERSION = '${NEW_VERSION}'/" version.js

# Actualizar fallback en index.html
sed -i '' "s/'${CURRENT}'/'${NEW_VERSION}'/g" index.html
sed -i '' "s/>v${CURRENT}</>v${NEW_VERSION}</g" index.html

# Actualizar CHANGELOG.md
TODAY=$(date +%Y-%m-%d)
sed -i '' "3i\\
\n## [${NEW_VERSION}] - ${TODAY}\n\n### Changed\n- Version bump to ${NEW_VERSION}\n" CHANGELOG.md

echo ""
echo "✅ Versión actualizada: v${NEW_VERSION}"
echo "   Archivos modificados: data/config.json, version.js, index.html, CHANGELOG.md"
echo ""
echo "   Próximos pasos:"
echo "   1. Revisar cambios: git diff"
echo "   2. Commit: git add -A && git commit -m 'chore: bump version to v${NEW_VERSION}'"
echo "   3. Push: git push"