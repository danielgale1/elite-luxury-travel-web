import { BRAND, JOURNEYS } from './config.js';
import { wxIcon, wxKind } from './wxicons.js';
import { DEMO, getSession, sendCode, verifyCode, signOut, myTrips, safeLink, sb, myReview, submitReview, signInPassword, signUpPassword, verifySignupCode, resendSignupCode, sendResetCode, setNewPassword, deleteAccount, sampleTrip, submitTripRequest, myRequests, demoPaid } from './data.js';

const root = document.getElementById('app');
// Image paths (the single-file preview swaps in embedded copies).
const img = n => (window.__IMG && window.__IMG[n]) || ('icons/' + n + '.png');
const withImgs = html => html.replace(/icons\/([a-z0-9-]+)\.png/g, (m, n) => img(n));

// Tiny element builder: text is always set as text, never HTML.
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) {
    if (kid === null || kid === undefined || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}
function svg(paths) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '1.75'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round');
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = paths; // static icon markup only
  return s;
}
// Icons from Lucide (lucide.dev, ISC license).
const ICON = {
  cal: "<path d=\"M8 2v4\" /> <path d=\"M16 2v4\" /> <rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /> <path d=\"M3 10h18\" /> <path d=\"M8 14h.01\" /> <path d=\"M12 14h.01\" /> <path d=\"M16 14h.01\" /> <path d=\"M8 18h.01\" /> <path d=\"M12 18h.01\" /> <path d=\"M16 18h.01\" />",
  info: "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 16v-4\" /> <path d=\"M12 8h.01\" />",
  card: "<rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\" /> <line x1=\"2\" x2=\"22\" y1=\"10\" y2=\"10\" />",
  chat: "<path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22Z\" />",
  lock: "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /> <path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />",
  chev: "<path d=\"m9 18 6-6-6-6\" />",
  plane: "<path d=\"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z\" />",
  doc: "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\" /> <path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /> <path d=\"M10 9H8\" /> <path d=\"M16 13H8\" /> <path d=\"M16 17H8\" />",
  pin: "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /> <circle cx=\"12\" cy=\"10\" r=\"3\" />",
  phone: "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\" />",
  hand: "<path d=\"M22 14a8 8 0 0 1-8 8\" /> <path d=\"M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2\" /> <path d=\"M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1\" /> <path d=\"M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10\" /> <path d=\"M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15\" />",
  mail: "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\" /> <path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\" />",
  compass: "<path d=\"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z\" /> <circle cx=\"12\" cy=\"12\" r=\"10\" />",
  bed: "<path d=\"M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8\" /> <path d=\"M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4\" /> <path d=\"M12 4v6\" /> <path d=\"M2 18h20\" />",
  clock: "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <polyline points=\"12 6 12 12 16 14\" />",
  ticket: "<path d=\"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\" /> <path d=\"M13 5v2\" /> <path d=\"M13 17v2\" /> <path d=\"M13 11v2\" />",
  star: "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />",
  camera: "<path d=\"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z\" /> <circle cx=\"12\" cy=\"13\" r=\"3\" />",
  check: "<path d=\"M20 6 9 17l-5-5\" />",
  image: "<path d=\"M16 5h6\" /> <path d=\"M19 2v6\" /> <path d=\"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5\" /> <path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" /> <circle cx=\"9\" cy=\"9\" r=\"2\" />",
  home: "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /> <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
  flag: "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\" /> <line x1=\"4\" x2=\"4\" y1=\"22\" y2=\"15\" />",
  back: "<path d=\"m15 18-6-6 6-6\" />",
  x: "<path d=\"M18 6 6 18\" /> <path d=\"m6 6 12 12\" />",
  download: "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /> <polyline points=\"7 10 12 15 17 10\" /> <line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\" />",
  share: "<path d=\"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8\" /> <polyline points=\"16 6 12 2 8 6\" /> <line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"15\" />",
  text: "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\" /> <path d=\"M13 8H7\" /> <path d=\"M17 12H7\" />"
};

function prettyPhone(p) {
  const m = (p || '').match(/^\+1(\d{3})(\d{3})(\d{4})$/);
  return m ? '+1 ' + m[1] + '-' + m[2] + '-' + m[3] : p;
}

function planeIcon() {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('fill', 'currentColor');
  s.innerHTML = '<path transform="rotate(90 12 12)" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"></path>';
  return s;
}

// Preview only: see the trip before, during and after travel.
let demoMode = 'before';
function demoBanner() {
  const set = mode => {
    demoMode = mode;
    const t = (tripsCache || [])[0];
    const s = t && parseDate(t.start_date), n = t ? (t.days || []).length : 0;
    if (mode === 'before' || !s) demoNow = null;
    else if (mode === 'during') { const d = new Date(s); d.setDate(d.getDate() + 1); d.setHours(12, 30, 0, 0); demoNow = d.getTime(); }
    else { const d = new Date(s); d.setDate(d.getDate() + n + 2); d.setHours(10, 0, 0, 0); demoNow = d.getTime(); }
    route();
  };
  const b = (mode, label) => h('button', { type: 'button', 'aria-pressed': demoMode === mode ? 'true' : 'false', onclick: () => set(mode) }, label);
  return h('div', { class: 'demo-banner' }, h('span', {}, 'Preview:'), b('before', 'Before trip'), b('during', 'During'), b('after', 'After trip'));
}

// Loading screen: the swoosh draws itself around the EL while the plane flies along it.
const LOADER_SVG = '<svg class="loader-svg" viewBox="0 0 536 458" aria-hidden="true"><defs><mask id="eltSw" maskUnits="userSpaceOnUse" x="0" y="0" width="536" height="458"><path id="eltPath" d="M210 177 C203.0 180.8 182.0 191.8 168 200 C154.0 208.2 140.7 217.2 126 226 C111.3 234.8 93.5 244.0 80 253 C66.5 262.0 55.5 269.7 45 280 C34.5 290.3 23.5 304.2 17 315 C10.5 325.8 6.3 335.0 6 345 C5.7 355.0 8.5 367.2 15 375 C21.5 382.8 31.7 388.2 45 392 C58.3 395.8 77.5 398.3 95 398 C112.5 397.7 131.7 394.3 150 390 C168.3 385.7 187.5 378.7 205 372 C222.5 365.3 239.2 357.8 255 350 C270.8 342.2 284.2 334.2 300 325 C315.8 315.8 333.3 305.5 350 295 C366.7 284.5 384.0 273.0 400 262 C416.0 251.0 430.7 242.3 446 229 C461.3 215.7 484.3 189.8 492 182" fill="none" stroke="#fff" stroke-width="44" stroke-linecap="round" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100"><animate attributeName="stroke-dashoffset" values="100;0;0" keyTimes="0;0.62;1" calcMode="spline" keySplines="0.42 0 0.38 1;0 0 1 1" dur="3.6s" repeatCount="indefinite"/></path></mask><mask id="eltCut" maskUnits="userSpaceOnUse" x="-200" y="-200" width="936" height="858"><rect x="-200" y="-200" width="936" height="858" fill="#fff"/><image href="icons/cut-mask.png" width="536" height="458" mask="url(#eltSw)"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.84;0.95;1" dur="3.6s" repeatCount="indefinite"/></image></mask></defs><image href="icons/letters-gold.png" width="536" height="458" mask="url(#eltCut)"/><g><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.84;0.95;1" dur="3.6s" repeatCount="indefinite"/><image href="icons/swoosh-gold.png" width="536" height="458" mask="url(#eltSw)"/><image href="icons/plane-static.png" x="436" y="128" width="100" height="117" opacity="0"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.615;0.645;1" dur="3.6s" repeatCount="indefinite"/></image><g opacity="0"><animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.05;0.615;0.645;1" dur="3.6s" repeatCount="indefinite"/><image href="icons/plane-sprite.png" x="-70" y="-70" width="140" height="140"/><animateMotion dur="3.6s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.62;1" calcMode="spline" keySplines="0.42 0 0.38 1;0 0 1 1"><mpath href="#eltPath"/></animateMotion></g></g><image href="icons/stems-gold.png" width="536" height="458"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.24;1" calcMode="discrete" dur="3.6s" repeatCount="indefinite"/></image></svg>';
// Sign-in screen: the same logo animation, played once.
const SIGNIN_SVG = '<svg class="signin-svg" viewBox="0 0 536 458" aria-hidden="true"><defs><mask id="eltSwS" maskUnits="userSpaceOnUse" x="0" y="0" width="536" height="458"><path id="eltPathS" d="M210 177 C203.0 180.8 182.0 191.8 168 200 C154.0 208.2 140.7 217.2 126 226 C111.3 234.8 93.5 244.0 80 253 C66.5 262.0 55.5 269.7 45 280 C34.5 290.3 23.5 304.2 17 315 C10.5 325.8 6.3 335.0 6 345 C5.7 355.0 8.5 367.2 15 375 C21.5 382.8 31.7 388.2 45 392 C58.3 395.8 77.5 398.3 95 398 C112.5 397.7 131.7 394.3 150 390 C168.3 385.7 187.5 378.7 205 372 C222.5 365.3 239.2 357.8 255 350 C270.8 342.2 284.2 334.2 300 325 C315.8 315.8 333.3 305.5 350 295 C366.7 284.5 384.0 273.0 400 262 C416.0 251.0 430.7 242.3 446 229 C461.3 215.7 484.3 189.8 492 182" fill="none" stroke="#fff" stroke-width="44" stroke-linecap="round" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100"><animate attributeName="stroke-dashoffset" values="100;0" keyTimes="0;1" calcMode="spline" keySplines="0.42 0 0.38 1" begin="0.5s" dur="2.4s" fill="freeze"/></path></mask><mask id="eltCutS" maskUnits="userSpaceOnUse" x="-200" y="-200" width="936" height="858"><rect x="-200" y="-200" width="936" height="858" fill="#fff"/><image href="icons/cut-mask.png" width="536" height="458" mask="url(#eltSwS)"/></mask></defs><image href="icons/letters-gold.png" width="536" height="458" mask="url(#eltCutS)"/><image href="icons/swoosh-gold.png" width="536" height="458" mask="url(#eltSwS)"/><image href="icons/plane-static.png" x="436" y="128" width="100" height="117" opacity="0"><animate attributeName="opacity" values="0;0;1" keyTimes="0;0.97;1" begin="0.5s" dur="2.4s" fill="freeze"/></image><g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.97;1" begin="0.5s" dur="2.4s" fill="freeze"/><image href="icons/plane-sprite.png" x="-70" y="-70" width="140" height="140"/><animateMotion begin="0.5s" dur="2.4s" fill="freeze" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.42 0 0.38 1"><mpath href="#eltPathS"/></animateMotion></g><image href="icons/stems-gold.png" width="536" height="458"><set attributeName="opacity" to="0" begin="1.44s" fill="freeze"/></image></svg>';
function loaderView(text) {
  const el = h('div', { class: 'loader', role: 'status', 'aria-label': text || 'Loading your journey' });
  el.innerHTML = withImgs('<div class="loader-mark">' + LOADER_SVG + '</div><img class="loader-word" src="icons/wordmark-gold.png" alt="Elite Luxury Travel"><div class="loader-bar"></div>');  // static markup only
  if (calm()) el.querySelector('.loader-mark').innerHTML = withImgs('<img src="icons/mark-gold.png" alt="" style="width:150px;height:auto">');
  return el;
}

const calm = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Shown above every screen of the sample trip.
let viewingSample = false;
function sampleBanner() {
  return h('div', { class: 'sample-banner' },
    h('span', {}, h('strong', {}, 'Sample trip'), ' · This is how your itinerary will look.'),
    h('a', { href: '#/explore' }, 'Close'));
}
function render(...nodes) {
  root.replaceChildren(...(DEMO ? [demoBanner()] : []), ...(viewingSample ? [sampleBanner()] : []), ...nodes);
  window.scrollTo(0, 0);
  animateIn(root);
}

// Gentle entrance: blocks rise in one after another, numbers count up.
function animateIn(scope) {
  if (calm()) return;
  const blocks = scope.querySelectorAll('.main > :not(header), .pad > *, .sched li, .list-card > *, .journeys > *, .stack > .flight');
  blocks.forEach((el, i) => { el.classList.add('rise'); el.style.animationDelay = Math.min(i, 12) * 55 + 'ms'; });
  scope.querySelectorAll('.stat strong').forEach(el => {
    const end = parseInt(el.textContent, 10); if (!(end > 0)) return;
    const t0 = performance.now(), dur = 900;
    const tick = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
    el.textContent = '0'; requestAnimationFrame(tick);
  });
}

function nav(tripId, current) {
  const base = '#/trip/' + encodeURIComponent(tripId);
  const item = (href, icon, label, key) =>
    h('a', { href, 'aria-current': current === key ? 'page' : null }, svg(ICON[icon]), label);
  return h('nav', { class: 'nav', 'aria-label': 'Main' },
    h('div', { class: 'nav-inner' },
      item(base, 'cal', 'Itinerary', 'itin'),
      item(base + '/info', 'info', 'Travel info', 'info'),
      item(base + '/pay', 'card', 'Pay', 'pay'),
      item(base + '/plan', 'compass', 'New trip', 'plan'),
      item(base + '/contact', 'chat', 'Contact', 'contact')
    ));
}

// ---------- Dates ----------
function parseDate(s) {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
// The phone's clock (it switches to local time when travelling). The preview can pretend a different moment.
let demoNow = null;
function now() { return demoNow ? new Date(demoNow) : new Date(); }
function todayLocal() { const n = now(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
function todayIndex(t) { const s = parseDate(t.start_date); return s ? Math.round((todayLocal() - s) / 86400000) : null; }
function tripState(t) {
  const i = todayIndex(t), n = (t.days || []).length;
  if (i === null || !n) return null;
  return i < 0 ? 'before' : i >= n ? 'after' : 'during';
}
function dayStatus(t, i) {
  const ti = todayIndex(t);
  if (ti === null) return 'upcoming';
  return i < ti ? 'done' : i === ti ? 'today' : 'upcoming';
}
function minutesOf(time) {
  const m = (time || '').trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!m) return null;
  let hr = +m[1]; const mi = +(m[2] || 0);
  if (m[3]) hr = (hr % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0);
  return hr * 60 + mi;
}
// Each schedule item is 'done', 'now' or 'upcoming', worked out from the day and the time.
function itemStatuses(t, i, items) {
  const ds = dayStatus(t, i);
  if (ds === 'done') return items.map(() => 'done');
  if (ds !== 'today') return items.map(() => 'upcoming');
  const n = now(), cur = n.getHours() * 60 + n.getMinutes();
  const starts = items.map(x => minutesOf(x.time));
  return items.map((x, k) => {
    const st = starts[k]; if (st === null || cur < st) return 'upcoming';
    const next = starts.slice(k + 1).find(v => v !== null);
    const over = next !== undefined ? cur >= next : cur >= st + 120;
    return over ? 'done' : 'now';
  });
}
function dayDate(t, i) { const s = parseDate(t.start_date); if (!s) return null; const d = new Date(s); d.setDate(d.getDate() + i); return d; }
function fmtDay(d) { return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }); }
function countdown(t) {
  const s = parseDate(t.start_date); if (!s) return null;
  const n = (t.days || []).length;
  const diff = Math.round((s - todayLocal()) / 86400000);
  if (diff > 1) return diff + ' days to go';
  if (diff === 1) return 'You leave tomorrow';
  if (diff === 0) return 'Your journey starts today';
  if (n && -diff < n) return 'Day ' + (1 - diff) + ' of your journey';
  if (n) return 'Welcome home';
  return null;
}

// ---------- Views ----------
// ---------- Photos ----------
function photo(url, alt, cls) {
  const src = safeLink(url || '');
  const box = h('div', { class: 'ph ' + (cls || '') });
  if (src) {
    const img = h('img', { src, alt: alt || '', loading: 'lazy', decoding: 'async', referrerpolicy: 'no-referrer' });
    img.addEventListener('error', () => { img.remove(); box.classList.add('loaded'); });
    img.addEventListener('load', () => box.classList.add('loaded'));
    box.append(img);
    if (img.complete && img.naturalWidth) box.classList.add('loaded');
  }
  return box;
}
function placeImage(t, city) {
  const p = (Array.isArray(t.places) ? t.places : []).find(x => (x.city || '').trim().toLowerCase() === (city || '').trim().toLowerCase());
  return (p && safeLink(p.image || '')) || safeLink(t.cover_image || '');
}
function cityGroups(t) {
  const days = Array.isArray(t.days) ? t.days : [];
  const groups = [];
  days.forEach((d, i) => {
    const c = (d.city || '').trim();
    const last = groups[groups.length - 1];
    if (last && last.city === c) last.items.push(i); else groups.push({ city: c, items: [i] });
  });
  return groups;
}

// ---------- Sign in, create account, forgot password ----------
// The logo animates once: the plane flies the swoosh, then the full logo stays.
let signinPlayed = false;
function signinLogo() {
  const box = h('div', { class: 'signin-mark', role: 'img', 'aria-label': BRAND.name });
  if (signinPlayed || calm()) box.innerHTML = withImgs('<img class="signin-mk" src="icons/mark-gold.png" alt="">');  // static markup only
  else box.innerHTML = withImgs(SIGNIN_SVG);
  box.append(h('img', { class: 'signin-word', src: img('wordmark-gold'), alt: '' }));
  signinPlayed = true;
  return box;
}
function authShell(title, intro, ...body) {
  window.scrollTo(0, 0);
  root.replaceChildren(h('div', { class: 'signin2' },
    h('div', { class: 'signin-photo' },
      photo(BRAND.signinImage, 'Coastline at golden hour', 'fill'),
      h('div', { class: 'shade' }),
      signinLogo()),
    h('div', { class: 'signin-sheet' },
      h('h1', {}, ...title),
      intro ? h('p', { class: 'muted', style: 'margin:12px 0 24px' }, intro) : h('div', { style: 'height:20px' }),
      ...body)));
  if (!calm()) root.querySelectorAll('.signin-sheet > *').forEach((el, i) => { el.classList.add('rise'); el.style.animationDelay = (150 + i * 70) + 'ms'; });
}

function input(id, label, type, attrs = {}) {
  const el = h('input', { id, type, required: true, ...attrs });
  const wrap = h('div', { class: 'stack', style: 'gap:8px' }, h('label', { for: id }, label), el);
  wrap.el = el;
  return wrap;
}

function passwordInput(id, label, autocomplete) {
  const w = input(id, label, 'password', { autocomplete, minlength: autocomplete === 'new-password' ? '8' : null });
  const toggle = h('button', { class: 'pw-toggle', type: 'button', 'aria-label': 'Show password', onclick: () => {
    const show = w.el.type === 'password'; w.el.type = show ? 'text' : 'password';
    toggle.textContent = show ? 'Hide' : 'Show'; toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  } }, 'Show');
  const holder = h('div', { class: 'pw-wrap' });
  w.replaceChild(holder, w.el);
  holder.append(w.el, toggle);
  return w;
}

function statusLine() { return h('p', { class: 'note', role: 'status', 'aria-live': 'polite' }); }
function setStatus(el, text, isError) { el.className = isError ? 'error' : 'note'; el.textContent = text; }
function busy(btn, on, label) { btn.disabled = on; btn.textContent = label; }
let playIntro = false;
function enterApp() { tripsCache = null; playIntro = true; location.hash = '#/'; route(); }
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function viewSignIn(msg, presetEmail) {
  const email = input('email', 'Email', 'email', { placeholder: 'you@example.com', autocomplete: 'email', value: presetEmail || '' });
  const pw = passwordInput('password', 'Password', 'current-password');
  const status = statusLine(); if (msg) setStatus(status, msg);
  const btn = h('button', { class: 'btn', type: 'submit' }, 'Sign in');
  const form = h('form', { class: 'stack', style: 'gap:16px', onsubmit: async (e) => {
    e.preventDefault();
    const v = email.el.value.trim(), p = pw.el.value;
    if (!emailOk(v) || !p) { setStatus(status, 'Please enter your email and password.', true); return; }
    if (DEMO) { enterApp(); return; }
    busy(btn, true, 'Signing in…');
    const r = await signInPassword(v, p);
    busy(btn, false, 'Sign in');
    if (r.ok) return enterApp();
    if (r.unconfirmed) { await resendSignupCode(v); return viewConfirmCode(v); }
    setStatus(status, 'That email and password don’t match. Try again or reset your password.', true);
  } }, email, pw, btn, status);
  authShell(['Your journey,', h('br'), 'in one place.'], 'Sign in to see your itinerary, hotels and travel details.',
    form,
    h('button', { class: 'link-btn', type: 'button', onclick: () => viewForgot(email.el.value.trim()) }, 'Forgot password?'),
    h('div', { class: 'auth-switch' }, h('span', {}, 'New here?'),
      h('button', { class: 'btn ghost', type: 'button', onclick: () => viewSignUp(email.el.value.trim()) }, 'Create your account'),
      h('a', { class: 'link-btn', href: '#/explore' }, 'Explore first, no account needed')));
}

function viewSignUp(presetEmail) {
  const email = input('email', 'Email', 'email', { placeholder: 'The email you gave your advisor', autocomplete: 'email', value: presetEmail || '' });
  const pw = passwordInput('password', 'Create a password', 'new-password');
  const pw2 = passwordInput('password2', 'Confirm password', 'new-password');
  const status = statusLine();
  const btn = h('button', { class: 'btn', type: 'submit' }, 'Create account');
  const form = h('form', { class: 'stack', style: 'gap:16px', onsubmit: async (e) => {
    e.preventDefault();
    const v = email.el.value.trim(), p = pw.el.value;
    if (!emailOk(v)) { setStatus(status, 'Please enter a valid email.', true); return; }
    if (p.length < 8) { setStatus(status, 'Use at least 8 characters for your password.', true); return; }
    if (p !== pw2.el.value) { setStatus(status, 'The passwords don’t match.', true); return; }
    if (DEMO) { viewConfirmCode(v); return; }
    busy(btn, true, 'Creating…');
    const r = await signUpPassword(v, p);
    busy(btn, false, 'Create account');
    if (!r.ok) { setStatus(status, /registered|exists/i.test(r.message || '') ? 'You already have an account. Please sign in.' : 'We couldn’t create your account. Please try again.', true); return; }
    if (r.needsCode) viewConfirmCode(v); else enterApp();
  } }, email, h('p', { class: 'hint' }, 'Use the same email you gave your Elite advisor so we can show your trip.'), pw, pw2, btn, status);
  authShell(['Create your', h('br'), 'account'], '', form,
    h('div', { class: 'auth-switch' }, h('span', {}, 'Already have an account?'),
      h('button', { class: 'btn ghost', type: 'button', onclick: () => viewSignIn('', email.el.value.trim()) }, 'Sign in')));
}

function codeInput() {
  return input('code', '6-digit code', 'text', { inputmode: 'numeric', autocomplete: 'one-time-code', pattern: '[0-9]*', maxlength: '8', placeholder: '123456', class: 'code-input' });
}

function viewConfirmCode(email) {
  const code = codeInput();
  const status = statusLine();
  const btn = h('button', { class: 'btn', type: 'submit' }, 'Confirm email');
  const form = h('form', { class: 'stack', style: 'gap:16px', onsubmit: async (e) => {
    e.preventDefault();
    const v = code.el.value.replace(/\D/g, '');
    if (v.length < 6) { setStatus(status, 'Please enter the code from your email.', true); return; }
    if (DEMO) return enterApp();
    busy(btn, true, 'Confirming…');
    const r = await verifySignupCode(email, v);
    busy(btn, false, 'Confirm email');
    if (r.ok) return enterApp();
    setStatus(status, 'That code didn’t work. Check the latest email or send a new code.', true);
  } }, code, btn, status);
  authShell(['Check your', h('br'), 'email'], 'We sent a 6-digit code to ' + email + '. Enter it to confirm it’s you.', form,
    h('button', { class: 'link-btn', type: 'button', onclick: async () => { await resendSignupCode(email); setStatus(status, 'A new code is on its way.'); } }, 'Send a new code'));
  setTimeout(() => code.el.focus(), 50);
}

function viewForgot(presetEmail) {
  const email = input('email', 'Email', 'email', { placeholder: 'you@example.com', autocomplete: 'email', value: presetEmail || '' });
  const status = statusLine();
  const btn = h('button', { class: 'btn', type: 'submit' }, 'Send reset code');
  const form = h('form', { class: 'stack', style: 'gap:16px', onsubmit: async (e) => {
    e.preventDefault();
    const v = email.el.value.trim();
    if (!emailOk(v)) { setStatus(status, 'Please enter a valid email.', true); return; }
    busy(btn, true, 'Sending…');
    await sendResetCode(v);
    busy(btn, false, 'Send reset code');
    viewResetPassword(v);  // same screen whether or not the email has an account
  } }, email, btn, status);
  authShell(['Reset your', h('br'), 'password'], 'Enter your email and we’ll send you a 6-digit code.', form,
    h('button', { class: 'link-btn', type: 'button', onclick: () => viewSignIn('', email.el.value.trim()) }, 'Back to sign in'));
}

function viewResetPassword(email) {
  const code = codeInput();
  const pw = passwordInput('password', 'New password', 'new-password');
  const status = statusLine();
  const btn = h('button', { class: 'btn', type: 'submit' }, 'Save new password');
  const form = h('form', { class: 'stack', style: 'gap:16px', onsubmit: async (e) => {
    e.preventDefault();
    const v = code.el.value.replace(/\D/g, ''), p = pw.el.value;
    if (v.length < 6) { setStatus(status, 'Please enter the code from your email.', true); return; }
    if (p.length < 8) { setStatus(status, 'Use at least 8 characters for your password.', true); return; }
    if (DEMO) return enterApp();
    busy(btn, true, 'Saving…');
    const r = await verifyCode(email, v);
    if (!r.ok) { busy(btn, false, 'Save new password'); setStatus(status, 'That code didn’t work. Check the latest email or send a new code.', true); return; }
    const u = await setNewPassword(p);
    busy(btn, false, 'Save new password');
    if (!u.ok) { setStatus(status, 'We couldn’t save that password. Please try a different one.', true); return; }
    enterApp();
  } }, code, pw, btn, status);
  authShell(['Choose a new', h('br'), 'password'], 'If ' + email + ' has an account, we sent it a 6-digit code.', form,
    h('button', { class: 'link-btn', type: 'button', onclick: async () => { await sendResetCode(email); setStatus(status, 'A new code is on its way.'); } }, 'Send a new code'),
    h('button', { class: 'link-btn', type: 'button', onclick: () => viewSignIn('', email) }, 'Back to sign in'));
  setTimeout(() => code.el.focus(), 50);
}

function viewTrip(t) {
  const days = Array.isArray(t.days) ? t.days : [];
  const base = '#/trip/' + encodeURIComponent(t.id);
  const cd = countdown(t);
  const groups = cityGroups(t);
  const cities = [...new Set(groups.map(g => g.city).filter(Boolean))];
  const nightsIn = c => groups.filter(g => g.city === c).reduce((n, g) => n + g.items.length, 0);
  const lastIdx = days.length - 1;
  const stays = hotelStays(t);
  const state = tripState(t);
  const tours = days.flatMap((d, i) => (Array.isArray(d.schedule) ? d.schedule : []).filter(x => x && x.tour).map(x => ({ ...x, i })));
  const others = pastTrips.filter(p => p.id !== t.id);
  // A past trip opened from the home screen gets a way back home.
  const backHome = state === 'after' && !viewingSample;
  const proposal = t.status === 'proposal';

  render(
    h('main', { class: 'main flush' },
      h('header', { class: 'hero' },
        photo(t.cover_image, t.title || 'Your trip', 'fill'),
        h('div', { class: 'shade' }),
        h('img', { class: 'hero-mark', src: img('mark-gold'), alt: BRAND.name }),
        backHome ? h('a', { class: 'round-back', href: '#/', 'aria-label': 'Back to home' }, svg(ICON.back)) : null,
        h('div', { class: 'hero-text' },
          proposal ? h('p', { class: 'hero-hi' }, 'Your proposal') : t.client_name ? h('p', { class: 'hero-hi' }, 'Hi ' + t.client_name) : null,
          h('h1', { class: 'hero-title' }, t.title || 'Your trip'),
          t.dates_text ? h('p', { class: 'hero-meta' }, t.dates_text) : null,
          proposal ? h('span', { class: 'pill' }, 'Ready to review') : cd ? h('span', { class: 'pill' }, cd) : null)),
      h('div', { class: 'pad' },
        days.length ? h('div', { class: 'stats' },
          h('div', { class: 'stat' }, h('strong', {}, String(days.length)), h('span', {}, 'Days')),
          h('div', { class: 'stat' }, h('strong', {}, String(Math.max(days.length - 1, 0))), h('span', {}, 'Nights')),
          h('div', { class: 'stat' }, h('strong', {}, String(cities.length)), h('span', {}, cities.length === 1 ? 'City' : 'Cities'))) : null,

        proposal ? proposalCard(t, base) : null,
        !proposal && state === 'during' ? todayCard(t, base) : null,
        !proposal && state === 'after' ? reviewCard(t, base) : null,

        (tours.length || stays.length) ? h('div', { class: 'quick' },
          tours.length ? h('button', { class: 'quick-btn', type: 'button', onclick: () => document.getElementById('sec-tours').scrollIntoView({ behavior: 'smooth', block: 'start' }) }, svg(ICON.ticket), h('span', {}, h('strong', {}, String(tours.length)), ' Tours')) : null,
          stays.length ? h('button', { class: 'quick-btn', type: 'button', onclick: () => document.getElementById('sec-hotels').scrollIntoView({ behavior: 'smooth', block: 'start' }) }, svg(ICON.bed), h('span', {}, h('strong', {}, String(stays.length)), ' Hotels')) : null,
          h('a', { class: 'quick-btn', href: base + '/info' }, svg(ICON.plane), h('span', {}, 'Flights'))) : null,

        cities.length ? h('section', { class: 'block' },
          h('h2', { class: 'section-title' }, 'Your places'),
          h('div', { class: 'places' }, cities.map(c => {
            const first = days.findIndex(d => (d.city || '').trim() === c);
            const n = nightsIn(c) - (days.length && (days[lastIdx].city || '').trim() === c ? 1 : 0);
            return h('a', { class: 'place', href: base + '/day/' + (first + 1) },
              photo(placeImage(t, c), c, 'fill'),
              h('div', { class: 'shade' }),
              h('span', { class: 'place-text' }, h('strong', {}, c), n > 0 ? h('span', {}, n + (n === 1 ? ' night' : ' nights')) : null));
          }))) : null,

        h('section', { class: 'block' },
          h('h2', { class: 'section-title' }, 'Day by day'),
          days.length ? h('p', { class: 'hint tap-hint' }, svg(ICON.hand || ICON.chev), 'Tap a day to see times, hotel and details') : null,
          days.length
            ? groups.map(g => h('div', { class: 'group' },
                g.city ? h('p', { class: 'group-city' }, g.city) : null,
                h('div', { class: 'days timeline' }, g.items.map(i => {
                  const d = days[i]; const dd = dayDate(t, i);
                  const st = dayStatus(t, i);
                  const plans = (Array.isArray(d.schedule) ? d.schedule : []).filter(x => x && x.title);
                  const nTours = plans.filter(x => x.tour).length;
                  return h('a', { class: 'day-row day-card ' + st, href: base + '/day/' + (i + 1), 'aria-current': st === 'today' ? 'date' : null, 'aria-label': 'Day ' + (i + 1) + ': ' + (d.title || '') + '. Open full day' },
                    h('span', { class: 'day-num' }, st === 'done' ? svg(ICON.check) : String(i + 1)),
                    h('span', { class: 'day-text' },
                      dd ? h('span', { class: 'day-date' }, fmtDay(dd), st === 'today' ? h('em', { class: 'tag today-tag' }, 'Today') : null, st === 'done' ? h('span', { class: 'sr-only' }, ' (completed)') : null) : null,
                      h('span', { class: 'day-title' }, d.title || 'Day ' + (i + 1)),
                      (d.stay && d.stay !== 'Home') ? h('span', { class: 'day-stay' }, svg(ICON.bed), d.stay) : null,
                      plans.length ? h('span', { class: 'day-plans' }, svg(ICON.clock), plans.length + (plans.length === 1 ? ' plan' : ' plans') + (nTours ? ' · ' + nTours + (nTours === 1 ? ' tour' : ' tours') : '')) : null),
                    h('span', { class: 'day-go' }, svg(ICON.chev)));
                }))))
            : h('p', { class: 'muted' }, 'Your day-by-day plan will appear here soon.')),

        tours.length ? h('section', { class: 'block', id: 'sec-tours' },
          h('h2', { class: 'section-title' }, 'Your tours & experiences'),
          h('div', { class: 'list-card' }, tours.map(x => {
            const dd = dayDate(t, x.i);
            return h('a', { class: 'list-item', href: base + '/day/' + (x.i + 1) },
              h('span', { class: 'list-icon' }, svg(ICON.ticket)),
              h('span', { class: 'day-text' },
                h('span', { class: 'day-title' }, x.title),
                h('span', { class: 'muted small' }, [dd ? fmtDay(dd) : 'Day ' + (x.i + 1), x.time].filter(Boolean).join(' · ')),
                x.note ? h('span', { class: 'muted small' }, x.note) : null),
              h('span', { class: 'chev' }, svg(ICON.chev)));
          }))) : null,

        stays.length ? h('section', { class: 'block', id: 'sec-hotels' },
          h('h2', { class: 'section-title' }, 'Your hotels'),
          h('div', { class: 'list-card' }, stays.map(st => {
            const a = dayDate(t, st.start), b = dayDate(t, st.end + 1);
            const n = st.end - st.start + 1;
            const map = mapsLink(st.address || st.name, st.address ? '' : st.city);
            return h('div', { class: 'list-item hotel' },
              h('span', { class: 'list-icon' }, svg(ICON.bed)),
              h('span', { class: 'day-text' },
                h('span', { class: 'day-title' }, st.name),
                h('span', { class: 'muted', style: 'font-size:13px' }, [st.city, (a && b) ? fmtDay(a) + ' to ' + fmtDay(b) : '', n + (n === 1 ? ' night' : ' nights')].filter(Boolean).join(' · ')),
                st.checkin ? h('span', { class: 'muted', style: 'font-size:13px' }, st.checkin) : null,
                st.conf ? h('span', { class: 'muted', style: 'font-size:13px' }, 'Confirmation ' + st.conf) : null),
              map ? h('a', { class: 'inline-link', href: map, target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Open ' + st.name + ' in Maps' }, svg(ICON.pin)) : null);
          }))) : null,

        others.length ? h('section', { class: 'block' },
          h('h2', { class: 'section-title' }, 'Previous travels'), pastList(others)) : null,

        h('a', { class: 'next-card', href: base + '/plan' },
          h('span', { class: 'list-icon' }, svg(ICON.compass)),
          h('span', { class: 'day-text' }, h('span', { class: 'day-title' }, 'Plan your next journey'), h('span', { class: 'muted', style: 'font-size:13px' }, 'Book another trip with your Elite advisor')),
          h('span', { class: 'chev' }, svg(ICON.chev))))),
    nav(t.id, 'itin'));
}


// Consecutive nights at the same hotel become one stay.
function hotelStays(t) {
  const days = Array.isArray(t.days) ? t.days : [];
  const stays = [];
  days.forEach((d, i) => {
    const name = (d.stay || '').trim();
    if (!name || name === 'Home') return;
    const last = stays[stays.length - 1];
    if (last && last.name === name && last.end === i - 1) { last.end = i; return; }
    stays.push({ name, city: (d.city || '').trim(), start: i, end: i, address: d.stay_address || '', checkin: d.checkin || '', conf: d.stay_conf || '' });
  });
  return stays;
}

function journeyLink(slug) {
  const base = safeLink(BRAND.planUrl || '');
  if (!base) return '';
  return slug ? base + (base.includes('?') ? '&' : '?') + 'journey=' + encodeURIComponent(slug) : base;
}

function journeysGrid() {
  return h('div', { class: 'journeys' }, JOURNEYS.map(j =>
    h('a', { class: 'journey', href: '#/journey/' + slugOf(j) },
      photo(j.image, j.title, 'fill'),
      h('div', { class: 'shade' }),
      h('span', { class: 'journey-text' }, h('span', {}, j.meta), h('strong', {}, j.title)))));
}

function viewPlan(t) {
  const plan = journeyLink('');
  render(
    h('main', { class: 'main' },
      h('p', { class: 'eyebrow' }, 'Your next journey'),
      h('h1', { style: 'margin-top:10px' }, 'Where to next?'),
      h('p', { class: 'muted', style: 'margin-top:12px' }, 'Pick one of our curated journeys or tell us about a trip of your own. Your advisor takes it from there.'),
      h('a', { class: 'btn', style: 'margin-top:24px', href: '#/request' }, svg(ICON.compass), 'Plan a custom trip'),
      h('h2', { class: 'section-title', style: 'margin-top:34px' }, 'Curated journeys'),
      journeysGrid()),
    t ? nav(t.id, 'plan') : navNoTrip('plan'));
}


// Local contact (driver, guide, operator) shows from 2 days before that day until it's over,
// so clients reach them on the day but still come to us first for anything else.
function contactFor(t, i, x) {
  const phone = (x.contact_phone || '').replace(/[^\d+]/g, '');
  if (!phone) return null;
  const ti = todayIndex(t);
  if (ti !== null && (i - ti > 2 || i < ti)) return null;
  return h('span', { class: 'sched-contact' },
    h('span', {}, x.contact_name || 'Local contact'),
    h('a', { class: 'mini-btn', href: 'tel:' + phone, 'aria-label': 'Call ' + (x.contact_name || 'local contact') }, svg(ICON.phone), 'Call'),
    h('a', { class: 'mini-btn', href: 'https://wa.me/' + phone.replace(/\D/g, ''), target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'WhatsApp ' + (x.contact_name || 'local contact') }, svg(ICON.chat), 'WhatsApp'));
}

function todayCard(t, base) {
  const i = todayIndex(t), d = (t.days || [])[i] || {};
  const items = Array.isArray(d.schedule) ? d.schedule.filter(x => x && (x.time || x.title)) : [];
  const st = itemStatuses(t, i, items);
  const k = st.findIndex(v => v !== 'done');
  const line = k >= 0
    ? (st[k] === 'now' ? 'Happening now: ' : 'Up next: ') + [items[k].time, items[k].title].filter(Boolean).join(' · ')
    : (d.stay && d.stay !== 'Home' ? 'Tonight: ' + d.stay : 'Enjoy the rest of your day');
  return h('a', { class: 'today-card', href: base + '/day/' + (i + 1) },
    h('span', { class: 'today-eyebrow' }, ['Today', 'Day ' + (i + 1), d.city].filter(Boolean).join(' · ')),
    h('strong', {}, d.title || 'Day ' + (i + 1)),
    h('span', { class: 'today-line' }, svg(ICON.clock), line),
    h('span', { class: 'today-go' }, 'Open today', svg(ICON.chev)));
}

function reviewCard(t, base) {
  const card = h('a', { class: 'review-card', href: base + '/review' },
    h('span', { class: 'review-stars', 'aria-hidden': 'true' }, [1, 2, 3, 4, 5].map(() => svg(ICON.star))),
    h('strong', {}, 'Welcome home' + (t.client_name ? ', ' + t.client_name : '')),
    h('span', {}, 'How was your trip? Leave a quick review and share your favourite photos.'),
    h('span', { class: 'btn' }, svg(ICON.camera), 'Review & share photos'));
  myReview(t.id).then(r => {
    if (!r) return;
    card.replaceChildren(h('strong', {}, 'Thank you for your review'), h('span', {}, 'We loved hearing about your trip. Where to next?'));
    card.href = base + '/plan';
  }).catch(() => {});
  return card;
}

// Resize on the phone before upload: faster, and the copy we keep has no GPS location data.
async function shrinkPhoto(file, max = 2000) {
  let bmp;
  try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
  catch (e) { bmp = await new Promise((ok, bad) => { const im = new Image(); im.onload = () => ok(im); im.onerror = bad; im.src = URL.createObjectURL(file); }); }
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise(ok => c.toBlob(ok, 'image/jpeg', 0.85));
}

function viewReview(t) {
  const MAX = 10;
  let rating = 0;
  const photos = [];  // { file, url }
  const starBtns = [1, 2, 3, 4, 5].map(n => h('button', { type: 'button', class: 'star', role: 'radio', 'aria-checked': 'false', 'aria-label': n + (n === 1 ? ' star' : ' stars'), onclick: () => setRating(n) }, svg(ICON.star)));
  function setRating(n) { rating = n; starBtns.forEach((b, k) => { b.setAttribute('aria-checked', k + 1 === n ? 'true' : 'false'); b.classList.toggle('on', k < n); }); }
  const text = h('textarea', { id: 'review', maxlength: '4000', placeholder: 'What did you love? Any moments that stood out?' });
  const thumbs = h('div', { class: 'thumbs' });
  const picker = h('input', { type: 'file', accept: 'image/*', multiple: true, class: 'sr-only', id: 'photos', onchange: () => {
    for (const f of picker.files) { if (photos.length >= MAX) break; if (f.type.startsWith('image/')) photos.push({ file: f, url: URL.createObjectURL(f) }); }
    picker.value = ''; drawThumbs();
  } });
  function drawThumbs() {
    thumbs.replaceChildren(...photos.map((p, k) => h('div', { class: 'thumb' },
      h('img', { src: p.url, alt: 'Photo ' + (k + 1) }),
      h('button', { type: 'button', 'aria-label': 'Remove photo ' + (k + 1), onclick: () => { URL.revokeObjectURL(p.url); photos.splice(k, 1); drawThumbs(); } }, '×'))));
    addLabel.style.display = photos.length >= MAX ? 'none' : '';
    count.textContent = photos.length ? photos.length + ' of ' + MAX + ' photos' : 'Up to ' + MAX + ' photos';
  }
  const addLabel = h('label', { for: 'photos', class: 'btn ghost add-photos' }, svg(ICON.image), 'Add photos');
  const count = h('p', { class: 'hint', style: 'margin:0' }, 'Up to ' + MAX + ' photos');
  const consent = h('input', { type: 'checkbox', id: 'consent' });
  const status = statusLine();
  const btn = h('button', { class: 'btn', type: 'submit' }, 'Send review');
  const form = h('form', { class: 'stack', style: 'gap:22px', onsubmit: async (e) => {
    e.preventDefault();
    if (!rating) { setStatus(status, 'Please choose a star rating.', true); return; }
    busy(btn, true, photos.length ? 'Preparing photos…' : 'Sending…');
    try {
      const blobs = [];
      for (const p of photos) blobs.push(await shrinkPhoto(p.file));
      const r = await submitReview(t, { rating, text: text.value.trim(), consent: consent.checked, photos: blobs },
        (d, n) => { btn.textContent = 'Uploading photo ' + d + ' of ' + n + '…'; });
      if (!r.ok) throw new Error(r.message);
      photos.forEach(p => URL.revokeObjectURL(p.url));
      viewReviewThanks(t, rating);
    } catch (err) {
      busy(btn, false, 'Send review');
      setStatus(status, 'We couldn’t send your review. Please check your connection and try again.', true);
    }
  } },
    h('div', { class: 'stack', style: 'gap:10px' }, h('span', { class: 'field-label', id: 'rate-label' }, 'Your rating'), h('div', { class: 'stars', role: 'radiogroup', 'aria-labelledby': 'rate-label' }, starBtns)),
    h('div', { class: 'stack', style: 'gap:8px' }, h('label', { for: 'review' }, 'Your review'), text),
    h('div', { class: 'stack', style: 'gap:10px' }, h('span', { class: 'field-label' }, 'Your photos'), thumbs, picker, addLabel, count),
    h('label', { class: 'check' }, consent, h('span', {}, 'Elite Luxury Travel may share my review and photos on its website and social media.')),
    btn, status);
  render(
    h('main', { class: 'main' },
      t && t.title ? h('p', { class: 'eyebrow page-eyebrow' }, t.title) : null,
      h('h1', {}, 'How was your trip?'),
      h('p', { class: 'muted', style: 'margin:12px 0 26px' }, 'Your review helps us plan even better journeys. It only takes a minute.'),
      form),
    nav(t.id, 'itin'));
  drawThumbs();
}

function viewReviewThanks(t, rating) {
  const g = safeLink(BRAND.googleReviewUrl || '');
  render(
    h('main', { class: 'main' },
      h('div', { class: 'thanks' },
        h('span', { class: 'list-icon big' }, svg(ICON.check)),
        h('h1', {}, 'Thank you' + (t.client_name ? ', ' + t.client_name : '') + '!'),
        h('p', { class: 'muted' }, 'We’ve received your review' + '. Jordan and the team will love reading it.'),
        (g && rating >= 4) ? h('a', { class: 'btn', href: g, target: '_blank', rel: 'noopener noreferrer' }, svg(ICON.star), 'Also share it on Google') : null,
        h('a', { class: (g && rating >= 4) ? 'btn ghost' : 'btn', href: '#/trip/' + encodeURIComponent(t.id) + '/plan' }, svg(ICON.compass), 'Plan your next journey'))),
    nav(t.id, 'itin'));
}

function mapsLink(place, city) {
  if (!place || place === 'Home') return '';
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([place, city].filter(Boolean).join(', '));
}

function viewDay(t, n) {
  const days = Array.isArray(t.days) ? t.days : [];
  const i = Math.min(Math.max(n - 1, 0), Math.max(days.length - 1, 0));
  const d = days[i] || {};
  const base = '#/trip/' + encodeURIComponent(t.id);
  const dd = dayDate(t, i);
  const map = d.stay_address ? mapsLink(d.stay_address, '') : mapsLink(d.stay, d.city);
  const sched = Array.isArray(d.schedule) ? d.schedule.filter(x => x && (x.time || x.title)) : [];
  const stats = itemStatuses(t, i, sched);
  render(
    h('main', { class: 'main flush' },
      h('header', { class: 'hero day-hero' },
        photo(safeLink(d.image || '') || placeImage(t, d.city), d.city || '', 'fill'),
        h('div', { class: 'shade' }),
        h('a', { class: 'round-back', href: base, 'aria-label': 'All days' }, svg(ICON.back)),
        h('div', { class: 'hero-text' },
          h('p', { class: 'hero-hi' }, ['Day ' + (i + 1), d.city, dd ? fmtDay(dd) : ''].filter(Boolean).join(' · ')),
          h('h1', { class: 'hero-title', style: 'font-size:36px' }, d.title || 'Day ' + (i + 1)))),
      h('div', { class: 'pad' },
        d.body ? h('p', { class: 'day-body' }, d.body) : null,
        sched.length ? h('section', { class: 'block', style: 'margin-top:26px' },
          h('h2', { class: 'section-title' }, dd ? 'Schedule · ' + fmtDay(dd) : 'Schedule'),
          h('ol', { class: 'sched' }, sched.map((x, k) =>
            h('li', { class: stats[k] },
              h('span', { class: 'sched-time' }, x.time || ''),
              h('span', { class: 'sched-text' }, h('strong', {}, x.title || '', x.tour ? h('em', { class: 'tag' }, 'Tour') : null, stats[k] === 'now' ? h('em', { class: 'tag now-tag' }, 'Now') : null, stats[k] === 'done' ? h('span', { class: 'sr-only' }, ' (done)') : null), x.note ? h('span', {}, x.note) : null,
                contactFor(t, i, x)))))) : null,
        (d.stay || d.included) ? h('div', { class: 'facts' },
          d.stay ? h('div', { class: 'fact fact-row' },
            h('span', { class: 'list-icon' }, svg(ICON.bed)),
            h('span', { class: 'fact-text' }, h('span', {}, 'Tonight'), h('span', {}, d.stay),
              d.stay_address ? h('span', { class: 'fact-sub' }, d.stay_address) : null,
              (d.checkin && (i === 0 || (days[i - 1] || {}).stay !== d.stay)) ? h('span', { class: 'fact-sub' }, d.checkin) : null,
              map ? h('a', { class: 'inline-link', href: map, target: '_blank', rel: 'noopener noreferrer' }, svg(ICON.pin), 'Open in Maps') : null)) : null,
          d.included ? h('div', { class: 'fact fact-row' },
            h('span', { class: 'list-icon' }, svg(ICON.check)),
            h('span', { class: 'fact-text' }, h('span', {}, 'Included'), h('span', {}, d.included))) : null)
          : h('div', { style: 'height:22px' }),
        h('div', { class: 'pager' },
          h('a', { class: 'btn ghost', href: base + '/day/' + Math.max(1, i), 'aria-disabled': i === 0 ? 'true' : null }, '‹  Previous'),
          h('a', { class: 'btn', href: base + '/day/' + Math.min(days.length, i + 2), 'aria-disabled': i >= days.length - 1 ? 'true' : null }, 'Next day  ›')))),
    nav(t.id, 'itin'));
}

function viewTrips(trips) {
  render(h('main', { class: 'main' },
    h('p', { class: 'muted' }, 'Welcome back'),
    h('h1', {}, 'Your trips'),
    h('div', { class: 'rule' }),
    h('div', { class: 'stack' }, trips.map(t =>
      h('a', { class: 'trip-card', href: '#/trip/' + encodeURIComponent(t.id) },
        h('span', { class: 'day-city' }, t.dates_text || ''),
        h('h2', {}, t.title || 'Your trip'),
        h('span', { class: 'muted' }, t.subtitle || '')))),
    accountFooter(40)));
}

function contactButtons(subject) {
  const phone = (BRAND.phone || '').replace(/[^\d+]/g, '');
  const wa = (BRAND.whatsapp || '').replace(/\D/g, '');
  return h('div', { class: 'stack' },
    wa ? h('a', { class: 'btn', href: 'https://wa.me/' + wa, target: '_blank', rel: 'noopener noreferrer' }, svg(ICON.chat), 'WhatsApp us') : null,
    phone ? h('a', { class: wa ? 'btn ghost' : 'btn', href: 'tel:' + phone }, svg(ICON.phone), 'Call ' + (BRAND.advisor ? BRAND.advisor.split(' ')[0] : 'us')) : null,
    h('a', { class: (wa || phone) ? 'btn ghost' : 'btn', href: 'mailto:' + BRAND.email + '?subject=' + encodeURIComponent(subject || 'Planning a trip') }, svg(ICON.mail), 'Email us'));
}

// Home when there is no upcoming trip: same look as the trip screen, with an empty itinerary,
// Book now, and the client's previous travels.
let guestMode = false;  // browsing without an account (Explore first)
function navNoTrip(current) {
  const item = (href, icon, label, key) => h('a', { href, 'aria-current': current === key ? 'page' : null }, svg(ICON[icon]), label);
  return h('nav', { class: 'nav', 'aria-label': 'Main' },
    h('div', { class: 'nav-inner' },
      item(guestMode ? '#/explore' : '#/', 'cal', 'Itinerary', 'itin'),
      item('#/home/info', 'info', 'Travel info', 'info'),
      item('#/home/pay', 'card', 'Pay', 'pay'),
      item('#/home/plan', 'compass', 'New trip', 'plan'),
      item('#/home/contact', 'chat', 'Contact', 'contact')));
}
const callLink = () => safeLink(BRAND.callUrl || '');
function bookButtons(primaryLabel) {
  const plan = journeyLink(''), call = callLink();
  return h('div', { class: 'stack', style: 'margin-top:16px' },
    h('a', { class: 'btn', href: '#/request' }, svg(ICON.compass), primaryLabel || 'Book now'),
    call ? h('a', { class: 'btn ghost', href: call, target: '_blank', rel: 'noopener noreferrer' }, svg(ICON.cal), 'Book a call') : null);
}
function pastList(past) {
  return h('div', { class: 'stack' }, past.map(t =>
    h('a', { class: 'past-card', href: '#/trip/' + encodeURIComponent(t.id) },
      photo(t.cover_image, t.title || 'Trip', 'past-ph'),
      h('span', { class: 'day-text' },
        h('span', { class: 'day-date' }, t.dates_text || ''),
        h('span', { class: 'day-title' }, t.title || 'Your trip'),
        h('span', { class: 'past-tag' }, svg(ICON.check), 'Completed')),
      h('span', { class: 'day-go' }, svg(ICON.chev)))));
}
function viewNoTrip(past, guest) {
  navTrip = null;
  const req = !guest && requestsCache[0];
  render(
    h('main', { class: 'main flush' },
      h('header', { class: 'hero' },
        photo((JOURNEYS[0] && JOURNEYS[0].image) || BRAND.signinImage, 'Your next journey', 'fill'),
        h('div', { class: 'shade' }),
        h('img', { class: 'hero-mark', src: img('mark-gold'), alt: BRAND.name }),
        h('div', { class: 'hero-text' },
          h('p', { class: 'hero-hi' }, guest ? 'Welcome to ' + BRAND.name : (past.length ? 'Welcome back' : 'Welcome')),
          h('h1', { class: 'hero-title' }, req ? 'Your trip is in the works' : 'No upcoming trip'),
          h('p', { class: 'hero-meta' }, req ? 'Jordan is preparing your proposal' : 'Your next journey starts here'),
          req ? h('span', { class: 'pill' }, 'Request received') : h('a', { class: 'pill pill-cta', href: '#/request' }, 'Book now'))),
      h('div', { class: 'pad' },
        h('div', { class: 'stats' },
          h('div', { class: 'stat' }, h('strong', {}, '0'), h('span', {}, 'Upcoming')),
          h('div', { class: 'stat' }, h('strong', {}, String(past.length)), h('span', {}, past.length === 1 ? 'Past trip' : 'Past trips')),
          h('div', { class: 'stat' }, h('strong', {}, String(JOURNEYS.length)), h('span', {}, 'Journeys'))),

        h('section', { class: 'block' },
          h('h2', { class: 'section-title' }, 'Your itinerary'),
          req ? requestCard(req) : h('div', { class: 'empty-card' },
            h('span', { class: 'list-icon' }, svg(ICON.cal)),
            h('strong', {}, 'No itinerary yet'),
            h('span', {}, 'Once you book, your day-by-day plan, hotels and flights will appear right here.'),
            bookButtons('Book now'),
            h('a', { class: 'empty-link', href: '#/trip/sample' }, 'See a sample itinerary', svg(ICON.chev)))),

        h('section', { class: 'block' },
          h('h2', { class: 'section-title' }, 'Previous travels'),
          past.length ? pastList(past)
            : h('p', { class: 'muted' }, 'Trips you take with us are kept here, with your itinerary, photos and review.')),

        h('section', { class: 'block' },
          h('h2', { class: 'section-title' }, 'Explore journeys'),
          h('div', { class: 'places' }, JOURNEYS.map(j =>
            h('a', { class: 'place', href: '#/journey/' + slugOf(j) },
              photo(j.image, j.title, 'fill'),
              h('div', { class: 'shade' }),
              h('span', { class: 'place-text' }, h('strong', {}, j.title), h('span', {}, j.meta)))))),

        accountFooter(40))),
    navNoTrip('itin'));
}
function viewNoTripTab(kind) {
  const info = kind === 'info';
  render(
    h('main', { class: 'main' },
      h('h1', {}, info ? 'Travel info' : 'Payments'),
      h('div', { class: 'empty-card', style: 'margin-top:22px' },
        h('span', { class: 'list-icon' }, svg(ICON[info ? 'plane' : 'card'])),
        h('strong', {}, 'Nothing here yet'),
        h('span', {}, info ? 'Your flights, travel documents and the weather for each stop appear here once your trip is booked.'
                           : 'Your payment schedule and secure payment link appear here once you book. We never ask for card details in the app.'),
        bookButtons('Book now'))),
    navNoTrip(kind));
}

// ---------- Travel info: flights, documents, weather ----------
const WX = { 0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Cloudy', 45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 95: 'Thunderstorms', 96: 'Thunderstorms', 99: 'Thunderstorms' };

async function loadWeather(city, box) {
  const key = 'elt_wx_' + city;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (cached) return drawWeather(city, cached, box);
  } catch (e) {}
  try {
    const g = await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&name=' + encodeURIComponent(city)).then(r => r.json());
    const p = g.results && g.results[0];
    if (!p) throw new Error('not found');
    const f = await fetch('https://api.open-meteo.com/v1/forecast?daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto&temperature_unit=fahrenheit&latitude=' + p.latitude + '&longitude=' + p.longitude).then(r => r.json());
    try { sessionStorage.setItem(key, JSON.stringify(f.daily)); } catch (e) {}
    drawWeather(city, f.daily, box);
  } catch (e) {
    box.className = 'wx-card';
    box.replaceChildren(h('p', { class: 'muted' }, 'Weather for ' + city + ' isn’t available right now.'));
  }
}
function drawWeather(city, d, box) {
  const n = d.time.length;
  const lo = Math.min(...d.temperature_2m_min), hi = Math.max(...d.temperature_2m_max);
  const span = Math.max(hi - lo, 1);
  const k0 = wxKind(d.weather_code[0]);
  box.className = 'wx-card wx-' + k0;
  box.replaceChildren(
    h('div', { class: 'wx-now' },
      h('div', {},
        h('p', { class: 'wx-city' }, city),
        h('p', { class: 'wx-big' }, Math.round(d.temperature_2m_max[0]) + '°'),
        h('p', { class: 'wx-sum' }, (WX[d.weather_code[0]] || '') + ' · L ' + Math.round(d.temperature_2m_min[0]) + '°')),
      wxIcon(d.weather_code[0], 'big')),
    h('ul', { class: 'wx-list' }, d.time.map((day, i) => {
      const dt = new Date(day + 'T12:00:00');
      const a = Math.round(d.temperature_2m_min[i]), z = Math.round(d.temperature_2m_max[i]);
      return h('li', {},
        h('span', { class: 'wx-label' }, i === 0 ? 'Today' : dt.toLocaleDateString(undefined, { weekday: 'short' })),
        wxIcon(d.weather_code[i]),
        h('span', { class: 'wx-desc' }, WX[d.weather_code[i]] || ''),
        h('span', { class: 'wx-low' }, a + '°'),
        h('span', { class: 'wx-bar', 'aria-hidden': 'true' }, h('span', { style: 'left:' + ((a - lo) / span * 100).toFixed(1) + '%;right:' + ((hi - z) / span * 100).toFixed(1) + '%' })),
        h('span', { class: 'wx-temp' }, z + '°'));
    })));
}

function section(title, ...kids) {
  return h('section', { class: 'info-section' }, h('h2', { class: 'section-title' }, title), ...kids);
}

function viewInfo(t) {
  const flights = Array.isArray(t.flights) ? t.flights : [];
  const docs = docsList(t, '#/trip/' + encodeURIComponent(t.id));
  saveOffline((Array.isArray(t.documents) ? t.documents : []).map(d => safeLink(d.url || '')).filter(Boolean));
  const cities = [...new Set((t.days || []).map(d => (d.city || '').trim()).filter(Boolean))];
  const wxCard = h('div', { class: 'wx-card' }, h('p', { class: 'muted' }, 'Loading weather…'));
  let wxCity = cities[0];
  const wxChips = h('div', { class: 'chips', role: 'tablist', 'aria-label': 'City' });
  const drawChips = () => wxChips.replaceChildren(...cities.map(c => h('button', { type: 'button', role: 'tab', class: 'chip', 'aria-selected': c === wxCity ? 'true' : 'false', onclick: () => { wxCity = c; drawChips(); loadWeather(c, wxCard); } }, c)));
  drawChips();
  render(
    h('main', { class: 'main' },
      t.title ? h('p', { class: 'eyebrow page-eyebrow' }, t.title) : null,
      h('h1', {}, 'Travel info'),
      section('Flights',
        flights.length ? h('div', { class: 'stack' }, flights.map(f => {
          const code = s => ((s || '').match(/\(([A-Z]{3})\)/) || [])[1] || '';
          const city = s => (s || '').replace(/\s*\([A-Z]{3}\)\s*/, '').trim();
          return h('div', { class: 'flight' },
            h('div', { class: 'flight-route' },
              h('span', { class: 'flight-end' }, h('strong', {}, code(f.from) || city(f.from) || '—'), h('span', {}, city(f.from))),
              h('span', { class: 'flight-line' }, planeIcon()),
              h('span', { class: 'flight-end right' }, h('strong', {}, code(f.to) || city(f.to) || '—'), h('span', {}, city(f.to)))),
            h('div', { class: 'flight-meta' },
              h('span', {}, [f.flight, f.when].filter(Boolean).join(' · ')),
              f.flight ? h('a', { class: 'inline-link', href: 'https://www.google.com/search?q=' + encodeURIComponent(f.flight + ' flight status'), target: '_blank', rel: 'noopener noreferrer' }, 'Status') : null),
            f.ref || safeLink(f.checkin || '') ? h('div', { class: 'flight-ref' },
              f.ref ? h('span', {}, 'Booking code ', h('strong', {}, f.ref)) : null,
              safeLink(f.checkin || '') ? h('a', { class: 'inline-link', href: safeLink(f.checkin), target: '_blank', rel: 'noopener noreferrer' }, 'Check in') : null) : null);
        }))
          : h('p', { class: 'muted' }, 'Your flight details will appear here once booked.'),
        flights.length ? h('p', { class: 'muted small', style: 'margin-top:12px' }, 'Online check-in opens 24 hours before each flight. At the airport you only need your passport.') : null),
      section('Tickets & documents',
        docs.length ? h('div', { class: 'list-card' }, docs)
          : h('p', { class: 'muted' }, 'Tickets, vouchers and confirmations will appear here as each part is booked.')),
      tripState(t) === 'after' ? null : section('Weather this week', ...(cities.length ? [cities.length > 1 ? wxChips : null, wxCard] : [h('p', { class: 'muted' }, 'Weather will appear once your itinerary is ready.')]))),
    nav(t.id, 'info'));
  if (wxCity && tripState(t) !== 'after') loadWeather(wxCity, wxCard);
}

function viewPayLink(t) {
  const link = safeLink(t.pay_link || '');
  render(
    h('main', { class: 'main' },
      t.title ? h('p', { class: 'eyebrow page-eyebrow' }, t.title) : null,
      h('h1', {}, 'Pay for your trip'),
      link
        ? h('div', { class: 'paycard' },
            h('div', { class: 'stack', style: 'gap:6px' },
              h('span', { class: 'muted', style: 'font-size:13px' }, 'Due now'),
              h('span', { class: 'amount' }, t.pay_amount || 'See secure checkout'),
              t.pay_due ? h('span', { class: 'muted', style: 'font-size:13px' }, t.pay_due) : null),
            h('a', { class: 'btn', href: link, target: '_blank', rel: 'noopener noreferrer' }, svg(ICON.lock), 'Pay securely'),
            h('span', { class: 'note' }, 'Secure checkout. We never see your card details.'))
        : h('div', { class: 'paycard' },
            h('span', { class: 'list-icon big' }, svg(ICON.lock)),
            h('span', { class: 'amount', style: 'font-size:30px' }, tripState(t) === 'after' ? 'All settled' : 'Nothing to pay yet'),
            h('span', { class: 'muted' }, tripState(t) === 'after' ? 'There’s nothing left to pay for this trip.' : 'When it’s time to book, your secure payment link will appear here.')),
      h('div', { class: 'stack', style: 'margin-top:28px;gap:8px' },
        h('strong', { style: 'font-size:14px' }, 'Paid so far'),
        h('span', { class: 'muted' }, t.paid_note || 'No payments yet.'))),
    nav(t.id, 'pay'));
}

function viewContact(t) {
  const phone = (BRAND.phone || '').replace(/[^\d+]/g, '');
  const wa = (BRAND.whatsapp || '').replace(/\D/g, '');
  render(
    h('main', { class: 'main' },
      t && t.title ? h('p', { class: 'eyebrow page-eyebrow' }, t.title) : null,
      h('h1', {}, 'We’re here for you'),
      h('p', { class: 'muted', style: 'margin-top:12px' }, 'Questions before you go, or help while you travel. Reach your Elite team any time.'),
      BRAND.advisor ? h('div', { class: 'advisor' },
        h('span', { class: 'advisor-mark' }, h('img', { src: img('mark-gold'), alt: '' })),
        h('span', { class: 'day-text' }, h('span', { class: 'muted', style: 'font-size:12px' }, 'Your travel advisor'), h('span', { class: 'day-title' }, BRAND.advisor), h('span', { class: 'muted', style: 'font-size:13px' }, BRAND.name))) : null,
      h('div', { class: 'stack', style: 'margin-top:28px' },
        wa ? h('a', { class: 'btn', href: 'https://wa.me/' + wa, target: '_blank', rel: 'noopener noreferrer' }, svg(ICON.chat), 'WhatsApp us') : null,
        phone ? h('a', { class: wa ? 'btn ghost' : 'btn', href: 'tel:' + phone }, svg(ICON.phone), 'Call ' + (BRAND.advisor ? BRAND.advisor.split(' ')[0] : 'us')) : null,
        phone ? h('a', { class: 'btn ghost', href: 'sms:' + phone }, svg(ICON.chat), 'Text us') : null,
        h('a', { class: (wa || phone) ? 'btn ghost' : 'btn', href: 'mailto:' + BRAND.email + '?subject=' + encodeURIComponent((t && t.title) || 'My trip') }, svg(ICON.mail), 'Email us')),
      h('p', { class: 'note', style: 'margin-top:16px' }, [BRAND.phoneDisplay || prettyPhone(phone), BRAND.email].filter(Boolean).join('  ·  ')),
      accountFooter(48)),
    t ? nav(t.id, 'contact') : navNoTrip('contact'));
}

// Sign out, privacy policy and delete account: shown at the bottom of the main screens.
function accountFooter(top = 40) {
  if (viewingSample) return null;
  if (guestMode) return h('div', { class: 'account-foot', style: 'margin-top:' + top + 'px' },
    h('a', { class: 'btn ghost', href: '#/' }, 'Sign in or create your account'),
    h('div', { class: 'account-links' }, BRAND.privacyUrl ? h('a', { href: BRAND.privacyUrl, target: '_blank', rel: 'noopener noreferrer' }, 'Privacy policy') : null));
  return h('div', { class: 'account-foot', style: 'margin-top:' + top + 'px' },
    h('button', { class: 'btn ghost', type: 'button', onclick: doSignOut }, 'Sign out'),
    h('div', { class: 'account-links' },
      BRAND.privacyUrl ? h('a', { href: BRAND.privacyUrl, target: '_blank', rel: 'noopener noreferrer' }, 'Privacy policy') : null,
      h('a', { href: '#/account/delete' }, 'Delete account')));
}

function viewDeleteAccount() {
  const msg = h('p', { class: 'note', role: 'status', style: 'margin-top:14px' });
  const btn = h('button', { class: 'btn danger', type: 'button' }, 'Delete my account');
  btn.onclick = async () => {
    btn.disabled = true; btn.textContent = 'Deleting…'; msg.textContent = '';
    const r = await deleteAccount();
    if (!r.ok) { btn.disabled = false; btn.textContent = 'Delete my account'; msg.textContent = 'We couldn’t delete your account. Please try again or email ' + BRAND.email + '.'; return; }
    tripsCache = null;
    history.replaceState(null, '', location.pathname + location.search);
    render(h('main', { class: 'main' },
      h('h1', {}, 'Your account is deleted'),
      h('p', { class: 'muted', style: 'margin-top:14px' }, 'Your login, reviews and photos have been removed. Thank you for travelling with us.'),
      h('div', { class: 'stack', style: 'margin-top:28px' }, h('button', { class: 'btn', type: 'button', onclick: () => viewSignIn() }, 'Done'))));
  };
  render(h('main', { class: 'main' },
    h('h1', {}, 'Delete your account?'),
    h('p', { class: 'muted', style: 'margin-top:14px' }, 'This permanently removes your login, your reviews and the photos you uploaded. It can’t be undone.'),
    h('p', { class: 'muted', style: 'margin-top:10px' }, 'Your booking records stay with Elite Luxury Travel so we can look after your trip. To have those removed too, email ' + BRAND.email + '.'),
    h('div', { class: 'stack', style: 'margin-top:28px' }, btn, h('a', { class: 'btn ghost', href: '#/' }, 'Keep my account')),
    msg));
}

async function doSignOut() {
  await signOut();
  tripsCache = null;
  location.hash = '';
  viewSignIn();
}


// ---------- Book and pay in the app ----------
// Journeys open inside the app, clients send a trip request, Jordan's proposal appears in the app,
// and payments open a secure checkout (Fora or Stripe) inside the app. The app never handles card numbers.
const slugOf = j => (j.url || '').split('/').pop() || '';
const journeyBySlug = s => JOURNEYS.find(j => slugOf(j) === s);
let navTrip = null;        // trip whose tabs show at the bottom (null = the no-trip tabs)
const navFor = key => navTrip ? nav(navTrip, key) : navNoTrip(key);
let requestsCache = [];
let sessionEmail = '';
let lastRequestEmail = '';

// Opens an outside page (secure checkout, call calendar, PDF) inside the app where possible.
function openInApp(url) {
  const B = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser;
  if (B) { B.open({ url, presentationStyle: 'popover' }); return; }
  window.open(url, '_blank', 'noopener');
}

function viewJourney(slug) {
  const j = journeyBySlug(slug);
  if (!j) { location.hash = '#/home/plan'; return; }
  const call = callLink();
  const steps = [['Send a request', 'Tell us your dates, who’s travelling and what you love.'],
    ['Get your proposal', 'Jordan tailors the route, hotels and experiences, and sends it here.'],
    ['Accept and pay securely', 'Pay your deposit in the app. We never see your card.'],
    ['Travel with everything in one place', 'Itinerary, tickets, receipts and your advisor, all in the app.']];
  render(
    h('main', { class: 'main flush' },
      h('header', { class: 'hero' },
        photo(j.image, j.title, 'fill'),
        h('div', { class: 'shade' }),
        h('a', { class: 'round-back', href: '#/home/plan', 'aria-label': 'Back', onclick: (e) => { if (history.length > 1) { e.preventDefault(); history.back(); } } }, svg(ICON.back)),
        h('div', { class: 'hero-text' },
          h('p', { class: 'hero-hi' }, j.meta),
          h('h1', { class: 'hero-title' }, j.title),
          j.from ? h('span', { class: 'pill' }, j.from) : null)),
      h('div', { class: 'pad' },
        h('p', { class: 'muted', style: 'margin-top:24px' }, 'A private journey, shaped entirely around you. Every hotel, guide and transfer is chosen by your advisor and can be changed to suit your pace, dates and budget.'),
        h('section', { class: 'block' },
          h('h2', { class: 'section-title' }, 'How booking works'),
          h('ol', { class: 'steps' }, steps.map(([a, b]) => h('li', {}, h('strong', {}, a), h('span', {}, b))))),
        h('div', { class: 'stack', style: 'margin-top:26px' },
          h('a', { class: 'btn', href: '#/request/' + slug }, svg(ICON.compass), 'Request this journey'),
          call ? h('a', { class: 'btn ghost', href: call, target: '_blank', rel: 'noopener noreferrer' }, svg(ICON.cal), 'Book a call first')
            : null,
          safeLink(j.url) ? h('a', { class: 'empty-link', href: j.url, target: '_blank', rel: 'noopener noreferrer' }, 'Full day-by-day on our website', svg(ICON.chev)) : null))),
    navFor('plan'));
}

function field(id, label, el) { return h('div', { class: 'stack', style: 'gap:8px' }, h('label', { for: id }, label), el); }

function viewRequest(slug) {
  const j = slug ? journeyBySlug(slug) : null;
  const sel = h('select', { id: 'rq-journey' }, h('option', { value: '' }, 'A custom trip'),
    ...JOURNEYS.map(x => h('option', { value: slugOf(x), selected: j === x ? true : null }, x.title)));
  const where = h('input', { id: 'rq-where', type: 'text', maxlength: '200', placeholder: 'Countries, cities, or “surprise me”' });
  const whereWrap = field('rq-where', 'Where would you like to go?', where);
  const syncWhere = () => { whereWrap.style.display = sel.value ? 'none' : ''; };
  sel.onchange = syncWhere; syncWhere();
  const when = h('input', { id: 'rq-when', type: 'text', maxlength: '120', placeholder: 'e.g. May 2027, about 10 nights' });
  const adults = h('input', { id: 'rq-adults', type: 'number', min: '1', max: '20', value: '2', inputmode: 'numeric' });
  const kids = h('input', { id: 'rq-kids', type: 'number', min: '0', max: '20', value: '0', inputmode: 'numeric' });
  const budget = h('select', { id: 'rq-budget' }, ...['Not sure yet', 'Under $5,000', '$5,000 to $10,000', '$10,000 to $20,000', '$20,000 and up'].map(v => h('option', {}, v)));
  const occasion = h('select', { id: 'rq-occ' }, ...['No special occasion', 'Honeymoon', 'Anniversary', 'Birthday', 'Family trip', 'Something else'].map(v => h('option', {}, v)));
  const notes = h('textarea', { id: 'rq-notes', maxlength: '2000', placeholder: 'Hotels you love, must-sees, pace, dietary needs…' });
  const name = input('rq-name', 'Your name', 'text', { autocomplete: 'name', maxlength: '120' });
  const email = input('rq-email', 'Email', 'email', { autocomplete: 'email', value: sessionEmail || '' });
  const phone = input('rq-phone', 'Phone or WhatsApp (optional)', 'tel', { autocomplete: 'tel', required: null, maxlength: '40' });
  let via = 'WhatsApp';
  const viaBox = h('div', { class: 'chips', role: 'radiogroup', 'aria-label': 'Best way to reach you' });
  const drawVia = () => viaBox.replaceChildren(...['WhatsApp', 'Call', 'Email'].map(v =>
    h('button', { type: 'button', class: 'chip', role: 'radio', 'aria-checked': v === via ? 'true' : 'false', 'aria-selected': v === via ? 'true' : 'false', onclick: () => { via = v; drawVia(); } }, v)));
  drawVia();
  const status = statusLine();
  const btn = h('button', { class: 'btn', type: 'submit' }, 'Send request');
  const form = h('form', { class: 'stack', style: 'gap:20px;margin-top:24px', novalidate: true, onsubmit: async (e) => {
    e.preventDefault();
    const em = email.el.value.trim();
    if (!sel.value && !where.value.trim()) { setStatus(status, 'Tell us where you’d like to go, or pick one of our journeys.', true); return; }
    if (!name.el.value.trim()) { setStatus(status, 'Please add your name.', true); return; }
    if (!emailOk(em)) { setStatus(status, 'Please enter a valid email so Jordan can send your proposal.', true); return; }
    busy(btn, true, 'Sending…');
    const jj = sel.value ? journeyBySlug(sel.value) : null;
    const r = await submitTripRequest({
      journey: jj ? jj.title : 'Custom trip', destination: where.value.trim(), dates: when.value.trim(),
      adults: Math.max(1, parseInt(adults.value, 10) || 1), children: Math.max(0, parseInt(kids.value, 10) || 0),
      budget: budget.value, occasion: occasion.value, notes: notes.value.trim(),
      name: name.el.value.trim(), email: em, phone: phone.el.value.trim(), contact_via: via });
    if (!r.ok) { busy(btn, false, 'Send request'); setStatus(status, 'We couldn’t send your request. Please check your connection and try again.', true); return; }
    lastRequestEmail = em; tripsCache = null;
    location.hash = '#/request/sent';
  } },
    field('rq-journey', 'Journey', sel), whereWrap,
    field('rq-when', 'When would you like to travel?', when),
    h('div', { class: 'row2' }, field('rq-adults', 'Adults', adults), field('rq-kids', 'Children', kids)),
    field('rq-budget', 'Budget per person', budget),
    field('rq-occ', 'Celebrating anything?', occasion),
    field('rq-notes', 'Anything else we should know?', notes),
    h('h2', { class: 'section-title', style: 'margin-top:8px' }, 'Your details'),
    name, email, phone,
    h('div', { class: 'stack', style: 'gap:8px' }, h('span', { class: 'field-label' }, 'Best way to reach you'), viaBox),
    btn, status,
    h('p', { class: 'note' }, 'No payment now. Jordan replies with a proposal you can review, accept and pay for right here in the app.'));
  render(h('main', { class: 'main' },
    h('p', { class: 'eyebrow' }, j ? j.meta : 'Your next journey'),
    h('h1', { style: 'margin-top:10px' }, j ? j.title : 'Plan a custom trip'),
    h('p', { class: 'muted', style: 'margin-top:12px' }, 'Tell us a little about your trip. It only takes a minute.'),
    form), navFor('plan'));
}

function viewRequestSent() {
  render(h('main', { class: 'main' },
    h('span', { class: 'list-icon big' }, svg(ICON.check)),
    h('h1', { style: 'margin-top:16px' }, 'Request sent'),
    h('p', { class: 'muted', style: 'margin-top:12px' }, 'Thank you! Jordan will be in touch with ideas and a proposal. When it’s ready, it appears right here in the app, where you can accept it and pay securely.'),
    h('div', { class: 'stack', style: 'margin-top:26px' },
      guestMode ? h('button', { class: 'btn', type: 'button', onclick: () => viewSignUp(lastRequestEmail) }, 'Create an account to follow it')
        : h('a', { class: 'btn', href: '#/' }, 'Back to home'),
      h('a', { class: 'btn ghost', href: '#/home/contact' }, svg(ICON.chat), 'Message Jordan'))),
    navFor('plan'));
}

function requestCard(r) {
  const who = [r.adults ? r.adults + (r.adults == 1 ? ' adult' : ' adults') : '', r.children ? r.children + (r.children == 1 ? ' child' : ' children') : ''].filter(Boolean).join(', ');
  const bits = [r.dates, who].filter(Boolean).join(' · ');
  return h('div', { class: 'empty-card request-card' },
    h('span', { class: 'list-icon' }, svg(ICON.clock)),
    h('span', { class: 'req-tag' }, 'Request received'),
    h('strong', {}, r.journey === 'Custom trip' && r.destination ? r.destination : r.journey),
    bits ? h('span', {}, bits) : null,
    h('span', {}, 'Jordan is preparing your proposal. It will appear right here as soon as it’s ready.'),
    h('div', { class: 'stack', style: 'margin-top:16px' },
      h('a', { class: 'btn ghost', href: '#/home/contact' }, svg(ICON.chat), 'Message Jordan')),
    h('a', { class: 'empty-link', href: '#/request' }, 'Send another request', svg(ICON.chev)));
}

function proposalCard(t, base) {
  const p = t.proposal || {};
  const pays = Array.isArray(t.payments) ? t.payments : [];
  const i = pays.findIndex(x => x.status !== 'paid');
  const pay = i >= 0 ? pays[i] : null;
  return h('section', { class: 'proposal-card' },
    h('p', { class: 'eyebrow' }, 'Your proposal'),
    h('div', { class: 'prop-price' },
      t.price_total ? h('span', { class: 'amount' }, t.price_total) : null,
      p.price_note ? h('span', { class: 'muted small' }, p.price_note) : null),
    Array.isArray(p.includes) && p.includes.length ? h('ul', { class: 'prop-list' }, p.includes.map(x => h('li', {}, svg(ICON.check), h('span', {}, x)))) : null,
    pay ? h('div', { class: 'prop-due' }, h('span', {}, 'To confirm, ' + pay.label.toLowerCase()), h('strong', {}, pay.amount)) : null,
    p.valid_until ? h('p', { class: 'muted small', style: 'margin:0' }, 'Held for you until ' + p.valid_until) : null,
    h('div', { class: 'stack' },
      pay ? h('button', { class: 'btn', type: 'button', onclick: () => openCheckout(t, i) }, svg(ICON.lock), 'Accept & pay ' + pay.amount) : null,
      h('a', { class: 'btn ghost', href: base + '/contact' }, svg(ICON.chat), 'Ask Jordan a question')),
    h('p', { class: 'note', style: 'margin:0' }, 'Payment opens a secure checkout inside the app. We never see or store your card details.'));
}

// The secure payment page. In the live app the provider's checkout opens inside the app.
// The preview shows where it opens; no card fields are ever part of this app.
function openCheckout(t, i) {
  const p = (t.payments || [])[i];
  if (!p) return;
  const link = safeLink(p.pay_link || '');
  if (!DEMO && link) { openInApp(link); return; }
  const live = !DEMO;  // live app without a payment link yet: explain instead of a checkout
  const close = () => { wrap.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  const x = h('button', { type: 'button', class: 'sheet-x', 'aria-label': 'Close', onclick: close }, svg(ICON.x));
  const wrap = h('div', { class: 'sheet-wrap', onclick: e => { if (e.target === wrap) close(); } },
    h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Secure checkout' },
      h('div', { class: 'sheet-head' }, h('span', {}, svg(ICON.lock), 'Secure checkout'), x),
      h('div', { class: 'stack', style: 'gap:6px' },
        h('span', { class: 'muted small' }, (t.title || 'Your trip') + ' · ' + p.label),
        h('span', { class: 'amount' }, p.amount)),
      live ? h('div', { class: 'sheet-frame' }, svg(ICON.clock),
          h('strong', {}, 'Your secure payment link is on its way'),
          h('span', {}, 'Jordan will set up this payment with you. Message him and he’ll take it from there. We never ask for card details in the app.'))
        : h('div', { class: 'sheet-frame' }, svg(ICON.card),
          h('strong', {}, 'The secure payment page opens here'),
          h('span', {}, 'In the live app, Fora’s or Stripe’s checkout loads in this window. The client pays without leaving the app, and we never see the card.')),
      live ? h('a', { class: 'btn', href: '#/trip/' + encodeURIComponent(t.id) + '/contact', onclick: () => close() }, svg(ICON.chat), 'Message Jordan')
        : t.sample ? h('p', { class: 'note' }, 'This is a sample trip, so there’s nothing to pay.')
        : h('button', { class: 'btn', type: 'button', onclick: () => { demoPaid(t.id, i); close(); tripsCache = null; location.hash = '#/trip/' + encodeURIComponent(t.id) + '/pay/paid'; } }, 'Preview: simulate a successful payment'),
      h('button', { class: 'btn ghost', type: 'button', onclick: close }, 'Cancel')));
  document.body.appendChild(wrap);
  document.addEventListener('keydown', onKey);
  x.focus();
}

const money = n => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2 });
const num = s => parseFloat(String(s || '').replace(/[^0-9.]/g, '')) || 0;

function viewPay(t, justPaid) {
  const pays = Array.isArray(t.payments) ? t.payments : [];
  if (!pays.length) return viewPayLink(t);
  const base = '#/trip/' + encodeURIComponent(t.id);
  const proposal = t.status === 'proposal';
  const nextI = pays.findIndex(p => p.status !== 'paid');
  const next = nextI >= 0 ? pays[nextI] : null;
  const paid = pays.filter(p => p.status === 'paid').reduce((n, p) => n + num(p.amount), 0);
  const total = num(t.price_total) || pays.reduce((n, p) => n + num(p.amount), 0);
  const stat = (label, v) => h('div', {}, h('strong', {}, v), h('span', {}, label));
  const files = [
    ...pays.map((p, i) => p.status === 'paid' && (p.receipt || safeLink(p.receipt_url || '')) ? { name: p.label + ' receipt', when: p.when, href: base + '/receipt/' + i } : null).filter(Boolean),
    ...(Array.isArray(t.invoices) ? t.invoices : []).map((d, i) => ({ name: d.name || 'Invoice', when: d.when, href: base + '/invoice/' + i }))];
  render(
    h('main', { class: 'main' },
      t.title ? h('p', { class: 'eyebrow page-eyebrow' }, t.title) : null,
      h('h1', {}, proposal ? 'Your proposal' : 'Payments'),
      justPaid ? h('div', { class: 'paid-banner', role: 'status' }, svg(ICON.check), h('span', {}, h('strong', {}, 'Payment received. '), 'Thank you! Your receipt is saved below.')) : null,
      proposal ? proposalCard(t, base) : null,
      !proposal && total ? h('div', { class: 'pay-summary' }, stat('Trip total', money(total)), stat('Paid', money(paid)), stat('Balance', money(Math.max(total - paid, 0)))) : null,
      proposal ? null : next
        ? h('div', { class: 'paycard' },
            h('div', { class: 'stack', style: 'gap:6px' },
              h('span', { class: 'muted small' }, 'Next payment · ' + next.label),
              h('span', { class: 'amount' }, next.amount),
              next.when ? h('span', { class: 'muted small' }, next.when) : null),
            h('button', { class: 'btn', type: 'button', onclick: () => openCheckout(t, nextI) }, svg(ICON.lock), 'Pay securely'),
            h('span', { class: 'note' }, 'Opens a secure checkout inside the app. We never see your card details.'))
        : h('div', { class: 'paycard' },
            h('span', { class: 'list-icon big' }, svg(ICON.check)),
            h('span', { class: 'amount', style: 'font-size:30px' }, 'All paid'),
            h('span', { class: 'muted' }, 'Thank you! There’s nothing left to pay for this trip.')),
      section('Payment schedule', h('div', { class: 'list-card' }, pays.map((p, i) => h('div', { class: 'list-item' },
        h('span', { class: 'list-icon' + (p.status === 'paid' ? ' ok' : '') }, svg(p.status === 'paid' ? ICON.check : ICON.clock)),
        h('span', { class: 'day-text' }, h('span', { class: 'day-title' }, p.label + ' · ' + p.amount), p.when ? h('span', { class: 'muted small' }, p.when) : null),
        h('span', { class: 'tag' + (p.status === 'paid' ? ' ok' : '') }, p.status === 'paid' ? 'Paid' : (i === nextI ? 'Due' : 'Later')))))),
      section('Invoices & receipts', files.length
        ? h('div', { class: 'list-card' }, files.map(f => h('a', { class: 'list-item', href: f.href },
            h('span', { class: 'list-icon' }, svg(ICON.doc)),
            h('span', { class: 'day-text' }, h('span', { class: 'day-title' }, f.name), f.when ? h('span', { class: 'muted small' }, f.when) : null),
            h('span', { class: 'chev' }, svg(ICON.chev)))))
        : h('p', { class: 'muted' }, 'Your invoice and a receipt for each payment appear here.'))),
    nav(t.id, 'pay'));
}

const DOC_ICON = { ticket: 'plane', voucher: 'ticket', hotel: 'bed', doc: 'doc' };
function docsList(t, base) {
  const docs = Array.isArray(t.documents) ? t.documents : [];
  return docs.map((d, i) => (d.sample || safeLink(d.url || '')) ? h('a', { class: 'list-item', href: base + '/doc/' + i },
    h('span', { class: 'list-icon' }, svg(ICON[DOC_ICON[d.kind] || 'doc'])),
    h('span', { class: 'day-text' },
      h('span', { class: 'day-title' }, d.name || 'Document'),
      h('span', { class: 'muted small offline' }, svg(ICON.download), 'Saved for offline')),
    h('span', { class: 'chev' }, svg(ICON.chev))) : null).filter(Boolean);
}

// Keeps a copy of each document on the phone so it opens without signal abroad.
function saveOffline(urls) {
  if (!('caches' in window) || !urls.length) return;
  caches.open('elt-docs').then(c => urls.forEach(u => c.match(u).then(m => m || c.add(u).catch(() => {})))).catch(() => {});
}
async function openDoc(url) {
  try {
    if ('caches' in window && !navigator.onLine) {
      const m = await (await caches.open('elt-docs')).match(url);
      if (m) { window.open(URL.createObjectURL(await m.blob()), '_blank'); return; }
    }
  } catch (e) {}
  openInApp(url);
}

function qrBox() {
  // A stand-in pattern for the preview; real vouchers show the supplier's own QR code.
  let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const cells = [];
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    const fin = (a, b) => x >= a && x < a + 7 && y >= b && y < b + 7;
    let on;
    if (fin(0, 0) || fin(14, 0) || fin(0, 14)) {
      const ox = x < 7 ? 0 : 14, oy = y < 7 ? 0 : 14, dx = x - ox, dy = y - oy;
      on = dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
    } else on = rnd() > 0.52;
    cells.push(h('i', { class: on ? 'on' : null }));
  }
  return h('div', { class: 'qr', role: 'img', 'aria-label': 'QR code' }, ...cells);
}
function docPage(s) {
  return h('div', { class: 'docpage' },
    h('div', { class: 'doc-top' }, h('img', { src: img('mark-gold'), alt: '' }), h('span', {}, BRAND.name)),
    h('h2', {}, s.heading),
    h('dl', {}, ...s.rows.flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])),
    s.qr ? qrBox() : null,
    s.foot ? h('p', { class: 'doc-foot' }, s.foot) : null,
    h('span', { class: 'doc-mark' }, 'Sample'));
}
function viewDoc(t, d, back, tab) {
  if (!d) { location.hash = back; return; }
  const url = safeLink(d.url || '');
  const s = d.sample;
  const status = statusLine();
  const share = async () => {
    if (url && navigator.share) { try { await navigator.share({ title: d.name || 'Document', url }); } catch (e) {} return; }
    if (url) { openDoc(url); return; }
    setStatus(status, 'In the live app this opens your phone’s share menu, so you can save the PDF to Files or send it.');
  };
  render(
    h('main', { class: 'main' },
      h('a', { class: 'back-link', href: back }, svg(ICON.back), 'Back'),
      h('h1', { style: 'margin-top:6px;font-size:32px' }, d.name || 'Document'),
      h('p', { class: 'muted small offline', style: 'margin-top:8px' }, svg(ICON.download), 'Saved on this phone. Opens without internet.'),
      s ? docPage(s) : null,
      h('div', { class: 'stack', style: 'margin-top:20px' },
        url ? h('button', { class: 'btn', type: 'button', onclick: () => openDoc(url) }, svg(ICON.doc), 'Open PDF') : null,
        h('button', { class: url ? 'btn ghost' : 'btn ghost', type: 'button', onclick: share }, svg(ICON.share), 'Share or save'),
        status)),
    nav(t.id, tab));
}

// Every screen inside one trip (the sample trip uses the same screens).
function tripRoute(t, parts) {
  navTrip = t.id;
  const base = '#/trip/' + encodeURIComponent(t.id);
  const n = parseInt(parts[3], 10);
  const pays = Array.isArray(t.payments) ? t.payments : [];
  if (parts[2] === 'day') return viewDay(t, n || 1);
  if (parts[2] === 'info') return viewInfo(t);
  if (parts[2] === 'pay') return viewPay(t, parts[3] === 'paid');
  if (parts[2] === 'doc') return viewDoc(t, (t.documents || [])[n], base + '/info', 'info');
  if (parts[2] === 'receipt') { const p = pays[n]; return viewDoc(t, p && { name: p.label + ' receipt', sample: p.receipt, url: p.receipt_url }, base + '/pay', 'pay'); }
  if (parts[2] === 'invoice') return viewDoc(t, (t.invoices || [])[n], base + '/pay', 'pay');
  if (parts[2] === 'contact') return viewContact(t);
  if (parts[2] === 'plan') return viewPlan(t);
  if (parts[2] === 'review') return viewReview(t);
  return viewTrip(t);
}

// ---------- Router ----------
let tripsCache = null;
let pastTrips = [];
let tripsLoading = null;
function sampleRoute(parts) {
  return tripRoute(sampleTrip(), parts);
}
// The tabs shown when there is no current trip (also used when exploring without an account).
function bookingRoute(parts) {
  if (parts[0] === 'journey') return viewJourney(parts[1]);
  if (parts[1] === 'sent') return viewRequestSent();
  return viewRequest(parts[1]);
}
function homeTab(tab) {
  navTrip = null;
  if (tab === 'info' || tab === 'pay') { viewNoTripTab(tab); return true; }
  if (tab === 'plan') { viewPlan(null); return true; }
  if (tab === 'contact') { viewContact(null); return true; }
  return false;
}

async function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  viewingSample = parts[0] === 'trip' && parts[1] === 'sample';
  if (viewingSample) return sampleRoute(parts);
  const session = await getSession();
  if (!session) {
    tripsCache = null;
    guestMode = ['explore', 'home', 'journey', 'request'].includes(parts[0]);
    sessionEmail = ''; requestsCache = [];
    if (parts[0] === 'explore') return viewNoTrip([], true);
    if (parts[0] === 'home') return homeTab(parts[1]) || viewNoTrip([], true);
    if (parts[0] === 'journey' || parts[0] === 'request') return bookingRoute(parts);
    viewSignIn(); return;
  }
  guestMode = false;
  sessionEmail = (session.user && session.user.email) || '';
  if (!tripsCache) {
    // The logo animation plays only right after signing in. Reopening the app goes straight in.
    const intro = playIntro; playIntro = false;
    if (intro) root.replaceChildren(loaderView('Loading your journey…'));
    else if (!root.firstChild || root.querySelector('.boot')) root.replaceChildren(h('div', { class: 'boot' }));
    if (!tripsLoading) tripsLoading = (async () => {
      const t0 = Date.now();
      const [data, reqs] = await Promise.all([myTrips(), myRequests().catch(() => [])]);
      requestsCache = reqs || [];
      const wait = 2300 - (Date.now() - t0);  // let the plane finish drawing the logo once
      if (intro && wait > 0 && !calm()) await new Promise(r => setTimeout(r, wait));
      tripsCache = data;
    })().finally(() => { tripsLoading = null; });
    try { await tripsLoading; }
    catch (e) { root.replaceChildren(h('div', { class: 'center' }, 'We couldn’t load your trip. Please check your connection.')); return; }
  }
  const trips = tripsCache || [];
  const current = trips.filter(t => tripState(t) !== 'after');
  pastTrips = trips.filter(t => tripState(t) === 'after');
  if (parts[0] === 'account' && parts[1] === 'delete') return viewDeleteAccount();
  if (parts[0] === 'explore') { location.hash = '#/'; return; }
  if (parts[0] === 'home' && homeTab(parts[1])) return;
  if (parts[0] === 'journey' || parts[0] === 'request') return bookingRoute(parts);
  if (parts[0] === 'trip') {
    const t = trips.find(x => String(x.id) === parts[1]);
    if (!t) { location.hash = '#/'; return; }
    return tripRoute(t, parts);
  }
  navTrip = null;
  if (current.length === 0) return viewNoTrip(pastTrips, false);
  if (current.length === 1) return viewTrip(current[0]);
  return viewTrips(current);
}

window.addEventListener('hashchange', route);
(async () => {
  if (!DEMO) {
    const c = await sb();
    c.auth.onAuthStateChange((evt) => { if (evt === 'SIGNED_IN' || evt === 'SIGNED_OUT') { tripsCache = null; route(); } });
  }
  if (DEMO && !location.hash) { viewSignIn(); return; }
  route();
})();

if ('serviceWorker' in navigator && !window.ELT_NATIVE) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
