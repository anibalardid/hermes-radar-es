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

# Función para marcar job como ejecutado
mark_job_run() {
  local job_id="$1"
  local status="$2"  # "ok" o "error"
  local error="${3:-}"
  
  local jobs_file="$HOME/.hermes/profiles/hermes-radar/cron/jobs.json"
  if [ ! -f "$jobs_file" ]; then
    return
  fi
  
  local now
  now=$(date +"%Y-%m-%dT%H:%M:%S%z")
  
  python3 scripts/mark_cron_job.py "$jobs_file" "$job_id" "$now" "$status" "$error"
}

case "${1:-all}" in
  all)
    echo "=== cronstarted: $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" >> data/cron.log
    bash scripts/x-monitor.sh >> data/cron.log 2>&1 && mark_job_run "c2622dd19333" "ok" || mark_job_run "c2622dd19333" "error"
    bash scripts/hermes-updates.sh >> data/cron.log 2>&1 && mark_job_run "6d7ccc4e9665" "ok" || mark_job_run "6d7ccc4e9665" "error"
    bash scripts/youtube-auto-update.sh >> data/cron.log 2>&1 && mark_job_run "7c875dfe4ef0" "ok" || mark_job_run "7c875dfe4ef0" "error"
    bash scripts/skills-discovery.sh >> data/cron.log 2>&1 && mark_job_run "3cf83981ce35" "ok" || mark_job_run "3cf83981ce35" "error"
    echo "=== cron done: $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" >> data/cron.log
    ;;
  x)
    bash scripts/x-monitor.sh >> data/cron.log 2>&1 && mark_job_run "c2622dd19333" "ok" || mark_job_run "c2622dd19333" "error"
    ;;
  updates)
    bash scripts/hermes-updates.sh >> data/cron.log 2>&1 && mark_job_run "6d7ccc4e9665" "ok" || mark_job_run "6d7ccc4e9665" "error"
    ;;
  youtube)
    bash scripts/youtube-auto-update.sh >> data/cron.log 2>&1 && mark_job_run "7c875dfe4ef0" "ok" || mark_job_run "7c875dfe4ef0" "error"
    ;;
  skills)
    bash scripts/skills-discovery.sh >> data/cron.log 2>&1 && mark_job_run "3cf83981ce35" "ok" || mark_job_run "3cf83981ce35" "error"
    ;;
  deploy)
    # Usa --skip-audit para entorno cron (no interactivo)
    bash scripts/deploy.sh "chore: nightly site deploy $(date +%Y-%m-%d)" --skip-audit >> data/cron.log 2>&1 && mark_job_run "site-update" "ok" || mark_job_run "site-update" "error"
    ;;
  *)
    echo "Uso: $0 [all|x|updates|youtube|skills|deploy]"
    exit 1
    ;;
esac
