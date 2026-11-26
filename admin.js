import { DEMO, getSession, signInPassword, signOut, isAdmin, allTrips, saveTrip, deleteTrip, safeLink, sb, allReviews } from './data.js';

const root = document.getElementById('admin');

function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'value') el.value = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) {
    if (kid === null || kid === undefined || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}
let uid = 0;
function field(label, value, opts = {}) {
  const id = 'f' + (++uid);
  const input = opts.multiline
    ? h('textarea', { id, placeholder: opts.placeholder || '' })
    : h('input', { id, type: opts.type || 'text', placeholder: opts.placeholder || '' });
  input.value = value || '';
  const wrap = h('div', { class: 'stack', style: 'gap:6px' }, h('label', { for: id }, label), input);
  wrap.input = input;
  return wrap;
}

function signInView(msg) {
  const email = field('Email', '', { type: 'email', placeholder: 'office@eliteluxurytravel.llc' });
  const pw = field('Password', '', { type: 'password' });
  const status = h('p', { class: 'small', role: 'status' }, msg || '');
  root.replaceChildren(h('div', { class: 'admin' },
    h('div', { class: 'eyebrow' }, 'Elite Luxury Travel'),
    h('h1', { style: 'margin:10px 0 20px' }, 'Trip manager'),
    h('form', { class: 'stack', onsubmit: async e => {
      e.preventDefault();
      status.textContent = 'Signing in…';
      const r = await signInPassword(email.input.value.trim(), pw.input.value);
      if (r.ok) return start();
      status.textContent = r.unconfirmed ? 'Confirm this email in the app first (Create your account), then sign in here.' : 'That email and password don’t match.';
    } }, email, pw, h('button', { class: 'btn', type: 'submit' }, 'Sign in'), status),
    h('p', { class: 'small', style: 'margin-top:18px' }, 'Use the same email and password as the Elite Luxury Travel app. Only trip managers can open this page.')));
}

async function listView() {
  const reviewsBox = h('div', {}, h('p', { class: 'small' }, 'Loading reviews…'));
  let trips = [];
  try { trips = await allTrips(); } catch (e) { root.replaceChildren(h('div', { class: 'admin' }, h('p', { class: 'error' }, 'Could not load trips: ' + e.message))); return; }
  root.replaceChildren(h('div', { class: 'admin' },
    DEMO ? h('p', { class: 'small' }, 'Preview mode: changes are not saved.') : null,
    h('h1', {}, 'Trips'),
    h('div', { class: 'toolbar' },
      h('button', { class: 'btn', type: 'button', onclick: () => editView(blankTrip()) }, 'New trip'),
      h('button', { class: 'btn ghost', type: 'button', onclick: async () => { await signOut(); signInView(); } }, 'Sign out')),
    h('div', { class: 'list' }, trips.length ? trips.map(t =>
      h('a', { href: '#', onclick: e => { e.preventDefault(); editView(JSON.parse(JSON.stringify(t))); } },
        h('strong', {}, t.title || 'Untitled'), h('br'),
        h('span', { class: 'small' }, (t.client_name || '') + ' · ' + (t.client_email || '') + ' · ' + ((t.days || []).length) + ' days')))
      : h('p', { class: 'small' }, 'No trips yet.')),
    h('h1', { style: 'margin-top:40px' }, 'Reviews'),
    reviewsBox));
  try {
    const reviews = await allReviews();
    const titles = Object.fromEntries(trips.map(t => [t.id, t.title || 'Trip']));
    reviewsBox.replaceChildren(...(reviews.length ? reviews.map(r =>
      h('div', { class: 'review-row' },
        h('strong', {}, '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) + '  ' + (titles[r.trip_id] || 'Trip')),
        h('span', { class: 'small' }, r.client_email + ' · ' + new Date(r.created_at).toLocaleDateString() + (r.share_ok ? ' · OK to share publicly' : ' · Private, do not share')),
        r.body ? h('p', {}, r.body) : null,
        r.photoUrls && r.photoUrls.length ? h('div', { class: 'review-photos' }, r.photoUrls.map((u, k) => h('a', { href: u, target: '_blank', rel: 'noopener noreferrer' }, h('img', { src: u, alt: 'Photo ' + (k + 1) })))) : null))
      : [h('p', { class: 'small' }, 'No reviews yet.')]));
  } catch (e) { reviewsBox.replaceChildren(h('p', { class: 'error' }, 'Could not load reviews: ' + e.message)); }
}

function blankTrip() {
  return { client_email: '', client_name: '', title: '', subtitle: '', dates_text: '', start_date: null, flights: [], documents: [], days: [], pay_link: '', pay_amount: '', pay_due: '', paid_note: '' };
}

function editView(trip) {
  const f = {
    client_name: field('Client first name', trip.client_name, { placeholder: 'Christine' }),
    client_email: field('Client email (they sign in with this)', trip.client_email, { type: 'email' }),
    title: field('Trip name', trip.title, { placeholder: 'Italy Anniversary' }),
    subtitle: field('Places', trip.subtitle, { placeholder: 'Rome, Florence, Venice' }),
    dates_text: field('Dates (as shown to client)', trip.dates_text, { placeholder: 'May 12 to 23, 2027' }),
    start_date: field('First day of the trip (for countdown and day dates)', trip.start_date, { type: 'date' }),
    pay_link: field('Secure payment link (Fora Bookable Quote or Stripe)', trip.pay_link, { type: 'url', placeholder: 'https://' }),
    pay_amount: field('Amount due (as you want it shown)', trip.pay_amount, { placeholder: 'USD 4,250' }),
    pay_due: field('Due date text', trip.pay_due, { placeholder: 'Due by March 1' }),
    paid_note: field('Paid so far (shown to client)', trip.paid_note, { placeholder: 'Deposit received, thank you' })
  };
  const daysBox = h('div', {});
  const days = (trip.days || []).map(d => ({ ...d }));

  function drawDays() {
    daysBox.replaceChildren(...days.map((d, i) => {
      const city = field('City', d.city), title = field('Title', d.title), body = field('What happens', d.body, { multiline: true });
      const stay = field('Tonight (hotel)', d.stay), inc = field('Included', d.included);
      const addr = field('Hotel address', d.stay_address), chk = field('Check-in note', d.checkin, { placeholder: 'Check-in from 3:00 PM' });
      const schedText = (d.schedule || []).map(x => [x.time, x.title, x.note || '', x.tour ? 'tour' : '', x.contact_name || '', x.contact_phone || ''].join(' | ').replace(/( \| )+$/, '')).join('\n');
      const sched = field('Schedule, one per line: time | activity | note | tour | contact name | contact phone (write "tour" in the 4th part to list it under Tours)', schedText, { multiline: true, placeholder: '9:00 AM | Colosseum tour | Meet at the Arch of Constantine | tour' });
      [['city', city], ['title', title], ['body', body], ['stay', stay], ['included', inc], ['stay_address', addr], ['checkin', chk]].forEach(([k, w]) => w.input.addEventListener('input', () => { d[k] = w.input.value; }));
      sched.input.addEventListener('input', () => {
        d.schedule = sched.input.value.split('\n').map(l => l.split('|').map(p => p.trim())).filter(p => p.some(Boolean)).map(([time = '', title = '', note = '', tag = '', contact_name = '', contact_phone = '']) => ({ time, title, note, tour: /tour/i.test(tag), contact_name, contact_phone }));
      });
      return h('fieldset', {},
        h('legend', {}, 'Day ' + (i + 1)),
        h('div', { class: 'row' }, city, title), body, sched, h('div', { class: 'row' }, stay, inc), h('div', { class: 'row' }, addr, chk),
        h('div', { class: 'toolbar', style: 'margin:4px 0 0' },
          i > 0 ? h('button', { class: 'btn ghost', type: 'button', onclick: () => { days.splice(i - 1, 0, days.splice(i, 1)[0]); drawDays(); } }, 'Move up') : null,
          h('button', { class: 'btn ghost', type: 'button', onclick: () => { days.splice(i, 1); drawDays(); } }, 'Remove day')));
    }));
  }
  drawDays();

  const flights = (trip.flights || []).map(x => ({ ...x }));
  const docs = (trip.documents || []).map(x => ({ ...x }));
  function listEditor(items, spec, addLabel, blank) {
    const box = h('div', {});
    function draw() {
      box.replaceChildren(...items.map((it, i) => {
        const ws = spec.map(([k, label, opts]) => { const w = field(label, it[k], opts || {}); w.input.addEventListener('input', () => { it[k] = w.input.value; }); return w; });
        return h('fieldset', {}, h('div', { class: 'row' }, ...ws),
          h('div', { class: 'toolbar', style: 'margin:4px 0 0' }, h('button', { class: 'btn ghost', type: 'button', onclick: () => { items.splice(i, 1); draw(); } }, 'Remove')));
      }), h('button', { class: 'btn ghost', type: 'button', onclick: () => { items.push({ ...blank }); draw(); } }, addLabel));
    }
    draw();
    return box;
  }
  const flightsBox = listEditor(flights, [['from', 'From', { placeholder: 'New York (JFK)' }], ['to', 'To', { placeholder: 'Rome (FCO)' }], ['flight', 'Flight number', { placeholder: 'AZ609' }], ['when', 'Date and time', { placeholder: 'May 12, 6:10 pm' }]], '+ Add a flight', { from: '', to: '', flight: '', when: '' });
  const docsBox = listEditor(docs, [['name', 'Document name', { placeholder: 'Hotel confirmation, Rome' }], ['url', 'Link (https://)', { type: 'url', placeholder: 'https://' }]], '+ Add a document', { name: '', url: '' });

  const status = h('p', { class: 'small', role: 'status' });
  async function save() {
    const out = { ...trip };
    for (const [k, w] of Object.entries(f)) out[k] = w.input.value.trim();
    out.days = days;
    out.flights = flights.filter(x => x.from || x.to || x.flight);
    out.documents = docs.filter(x => x.name || x.url);
    if (out.documents.some(d => !safeLink(d.url))) { status.textContent = 'Every document link must start with https://'; return; }
    if (!out.start_date) out.start_date = null;
    if (!out.client_email || !out.title) { status.textContent = 'Client email and trip name are required.'; return; }
    if (out.pay_link && !safeLink(out.pay_link)) { status.textContent = 'The payment link must start with https://'; return; }
    try { const saved = await saveTrip(out); Object.assign(trip, saved); status.textContent = 'Saved.'; }
    catch (e) { status.textContent = 'Could not save: ' + e.message; }
  }

  root.replaceChildren(h('div', { class: 'admin' },
    h('a', { href: '#', class: 'back', onclick: e => { e.preventDefault(); listView(); } }, '‹  All trips'),
    h('h1', { style: 'margin-bottom:18px' }, trip.id ? 'Edit trip' : 'New trip'),
    h('fieldset', {}, h('legend', {}, 'Client'), h('div', { class: 'row' }, f.client_name, f.client_email)),
    h('fieldset', {}, h('legend', {}, 'Trip'), f.title, h('div', { class: 'row' }, f.subtitle, f.dates_text), f.start_date),
    h('h2', { style: 'font-size:18px;margin:22px 0 10px' }, 'Day by day'),
    daysBox,
    h('button', { class: 'btn ghost', type: 'button', onclick: () => { days.push({ city: days.length ? days[days.length - 1].city : '', title: '', body: '', stay: days.length ? days[days.length - 1].stay : '', included: '' }); drawDays(); } }, '+ Add a day'),
    h('h2', { style: 'font-size:18px;margin:26px 0 10px' }, 'Flights'), flightsBox,
    h('h2', { style: 'font-size:18px;margin:26px 0 10px' }, 'Documents'), docsBox,
    h('fieldset', { style: 'margin-top:22px' }, h('legend', {}, 'Payment'), f.pay_link, h('div', { class: 'row' }, f.pay_amount, f.pay_due), f.paid_note),
    h('div', { class: 'toolbar' },
      h('button', { class: 'btn', type: 'button', onclick: save }, 'Save trip'),
      trip.id ? h('button', { class: 'btn ghost', type: 'button', onclick: async () => {
        if (!window.confirm('Delete this trip? This cannot be undone.')) return;
        try { await deleteTrip(trip.id); listView(); } catch (e) { status.textContent = 'Could not delete: ' + e.message; }
      } }, 'Delete trip') : null),
    status));
}

(async () => {
  if (!DEMO) {
    const c = await sb();
    c.auth.onAuthStateChange(evt => { if (evt === 'SIGNED_IN') start(); });
  }
  start();
})();

async function start() {
  const session = await getSession();
  if (!session) return signInView();
  if (!(await isAdmin())) {
    root.replaceChildren(h('div', { class: 'admin' }, h('h1', {}, 'No access'), h('p', { class: 'small' }, 'This email is not set up as a trip manager.'),
      h('button', { class: 'btn ghost', type: 'button', onclick: async () => { await signOut(); signInView(); } }, 'Sign out')));
    return;
  }
  listView();
}
