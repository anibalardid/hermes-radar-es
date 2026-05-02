// ═══════════════════════════════════════════════════════════════
// HERMES RADAR — SPA Router + Content
// Dark/Light theme · Hash routing · All content in Spanish
// ═══════════════════════════════════════════════════════════════

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
  const rawPath = hash.replace('#', '') || '/';
  const path = rawPath.split('?')[0];
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

// ─── Data Loading ───
const DATA = {};

async function loadData() {
  const v = typeof HR_VERSION !== 'undefined' ? HR_VERSION : '0.1.0';
  const cache = `?v=${v}`;
  const files = {
    handbook: 'data/handbook.json',
    skills: 'data/skills.json',
    herramientas: 'data/herramientas.json',
    trucos: 'data/trucos.json',
    versions: 'data/versions.json',
    radar: 'data/radar.json',
    videos: 'data/videos.json',
    comunidad: 'data/comunidad.json',
  };
  const config = await (await fetch('data/config.json' + cache)).json();
  DATA.config = config;
  const entries = await Promise.all(
    Object.entries(files).map(([key, path]) =>
      fetch(path + cache).then(r => r.json()).then(d => [key, d])
    )
  );
  entries.forEach(([key, val]) => DATA[key] = val);
}

// ─── Helpers ───
function ytUrl(id) {
  return `https://www.youtube.com/watch?v=${id}&hl=es&cc_lang_pref=es&cc_load_policy=1`;
}
function ytThumb(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
function ghSkill(cat, name) {
  return `${DATA.config.SKILLS_BASE}/${cat}/${name}/SKILL.md`;
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', async () => {
  // Show loading indicator
  const main = document.getElementById('main-content');
  main.innerHTML = '<div class="container" style="text-align:center;padding:4rem"><p>Cargando...</p></div>';
  
  try {
    await loadData();
  } catch(e) {
    console.error('Error loading data:', e);
  }
  
  // Sync version badge
  const badge = document.getElementById('version-badge');
  if (badge && DATA.config) badge.textContent = 'v' + DATA.config.HR_VER;

  initTheme();
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('nav-toggle').addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.toggle('open');
  });
  window.addEventListener('hashchange', () => navigate(location.hash));
  navigate(location.hash || '#/');

  initDisclaimer();
  initNewsBanner();
});

// ─── News Banner logic ───
function initNewsBanner() {
  const banner = document.getElementById('news-banner');
  if (!banner) return;
  const closeBtn = document.getElementById('news-close');
  const textEl = document.getElementById('news-text');
  if (!DATA.radar || !DATA.radar.length) return;
  const current = DATA.radar.find(r => r.current) || DATA.radar[0];
  if (!current) return;
  const text = current.name + ' — ' + current.date;
  textEl.textContent = text;
  const seenKey = 'hr-banner-seen-' + current.version;
  if (localStorage.getItem(seenKey) === '1') return;
  banner.style.display = '';
  closeBtn.addEventListener('click', () => {
    banner.classList.add('hidden');
    localStorage.setItem(seenKey, '1');
  });
}

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

// ═══════════════════════════════════════════════════════════════
// RENDERERS
// ═══════════════════════════════════════════════════════════════

function renderHome() {
  const latestUpdate = DATA.radar ? (DATA.radar.find(r => r.current) || DATA.radar[0]) : null;
  const badgeText = latestUpdate ? `${latestUpdate.version} · ${latestUpdate.name}` : 'Actualizado abril 2026 · v0.10.0';
  return `
    <div class="container">
      <section class="hero">
        <a href="#/novedades" class="hero-badge" style="text-decoration:none;color:inherit">
          <span class="dot"></span>
          ${badgeText}
        </a>
        <h1>la base de conocimiento<br>de <span class="accent">hermes agent</span><br>en español.</h1>
        <p class="hero-desc">
          Handbook, skills, herramientas, videos, plugins, novedades y trucos.
          Todo lo que necesitás saber sobre el agente de IA que crece con vos.
          Curado por la comunidad.
        </p>
        <div class="hero-actions">
          <a href="#/handbook" class="btn btn-primary">Leer el handbook →</a>
          <a href="#/novedades" class="btn btn-outline">Ver novedades</a>
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
        <a href="#/novedades" class="card featured-card" style="text-decoration:none;color:inherit">
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
        ${DATA.handbook[DATA.handbook.length-1].items.map(l => `
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
  const sections = DATA.handbook.filter(s => !s.items);
  const linksSection = DATA.handbook[DATA.handbook.length-1];
  return `
    <div class="container">
      <section class="section">
        <div class="section-header">
          <div class="section-label">Handbook</div>
          <h1 class="section-title">El handbook de Hermes Agent</h1>
          <p class="section-desc">Todo lo que necesitás saber para empezar: qué es, cómo funciona, cómo instalarlo y cómo sacarle provecho.</p>
        </div>
        <div class="content-narrow">
          <div class="callout" style="margin-bottom: 1.5rem;">
            <a href="hermes-cheatsheet.jpg" target="_blank" rel="noopener">
              <img src="hermes-cheatsheet.jpg" alt="Hermes Agent Cheatsheet" style="max-width:100%; border-radius:8px; box-shadow: 0 4px 24px rgba(0,0,0,0.4);">
            </a>
            <p style="margin-top:0.75rem; font-size:0.875rem; opacity:0.7;">Referencia rápida de Hermes Agent — Creado por <a href="https://x.com/EtherCoins" target="_blank" rel="noopener">@EtherCoins</a></p>
          </div>
          <div class="toc">
            <div class="toc-title">Contenido</div>
            <ul class="toc-list">
              ${sections.map(s => `<li><a href="javascript:void(0)" onclick="document.getElementById('hb-${s.id}').scrollIntoView({behavior:'smooth',block:'start'})">${s.title}</a></li>`).join('')}
              <li><a href="javascript:void(0)" onclick="document.getElementById('hb-${linksSection.id}').scrollIntoView({behavior:'smooth',block:'start'})">${linksSection.title}</a></li>
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
        ${DATA.skills.map(cat => `
          <div class="category-section">
            <div class="category-label">${cat.icon} ${cat.label}</div>
            <div class="cards-grid">
              ${cat.skills.map(s => {
                const url = s.badge === 'optional'
                  ? `${DATA.config.OPT_SKILLS_BASE}/${cat.cat}/${s.name}/SKILL.md`
                  : `${DATA.config.SKILLS_BASE}/${s.gh}/${s.name}/SKILL.md`;
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

  DATA.herramientas.forEach(group => {
    html += `
        <div class="category-section">
          <div class="category-label">${group.icon} ${group.cat}</div>
          <p class="section-desc" style="margin-bottom:1rem">${group.desc}</p>
          <div class="herr-grid">`;

    group.tools.forEach(t => {
      if (t.url) {
        const isGithub = t.url.includes('github.com');
        const icon = isGithub ? '🔗' : '📄';
        const suffix = isGithub ? ' ↗' : ' →';
        const linkLabel = isGithub ? '' : 'Docs';
        html += `
            <div class="card" style="cursor:pointer" onclick="window.open('${t.url}','_blank')">
              <div class="card-title" style="display:flex;justify-content:space-between;align-items:center">
                <span>${icon} ${t.name}${linkLabel ? ' <span style="font-size:.75rem;opacity:.7">(' + linkLabel + ')</span>' : ''}${suffix}</span>
                ${t.stars ? `<span style="font-size:.75rem;color:var(--muted)">${t.stars} ⭐ · ${t.lang || ''}</span>` : ''}
              </div>
              <div class="card-desc">${t.desc}</div>
              <div class="card-meta"><span class="badge ${isGithub ? 'badge-info' : 'badge-accent'}">${t.cat}</span></div>
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
          ${DATA.videos.map(v => `
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
            ${DATA.comunidad.plugins.map(p => `
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
          <div class="category-label">🔌 Plugins de la comunidad</div>
          <div class="cards-grid">
            ${DATA.comunidad.community_plugins ? DATA.comunidad.community_plugins.map(p => `
              <div class="card">
                <div class="card-title">${p.name}</div>
                <div class="card-desc">${p.desc}</div>
                <div class="card-meta">
                  <span class="badge badge-info">${p.badge}</span>
                  <a href="${p.url}" target="_blank" rel="noopener" class="badge badge-muted" style="text-decoration:none">${p.author} · ${p.stars} ⭐ ↗</a>
                </div>
              </div>
            `).join('') : ''}
          </div>
          <div class="content-narrow mt-2">
            <blockquote><strong>Plugins de terceros no están auditados por Nous Research.</strong> Revisá siempre el código antes de habilitarlos.</blockquote>
          </div>
        </div>

        <div class="category-section">
          <div class="category-label">🎨 Skins / Themes del CLI</div>
          <div class="cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
            ${DATA.comunidad.skins.map(s => `
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
          ${DATA.comunidad.projects.map(p => `
            <div class="list-item">
              <div class="list-item-icon">${p.swarm ? '🤖' : '⭐'}</div>
              <div class="list-item-content">
                <div class="list-item-title">
                  <a href="${p.url}" target="_blank" rel="noopener">${p.name}</a>
                  <span class="badge badge-muted">${p.stars}</span>
                  ${p.swarm ? '<span class="badge badge-accent">🤖 Swarm</span>' : ''}
                </div>
                <div class="list-item-desc">por ${p.author} — ${p.desc}</div>
                ${p.swarm_features ? `<div class="list-item-features" style="margin-top:0.4rem;font-size:0.8rem;opacity:0.8">${p.swarm_features.map(f => `• ${f}`).join(' · ')}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="category-section">
          <div class="category-label">🔗 Integraciones del ecosistema</div>
          ${DATA.comunidad.integraciones.map(i => `
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

// ─── Changelog del sitio (radar) ───
function renderRadar() {
  if (!DATA.radar) return '<div class="container"><section class="section"><p>Cargando...</p></section></div>';
  return `
    <div class="container">
      <section class="section">
        <div class="section-header">
          <div class="section-label">Changelog del sitio</div>
          <h1 class="section-title">Cambios de Hermes Radar</h1>
          <p class="section-desc">Historial de actualizaciones de esta pagina web. Actualizado a v${DATA.config ? DATA.config.HR_VER : '?'}</p>
        </div>
        <div class="content-narrow">
          <div class="timeline">
            ${DATA.radar.map(r => `
              <div class="timeline-item${r.current ? ' current' : ''}">
                <div class="timeline-title">${r.version} — "${r.name}"</div>
                <div class="timeline-date">${r.date}</div>
                <div class="timeline-body">
                  <ul>${r.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    </div>`;
}

// ─── Novedades (Hermes Agent releases) ───
function renderNovedades() {
  const tab = window.location.hash.includes('tab=radar') ? 'radar' : 'hermes';
  return `
    <div class="container">
      <section class="section">
        <div class="section-header">
          <div class="section-label">Novedades</div>
          <h1 class="section-title">Historial de versiones</h1>
          <p class="section-desc">Dos timelines separadas: releases de Hermes Agent y cambios de esta pagina.</p>
        </div>
        <div class="content-narrow">
          <div class="tab-nav">
            <a href="#/novedades?tab=hermes" class="tab-link ${tab === 'hermes' ? 'active' : ''}">Hermes Agent</a>
            <a href="#/novedades?tab=radar" class="tab-link ${tab === 'radar' ? 'active' : ''}">Hermes Radar (sitio)</a>
          </div>
          ${tab === 'hermes' ? renderNovedadesHermes() : renderRadar()}
        </div>
      </section>
    </div>`;
}

function renderNovedadesHermes() {
  return `
    <div class="timeline">
      ${DATA.versions.map(v => `
        <div class="timeline-item${v.current ? ' current' : ''}">
          <div class="timeline-title">${v.version} — "${v.name}"</div>
          <div class="timeline-date">${v.date} · ${v.tag}</div>
          <div class="timeline-body">
            <ul>${v.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
          </div>
        </div>
      `).join('')}
    </div>`;
}

// ─── Trucos ───
function renderTrucos() {
  const cats = [...new Set(DATA.trucos.map(t => t.cat))];
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
              ${DATA.trucos.filter(t => t.cat === cat).map((t, i) => `
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