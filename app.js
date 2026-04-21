// ─── VERSION (keep in sync with version.js) ───
const HR_VER = '26.04';

// ═══════════════════════════════════════════════════════════════
// HERMES RADAR — SPA Router + Content
// Dark/Light theme · Hash routing · All content in Spanish
// ═══════════════════════════════════════════════════════════════

const SKILLS_BASE = 'https://github.com/NousResearch/hermes-agent/blob/main/skills';
const OPT_SKILLS_BASE = 'https://github.com/NousResearch/hermes-agent/blob/main/optional-skills';

// ─── Theme ───
function initTheme() {
  const saved = localStorage.getItem('hr-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('hr-theme', next);
}

// ─── Router ───
const routes = {
  '/': renderHome,
  '/handbook': renderHandbook,
  '/skills': renderSkills,
  '/herramientas': renderHerramientas,
  '/videos': renderVideos,
  '/comunidad': renderComunidad,
  '/novedades': renderNovedades,
  '/trucos': renderTrucos,
};

function navigate(hash) {
  const path = hash.replace('#', '') || '/';
  const main = document.getElementById('main-content');
  document.querySelectorAll('.nav-link, .mobile-nav .nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-section') === getSection(path));
  });
  document.getElementById('mobile-nav').classList.remove('open');
  const renderer = routes[path] || renderHome;
  main.innerHTML = `<div class="fade-in">${renderer()}</div>`;
  window.scrollTo(0, 0);
}

function getSection(path) {
  if (path === '/') return 'home';
  return path.replace('/', '');
}

// ─── Helpers ───
function ytUrl(id) {
  return `https://www.youtube.com/watch?v=${id}&hl=es&cc_lang_pref=es&cc_load_policy=1`;
}
function ytThumb(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
function ghSkill(cat, name) {
  return `${SKILLS_BASE}/${cat}/${name}/SKILL.md`;
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  // Sync version badge
  const badge = document.getElementById('version-badge');
  if (badge) badge.textContent = 'v' + (typeof HR_VERSION !== 'undefined' ? HR_VERSION : HR_VER);

  initTheme();
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('nav-toggle').addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.toggle('open');
  });
  window.addEventListener('hashchange', () => navigate(location.hash));
  navigate(location.hash || '#/');
});

// ─── Disclaimer Modal ───
function initDisclaimer() {
  const overlay = document.getElementById('disclaimer-modal');
  const btn = document.getElementById('disclaimer-btn');
  const closeBtn = document.getElementById('disclaimer-close');
  const acceptBtn = document.getElementById('disclaimer-accept');

  function open() { overlay.classList.add('open'); }
  function close() { overlay.classList.remove('open'); }

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  acceptBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// Re-init modal after SPA navigation
const origNavigate = navigate;
navigate = function(hash) {
  origNavigate(hash);
  initDisclaimer();
};

// ═══════════════════════════════════════════════════════════════
// CONTENT DATA
// ═══════════════════════════════════════════════════════════════

const HANDBOOK = [
  {
    id: 'que',
    title: '¿Qué es Hermes Agent?',
    content: `<p><strong>Hermes Agent</strong> es un agente de IA de código abierto creado por <a href="https://nousresearch.com" target="_blank" rel="noopener">Nous Research</a> que se ejecuta en tu propia máquina, recuerda lo que aprende entre sesiones, y escribe sus propias skills reutilizables mientras trabaja.</p>
<p>Se comunica contigo a través de CLI, Telegram, Discord, WhatsApp, Email y más de 16 plataformas. Con más de 108K estrellas en GitHub, es el agente de código abierto de más rápido crecimiento de 2026.</p>
<blockquote><strong>La idea central:</strong> La mayoría de las herramientas de IA no tienen estado — abres un chat, preguntas, cierras la pestaña, y la próxima sesión empieza desde cero. Hermes invierte eso. Tiene memoria persistente, genera skills (procedimientos reutilizables), y te alcanza por el canal que prefieras.</blockquote>`
  },
  {
    id: 'como',
    title: '¿Cómo funciona?',
    content: `<p>Hermes opera en 5 capas alrededor del modelo de lenguaje, lo que Nous Research llama <strong>Harness Engineering</strong>:</p>
<ul>
  <li><strong>Instrucciones</strong> — Prompts del sistema optimizados que guían el comportamiento del agente</li>
  <li><strong>Restricciones</strong> — Límites de seguridad que evitan acciones peligrosas</li>
  <li><strong>Feedback</strong> — Mecanismos de aprobación, revisión y corrección (approval buttons, review cycles)</li>
  <li><strong>Memoria</strong> — Persistencia cross-session que acumula conocimiento; memoria que se inyecta automáticamente en futuras conversaciones</li>
  <li><strong>Orquestación</strong> — Delegación de tareas a sub-agentes, ejecución en paralelo, pipelines de procesamiento</li>
</ul>
<p>La filosofía es clara: el verdadero desbloqueo no es un modelo más inteligente, sino un wrapper más inteligente alrededor del modelo. Puedes intercambiar el modelo manteniendo todo lo demás — frontier hoy, local mañana, algo distinto el año que viene.</p>
<h4>Arquitectura de herramientas</h4>
<p>Hermes tiene <strong>47+ herramientas integradas</strong> organizadas en categorías:</p>
<ul>
  <li><strong>Web:</strong> <code>web_search</code>, <code>web_extract</code> — búsqueda y extracción</li>
  <li><strong>Terminal & Archivos:</strong> <code>terminal</code>, <code>process</code>, <code>read_file</code>, <code>patch</code>, <code>write_file</code></li>
  <li><strong>Browser:</strong> <code>browser_navigate</code>, <code>browser_snapshot</code>, <code>browser_vision</code>, <code>browser_click</code></li>
  <li><strong>Media:</strong> <code>vision_analyze</code>, <code>image_generate</code>, <code>text_to_speech</code></li>
  <li><strong>Orquestación:</strong> <code>todo</code>, <code>clarify</code>, <code>execute_code</code>, <code>delegate_task</code></li>
  <li><strong>Memoria:</strong> <code>memory</code>, <code>session_search</code>, <code>skill_manage</code></li>
  <li><strong>Automatización:</strong> <code>cronjob</code>, <code>send_message</code></li>
</ul>`
  },
  {
    id: 'quien',
    title: '¿Para quién es Hermes?',
    content: `<p>Hermes atrae tres perfiles principales. Identificá cuál sos y el resto tiene más sentido:</p>
<div class="table-wrapper"><table>
  <thead><tr><th>Si querés...</th><th>Empezá con...</th><th>Dejá para después</th></tr></thead>
  <tbody>
    <tr><td>Escribir mejor código desde la terminal</td><td>CLI + skills</td><td>Telegram, cron</td></tr>
    <tr><td>Automatizar tareas repetitivas (resúmenes, monitoreo, informes)</td><td>Cron + gateways de mensajería + memoria</td><td>Ejecución de código, multi-agente</td></tr>
    <tr><td>Tener un asistente siempre disponible desde tu teléfono</td><td>Gateway Telegram + voz</td><td>CLI local, multi-agente</td></tr>
  </tbody>
</table></div>
<h4>El CLI coder</h4>
<p>Vivís en la terminal. Querés un agente que audite repos, escriba migrations, debuggee errores — sin salir del CLI. Usás las skills de <code>github-pr-workflow</code>, <code>systematic-debugging</code>, <code>test-driven-development</code>.</p>
<h4>El automation operator</h4>
<p>No necesariamente programás. Querés que Hermes resuma noticias, monitoree precios, triagee tu inbox mientras dormís. Lo hosteás en un VPS y lo conectás a Telegram o Discord.</p>
<h4>El Telegram-bot operator</h4>
<p>Querés un agente siempre disponible desde el celular. La integración con Telegram es la killer feature: mensaje de texto, voz, imágenes, ubicación — Hermes los procesa todos.</p>`
  },
  {
    id: 'install',
    title: 'Instalación rápida',
    content: `<p>Instalar Hermes Agent toma menos de 2 minutos:</p>
<pre><code># Instalar con curl (macOS/Linux)
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

# O con pip
pip install hermes-agent

# Primera configuración (asistente interactivo)
hermes setup</code></pre>
<p>El asistente <code>hermes setup</code> te guía para:</p>
<ul>
  <li>Elegir un proveedor de modelo (OpenRouter, OpenAI, Anthropic, etc.)</li>
  <li>Configurar tu API key</li>
  <li>Conectar plataformas de mensajería (Telegram, Discord, etc.)</li>
  <li>Verificar que todo funciona con <code>hermes doctor</code></li>
</ul>
<h4>Verificar la instalación</h4>
<pre><code># Verificar estado
hermes status

# Diagnóstico completo
hermes doctor

# Iniciar una conversación
hermes chat

# Iniciar gateway de mensajería
hermes gateway start</code></pre>`
  },
  {
    id: 'providers',
    title: 'Proveedores de modelo',
    content: `<p>Hermes soporta <strong>20+ proveedores de LLM</strong>. Podés cambiar de modelo en cualquier momento con <code>/model</code> o en <code>config.yaml</code>:</p>
<div class="table-wrapper"><table>
  <thead><tr><th>Proveedor</th><th>Modelos populares</th><th>Destacado</th></tr></thead>
  <tbody>
    <tr><td>OpenRouter</td><td>200+ modelos</td><td>Variantes free/extended/fast, el más versátil</td></tr>
    <tr><td>Nous Portal</td><td>400+ modelos</td><td>Tool Gateway incluido (búsqueda, imágenes, TTS sin API keys extra)</td></tr>
    <tr><td>Anthropic</td><td>Claude Sonnet, Opus</td><td>Fast Mode disponible, excelente razonamiento</td></tr>
    <tr><td>OpenAI</td><td>GPT-5.4, Codex</td><td>Fast Mode disponible, gran ecosistema</td></tr>
    <tr><td>xAI (Grok)</td><td>Grok 3</td><td>Prompt caching nativo</td></tr>
    <tr><td>Google (Gemini)</td><td>Gemini 2.5 Pro/Flash</td><td>Vía Google AI Studio</td></tr>
    <tr><td>Hugging Face</td><td>Varios</td><td>Inferencia vía HF API</td></tr>
    <tr><td>Xiaomi MiMo</td><td>MiMo v2 Pro</td><td>Gratuito en Nous Portal</td></tr>
    <tr><td>Ollama (local)</td><td>Cualquier modelo local</td><td>Privacidad total, sin costos de API</td></tr>
  </tbody>
</table></div>
<h4>Fallback de proveedores</h4>
<p>Configurá una cadena de proveedores para que Hermes cambie automáticamente si el principal falla:</p>
<pre><code># config.yaml
provider_chain:
  - openrouter
  - anthropic
  - openai</code></pre>`
  },
  {
    id: 'platforms',
    title: 'Plataformas de mensajería',
    content: `<p>Hermes soporta <strong>16 plataformas</strong> de mensajería, conectándose a donde estés:</p>
<div class="table-wrapper"><table>
  <thead><tr><th>Plataforma</th><th>Destacado</th></tr></thead>
  <tbody>
    <tr><td>Telegram</td><td>La más popular. Soporta texto, voz, imágenes, ubicación, approval buttons.</td></tr>
    <tr><td>Discord</td><td>Bots en servidores, threads, approval buttons, multi-server.</td></tr>
    <tr><td>Slack</td><td>Multi-workspace OAuth, approval buttons, threads.</td></tr>
    <tr><td>WhatsApp</td><td>Vía WhatsApp Web protocol. Texto, imágenes, documentos.</td></tr>
    <tr><td>Signal</td><td>Privacidad end-to-end via signal-cli.</td></tr>
    <tr><td>Matrix</td><td>Protocolo abierto, federación, Tier 1 support.</td></tr>
    <tr><td>Email (IMAP/SMTP)</td><td>Enviar y recibir emails. Integración con Gmail vía himalaya.</td></tr>
    <tr><td>SMS (Twilio)</td><td>Envío y recepción de SMS/MMS.</td></tr>
    <tr><td>iMessage</td><td>Vía BlueBubbles. Ecosistema Apple completo.</td></tr>
    <tr><td>WeChat / WeCom</td><td>Ecosistema chino completo.callback mode.</td></tr>
    <tr><td>Feishu/Lark</td><td>Plataforma empresarial china.</td></tr>
    <tr><td>DingTalk</td><td>Plataforma de comunicación empresarial.</td></tr>
    <tr><td>Mattermost</td><td>Slack alternativo self-hosted.</td></tr>
    <tr><td>Home Assistant</td><td>Control de dispositivos del hogar.</td></tr>
    <tr><td>Webhooks</td><td>Integración con cualquier servicio HTTP.</td></tr>
    <tr><td>CLI (Terminal)</td><td>Interfaz nativa TUI completa.</td></tr>
  </tbody>
</table></div>`
  },
  {
    id: 'config',
    title: 'Configuración básica',
    content: `<p>Hermes se configura en <code>~/.hermes/config.yaml</code>. Los elementos esenciales:</p>
<pre><code># ~/.hermes/config.yaml
provider: openrouter          # Proveedor de LLM
model: anthropic/claude-sonnet-4  # Modelo a usar

# Plataformas de mensajería
telegram:
  token: "TU_BOT_TOKEN"
  allowed_users: [123456789]

discord:
  token: "TU_BOT_TOKEN"

# Memoria persistente
memory:
  enabled: true
  max_entries: 500

# Skills
skills:
  auto_generate: true        # Generar skills automáticamente
  directory: ~/.hermes/skills

# Perfiles aislados
profiles:
  personal:
    model: anthropic/claude-sonnet-4
  trabajo:
    model: openai/gpt-5.4
    memory:
      directory: ~/.hermes/profiles/trabajo/memory</code></pre>
<h4>Comandos esenciales de gestión</h4>
<div class="table-wrapper"><table>
  <thead><tr><th>Comando</th><th>Qué hace</th></tr></thead>
  <tbody>
    <tr><td><code>hermes setup</code></td><td>Asistente de configuración completo</td></tr>
    <tr><td><code>hermes model</code></td><td>Elegir/cambiar modelo y proveedor</td></tr>
    <tr><td><code>hermes tools</code></td><td>Ver y configurar herramientas habilitadas</td></tr>
    <tr><td><code>hermes gateway start</code></td><td>Iniciar gateway de mensajería</td></tr>
    <tr><td><code>hermes backup</code></td><td>Respaldar configuración completa</td></tr>
    <tr><td><code>hermes import</code></td><td>Restaurar desde backup</td></tr>
    <tr><td><code>hermes update</code></td><td>Actualizar a la última versión</td></tr>
    <tr><td><code>hermes doctor</code></td><td>Diagnosticar problemas</td></tr>
    <tr><td><code>hermes debug share</code></td><td>Compartir reporte de diagnóstico</td></tr>
    <tr><td><code>hermes mcp serve</code></td><td>Modo servidor MCP para editores</td></tr>
    <tr><td><code>hermes plugins enable &lt;name&gt;</code></td><td>Habilitar un plugin</td></tr>
    <tr><td><code>hermes skills install official/&lt;cat&gt;/&lt;name&gt;</code></td><td>Instalar skill opcional</td></tr>
  </tbody>
</table></div>`
  },
  {
    id: 'loop',
    title: 'El loop de aprendizaje',
    content: `<p>La característica distintiva de Hermes es su capacidad de <strong>auto-mejora continua</strong>. Así funciona el ciclo:</p>
<ol>
  <li>Le das una tarea a Hermes</li>
  <li>Hermes ejecuta herramientas y construye la respuesta</li>
  <li>Cada pocas llamadas, se detiene y se pregunta: <em>¿qué acaba de pasar? ¿qué funcionó? ¿qué falló? ¿debería esto convertirse en una skill?</em></li>
  <li>Cuando la respuesta es sí, escribe un archivo markdown en <code>~/.hermes/skills/&lt;nombre&gt;/SKILL.md</code></li>
  <li>En futuras ejecuciones, carga y usa esas skills automáticamente</li>
</ol>
<blockquote>El día 1 Hermes es un asistente genérico. El día 30 es <em>tu</em> asistente, con 30 días de preferencias aprendidas incorporadas.</blockquote>
<h4>Estructura de una skill</h4>
<p>Las skills son archivos markdown con YAML frontmatter — legibles, editables, compartibles:</p>
<pre><code># ~/.hermes/skills/mi-workflow/SKILL.md
---
name: mi-workflow
description: Flujo de trabajo personalizado para deploy
version: 1.0.0
---

# Mi Workflow de Deploy

## Pasos
1. Correr tests con pytest
2. Verificar cobertura > 80%
3. Si pasa, hacer git push origin main
4. Esperar CI verde
5. Hacer tag y push del tag

## Notas
- Siempre verificar CI antes de deploy
- Usar --profile produccion</code></pre>
<h4>Skills vs Memoria</h4>
<p><strong>Memoria</strong> guarda hechos y preferencias (tu nombre, tu estilo de código, configuraciones). <strong>Skills</strong> guardan procedimientos (cómo deployar, cómo revisar un PR, cómo debuggear un error). Se complementan.</p>`
  },
  {
    id: 'primer-workflow',
    title: 'Tu primer workflow',
    content: `<p>Una vez instalado Hermes, probá estos flujos para entender su potencial:</p>
<h4>1. Conversación simple (CLI)</h4>
<pre><code>hermes chat
&gt; Resumí los últimos 5 issues de mi repo en GitHub
&gt; Creá un PR con los cambios del branch feature/auth
&gt; Explicame qué hace esta función en inglés</code></pre>
<h4>2. Tarea programada (Cron)</h4>
<pre><code>hermes chat
&gt; Programá un resumen diario de mis notificaciones de GitHub a las 9am por Telegram</code></pre>
<h4>3. Agentes delegados (Multi-agente)</h4>
<pre><code>hermes chat
&gt; Usando delegate_task, creá 3 sub-agentes:
  1. Uno que investigue el bug #42
  2. Uno que escriba tests para el módulo auth
  3. Uno que revise el PR open #15
&gt; Compilá los resultados y dame un reporte</code></pre>
<h4>4. Monitoreo web</h4>
<pre><code>hermes chat
&gt; Monitoreá la página de releases de mi framework favorito
&gt; y avisame por Telegram cuando salga una nueva versión</code></pre>`
  },
  {
    id: 'faq',
    title: 'FAQ',
    content: `<h4>¿Hermes es gratuito?</h4>
<p>Sí, Hermes es código abierto (licencia MIT) y gratuito. Lo que pagás es el uso del modelo LLM (vía OpenRouter, OpenAI, Anthropic, etc.). También podés usar modelos locales con Ollama sin costo de API.</p>
<h4>¿Puedo usar Hermes sin Internet?</h4>
<p>Parcialmente. Con un modelo local (Ollama), las funciones básicas funcionan offline. La búsqueda web, extracción de contenido y algunas herramientas sí necesitan Internet.</p>
<h4>¿Mis datos están seguros?</h4>
<p>Hermes se ejecuta localmente en tu máquina. Tus archivos, memoria y skills quedan en <code>~/.hermes/</code>. Ningún dato se envía a Nous Research. Los prompts sí se envían al proveedor de LLM que elijas.</p>
<h4>¿Cómo se diferencia de Claude Code / Cursor?</h4>
<p>Claude Code y Cursor son editores con IA integrada. Hermes es un agente generalista que funciona <em>fuera</em> del editor — puede monitorear web, triagear emails, ejecutar cron jobs, y hablar por Telegram. Su sistema de memoria y skills lo hace mejorar con el uso.</p>
<h4>¿Puedo tener múltiples instancias?</h4>
<p>Sí, con <strong>Profiles</strong> (v0.6.0+). Cada profile tiene su propia config, memoria, sesiones y skills. Ideal para separar trabajo personal de profesional.</p>
<h4>¿Cómo migro desde OpenClaw?</h4>
<pre><code>hermes claw migrate</code></pre>
<p>Esto migra datos, memorias, skills y API keys automáticamente.</p>`
  },
  {
    id: 'links',
    title: 'Links de documentación',
    items: [
      { name: 'Documentación oficial', url: 'https://hermes-agent.nousresearch.com/docs', desc: 'Docs completos de Hermes Agent' },
      { name: 'Repositorio GitHub', url: 'https://github.com/NousResearch/hermes-agent', desc: 'Código fuente, issues, releases' },
      { name: 'Discord', url: 'https://discord.gg/NousResearch', desc: 'Comunidad en Discord' },
      { name: 'agentskills.io', url: 'https://agentskills.io', desc: 'Estándar abierto para skills de agentes' },
      { name: 'Nous Research', url: 'https://nousresearch.com', desc: 'Organización detrás de Hermes' },
    ]
  }
];

const SKILLS_DATA = [
  { cat: 'software-development', label: 'Desarrollo', icon: '💻', skills: [
    { name: 'plan', desc: 'Modo planificación: inspecciona contexto y crea planes markdown detallados', badge: 'bundled', gh: 'software-development' },
    { name: 'github-pr-workflow', desc: 'Ciclo completo de PRs: crear branches, commitear, abrir PRs, monitorear CI', badge: 'bundled', gh: 'github' },
    { name: 'github-issues', desc: 'Crear, gestionar y cerrar issues en GitHub', badge: 'bundled', gh: 'github' },
    { name: 'github-repo-management', desc: 'Clonar, fork, configurar repos, gestionar secrets y workflows', badge: 'bundled', gh: 'github' },
    { name: 'github-code-review', desc: 'Review de código: analizar diffs, dejar comentarios inline, aprobar/rechazar PRs', badge: 'bundled', gh: 'github' },
    { name: 'test-driven-development', desc: 'Enforzar ciclo RED-GREEN-REFACTOR en desarrollo', badge: 'bundled', gh: 'software-development' },
    { name: 'systematic-debugging', desc: 'Investigación de causa raíz en 4 fases', badge: 'bundled', gh: 'software-development' },
    { name: 'writing-plans', desc: 'Crear planes de implementación completos con subtareas', badge: 'bundled', gh: 'software-development' },
    { name: 'requesting-code-review', desc: 'Pipeline de verificación pre-commit: seguridad, linting, tests', badge: 'bundled', gh: 'software-development' },
  ]},
  { cat: 'autonomous-ai-agents', label: 'Agentes IA', icon: '🤖', skills: [
    { name: 'claude-code', desc: 'Delegar tareas de código a Claude Code', badge: 'bundled', gh: 'autonomous-ai-agents' },
    { name: 'codex', desc: 'Delegar tareas de código a OpenAI Codex CLI', badge: 'bundled', gh: 'autonomous-ai-agents' },
    { name: 'opencode', desc: 'Delegar tareas de código a OpenCode CLI', badge: 'bundled', gh: 'autonomous-ai-agents' },
    { name: 'hermes-agent', desc: 'Guía completa de uso y extensión de Hermes Agent', badge: 'bundled', gh: 'autonomous-ai-agents' },
    { name: 'hermes-multiagent', desc: 'Orquestación multi-agente con 17 agentes especializados', badge: 'bundled', gh: 'autonomous-ai-agents' },
    { name: 'subagent-driven-development', desc: 'Delegar tareas a sub-agentes para implementación paralela', badge: 'bundled', gh: 'software-development' },
  ]},
  { cat: 'research', label: 'Investigación', icon: '🔬', skills: [
    { name: 'arxiv', desc: 'Buscar y recuperar papers académicos de arXiv', badge: 'bundled', gh: 'research' },
    { name: 'blogwatcher', desc: 'Monitorear blogs y feeds RSS por actualizaciones', badge: 'bundled', gh: 'feeds' },
    { name: 'polymarket', desc: 'Consultar datos de mercados de predicción Polymarket', badge: 'bundled', gh: 'research' },
  ]},
  { cat: 'productivity', label: 'Productividad', icon: '📝', skills: [
    { name: 'google-workspace', desc: 'Gmail, Calendar, Drive, Sheets, Docs integrados', badge: 'bundled', gh: 'productivity' },
    { name: 'notion', desc: 'Gestión de páginas, bases de datos y bloques en Notion', badge: 'bundled', gh: 'productivity' },
    { name: 'linear', desc: 'Gestión de issues y proyectos via Linear API', badge: 'bundled', gh: 'productivity' },
    { name: 'powerpoint', desc: 'Creación y edición de presentaciones .pptx', badge: 'bundled', gh: 'productivity' },
    { name: 'ocr-and-documents', desc: 'Extracción de texto de PDFs y documentos escaneados', badge: 'bundled', gh: 'productivity' },
    { name: 'nano-pdf', desc: 'Editar PDFs con instrucciones en lenguaje natural', badge: 'bundled', gh: 'productivity' },
    { name: 'obsidian', desc: 'Leer, buscar y crear notas en el vault de Obsidian', badge: 'bundled', gh: 'note-taking' },
  ]},
  { cat: 'creative', label: 'Creativo', icon: '🎨', skills: [
    { name: 'excalidraw', desc: 'Diagramas estilo hand-drawn en formato Excalidraw', badge: 'bundled', gh: 'creative' },
    { name: 'p5js', desc: 'Arte generativo e interactivo con p5.js', badge: 'bundled', gh: 'creative' },
    { name: 'manim-video', desc: 'Animaciones matemáticas tipo 3Blue1Brown', badge: 'bundled', gh: 'creative' },
    { name: 'ascii-art', desc: 'Generación de ASCII art con pyfiglet, cowsay', badge: 'bundled', gh: 'creative' },
    { name: 'songwriting-and-ai-music', desc: 'Composición de canciones y generación musical con IA', badge: 'bundled', gh: 'creative' },
  ]},
  { cat: 'mlops', label: 'ML / IA', icon: '🧠', skills: [
    { name: 'axolotl', desc: 'Fine-tuning de LLMs con Axolotl (LoRA/QLoRA, DPO/KTO/ORPO/GRPO)', badge: 'bundled', gh: 'mlops/training' },
    { name: 'llama-cpp', desc: 'Inferencia LLM con llama.cpp (CPU, Apple Silicon, GPU)', badge: 'bundled', gh: 'mlops/inference' },
    { name: 'serving-llms-vllm', desc: 'Serving de LLMs con vLLM (PagedAttention, continuous batching)', badge: 'bundled', gh: 'mlops/inference' },
    { name: 'evaluating-llms-harness', desc: 'Evaluación de LLMs en 60+ benchmarks académicos', badge: 'bundled', gh: 'mlops/evaluation' },
    { name: 'fine-tuning-with-trl', desc: 'Fine-tuning con RL usando TRL (SFT, DPO, GRPO)', badge: 'bundled', gh: 'mlops/training' },
  ]},
  { cat: 'integrations', label: 'Integraciones', icon: '🔌', skills: [
    { name: 'native-mcp', desc: 'Cliente MCP integrado para conectar servidores externos', badge: 'bundled', gh: 'mcp' },
    { name: 'openhue', desc: 'Control de luces Philips Hue, habitaciones y escenas', badge: 'bundled', gh: 'smart-home' },
    { name: 'himalaya', desc: 'Gestión de emails vía IMAP/SMTP', badge: 'bundled', gh: 'email' },
    { name: 'imessage', desc: 'Enviar y recibir iMessages/SMS vía CLI en macOS', badge: 'bundled', gh: 'apple' },
    { name: 'dogfood', desc: 'QA exploratorio sistemático de aplicaciones web', badge: 'bundled', gh: 'dogfood' },
  ]},
  { cat: 'optional', label: 'Skills opcionales', icon: '📦', skills: [
    { name: 'blackbox', desc: 'Delegar tareas a Blackbox AI CLI (multi-modelo con juez)', badge: 'optional', gh: 'autonomous-ai-agents' },
    { name: 'honcho', desc: 'Memoria cross-session con Honcho (modelado dialéctico)', badge: 'optional', gh: 'autonomous-ai-agents' },
    { name: 'solana', desc: 'Consultas blockchain Solana con precios USD', badge: 'optional', gh: 'blockchain' },
    { name: 'base', desc: 'Consultas blockchain Base (Ethereum L2) con precios USD', badge: 'optional', gh: 'blockchain' },
    { name: 'docker-management', desc: 'Gestión de contenedores, imágenes, volumes, Compose', badge: 'optional', gh: 'devops' },
    { name: '1password', desc: 'Integración con 1Password CLI para gestión de secretos', badge: 'optional', gh: 'security' },
    { name: 'sherlock', desc: 'Búsqueda OSINT de usuarios en 400+ redes sociales', badge: 'optional', gh: 'red-teaming' },
    { name: 'blender-mcp', desc: 'Control de Blender desde Hermes (3D, materiales, animaciones)', badge: 'optional', gh: 'mcp' },
    { name: 'fastmcp', desc: 'Crear, testear y desplegar servidores MCP con FastMCP', badge: 'optional', gh: 'mcp' },
  ]},
];

const VIDEOS_DATA = [
  { id: '3jNp14bJpgs', title: 'Hermes Agent Setup: el killer de OpenClaw está aquí', channel: 'Wes Roth', views: '56K', desc: 'Setup completo en VPS Hostinger, Telegram, CLI, gateway. El video de referencia más popular.' },
  { id: 'tP6yf22OJdI', title: '¿Acabo de matar el Agente Hermes a OpenClaw? (guía completa)', channel: 'Alex Finn', views: '108K', desc: 'Comparación detallada Hermes vs OpenClaw con demo. Amplia cobertura de funcionalidades.' },
  { id: 'uycgV-eulGE', title: 'Tutorial completo de Hermes Agent', channel: 'Metics Media', views: '21K', desc: 'Paso a paso: instalación en VPS con Hostinger, configuración de Telegram y OpenRouter, demo en vivo.' },
  { id: 'tm4h8dG-xlI', title: 'Cómo empezar con tu Agente Hermes (guía para principiantes)', channel: 'Theo Vigneres', views: '6.6K', desc: 'Guía desde cero: VPS, SSH, terminal, proveedores LLM, API keys, gateway Telegram.' },
  { id: 'k5HM4HUGt00', title: 'El setup que todos están instalando', channel: 'Sharbel A.', views: '23K', desc: 'Instalación rápida, demo en vivo de auto-mejora, veredicto honesto vs OpenClaw.' },
  { id: 'P2LIFtrRr2U', title: 'Hermes Agent: ¡Nueva alternativa GRATUITA a OpenClaw!', channel: 'Julian Goldie SEO', views: '9.4K', desc: 'Instalación, configuración de API keys, demo de coding, comparación con OpenClaw.' },
  { id: '6M2tItdARew', title: 'El Agente de IA que Nunca Olvida: Conoce Hermes Agent', channel: 'Siggi', views: '—', desc: 'Enfoque en el sistema de memoria que persiste entre sesiones y auto-mejora.' },
  { id: 'UVlK4lsvR4E', title: 'Cómo instalar Hermes Agent en Windows (Setup + Skills)', channel: 'AI Automation', views: '—', desc: 'Setup completo en Windows vía WSL2, con configuración de skills personalizados.' },
  { id: '8tpuky8HpXw', title: '¿Mejor que OpenClaw? Probando Hermes con Qwen 3', channel: 'Onchain AI Garage', views: '16K', desc: 'Prueba de rendimiento con el modelo Qwen 3.' },
  { id: '3Pr9BPjxICE', title: 'Cómo configurar el agente Hermes con OpenRouter', channel: "Jake's Tech", views: '11K', desc: 'Guía detallada de configuración con OpenRouter como proveedor.' },
];

const COMUNIDAD_DATA = {
  plugins: [
    { name: 'disk-cleanup', desc: 'Limpieza automática de archivos efímeros (tests, temporales, logs). Reglas configurables por categoría.', badge: 'built-in', url: 'https://github.com/NousResearch/hermes-agent/tree/main/hermes_cli/plugins' },
    { name: 'memory (Honcho)', desc: 'Proveedor de memoria cross-session con modelado dialéctico de usuarios.', badge: 'built-in', url: 'https://github.com/NousResearch/hermes-agent/tree/main/hermes_cli/plugins' },
    { name: 'context_engine', desc: 'Motor de contexto intercambiable. Filtrado, resumen o inyección de contexto por dominio.', badge: 'built-in', url: 'https://github.com/NousResearch/hermes-agent/tree/main/hermes_cli/plugins' },
    { name: 'example-dashboard', desc: 'Plugin de ejemplo que demuestra cómo crear dashboards web.', badge: 'built-in', url: 'https://github.com/NousResearch/hermes-agent/tree/main/hermes_cli/plugins' },
  ],
  skins: [
    { name: 'default', desc: 'Classic Hermes — dorado y kawaii', visual: 'Bordes dorados, texto cornsilk, caras kawaii', url: 'https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/skin_engine.py' },
    { name: 'ares', desc: 'Tema dios de la guerra — carmesí y bronce', visual: 'Bordes carmesí, acentos bronce, verbos agresivos', url: 'https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/skin_engine.py' },
    { name: 'mono', desc: 'Monocromo — escala de grises limpia', visual: 'Todo en grises, ideal para grabaciones', url: 'https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/skin_engine.py' },
    { name: 'slate', desc: 'Azul frío — enfocado en desarrolladores', visual: 'Bordes azul royal, calmo y profesional', url: 'https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/skin_engine.py' },
    { name: 'daylight', desc: 'Tema claro para terminales claras', visual: 'Fondo claro, texto oscuro, acentos suaves', url: 'https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/skin_engine.py' },
  ],
  projects: [
    { name: 'Hermes WebUI', author: 'nesquena', stars: '3.1K', desc: 'La mejor forma de usar Hermes Agent desde la web o tu teléfono.', url: 'https://github.com/nesquena/hermes-webui' },
    { name: 'Hermes Workspace', author: 'outsourc-e', stars: '1.9K', desc: 'Workspace web nativo — chat, terminal, navegador de memoria, gestor de skills, panel inspector.', url: 'https://github.com/outsourc-e/hermes-workspace' },
    { name: 'Hermes Desktop (dodo)', author: 'dodo-reach', stars: '511', desc: 'Workspace nativo para Mac — SSH real, terminal real, datos de sesión reales.', url: 'https://github.com/dodo-reach/hermes-desktop' },
    { name: 'Hermes CyberUI', author: 'anibalardid', stars: '4', desc: 'Interfaz web cyberpunk para Hermes Agent. FastAPI + React, 14 páginas, tema oscuro futurista.', url: 'https://github.com/anibalardid/hermes-cyberui' },
    { name: 'Hermes Control Interface', author: 'xaspx', stars: '445', desc: 'Dashboard self-hosted — terminal, explorador de archivos, cron, métricas, panel de estado.', url: 'https://github.com/xaspx/hermes-control-interface' },
    { name: 'Hermes Telegram Mini App', author: 'clawvader-tech', stars: '205', desc: 'React SPA dashboard para Telegram Mini App v2.0 — 10 páginas, mobile-first.', url: 'https://github.com/clawvader-tech/hermes-telegram-miniapp' },
    { name: 'Pan UI', author: 'Euraika-Labs', stars: '27', desc: 'Workspace self-hosted con chat, skills, extensiones, memoria, perfiles.', url: 'https://github.com/Euraika-Labs/pan-ui' },
    { name: 'Hermes Desktop (fathah)', author: 'fathah', stars: '331', desc: 'Desktop companion para instalar, configurar y chatear con Hermes Agent.', url: 'https://github.com/fathah/hermes-desktop' },
  ],
  integraciones: [
    { name: 'agentskills.io', desc: 'Estándar abierto para skills de agentes. Compatible con Hermes, Claude Code, Cursor y más.', url: 'https://agentskills.io' },
    { name: 'Open WebUI', desc: 'Integración via API server con streaming para interfaz web.', url: 'https://github.com/open-webui/open-webui' },
    { name: 'VS Code / Zed / JetBrains', desc: 'ACP: registro de servidores MCP desde editores.', url: 'https://hermes-agent.nousresearch.com/docs/mcp' },
    { name: '1Panel', desc: 'Panel de control VPS con soporte nativo para desplegar agentes IA.', url: 'https://github.com/1Panel-dev/1Panel' },
    { name: 'Docker (oficial)', desc: 'Imagen multi-arch (amd64 + arm64), usuario no-root.', url: 'https://hub.docker.com/r/nousresearch/hermes-agent' },
    { name: 'Nix', desc: 'Flake completo, módulo NixOS con contenedor persistente.', url: 'https://github.com/NousResearch/hermes-agent/tree/main/nix' },
  ]
};

const VERSIONS_DATA = [
  {
    version: 'v0.10.0',
    tag: 'v2026.4.16',
    date: '16 abril 2026',
    name: 'The Tool Gateway Release',
    current: true,
    highlights: [
      'Nous Tool Gateway: suscriptores de Nous Portal pueden usar búsqueda web (Firecrawl), generación de imágenes (FAL/FLUX 2 Pro), texto-a-voz (OpenAI TTS) y automatización de navegador sin claves API adicionales',
      'Configuración <code>use_gateway</code> por herramienta',
      'El runtime prefiere el gateway cuando existen claves API directas',
      'Reemplaza <code>HERMES_ENABLE_NOUS_MANAGED_TOOLS</code> con detección basada en suscripción',
      '180+ commits con correcciones en core, gateway, CLI y sistema de herramientas',
    ]
  },
  {
    version: 'v0.9.0',
    tag: 'v2026.4.13',
    date: '13 abril 2026',
    name: 'The Everywhere Release',
    highlights: [
      'Local Web Dashboard — nueva interfaz web para gestionar Hermes',
      'Fast Mode (<code>/fast</code>) para procesamiento prioritario en OpenAI y Anthropic',
      'iMessage via BlueBubbles — integración completa con ecosistema Apple',
      'WeChat y WeCom Callback Mode — cobertura del ecosistema chino',
      'Termux/Android — ejecutar Hermes nativamente en Android',
      '16 plataformas de mensajería soportadas',
      '487 commits, 269 PRs mergeados, 167 issues resueltas, 24 contribuidores',
    ]
  },
  {
    version: 'v0.8.0',
    tag: 'v2026.4.8',
    date: '8 abril 2026',
    name: 'The Intelligence Release',
    highlights: [
      'Background Process Auto-Notifications (<code>notify_on_complete</code>)',
      'Xiaomi MiMo v2 Pro gratuito en Nous Portal',
      'Live Model Switching (<code>/model</code>) en todas las plataformas',
      'Self-Optimized GPT/Codex Tool-Use Guidance',
      'Google AI Studio (Gemini) como proveedor nativo',
      'Approval Buttons en Slack y Telegram',
      'MCP OAuth 2.1 PKCE + escaneo de malware OSV',
      '209 PRs mergeados, 82 issues resueltas',
    ]
  },
  {
    version: 'v0.7.0',
    tag: 'v2026.4.3',
    date: '3 abril 2026',
    name: 'The Resilience Release',
    highlights: [
      'Pluggable Memory Provider Interface — memoria como sistema de plugins extensible',
      'Same-Provider Credential Pools — rotación automática de claves API',
      'Camofox Anti-Detection Browser Backend — navegación stealth',
      'Inline Diff Previews — diffs visuales en operaciones de archivos',
      'Secret Exfiltration Blocking — bloqueo de exfiltración de secretos',
      '168 PRs, 46 issues resueltas',
    ]
  },
  {
    version: 'v0.6.0',
    tag: 'v2026.3.30',
    date: '30 marzo 2026',
    name: 'The Multi-Instance Release',
    highlights: [
      'Profiles: instancias múltiples aisladas con config, memoria y skills separados',
      'MCP Server Mode (<code>hermes mcp serve</code>) para exponer conversaciones a clientes MCP',
      'Docker Container oficial',
      'Ordered Fallback Provider Chain — failover automático entre proveedores',
      'Feishu/Lark y WeCom Platform Support',
      '95 PRs, 16 issues resueltas',
    ]
  },
  {
    version: 'v0.5.0',
    tag: 'v2026.3.28',
    date: '28 marzo 2026',
    name: 'The Hardening Release',
    highlights: [
      'Nous Portal ahora soporta 400+ modelos',
      'Hugging Face como proveedor de inferencia de primera clase',
      'Telegram Private Chat Topics — conversaciones basadas en proyectos',
      'Native Modal SDK backend (reemplazo de swe-rex)',
      'Plugin lifecycle hooks (<code>pre_llm_call</code>, <code>post_llm_call</code>, etc.)',
      'Nix flake — build reproducible, módulo NixOS',
      '50+ correcciones de seguridad y confiabilidad',
    ]
  },
];

// ─── Herramientas (separadas de Skills) ───
const HERRAMIENTAS_DATA = [
  {
    cat: 'Herramientas integradas',
    desc: 'Hermes incluye 47+ herramientas nativas que el modelo puede invocar directamente. No requieren instalación ni skills adicionales.',
    icon: '🔧',
    tools: [
      { name: 'terminal', desc: 'Ejecutar comandos de shell', cat: 'Terminal & Archivos' },
      { name: 'process', desc: 'Gestionar procesos en background', cat: 'Terminal & Archivos' },
      { name: 'read_file', desc: 'Leer archivos con paginación', cat: 'Terminal & Archivos' },
      { name: 'write_file', desc: 'Escribir/reemplazar archivos completos', cat: 'Terminal & Archivos' },
      { name: 'patch', desc: 'Ediciones puntuales con find-and-replace', cat: 'Terminal & Archivos' },
      { name: 'search_files', desc: 'Buscar contenido o nombres de archivos (ripgrep)', cat: 'Terminal & Archivos' },
      { name: 'browser_navigate', desc: 'Navegar a URLs y obtener snapshots', cat: 'Browser' },
      { name: 'browser_click', desc: 'Clickear elementos en páginas web', cat: 'Browser' },
      { name: 'browser_type', desc: 'Escribir texto en campos input', cat: 'Browser' },
      { name: 'browser_vision', desc: 'Screenshot + análisis visual con IA', cat: 'Browser' },
      { name: 'browser_snapshot', desc: 'Snapshot del accessibility tree de la página', cat: 'Browser' },
      { name: 'web_search', desc: 'Búsqueda web general', cat: 'Web' },
      { name: 'web_extract', desc: 'Extraer contenido de URLs', cat: 'Web' },
      { name: 'vision_analyze', desc: 'Analizar imágenes con IA vision', cat: 'Media' },
      { name: 'image_gen', desc: 'Generar imágenes con IA', cat: 'Media' },
      { name: 'text_to_speech', desc: 'Convertir texto a voz', cat: 'Media' },
      { name: 'execute_code', desc: 'Ejecutar Python con acceso a todas las tools', cat: 'Orquestación' },
      { name: 'delegate_task', desc: 'Delegar a sub-agentes en paralelo', cat: 'Orquestación' },
      { name: 'todo', desc: 'Gestionar lista de tareas de la sesión', cat: 'Orquestación' },
      { name: 'clarify', desc: 'Preguntar al usuario cuando hay ambigüedad', cat: 'Orquestación' },
      { name: 'memory', desc: 'Memoria persistente entre sesiones', cat: 'Memoria' },
      { name: 'session_search', desc: 'Buscar en conversaciones pasadas', cat: 'Memoria' },
      { name: 'skill_manage', desc: 'Crear, editar, eliminar skills', cat: 'Memoria' },
      { name: 'cronjob', desc: 'Programar y gestionar tareas recurrentes', cat: 'Automatización' },
      { name: 'send_message', desc: 'Enviar mensajes a plataformas conectadas', cat: 'Automatización' },
    ]
  },
  {
    cat: 'Herramientas y plataformas externas',
    desc: 'Proyectos y servicios que se integran con Hermes Agent, ampliando sus capacidades más allá de las tools nativas.',
    icon: '🔌',
    tools: [
      { name: 'Paperclip', desc: 'Plataforma SaaS para correr Hermes como empleado gestionado en una company. Adapter oficial con soporte para 8 proveedores de inferencia, skills parsing, y más.', cat: 'Plataformas', url: 'https://github.com/NousResearch/hermes-paperclip-adapter', stars: '907', lang: 'TypeScript' },
      { name: 'OpenShell', desc: 'Runtime seguro y privado para agentes IA autónomos. Fork de NVIDIA OpenShell mantenido por Nous Research.', cat: 'Runtime', url: 'https://github.com/NousResearch/openShell', stars: '570', lang: 'Rust' },
      { name: 'Hermes Self-Evolution', desc: 'Mejora evolutiva automática para Hermes — optimiza skills, prompts y código usando DSPy + GEPA.', cat: 'Evolución', url: 'https://github.com/NousResearch/hermes-agent-self-evolution', stars: '2k', lang: 'Python' },
    ]
  }
];

const TRUCOS_DATA = [
  // ── Configuración ──
  { cat: 'Configuración', title: 'Cambia de modelo al vuelo',
    desc: 'Usa <code>/model</code> en cualquier conversación para cambiar de modelo sin reiniciar. También podés configurar un modelo diferente por perfil.',
    code: '# En conversación\n/model anthropic/claude-opus-4\n\n# En config.yaml\nmodel: openai/gpt-4o' },
  { cat: 'Configuración', title: 'Profiles para instancias separadas',
    desc: 'Creá profiles aislados con su propia config, memoria, sesiones y skills. Ideal para separar trabajo personal de profesional.',
    code: '# Crear un nuevo profile\nhermes profile create trabajo\n\n# Listar profiles\nhermes profile list\n\n# Usar un profile específico\nhermes chat --profile trabajo' },
  { cat: 'Configuración', title: 'Fallback de proveedores',
    desc: 'Configurá una cadena de proveedores para que Hermes cambie automáticamente si el principal falla.',
    code: '# config.yaml\nprovider_chain:\n  - openrouter\n  - anthropic\n  - openai\n\n# Hermes prueba en orden y usa el primero disponible' },
  { cat: 'Configuración', title: 'Configurá el sistema de aprobación',
    desc: 'Hermes puede pedirte confirmación antes de ejecutar comandos peligrosos. Configurá qué requiere aprobación.',
    code: '# config.yaml\napprovals:\n  terminal: ask          # Pregunta antes de ejecutar\n  write_file: auto       # Escribe sin preguntar\n  patch: ask             # Pregunta antes de editar archivos\n  web_search: auto       # Busca sin preguntar\n  delegate_task: ask     # Pregunta antes de delegar' },
  { cat: 'Configuración', title: 'Variables de entorno sensibles',
    desc: 'Nunca pongas API keys directamente en config.yaml. Usá variables de entorno y <code>.env</code> para proteger tus credenciales.',
    code: '# .env (NO commitear esto)\nANTHROPIC_API_KEY=sk-ant-...\nOPENAI_API_KEY=sk-...\nOPENROUTER_API_KEY=sk-or-...\n\n# config.yaml referencia las env vars\nanthropic:\n  api_key: ${ANTHROPIC_API_KEY}' },

  // ── Automatización ──
  { cat: 'Automatización', title: 'Background processes con notificación',
    desc: 'Ejecutá tareas largas en background y recibí notificación cuando terminen. Perfecto para tests, builds y deployments.',
    code: '# En terminal de Hermes\nexecute_code background=true notify_on_complete=true\ntask = "pytest tests/ -v"\n\n# Recibirás una notificación cuando termine' },
  { cat: 'Automatización', title: 'Cron jobs para tareas recurrentes',
    desc: 'Programá tareas que se ejecuten solas: resúmenes diarios, monitoreo de precios, limpieza de logs, etc.',
    code: '# Crear un cron job\ncronjob create --schedule "0 9 * * *" \\\n  --name "resumen-diario" \\\n  --prompt "Resumir las novedades del día"\n\n# Listar cron jobs\ncronjob list\n\n# Ejecutar manualmente\ncronjob run --job_id resumen-diario' },
  { cat: 'Automatización', title: 'Webhooks para eventos externos',
    desc: 'Conectá Hermes a servicios externos vía webhooks. Cada vez que llegue un evento, Hermes reacciona automáticamente.',
    code: '# Crear webhook subscription\nwebhook create \\\n  --url /hooks/github \\\n  --event push \\\n  --prompt "Se hizo push en {repo}. Resumí los cambios."\n\n# Hermes recibe el POST y ejecuta el prompt' },
  { cat: 'Automatización', title: 'Pipeline con sub-agentes',
    desc: 'Delegá tareas complejas a múltiples sub-agentes que trabajan en paralelo usando <code>delegate_task</code>.',
    code: '# Ejemplo: delegar 3 tareas en paralelo\ndelegate_task tasks=[\n  { goal: "Buscar info sobre X en la web", toolsets: ["web"] },\n  { goal: "Analizar código del repo", toolsets: ["terminal", "file"] },\n  { goal: "Generar documentación", toolsets: ["terminal", "file"] }\n]' },

  // ── Memoria y Skills ──
  { cat: 'Memoria y Skills', title: 'Crea skills personalizadas',
    desc: 'Hermes genera skills automáticamente, pero podés crear las tuyas manualmente en <code>~/.hermes/skills/</code>. Son archivos markdown con YAML frontmatter.',
    code: '# ~/.hermes/skills/mi-skill/SKILL.md\n---\nname: mi-skill\ndescription: Descripción de mi skill personalizado\n---\n\n# Mi Skill\n\nPasos:\n1. Hacer X\n2. Verificar Y\n3. Completar Z\n\n## Notas\n- Siempre verificar antes de proceder' },
  { cat: 'Memoria y Skills', title: 'Memoria persistente entre sesiones',
    desc: 'Hermes recuerda lo que aprende. Guardá hechos clave con <code>memory</code> y buscalos en sesiones futuras con <code>session_search</code>.',
    code: '# Guardar un dato en memoria\nmemory add --target user \\\n  --content "Prefiero respuestas concisas"\n\n# Buscar en sesiones pasadas\nsession_search "docker networking"\n\n# Ver la memoria guardada\nmemory --action list' },
  { cat: 'Memoria y Skills', title: 'Instalá skills de la comunidad',
    desc: 'Explorá y probá skills creadas por otros usuarios. Instalalas con un solo comando.',
    code: '# Instalar skill oficial opcional\nhermes skills install official/crypto/solana\n\n# Instalar skill comunitaria\nhermes skills install community/mi-skill\n\n# Listar skills instaladas\nhermes skills list\n\n# Desinstalar\nhermes skills uninstall solana' },
  { cat: 'Memoria y Skills', title: 'Compartí skills entre profiles',
    desc: 'Las skills globales están disponibles para todos los profiles. Las de profile solo para ese contexto.',
    code: '# Skills globales (todos los profiles)\n~/.hermes/skills/mi-skill/SKILL.md\n\n# Skills de un profile específico\n~/.hermes/profiles/trabajo/skills/mi-skill/SKILL.md\n\n# En config.yaml, podés habilitar/deshabilitar\nskills:\n  enabled: ["mi-skill", "plan"]\n  disabled: ["red-teaming"]' },

  // ── Plataformas ──
  { cat: 'Plataformas', title: 'Gateway de mensajería multi-plataforma',
    desc: 'Hermes puede estar conectado a múltiples plataformas simultáneamente. Configurá las que necesites.',
    code: '# config.yaml\ntelegram:\n  token: "TU_TOKEN"\n  allowed_users: [12345]\n\ndiscord:\n  token: "TU_TOKEN"\n\nslack:\n  bot_token: "xoxb-..."\n\n# Iniciar gateway\nhermes gateway start' },
  { cat: 'Plataformas', title: 'MCP Server Mode para editores',
    desc: 'Expón Hermes como servidor MCP para integrarse con VS Code, Zed y otros editores que soporten ACP.',
    code: '# Iniciar servidor MCP\nhermes mcp serve\n\n# Desde VS Code, registrar el servidor MCP\n# Hermes se integra nativamente con editores via ACP' },
  { cat: 'Plataformas', title: 'Paperclip: Hermes como empleado virtual',
    desc: 'Conectá Hermes a <a href="https://paperclip.ing" target="_blank" rel="noopener">Paperclip</a> para correrlo como empleado gestionado en una company.',
    code: '# Instalar el adapter\nnpm install -g hermes-paperclip-adapter\n\n# Configurar\npaperclip-adapter init\n\n# Ejecutar\npaperclip-adapter start\n\n# Docs: github.com/NousResearch/hermes-paperclip-adapter' },

  // ── DevOps ──
  { cat: 'DevOps', title: 'Docker para deployment en producción',
    desc: 'La imagen oficial de Docker soporta CLI y gateway, con usuario no-root por defecto.',
    code: '# docker-compose.yml\nservices:\n  hermes:\n    image: nousresearch/hermes-agent:latest\n    volumes:\n      - ./hermes-data:/home/hermes\n    env_file: .env\n    command: hermes gateway start\n\n# Ejecutar\ndocker compose up -d' },
  { cat: 'DevOps', title: 'Backup y restore completo',
    desc: 'Respaldá toda tu configuración, memoria y skills con un solo comando.',
    code: '# Crear backup\nhermes backup --output mi-backup.tar.gz\n\n# Restaurar desde backup\nhermes import mi-backup.tar.gz\n\n# Diagnosticar problemas\nhermes doctor\nhermes debug share  # Compartir reporte de diagnóstico' },
  { cat: 'DevOps', title: 'Watch patterns para procesos en background',
    desc: 'Configurá patrones de texto que disparan notificaciones durante un proceso en ejecución.',
    code: '# Recibe notificación cuando aparezca "ERROR" o "listening"\nexecute_code background=true\nwatch_patterns = ["ERROR", "Traceback", "listening on port"]\n\n# Útil para detectar errores sin esperar al final' },

  // ── Tips ocultos ──
  { cat: 'Tips ocultos', title: 'Ejecutá código Python inline',
    desc: 'Con <code>execute_code</code> podés correr Python directamente en la sesión de Hermes, con acceso a todas las herramientas.',
    code: '# Ejecutar Python con acceso a tools\nexecute_code:\n  from hermes_tools import terminal, read_file\n  result = terminal("git log --oneline -5")\n  print(result)\n\n# Ideal para procesar datos entre llamadas a tools' },
  { cat: 'Tips ocultos', title: 'Comandos del sistema sin salir de Hermes',
    desc: 'Usá <code>!</code> al inicio de un mensaje para ejecutar un comando de shell directo, sin que Hermes lo procese como prompt.',
    code: '# Ejecutar comando de shell directamente\n!git status\n!cat ~/.hermes/config.yaml\n!ps aux | grep hermes\n\n# Útil para debugging rápido sin abrir otra terminal' },
  { cat: 'Tips ocultos', title: 'Modo verbose para debugging',
    desc: 'Si algo no funciona como esperás, activá el modo verbose para ver exactamente qué está haciendo Hermes internally.',
    code: '# Activar verbose logging\nhermes chat --verbose\n\n# O en config.yaml\nlogging:\n  level: debug\n  file: ~/.hermes/hermes.log\n\n# Ver logs en tiempo real\n!tail -f ~/.hermes/hermes.log' },
];

// ═══════════════════════════════════════════════════════════════
// RENDERERS
// ═══════════════════════════════════════════════════════════════

function renderHome() {
  return `
    <div class="container">
      <section class="hero">
        <div class="hero-badge">
          <span class="dot"></span>
          Actualizado abril 2026 · v0.10.0
        </div>
        <h1>la base de conocimiento<br>de <span class="accent">hermes agent</span><br>en español.</h1>
        <p class="hero-desc">
          Handbook, skills, herramientas, videos, plugins, novedades y trucos.
          Todo lo que necesitás saber sobre el agente de IA que crece con vos.
          Curado por la comunidad.
        </p>
        <div class="hero-actions">
          <a href="#/handbook" class="btn btn-primary">Leer el handbook →</a>
          <a href="#/novedades" class="btn btn-outline">Novedades v0.10.0</a>
        </div>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-value">108K+</div><div class="stat-label">Estrellas GitHub</div></div>
          <div class="stat-card"><div class="stat-value">85+</div><div class="stat-label">Skills incluidas</div></div>
          <div class="stat-card"><div class="stat-value">16</div><div class="stat-label">Plataformas</div></div>
          <div class="stat-card"><div class="stat-value">47</div><div class="stat-label">Herramientas built-in</div></div>
          <div class="stat-card"><div class="stat-value">20+</div><div class="stat-label">Proveedores LLM</div></div>
          <div class="stat-card"><div class="stat-value">6</div><div class="stat-label">Backends de terminal</div></div>
        </div>
      </section>
      ${renderFeaturedSection()}
      ${renderQuickLinksSection()}
    </div>`;
}

function renderFeaturedSection() {
  return `
    <section class="section">
      <div class="section-header">
        <div class="section-label">Destacado</div>
        <h2 class="section-title">Empezá por acá</h2>
      </div>
      <div class="cards-grid">
        <a href="#/handbook" class="card" style="text-decoration:none;color:inherit">
          <div class="card-header"><span class="card-icon">📖</span><div><div class="card-title">Handbook completo</div><div class="card-desc">Qué es, cómo funciona, proveedores, plataformas, loop de aprendizaje y más.</div></div></div>
        </a>
        <a href="#/skills" class="card" style="text-decoration:none;color:inherit">
          <div class="card-header"><span class="card-icon">⚡</span><div><div class="card-title">Skills</div><div class="card-desc">85+ skills incluidas, organizadas por categoría con links al código fuente.</div></div></div>
        </a>
        <a href="#/herramientas" class="card" style="text-decoration:none;color:inherit">
          <div class="card-header"><span class="card-icon">🔧</span><div><div class="card-title">Herramientas</div><div class="card-desc">47+ herramientas nativas, Paperclip, OpenShell, Self-Evolution y más.</div></div></div>
        </a>
        <a href="#/videos" class="card" style="text-decoration:none;color:inherit">
          <div class="card-header"><span class="card-icon">🎬</span><div><div class="card-title">Videos útiles</div><div class="card-desc">Tutoriales, demos y reviews con subtítulos traducidos automáticamente.</div></div></div>
        </a>
        <a href="#/novedades" class="card" style="text-decoration:none;color:inherit">
          <div class="card-header"><span class="card-icon">🆕</span><div><div class="card-title">Novedades por versión</div><div class="card-desc">Changelog detallado desde v0.5.0 hasta v0.10.0.</div></div></div>
        </a>
        <a href="#/comunidad" class="card" style="text-decoration:none;color:inherit">
          <div class="card-header"><span class="card-icon">👥</span><div><div class="card-title">Comunidad</div><div class="card-desc">Plugins, skins, GUIs y proyectos comunitarios del ecosistema.</div></div></div>
        </a>
        <a href="#/trucos" class="card" style="text-decoration:none;color:inherit">
          <div class="card-header"><span class="card-icon">💡</span><div><div class="card-title">Trucos y configs</div><div class="card-desc">Configuraciones avanzadas, tips ocultos y trucos paraexprimir Hermes.</div></div></div>
        </a>
      </div>
    </section>`;
}

function renderQuickLinksSection() {
  return `
    <section class="section">
      <div class="section-header">
        <div class="section-label">Links útiles</div>
        <h2 class="section-title">Recursos oficiales</h2>
      </div>
      <div class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))">
        ${HANDBOOK[HANDBOOK.length-1].items.map(l => `
          <a href="${l.url}" target="_blank" rel="noopener" class="card" style="text-decoration:none;color:inherit">
            <div class="card-title">${l.name} ↗</div>
            <div class="card-desc">${l.desc}</div>
          </a>
        `).join('')}
      </div>
    </section>`;
}

// ─── Handbook ───
function renderHandbook() {
  const sections = HANDBOOK.filter(s => !s.items);
  const linksSection = HANDBOOK[HANDBOOK.length-1];
  return `
    <div class="container">
      <section class="section">
        <div class="section-header">
          <div class="section-label">Handbook</div>
          <h1 class="section-title">El handbook de Hermes Agent</h1>
          <p class="section-desc">Todo lo que necesitás saber para empezar: qué es, cómo funciona, cómo instalarlo y cómo sacarle provecho.</p>
        </div>
        <div class="content-narrow">
          <div class="toc">
            <div class="toc-title">Contenido</div>
            <ul class="toc-list">
              ${sections.map(s => `<li><a href="#hb-${s.id}">${s.title}</a></li>`).join('')}
              <li><a href="#hb-${linksSection.id}">${linksSection.title}</a></li>
            </ul>
          </div>
          ${sections.map(s => `<h2 id="hb-${s.id}">${s.title}</h2>${s.content}`).join('')}
          <h2 id="hb-${linksSection.id}">${linksSection.title}</h2>
          <div class="cards-grid" style="grid-template-columns: 1fr">
            ${linksSection.items.map(l => `
              <a href="${l.url}" target="_blank" rel="noopener" class="card" style="text-decoration:none;color:inherit">
                <div class="card-title">${l.name} ↗</div>
                <div class="card-desc">${l.desc}</div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    </div>`;
}

// ─── Skills ───
function renderSkills() {
  return `
    <div class="container">
      <section class="section">
        <div class="section-header">
          <div class="section-label">Skills</div>
          <h1 class="section-title">Skills de Hermes</h1>
          <p class="section-desc">85+ skills incluidas organizadas por categoría, con links al código fuente. Las skills opcionales se instalan con <code>hermes skills install</code>. Para ver las herramientas nativas y plataformas externas, visitá la sección de <a href="#/herramientas">Herramientas</a>.</p>
        </div>
        ${SKILLS_DATA.map(cat => `
          <div class="category-section">
            <div class="category-label">${cat.icon} ${cat.label}</div>
            <div class="cards-grid">
              ${cat.skills.map(s => {
                const url = s.badge === 'optional'
                  ? `${OPT_SKILLS_BASE}/${cat.cat}/${s.name}/SKILL.md`
                  : `${SKILLS_BASE}/${s.gh}/${s.name}/SKILL.md`;
                return `
                <div class="card">
                  <div class="card-title">
                    <a href="${url}" target="_blank" rel="noopener">${s.name} ↗</a>
                  </div>
                  <div class="card-desc">${s.desc}</div>
                  <div class="card-meta">
                    <span class="badge ${s.badge === 'bundled' ? 'badge-accent' : 'badge-info'}">${s.badge === 'bundled' ? 'incluida' : 'opcional'}</span>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>
        `).join('')}
        <div class="category-section mt-3">
          <div class="category-label">⚠️ Seguridad</div>
          <div class="content-narrow">
            <blockquote><strong>Revisá siempre el código fuente antes de instalar o usar una skill.</strong> Las skills pueden ejecutar código, acceder a archivos y hacer llamadas de red. Incluso las skills oficiales merecen una revisión. Las de terceros pueden contener vulnerabilidades, exfiltrar datos o realizar acciones no deseadas. Verificá el contenido de <code>SKILL.md</code> y cualquier script asociado antes de habilitarlas.</blockquote>
          </div>
        </div>

        <div class="category-section">
          <div class="category-label">🔧 Cómo instalar skills opcionales</div>
          <div class="content-narrow">
            <pre><code># Instalar skill opcional
hermes skills install official/crypto/solana

# Listar skills instaladas
hermes skills list

# Desinstalar
hermes skills uninstall solana</code></pre>
            <p>Las skills se guardan en <code>~/.hermes/skills/</code> como archivos markdown con YAML frontmatter. Hermes las carga y usa automáticamente. Podés editarlas o crear las tuyas.</p>
          </div>
        </div>
      </section>
    </div>`;
}

// ─── Herramientas ───
function renderHerramientas() {
  let html = `
    <div class="container">
      <section class="section">
        <div class="section-header">
          <div class="section-label">Herramientas</div>
          <h1 class="section-title">Herramientas de Hermes</h1>
          <p class="section-desc">47+ herramientas nativas y plataformas externas que amplían las capacidades de Hermes Agent.</p>
        </div>`;

  HERRAMIENTAS_DATA.forEach(group => {
    html += `
        <div class="category-section">
          <div class="category-label">${group.icon} ${group.cat}</div>
          <p class="section-desc" style="margin-bottom:1rem">${group.desc}</p>
          <div class="herr-grid">`;

    group.tools.forEach(t => {
      if (t.url) {
        html += `
            <div class="card" style="cursor:pointer" onclick="window.open('${t.url}','_blank')">
              <div class="card-title" style="display:flex;justify-content:space-between;align-items:center">
                <span>${t.icon || '🔗'} ${t.name} ↗</span>
                <span style="font-size:.75rem;color:var(--muted)">${t.stars || ''} ⭐ · ${t.lang || ''}</span>
              </div>
              <div class="card-desc">${t.desc}</div>
              <div class="card-meta"><span class="badge badge-info">${t.cat}</span></div>
            </div>`;
      } else {
        html += `
            <div class="card">
              <div class="card-title">${t.name}</div>
              <div class="card-desc">${t.desc}</div>
              <div class="card-meta"><span class="badge badge-accent">${t.cat}</span></div>
            </div>`;
      }
    });

    html += `
          </div>
        </div>`;
  });

  html += `
      </section>
    </div>`;
  return html;
}

// ─── Videos ───
function renderVideos() {
  return `
    <div class="container">
      <section class="section">
        <div class="section-header">
          <div class="section-label">Videos</div>
          <h1 class="section-title">Videos útiles</h1>
          <p class="section-desc">Los mejores tutoriales, demos y reviews de Hermes Agent. Los videos que no están en español se reproducen con subtítulos traducidos automáticamente.</p>
        </div>
        <div class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))">
          ${VIDEOS_DATA.map(v => `
            <a href="${ytUrl(v.id)}" target="_blank" rel="noopener" class="card video-card" style="text-decoration:none;color:inherit">
              <div class="video-thumb" style="background:url('${ytThumb(v.id)}') center/cover;border-radius:var(--radius-sm)">
                <div class="play-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
                </div>
              </div>
              <div class="video-channel">${v.channel}${v.views ? ' · ' + v.views + ' vistas' : ''}</div>
              <div class="card-title">${v.title}</div>
              <div class="card-desc">${v.desc}</div>
            </a>
          `).join('')}
        </div>
      </section>
    </div>`;
}

// ─── Comunidad ───
function renderComunidad() {
  return `
    <div class="container">
      <section class="section">
        <div class="section-header">
          <div class="section-label">Comunidad</div>
          <h1 class="section-title">Plugins, skins y proyectos</h1>
          <p class="section-desc">El ecosistema comunitario alrededor de Hermes Agent: plugins, themes del CLI, interfaces web y más.</p>
        </div>

        <div class="category-section">
          <div class="category-label">🔌 Plugins incluidos</div>
          <div class="cards-grid">
            ${COMUNIDAD_DATA.plugins.map(p => `
              <div class="card">
                <div class="card-title">${p.name}</div>
                <div class="card-desc">${p.desc}</div>
                <div class="card-meta">
                  <span class="badge badge-success">${p.badge}</span>
                  <a href="${p.url}" target="_blank" rel="noopener" class="badge badge-muted" style="text-decoration:none">ver código ↗</a>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="content-narrow mt-2">
            <p class="text-sm text-muted">Los plugins se instalan en <code>~/.hermes/plugins/</code> y se habilitan con <code>hermes plugins enable &lt;nombre&gt;</code>. Podés crear los tuyos con un <code>plugin.yaml</code> y código Python.</p>
            <blockquote><strong>Revisá siempre el código de un plugin antes de habilitarlo.</strong> Los plugins se ejecutan con los mismos permisos que Hermes y pueden acceder a archivos, red, variables de entorno y secretos. Verificá el <code>plugin.yaml</code> y el código Python antes de activar cualquier plugin, especialmente de terceros.</blockquote>
          </div>
        </div>

        <div class="category-section">
          <div class="category-label">🎨 Skins / Themes del CLI</div>
          <div class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
            ${COMUNIDAD_DATA.skins.map(s => `
              <div class="card">
                <div class="card-title">
                  <a href="${s.url}" target="_blank" rel="noopener">${s.name} ↗</a>
                </div>
                <div class="card-desc">${s.desc}</div>
                <div class="card-meta"><span class="badge badge-muted">${s.visual}</span></div>
              </div>
            `).join('')}
          </div>
          <div class="content-narrow mt-2">
            <p class="text-sm text-muted">Cambiá de skin con <code>/skin</code> o en <code>config.yaml</code>. Creá skins personalizados en <code>~/.hermes/skins/&lt;nombre&gt;.yaml</code>.</p>
            <blockquote><strong>Skins de terceros pueden contener configuraciones riesgosas.</strong> Un skin YAML puede incluir comandos personalizados o verbos que alteren el comportamiento del agente. Revisá el contenido del archivo <code>.yaml</code> antes de cargar skins descargadas de internet.</blockquote>
          </div>
        </div>

        <div class="category-section">
          <div class="category-label">🖥️ Workspaces y GUIs</div>
          <div class="content-narrow mb-2">
            <blockquote><strong>Proyectos de terceros no están auditados por Nous Research.</strong> Antes de instalar o usar cualquier workspace, interfaz o herramienta comunitaria, revisá su código fuente, issues abiertos y actividad del repositorio. Estas herramientas pueden tener acceso a tus conversaciones, API keys y archivos locales.</blockquote>
          </div>
          ${COMUNIDAD_DATA.projects.map(p => `
            <div class="list-item">
              <div class="list-item-icon">⭐</div>
              <div class="list-item-content">
                <div class="list-item-title"><a href="${p.url}" target="_blank" rel="noopener">${p.name}</a> <span class="badge badge-muted">${p.stars}</span></div>
                <div class="list-item-desc">por ${p.author} — ${p.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="category-section">
          <div class="category-label">🔗 Integraciones del ecosistema</div>
          ${COMUNIDAD_DATA.integraciones.map(i => `
            <div class="list-item">
              <div class="list-item-icon">🔗</div>
              <div class="list-item-content">
                <div class="list-item-title">${i.url ? `<a href="${i.url}" target="_blank" rel="noopener">${i.name} ↗</a>` : i.name}</div>
                <div class="list-item-desc">${i.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>`;
}

// ─── Novedades ───
function renderNovedades() {
  return `
    <div class="container">
      <section class="section">
        <div class="section-header">
          <div class="section-label">Novedades</div>
          <h1 class="section-title">Historial de versiones</h1>
          <p class="section-desc">Cada release de Hermes Agent con sus features principales y cambios. Actualizado a v0.10.0.</p>
        </div>
        <div class="content-narrow">
          <div class="timeline">
            ${VERSIONS_DATA.map(v => `
              <div class="timeline-item${v.current ? ' current' : ''}">
                <div class="timeline-title">${v.version} — "${v.name}"</div>
                <div class="timeline-date">${v.date} · ${v.tag}</div>
                <div class="timeline-body">
                  <ul>${v.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    </div>`;
}

// ─── Trucos ───
function renderTrucos() {
  const cats = [...new Set(TRUCOS_DATA.map(t => t.cat))];
  return `
    <div class="container">
      <section class="section">
        <div class="section-header">
          <div class="section-label">Trucos</div>
          <h1 class="section-title">Trucos y configuraciones</h1>
          <p class="section-desc">Configuraciones avanzadas, tips ocultos y trucos para exprimir Hermes Agent al máximo.</p>
        </div>
        ${cats.map(cat => `
          <div class="category-section">
            <div class="category-label">${cat}</div>
            <div class="trucos-grid">
              ${TRUCOS_DATA.filter(t => t.cat === cat).map((t, i) => `
                <div class="card">
                  <div class="card-header">
                    <span class="tip-number">${i + 1}</span>
                    <div>
                      <div class="card-title">${t.title}</div>
                      <div class="card-desc">${t.desc}</div>
                    </div>
                  </div>
                  <div class="code-block"><pre><code>${t.code}</code></pre></div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </section>
    </div>`;
}