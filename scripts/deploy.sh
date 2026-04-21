#!/usr/bin/env bash
# deploy.sh — Audit de seguridad, commit y push a GitHub Pages
# Uso: ./scripts/deploy.sh "mensaje del commit"
# Flags: --skip-audit  (saltar auditoría de seguridad, no recomendado)

set -euo pipefail
cd "$(dirname "$0")/.."

MSG="${1:?Uso: deploy.sh \"mensaje del commit\"}"
SKIP_AUDIT=false
[[ "${2:-}" == "--skip-audit" ]] && SKIP_AUDIT=true

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}════════════════════════════════════════${NC}"
echo -e "${CYAN}  Hermes Radar — Deploy Pipeline${NC}"
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo ""

# ─── Paso 1: Validar JSON ───
echo -e "${YELLOW}[1/5] Validando archivos JSON...${NC}"
JSON_OK=true
for f in data/*.json; do
  if ! jq empty "$f" 2>/dev/null; then
    echo -e "${RED}  ❌ JSON inválido: $f${NC}"
    JSON_OK=false
  else
    echo -e "${GREEN}  ✅ $f${NC}"
  fi
done

if [[ "$JSON_OK" == "false" ]]; then
  echo -e "${RED}Error: JSON inválido encontrado. Corregí antes de continuar.${NC}"
  exit 1
fi
echo ""

# ─── Paso 2: Auditoría de seguridad ───
if [[ "$SKIP_AUDIT" == "true" ]]; then
  echo -e "${YELLOW}[2/5] Auditoría de seguridad — SKIPPED (--skip-audit)${NC}"
  echo ""
else
  echo -e "${YELLOW}[2/5] Auditoría de seguridad...${NC}"
  ISSUES=0

  # 2a. API keys y tokens
  echo "  Buscando API keys y tokens..."
  PATTERNS=(
    '(API_KEY|API_SECRET|ACCESS_TOKEN|SECRET_KEY|PRIVATE_KEY)\s*[=:]\s*["\x27][^"\x27]{8,}'
    'sk-[a-zA-Z0-9]{20,}'
    'sk-ant-[a-zA-Z0-9\-]{20,}'
    'xox[bpsoa]-[a-zA-Z0-9\-]{10,}'
    'ghp_[a-zA-Z0-9]{36,}'
    'gho_[a-zA-Z0-9]{36,}'
    'AKIA[A-Z0-9]{16}'
    'AIza[a-zA-Z0-9_\-]{35}'
    '[a-zA-Z0-9_-]{40}@apps\.googlemail\.com'
  )

  for pat in "${PATTERNS[@]}"; do
    while IFS= read -r match; do
      if [[ -n "$match" ]]; then
        echo -e "${RED}    ⚠️  Posible secreto: ${match}${NC}"
        ISSUES=$((ISSUES + 1))
      fi
    done < <(grep -rnE "$pat" --include='*.js' --include='*.json' --include='*.html' --include='*.css' --include='*.sh' . 2>/dev/null || true)
  done

  # 2b. Contraseñas en texto plano
  echo "  Buscando contraseñas en texto plano..."
  PASS_PATTERNS=(
    'password\s*[=:]\s*["\x27][^"\x27]{3,}'
    'passwd\s*[=:]\s*["\x27][^"\x27]{3,}'
  )
  for pat in "${PASS_PATTERNS[@]}"; do
    while IFS= read -r match; do
      if [[ -n "$match" ]]; then
        # Ignorar placeholders obvios
        if ! echo "$match" | grep -qiE '(TU_TU|REEMPLAZA|PLACEHOLDER|EXAMPLE|XXXX|****|\*\*\*\*)'; then
          echo -e "${RED}    ⚠️  Posible contraseña: ${match}${NC}"
          ISSUES=$((ISSUES + 1))
        fi
      fi
    done < <(grep -rnE "$pat" --include='*.js' --include='*.json' --include='*.html' . 2>/dev/null || true)
  done

  # 2c. Emails personales
  echo "  Buscando emails personales..."
  while IFS= read -r match; do
    if [[ -n "$match" ]]; then
      # Ignorar emails de ejemplo y de organizaciones
      if ! echo "$match" | grep -qiE '(example\.com|nousresearch\.com|github\.com|gmail\.com.*noreply)'; then
        echo -e "${YELLOW}    ⚠️  Email personal: ${match}${NC}"
        ISSUES=$((ISSUES + 1))
      fi
    fi
  done < <(grep -rnE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' --include='*.js' --include='*.json' --include='*.html' . 2>/dev/null || true)

  # 2d. IPs internas y puertos sensibles
  echo "  Buscando IPs internas..."
  # Busca solo IPs privadas RFC1918 con 4 octetos (no versiones semver)
  while IFS= read -r match; do
    echo -e "${YELLOW}    ⚠️  IP interna: ${match}${NC}"
    ISSUES=$((ISSUES + 1))
  done < <(grep -rnE '(192\.168\.[0-9]{1,3}\.[0-9]{1,3}|10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|172\.(1[6-9]|2[0-9]|3[01])\.[0-9]{1,3}\.[0-9]{1,3})' --include='*.js' --include='*.json' --include='*.html' . 2>/dev/null || true)

  # 2e. Archivos ocultos/sensibles
  echo "  Buscando archivos sensibles..."
  SENSITIVE_FILES=('.env' '.env.local' '.env.production' '.npmrc' '.pypirc' '.netrc' 'credentials.json' 'service-account.json' 'id_rsa' 'id_ed25519')
  for sf in "${SENSITIVE_FILES[@]}"; do
    if [[ -f "$sf" ]]; then
      echo -e "${RED}    ⚠️  Archivo sensible encontrado: $sf${NC}"
      ISSUES=$((ISSUES + 1))
    fi
  done

  # 2f. Verificar .gitignore
  echo "  Verificando .gitignore..."
  if [[ -f ".gitignore" ]]; then
    GITIGNORE_OK=true
    for pattern in '*.env' '.env*' 'node_modules' '.DS_Store'; do
      if ! grep -q "$pattern" .gitignore 2>/dev/null; then
        echo -e "${YELLOW}    ⚠️  .gitignore no incluye: $pattern${NC}"
        GITIGNORE_OK=false
      fi
    done
    if [[ "$GITIGNORE_OK" == "true" ]]; then
      echo -e "${GREEN}    ✅ .gitignore OK${NC}"
    fi
  else
    echo -e "${YELLOW}    ⚠️  No existe .gitignore${NC}"
  fi

  echo ""
  if [[ $ISSUES -gt 0 ]]; then
    echo -e "${RED}  ❌ Se encontraron $ISSUES problema(s) de seguridad.${NC}"
    echo -e "${RED}     Revisá los hallazgos arriba. Usá --skip-audit solo si estás seguro.${NC}"
    echo ""
    read -p "  ¿Continuar de todas formas? (s/N): " CONFIRM
    if [[ "$CONFIRM" != "s" && "$CONFIRM" != "S" ]]; then
      echo -e "${YELLOW}Deploy cancelado.${NC}"
      exit 1
    fi
  else
    echo -e "${GREEN}  ✅ Auditoría de seguridad pasada. Sin problemas.${NC}"
  fi
  echo ""
fi

# ─── Paso 3: Verificar JS syntax ───
echo -e "${YELLOW}[3/5] Verificando sintaxis JS...${NC}"
if command -v node &>/dev/null; then
  if node -c app.js 2>/dev/null; then
    echo -e "${GREEN}  ✅ app.js sintaxis OK${NC}"
  else
    echo -e "${RED}  ❌ Error de sintaxis en app.js${NC}"
    node -c app.js 2>&1 || true
    exit 1
  fi
  if node -c version.js 2>/dev/null; then
    echo -e "${GREEN}  ✅ version.js sintaxis OK${NC}"
  else
    echo -e "${RED}  ❌ Error de sintaxis en version.js${NC}"
    exit 1
  fi
else
  echo -e "${YELLOW}  ⚠️  node no disponible, salteando verificación de sintaxis JS${NC}"
fi
echo ""

# ─── Paso 4: Commit ───
echo -e "${YELLOW}[4/5] Commit...${NC}"
git add -A
CHANGES=$(git diff --cached --stat)
if [[ -z "$CHANGES" ]]; then
  echo -e "${YELLOW}  No hay cambios para commitear.${NC}"
else
  echo "$CHANGES"
  echo ""
  git commit -m "$MSG"
  echo -e "${GREEN}  ✅ Commit creado${NC}"
fi
echo ""

# ─── Paso 5: Push ───
echo -e "${YELLOW}[5/5] Push a origin/main...${NC}"
git push origin main
echo -e "${GREEN}  ✅ Push exitoso${NC}"
echo ""

echo -e "${CYAN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  🚀 Deploy completado${NC}"
echo -e "${CYAN}════════════════════════════════════════${NC}"