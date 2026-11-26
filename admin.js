import { DEMO, getSession, signInPassword, signOut, isAdmin, allTrips, saveTrip, deleteTrip, safeLink, sb, allReviews, allRequests, closeRequest } from './data.js';

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
  const input = opts.select
    ? h('select', { id }, ...opts.select.map(([v, l]) => h('option', { value: v }, l)))
    : opts.multiline
    ? h('textarea', { id, placeholder: opts.placeholder || '' })
    : h('input', { id, type: opts.type || 'text', placeholder: opts.placeholder || '' });
  input.value = value || (opts.select ? opts.select[0][0] : '');
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
  const requestsBox = h('div', {}, h('p', { class: 'small' }, 'Loading requests…'));
  let trips = [];
  try { trips = await allTrips(); } catch (e) { root.replaceChildren(h('div', { class: 'admin' }, h('p', { class: 'error' }, 'Could not load trips: ' + e.message))); return; }
  root.replaceChildren(h('div', { class: 'admin' },
    DEMO ? h('p', { class: 'small' }, 'Preview mode: changes are not saved.') : null,
    h('h1', {}, 'Trip requests'),
    h('p', { class: 'small', style: 'margin:-6px 0 12px' }, 'Sent from the app. Make a proposal for one, then mark it done so it leaves the client’s home screen.'),
    requestsBox,
    h('h1', { style: 'margin-top:40px' }, 'Trips'),
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
    const reqs = await allRequests();
    const drawReqs = list => requestsBox.replaceChildren(...(list.length ? list.map(r =>
      h('div', { class: 'review-row' },
        h('strong', {}, (r.journey === 'Custom trip' && r.destination ? r.destination : r.journey) + ' · ' + r.name),
        h('span', { class: 'small' }, [r.email, r.phone, 'prefers ' + (r.contact_via || 'email'), new Date(r.created_at).toLocaleDateString()].filter(Boolean).join(' · ')),
        h('span', { class: 'small' }, [r.dates, r.adults + ' adults' + (r.children ? ', ' + r.children + ' children' : ''), r.budget, r.occasion].filter(Boolean).join(' · ')),
        r.notes ? h('p', {}, r.notes) : null,
        h('div', { class: 'toolbar', style: 'margin:6px 0 0' },
          h('button', { class: 'btn', type: 'button', onclick: () => editView({ ...blankTrip(), client_email: r.email, client_name: (r.name || '').split(' ')[0], title: r.journey === 'Custom trip' ? (r.destination || '') : r.journey, status: 'proposal', dates_text: r.dates || '' }) }, 'Make a proposal'),
          h('button', { class: 'btn ghost', type: 'button', onclick: async () => { try { await closeRequest(r.id); drawReqs(list.filter(x => x.id !== r.id)); } catch (e) { alert('Could not update: ' + e.message); } } }, 'Mark done'))))
      : [h('p', { class: 'small' }, 'No open requests.')]));
    drawReqs(reqs);
  } catch (e) { requestsBox.replaceChildren(h('p', { class: 'error' }, 'Could not load requests: ' + e.message)); }
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
  return { client_email: '', client_name: '', title: '', subtitle: '', dates_text: '', start_date: null, flights: [], documents: [], days: [], pay_link: '', pay_amount: '', pay_due: '', paid_note: '',
    status: 'booked', price_total: '', proposal: {}, payments: [], invoices: [] };
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
    paid_note: field('Paid so far (shown to client)', trip.paid_note, { placeholder: 'Deposit received, thank you' }),
    status: field('Stage', trip.status, { select: [['booked', 'Booked trip'], ['proposal', 'Proposal (client can review, accept and pay)']] }),
    price_total: field('Trip total (as shown)', trip.price_total, { placeholder: '$24,800' })
  };
  const prop = trip.proposal || {};
  const pf = {
    price_note: field('Price note', prop.price_note, { placeholder: 'Total for 2 travellers, flights not included' }),
    valid_until: field('Held until', prop.valid_until, { placeholder: 'Dec 10, 2026' }),
    includes: field('What’s included, one per line', (prop.includes || []).join('\n'), { multiline: true, placeholder: '11 nights in 5-star hotels, breakfast daily' })
  };
  const daysBox = h('div', {});
  const days = (trip.days || []).map(d => ({ ...d }));

  function drawDays() {
    daysBox.replaceChildren(...days.map((d, i) => {
      const city = field('City', d.city), title = field('Title', d.title), body = field('What happens', d.body, { multiline: true });
      const stay = field('Tonight (hotel)', d.stay), inc = field('Included', d.included);
      const addr = field('Hotel address', d.stay_address), chk = field('Check-in note', d.checkin, { placeholder: 'Check-in from 3:00 PM' });
      const conf = field('Hotel confirmation number', d.stay_conf);
      const schedText = (d.schedule || []).map(x => [x.time, x.title, x.note || '', x.tour ? 'tour' : '', x.contact_name || '', x.contact_phone || ''].join(' | ').replace(/( \| )+$/, '')).join('\n');
      const sched = field('Schedule, one per line: time | activity | note | tour | contact name | contact phone (write "tour" in the 4th part to list it under Tours)', schedText, { multiline: true, placeholder: '9:00 AM | Colosseum tour | Meet at the Arch of Constantine | tour' });
      [['city', city], ['title', title], ['body', body], ['stay', stay], ['included', inc], ['stay_address', addr], ['checkin', chk], ['stay_conf', conf]].forEach(([k, w]) => w.input.addEventListener('input', () => { d[k] = w.input.value; }));
      sched.input.addEventListener('input', () => {
        d.schedule = sched.input.value.split('\n').map(l => l.split('|').map(p => p.trim())).filter(p => p.some(Boolean)).map(([time = '', title = '', note = '', tag = '', contact_name = '', contact_phone = '']) => ({ time, title, note, tour: /tour/i.test(tag), contact_name, contact_phone }));
      });
      return h('fieldset', {},
        h('legend', {}, 'Day ' + (i + 1)),
        h('div', { class: 'row' }, city, title), body, sched, h('div', { class: 'row' }, stay, inc), h('div', { class: 'row' }, addr, chk), conf,
        h('div', { class: 'toolbar', style: 'margin:4px 0 0' },
          i > 0 ? h('button', { class: 'btn ghost', type: 'button', onclick: () => { days.splice(i - 1, 0, days.splice(i, 1)[0]); drawDays(); } }, 'Move up') : null,
          h('button', { class: 'btn ghost', type: 'button', onclick: () => { days.splice(i, 1); drawDays(); } }, 'Remove day')));
    }));
  }
  drawDays();

  const flights = (trip.flights || []).map(x => ({ ...x }));
  const docs = (trip.documents || []).map(x => ({ kind: 'doc', ...x }));
  const pays = (trip.payments || []).map(x => ({ ...x }));
  const invs = (trip.invoices || []).map(x => ({ ...x }));
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
  const flightsBox = listEditor(flights, [['from', 'From', { placeholder: 'New York (JFK)' }], ['to', 'To', { placeholder: 'Rome (FCO)' }], ['flight', 'Flight number', { placeholder: 'AZ609' }], ['when', 'Date and time', { placeholder: 'May 12, 6:10 pm' }], ['ref', 'Booking code', { placeholder: 'ABC123' }], ['checkin', 'Check-in link (optional)', { type: 'url', placeholder: 'https://' }]], '+ Add a flight', { from: '', to: '', flight: '', when: '', ref: '', checkin: '' });
  const docsBox = listEditor(docs, [['name', 'Document name', { placeholder: 'Vatican tickets' }], ['kind', 'Type', { select: [['doc', 'Document'], ['ticket', 'Flight e-ticket'], ['voucher', 'Voucher or tickets'], ['hotel', 'Hotel confirmation']] }], ['url', 'Link to the PDF (https://)', { type: 'url', placeholder: 'https://' }]], '+ Add a document', { name: '', kind: 'doc', url: '' });
  const paysBox = listEditor(pays, [['label', 'Payment', { placeholder: 'Deposit' }], ['amount', 'Amount', { placeholder: '$5,000' }], ['status', 'Status', { select: [['due', 'Due now'], ['later', 'Due later'], ['paid', 'Paid']] }], ['when', 'Date text', { placeholder: 'Due Mar 1, 2027 / Paid Nov 26, 2026' }], ['pay_link', 'Secure payment link', { type: 'url', placeholder: 'https://' }], ['receipt_url', 'Receipt link (after paying)', { type: 'url', placeholder: 'https://' }]], '+ Add a payment', { label: '', amount: '', status: 'due', when: '', pay_link: '', receipt_url: '' });
  const invsBox = listEditor(invs, [['name', 'Invoice name', { placeholder: 'Trip invoice' }], ['when', 'Date', { placeholder: 'Nov 26, 2026' }], ['url', 'Link to the PDF (https://)', { type: 'url', placeholder: 'https://' }]], '+ Add an invoice', { name: '', when: '', url: '' });

  const status = h('p', { class: 'small', role: 'status' });
  async function save() {
    const out = { ...trip };
    for (const [k, w] of Object.entries(f)) out[k] = w.input.value.trim();
    out.days = days;
    out.flights = flights.filter(x => x.from || x.to || x.flight);
    out.documents = docs.filter(x => x.name || x.url);
    if (out.documents.some(d => !safeLink(d.url))) { status.textContent = 'Every document link must start with https://'; return; }
    out.payments = pays.filter(x => x.label || x.amount);
    out.invoices = invs.filter(x => x.name || x.url);
    const badLink = v => v && !safeLink(v);
    if (out.payments.some(x => badLink(x.pay_link) || badLink(x.receipt_url)) || out.invoices.some(x => !safeLink(x.url || '')) || out.flights.some(x => badLink(x.checkin))) { status.textContent = 'Every link must start with https://'; return; }
    out.proposal = { price_note: pf.price_note.input.value.trim(), valid_until: pf.valid_until.input.value.trim(), includes: pf.includes.input.value.split('\n').map(x => x.trim()).filter(Boolean) };
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
    h('fieldset', {}, h('legend', {}, 'Trip'), f.title, h('div', { class: 'row' }, f.subtitle, f.dates_text), h('div', { class: 'row' }, f.start_date, f.status)),
    h('fieldset', {}, h('legend', {}, 'Proposal (shown while Stage is Proposal)'), h('div', { class: 'row' }, f.price_total, pf.valid_until), pf.price_note, pf.includes),
    h('h2', { style: 'font-size:18px;margin:22px 0 10px' }, 'Day by day'),
    daysBox,
    h('button', { class: 'btn ghost', type: 'button', onclick: () => { days.push({ city: days.length ? days[days.length - 1].city : '', title: '', body: '', stay: days.length ? days[days.length - 1].stay : '', included: '' }); drawDays(); } }, '+ Add a day'),
    h('h2', { style: 'font-size:18px;margin:26px 0 10px' }, 'Flights'), flightsBox,
    h('h2', { style: 'font-size:18px;margin:26px 0 10px' }, 'Documents'), docsBox,
    h('h2', { style: 'font-size:18px;margin:26px 0 4px' }, 'Payment schedule'),
    h('p', { class: 'small', style: 'margin:0 0 10px' }, 'Each payment shows on the client’s Pay tab. Paste the Fora or Stripe link; mark it Paid and add the receipt link once it’s paid.'), paysBox,
    h('h2', { style: 'font-size:18px;margin:26px 0 10px' }, 'Invoices'), invsBox,
    pays.length ? null : h('fieldset', { style: 'margin-top:22px' }, h('legend', {}, 'Single payment link (used when there is no payment schedule)'), f.pay_link, h('div', { class: 'row' }, f.pay_amount, f.pay_due), f.paid_note),
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
