# 📡 Hermes Radar

Base de conocimiento y novedades de Hermes Agent en español.

## Secciones

- **Inicio** — Hero con stats y acceso rápido a todas las secciones
- **Handbook** — Qué es Hermes, cómo funciona, instalación, configuración y loop de aprendizaje
- **Skills** — 85+ skills organizadas por categoría
- **Videos** — Tutoriales y demos curados
- **Comunidad** — Plugins, skins/themes del CLI, workspaces y GUIs
- **Novedades** — Changelog detallado desde v0.5.0 hasta v0.10.0
- **Trucos** — Configuraciones avanzadas y tips

## Stack

- HTML estático + CSS + JS vanilla (sin build step)
- Diseño shadcn-inspired (dark/light theme con toggle)
- SPA con hash routing
- Tipografía Inter (Google Fonts)

## Automatización (Cron Jobs)

| Cron | Frecuencia | Función |
|------|-----------|---------|
| `hermes-radar-x-monitor` | Cada 6h | Busca tweets de @Teknium y la comunidad Hermes en X |
| `hermes-radar-updates` | Cada 12h | Detecta nuevas versiones de Hermes Agent |
| `hermes-radar-skills` | Diario 8:00 | Descubre nuevos skills, plugins y themes con 5+ estrellas |
| `hermes-radar-site-update` | Diario 8:30 | Actualiza videos, trucos y pushea cambios |

## Desarrollo local

```bash
cd hermes-radar-es
python3 -m http.server 8765
# Abrir http://localhost:8765
```

## Deploy en GitHub Pages

Pushear a `main` = auto-deploy a `https://anibalardid.github.io/hermes-radar-es/`

## Estructura

```
hermes-radar-es/
├── index.html       — HTML principal
├── styles.css        — Tema dark/light
├── app.js            — SPA router + contenido en español
├── data/             — Datos crudos de crons (no commiteados)
├── scripts/          — Scripts de recolección
├── docs/             — Documentación
└── README.md
```

## Actualizar contenido

Todo el contenido está en `app.js` como constantes JS:

- **Novedades**: `VERSIONS_DATA`
- **Skills**: `SKILLS_DATA`
- **Videos**: `VIDEOS_DATA`
- **Comunidad**: `COMUNIDAD_DATA` (plugins, skins, proyectos, integraciones)
- **Trucos**: `TRUCOS_DATA`

Los cron jobs actualizan automáticamente estas constantes.