#!/usr/bin/env bash
# cronsite.sh — Wrapper para ejecutar los scripts del sitio
# Se usa desde crontab del sistema

export PATH="/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:$HOME/.hermes/profiles/hermes-radar/bin:$PATH"
export HOME="$HOME"

cd "/Users/anibal/.hermes/projects/hermes-radar-es" || exit 1

# Cargar env del profile
if [ -f "$HOME/.hermes/profiles/hermes-radar/.env" ]; then
  set -a
  source "$HOME/.hermes/profiles/hermes-radar/.env"
  set +a
fi

case "${1:-all}" in
  all)
    bash scripts/x-monitor.sh
    bash scripts/hermes-updates.sh
    bash scripts/youtube-auto-update.sh
    bash scripts/skills-discovery.sh
    ;;
  x)
    bash scripts/x-monitor.sh
    ;;
  updates)
    bash scripts/hermes-updates.sh
    ;;
  youtube)
    bash scripts/youtube-auto-update.sh
    ;;
  skills)
    bash scripts/skills-discovery.sh
    ;;
  *)
    echo "Uso: $0 [all|x|updates|youtube|skills]"
    exit 1
    ;;
esac
