# Hermes Radar Architecture

## Website
- Static SPA: index.html + styles.css + app.js
- Dark/light shadcn-inspired theme
- Deployed on GitHub Pages (push to main)

## Content Constants (app.js)

| Constant | Line | Content |
|----------|------|---------|
| SKILLS_DATA | ~378 | 85+ skills by category |
| VIDEOS_DATA | ~446 | YouTube tutorials |
| COMUNIDAD_DATA | ~459 | Plugins, skins, projects, integrations |
| VERSIONS_DATA | ~493 | Version history (v0.5.0 — v0.10.0) |
| TRUCOS_DATA | ~584 | Tips and tricks |

## Cron Jobs

| Job | Schedule | Action |
|-----|----------|--------|
| hermes-radar-x-monitor | Every 6h | @Teknium tweets, Hermes community, trending |
| hermes-radar-updates | Every 12h | GitHub releases, tags, npm registry |
| hermes-radar-skills | Daily 8:00 | GitHub search for community repos (5+ stars) |
| hermes-radar-site-update | Daily 8:30 | YouTube, docs, issues — commits & pushes |

## Security
- All credentials in environment variables only (profile .env)
- Never hardcoded in scripts, code, or git-tracked files
- .gitignore excludes data/*.json/txt (raw data with potential sensitive content)