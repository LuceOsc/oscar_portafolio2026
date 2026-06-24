import dict from '../data/i18n.json';
import projects from '../data/projects.json';
import config from '../data/config.json';

const projectsById = Object.fromEntries(projects.map((p) => [p.id, p]));

const statusStyles = {
  live: { color: '#6ee7b7', border: 'rgba(52,211,153,.55)', bg: 'rgba(52,211,153,.14)', dot: '#34d399', key: 'proj.st_live', blink: true },
  demo: { color: '#93c5fd', border: 'rgba(96,165,250,.55)', bg: 'rgba(96,165,250,.14)', dot: '#60a5fa', key: 'proj.st_demo', blink: false },
  private: { color: '#d8b4fe', border: 'rgba(192,132,252,.55)', bg: 'rgba(192,132,252,.14)', dot: '#c084fc', key: 'proj.st_private', blink: false },
  progress: { color: '#fcd34d', border: 'rgba(251,191,36,.5)', bg: 'rgba(251,191,36,.14)', dot: '#fbbf24', key: 'proj.st_progress', blink: true },
};
const catLabelKey = { web: 'proj.cWeb', ecom: 'proj.cEcom', sys: 'proj.cSys', prog: 'proj.f_prog' };

let state = { lang: 'es', theme: 'dark' };

function tr(key) {
  const v = dict[key];
  return v ? (v[state.lang] ?? key) : key;
}

function applyTheme(theme, persist = true) {
  document.documentElement.setAttribute('data-theme', theme);
  const sun = document.querySelector('[data-ic-sun]');
  const moon = document.querySelector('[data-ic-moon]');
  if (sun && moon) {
    sun.style.display = theme === 'dark' ? 'flex' : 'none';
    moon.style.display = theme === 'dark' ? 'none' : 'flex';
  }
  state.theme = theme;
  if (persist) {
    try { localStorage.setItem('ol_theme', theme); } catch (e) {}
  }
}
function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

function applyLang(lang, persist = true) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = dict[el.getAttribute('data-i18n')];
    if (v && v[lang] != null) el.textContent = v[lang];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const v = dict[el.getAttribute('data-i18n-ph')];
    if (v && v[lang] != null) el.setAttribute('placeholder', v[lang]);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const v = dict[el.getAttribute('data-i18n-aria')];
    if (v && v[lang] != null) {
      el.setAttribute('aria-label', v[lang]);
      el.setAttribute('title', v[lang]);
    }
  });
  document.querySelectorAll('[data-lang-label]').forEach((el) => {
    el.textContent = lang === 'es' ? 'EN' : 'ES';
  });
  document.querySelectorAll('[data-proj]').forEach((card) => {
    const p = projectsById[card.getAttribute('data-projid')];
    if (!p) return;
    const descEl = card.querySelector('[data-proj-field="desc"]');
    const metricEl = card.querySelector('[data-proj-field="metric"]');
    if (descEl) descEl.textContent = p.desc[lang];
    if (metricEl) metricEl.textContent = p.metric[lang];
  });
  try { document.documentElement.lang = lang; } catch (e) {}
  state.lang = lang;
  if (persist) {
    try { localStorage.setItem('ol_lang', lang); } catch (e) {}
  }
}
function toggleLang() {
  applyLang(state.lang === 'es' ? 'en' : 'es');
}

function filter(cat) {
  document.querySelectorAll('[data-proj]').forEach((el) => {
    const show = cat === 'all' || el.getAttribute('data-cat') === cat;
    el.style.display = show ? '' : 'none';
  });
  document.querySelectorAll('[data-filter]').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-filter') === cat);
  });
}

function setupEmail() {
  const email = 'oscarsini10' + '@' + 'gmail.com';
  document.querySelectorAll('[data-email-link]').forEach((a) => a.setAttribute('href', 'mailto:' + email));
  document.querySelectorAll('[data-email-text]').forEach((s) => { s.textContent = email; });
}

function openProject(id) {
  const p = projectsById[id];
  if (!p) return;
  const modal = document.querySelector('[data-modal]');
  if (!modal) return;
  const panel = modal.querySelector('[data-modal-panel]');
  const lang = state.lang;

  const gal = modal.querySelector('[data-modal-gallery]');
  gal.innerHTML = '';
  const hero = document.createElement('div');
  hero.style.cssText = 'position:relative; border-radius:16px; overflow:hidden; aspect-ratio:16/9; background:radial-gradient(circle at 30% 20%, rgba(139,92,246,.35), transparent 55%), radial-gradient(circle at 80% 90%, rgba(34,211,238,.25), transparent 55%), #0c0c16;';
  if (p.img) {
    const im = document.createElement('img');
    im.src = import.meta.env.BASE_URL + p.img;
    im.alt = p.name;
    im.style.cssText = 'width:100%; height:100%; object-fit:cover; object-position:top center;';
    hero.appendChild(im);
  } else {
    hero.innerHTML = '<div style="position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px); background-size:34px 34px;"></div><div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center;"><svg width="92" height="92" viewBox="0 0 24 24" fill="none" stroke="' + p.accent + '" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 16px ' + p.accent + '88);">' + (p.icon === 'erp' ? '<line x1="4" y1="20" x2="20" y2="20"/><rect x="5.5" y="11" width="3.4" height="7"/><rect x="10.3" y="6" width="3.4" height="12"/><rect x="15.1" y="14" width="3.4" height="4"/>' : '<rect x="2" y="6" width="20" height="12" rx="4"/><line x1="7" y1="11" x2="7" y2="13"/><line x1="6" y1="12" x2="8" y2="12"/><circle cx="16" cy="11" r="1"/><circle cx="18.5" cy="13" r="1"/>') + '</svg></div>';
  }
  gal.appendChild(hero);

  const ss = statusStyles[p.status] || statusStyles.live;
  const st = modal.querySelector('[data-modal-status]');
  st.style.color = ss.color;
  st.style.borderColor = ss.border;
  st.style.background = ss.bg;
  const dotOrLock = p.status === 'private'
    ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="' + ss.color + '" stroke-width="2.2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>'
    : '<span style="width:6px; height:6px; border-radius:50%; background:' + ss.dot + '; box-shadow:0 0 8px ' + ss.dot + ';' + (ss.blink ? ' animation:blink 2s infinite;' : '') + '"></span>';
  st.innerHTML = dotOrLock + tr(ss.key);

  modal.querySelector('[data-modal-cat]').textContent = tr(catLabelKey[p.cat] || 'proj.cWeb');
  const metricEl = modal.querySelector('[data-modal-metric]');
  if (p.metric) {
    metricEl.style.display = 'inline-flex';
    metricEl.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/></svg>' + p.metric[lang];
  } else {
    metricEl.style.display = 'none';
  }
  modal.querySelector('[data-modal-title]').textContent = p.name;
  modal.querySelector('[data-modal-desc]').textContent = p.desc[lang];
  modal.querySelector('[data-modal-lbl-problem]').textContent = tr('modal.problem');
  modal.querySelector('[data-modal-lbl-solution]').textContent = tr('modal.solution');
  modal.querySelector('[data-modal-lbl-tech]').textContent = tr('modal.tech');
  modal.querySelector('[data-modal-lbl-links]').textContent = tr('modal.links');
  modal.querySelector('[data-modal-problem]').textContent = p.problem[lang];
  modal.querySelector('[data-modal-solution]').textContent = p.solution[lang];
  modal.querySelector('[data-modal-lbl-impact]').textContent = tr('modal.impact');
  modal.querySelector('[data-modal-impact]').textContent = p.impact ? p.impact[lang] : '';

  const techWrap = modal.querySelector('[data-modal-tech]');
  techWrap.innerHTML = '';
  p.tech.forEach((tech) => {
    const s = document.createElement('span');
    s.textContent = tech;
    s.style.cssText = "font-family:'JetBrains Mono',monospace; font-size:12px; padding:6px 12px; border-radius:8px; border:1px solid var(--border); background:var(--surface); color:var(--text);";
    techWrap.appendChild(s);
  });

  const linksWrap = modal.querySelector('[data-modal-links]');
  linksWrap.innerHTML = '';
  p.links.forEach((l) => {
    let el;
    if (l.type === 'private') {
      el = document.createElement('span');
      el.style.cssText = "display:inline-flex; align-items:center; gap:8px; padding:11px 18px; border-radius:11px; border:1px dashed var(--border); color:var(--muted); font-weight:600; font-size:13.5px;";
      el.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>' + tr('modal.private');
    } else if (l.type === 'quote') {
      el = document.createElement('a');
      el.href = '#contact';
      el.style.cssText = "display:inline-flex; align-items:center; gap:8px; padding:11px 18px; border-radius:11px; border:1px solid var(--border); background:var(--surface); color:var(--text); text-decoration:none; font-weight:600; font-size:13.5px; cursor:pointer;";
      el.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>' + tr('modal.quote');
      el.addEventListener('click', () => closeProject());
    } else {
      el = document.createElement('a');
      el.href = l.url || '#';
      el.target = '_blank';
      el.rel = 'noopener';
      el.style.cssText = "display:inline-flex; align-items:center; gap:8px; padding:11px 18px; border-radius:11px; background:linear-gradient(135deg,#8b5cf6,#3b82f6); color:#fff; text-decoration:none; font-weight:600; font-size:13.5px; box-shadow:0 10px 26px rgba(124,58,237,.4);";
      el.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>' + tr(l.type === 'demo' ? 'modal.demo' : 'modal.visit');
    }
    linksWrap.appendChild(el);
  });

  modal.style.display = 'flex';
  void modal.offsetWidth;
  modal.style.opacity = '1';
  panel.style.opacity = '1';
  panel.style.transform = 'none';
  panel.scrollTop = 0;
  try { document.body.style.overflow = 'hidden'; } catch (e) {}
}

function closeProject() {
  const modal = document.querySelector('[data-modal]');
  if (!modal) return;
  const panel = modal.querySelector('[data-modal-panel]');
  modal.style.opacity = '0';
  if (panel) {
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(20px) scale(.98)';
  }
  setTimeout(() => { modal.style.display = 'none'; }, 300);
  try { document.body.style.overflow = ''; } catch (e) {}
}

function setupModal() {
  const modal = document.querySelector('[data-modal]');
  if (!modal) return;
  modal.querySelector('[data-modal-backdrop]')?.addEventListener('click', closeProject);
  modal.querySelector('[data-modal-close]')?.addEventListener('click', closeProject);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProject(); });
}

function setupProjectClicks() {
  document.querySelectorAll('[data-proj]').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-projid');
      if (id) openProject(id);
    });
  });
}

function setupFilters() {
  document.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => filter(btn.getAttribute('data-filter')));
  });
}

function setupReveal() {
  let els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  const reveal = (el) => el.classList.add('is-visible');
  const check = () => {
    const vh = window.innerHeight || 800;
    els = els.filter((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.9 && rect.bottom > 0) {
        reveal(el);
        return false;
      }
      return true;
    });
    if (els.length === 0) {
      window.removeEventListener('scroll', check, true);
      window.removeEventListener('resize', check);
    }
  };
  window.addEventListener('scroll', check, true);
  window.addEventListener('resize', check);
  check();
  setTimeout(check, 160);
  setTimeout(check, 600);
  setTimeout(() => { els.slice().forEach(reveal); els = []; }, 1600);
}

function setupNavToggle() {
  const btn = document.getElementById('nav-toggle');
  const menu = document.querySelector('.nav-actions');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }));
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (form.elements['cname']?.value || '').trim();
    const email = (form.elements['cemail']?.value || '').trim();
    const msg = (form.elements['cmsg']?.value || '').trim();
    const text = encodeURIComponent('Hola Oscar, soy ' + name + ' (' + email + '). ' + msg);
    window.open('https://wa.me/' + config.whatsapp.number + '?text=' + text, '_blank');
  });
}

function init() {
  let lang = 'es';
  let theme = 'dark';
  try {
    const sl = localStorage.getItem('ol_lang');
    if (sl) lang = sl;
    const st = localStorage.getItem('ol_theme');
    if (st) theme = st;
  } catch (e) {}

  applyTheme(theme, false);
  if (lang !== 'es') applyLang(lang, false);
  filter('all');
  setupEmail();
  setupModal();
  setupProjectClicks();
  setupFilters();
  setupReveal();
  setupContactForm();
  setupNavToggle();

  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('lang-toggle')?.addEventListener('click', toggleLang);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
