#!/usr/bin/env bash
# bump-version.sh — Incrementa la versión del sitio y hace commit
# Uso: ./bump-version.sh [major|minor|patch]
#   patch: 0.1.0 → 0.1.1 (default)
#   minor: 0.1.0 → 0.2.0
#   major: 0.1.0 → 1.0.0

set -euo pipefail
cd "$(dirname "$0")/.."

BUMP="${1:-patch}"

# Leer versión actual
CURRENT=$(grep "HR_VERSION = " version.js | sed "s/.*'\\([^']*\\)'.*/\\1/")

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

case "$BUMP" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
  *) echo "Uso: bump-version.sh [major|minor|patch]"; exit 1 ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"

echo "Bumping: $CURRENT → $NEW_VERSION"

# Actualizar version.js
sed -i '' "s/var HR_VERSION = '${CURRENT}'/var HR_VERSION = '${NEW_VERSION}'/" version.js

# Actualizar HR_VER en app.js
sed -i '' "s/const HR_VER = '${CURRENT}'/const HR_VER = '${NEW_VERSION}'/" app.js

# Actualizar fallback en index.html
sed -i '' "s/'${CURRENT}'/'${NEW_VERSION}'/g" index.html

# Actualizar badge default en index.html
sed -i '' "s/>v${CURRENT}</>v${NEW_VERSION}</g" index.html

# Actualizar CHANGELOG.md — agregar entrada
TODAY=$(date +%Y-%m-%d)
sed -i '' "3i\\
\\
## [${NEW_VERSION}] - ${TODAY}\\
\\
### Changed\\
- Version bump to ${NEW_VERSION}
" CHANGELOG.md

echo ""
echo "✅ Versión actualizada: v${NEW_VERSION}"
echo "   Archivos modificados: version.js, app.js, index.html, CHANGELOG.md"
echo ""
echo "   Proximos pasos:"
echo "   1. Revisar cambios: git diff"
echo "   2. Commit: git add -A && git commit -m 'chore: bump version to v${NEW_VERSION}'"
echo "   3. Push: git push"