import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const DEMO = !SUPABASE_URL;
// The store app ships its own copy of the library; the website loads it from the CDN.
const SUPABASE_LIB = window.ELT_NATIVE ? './vendor/supabase.js' : 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

let client = null;
export async function sb() {
  if (DEMO) return null;
  if (!client) {
    const { createClient } = await import(SUPABASE_LIB);
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, detectSessionInUrl: true, flowType: 'pkce' }
    });
  }
  return client;
}

// Sample trip used in demo mode.
const SAMPLE = [{
  id: 'sample-italy',
  client_name: 'Christine',
  client_email: 'demo@example.com',
  title: 'Italy Anniversary',
  subtitle: 'Rome, Florence, Venice, Milan',
  dates_text: 'Sample dates: May 12 to 23, 2027',
  start_date: '2027-05-12',
  flights: [
    { from: 'New York (JFK)', to: 'Rome (FCO)', flight: 'AZ 609', when: 'Tue, May 11 · departs 6:45 PM, lands 9:20 AM May 12', ref: 'SAMPLE1' },
    { from: 'Milan (MXP)', to: 'New York (JFK)', flight: 'AZ 604', when: 'Sun, May 23 · departs 1:10 PM, lands 3:55 PM', ref: 'SAMPLE1' }
  ],
  // Tickets, vouchers and confirmations. Jordan uploads the PDFs on the admin page.
  documents: [
    { name: 'Flight e-tickets', kind: 'ticket', sample: { heading: 'Electronic ticket receipt', rows: [['Passengers', '2 adults'], ['Booking code', 'SAMPLE1'], ['Outbound', 'AZ 609 · New York (JFK) to Rome (FCO) · Tue, May 11'], ['Return', 'AZ 604 · Milan (MXP) to New York (JFK) · Sun, May 23'], ['Class', 'Business']], foot: 'Show your passport at check-in. Online check-in opens 24 hours before departure.' } },
    { name: 'Vatican early entry tickets', kind: 'voucher', sample: { heading: 'Tour voucher', rows: [['Tour', 'Early entry: Vatican Museums & Sistine Chapel'], ['Date', 'Fri, May 14 · 7:30 AM'], ['Guests', '2'], ['Meeting point', 'Vatican Museums entrance']], qr: true, foot: 'Show this QR code to your guide on your phone. No need to print.' } },
    { name: 'Train tickets: Rome, Florence, Venice, Milan', kind: 'voucher', sample: { heading: 'Rail tickets', rows: [['May 16', 'Roma Termini to Firenze S.M.N. · 10:20 AM'], ['May 19', 'Firenze S.M.N. to Venezia S. Lucia · 11:30 AM'], ['May 22', 'Venezia S. Lucia to Milano Centrale · 10:25 AM'], ['Class', 'First class, 2 travellers']], qr: true, foot: 'Show the QR code on board when asked.' } },
    { name: 'Hotel confirmations', kind: 'hotel', sample: { heading: 'Hotel confirmations', rows: [['Rome', 'Singer Palace Hotel · May 12 to 16 · Conf. SAMPLE-4821'], ['Florence', 'The Place Firenze · May 16 to 19 · Conf. SAMPLE-7733'], ['Venice', 'Hotel Londra Palace · May 19 to 22 · Conf. SAMPLE-1904'], ['Milan', 'Park Hyatt Milan · May 22 to 23 · Conf. SAMPLE-5560']], foot: 'Your name is on every reservation. Just give your name at the front desk.' } },
    { name: 'Travel insurance policy', kind: 'doc', sample: { heading: 'Travel insurance', rows: [['Covered', '2 travellers · May 11 to 23, 2027'], ['Policy', 'SAMPLE-POLICY']], foot: 'Keep this with you while you travel.' } }
  ],
  // Payment schedule. Each payment opens Fora's or Stripe's secure page; receipts are kept here.
  price_total: '$24,800',
  payments: [
    { label: 'Deposit', amount: '$5,000', status: 'paid', when: 'Paid Nov 26, 2026', receipt: { heading: 'Payment receipt', rows: [['For', 'Italy Anniversary · deposit'], ['Amount', '$5,000.00'], ['Paid', 'Nov 26, 2026'], ['Method', 'Card, via secure checkout']], foot: 'Sample receipt for the preview.' } },
    { label: 'Final balance', amount: '$19,800', status: 'due', when: 'Due Mar 1, 2027', pay_link: 'https://example.com/secure-checkout' }
  ],
  invoices: [
    { name: 'Trip invoice', when: 'Nov 26, 2026', sample: { heading: 'Invoice', rows: [['Trip', 'Italy Anniversary · May 12 to 23, 2027'], ['Travellers', '2 adults'], ['Trip total', '$24,800.00'], ['Deposit paid', '$5,000.00 · Nov 26, 2026'], ['Balance due', '$19,800.00 by Mar 1, 2027']], foot: 'Sample invoice for the preview.' } }
  ],
  cover_image: 'https://images.squarespace-cdn.com/content/6a3ead383af5dc37cc4928a6/75860ccc-dcf7-4ca9-b710-58485a5af1e4/Ys1jQraWs2CqD086mLRf1lZqlLkvJCdTGYLhYich7JA6sfV7Ku5YsYaG1YUbeoNANeE1MqLMgGX24ivaPHaMrFUBrSRCw4LPJO6iqMQT-YcMyIy751cE6llvhOtr0TJVBKbtAhIz1XfunvR9CYdrRknlh8DOybM_V2LqJRoqDJD4L9v2MVG7vxF5drzXFTSb.jpg?format=1500w',
  places: [
    { city: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80&auto=format&fit=crop' },
    { city: 'Florence', image: 'https://images.unsplash.com/photo-1776377231754-d36928e6ee4d?w=1200&q=80&auto=format&fit=crop' },
    { city: 'Venice', image: 'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=1200&q=80&auto=format&fit=crop' },
    { city: 'Milan', image: '' }
  ],
  pay_link: '',
  pay_amount: '',
  pay_due: '',
  paid_note: '',
  days: [
    { city: 'Rome', title: 'Arrive in Rome', schedule: [{ time: '9:20 AM', title: 'Land in Rome', contact_name: 'Your driver (sample)', contact_phone: '+39 000 000 0001', note: 'Your driver waits in arrivals with your name' }, { time: '11:00 AM', title: 'Arrive at your hotel', note: 'Early check-in requested' }, { time: '7:30 PM', title: 'Dinner near the Spanish Steps', note: 'Table for two at Il Gabriello' }], checkin: 'Check-in from 2:00 PM', stay_address: 'Via Alessandro Specchi 10, Rome', body: 'Your driver meets you at the airport. Settle in, then an easy evening near the Spanish Steps.', stay: 'Singer Palace Hotel', included: 'Private airport transfer' },
    { city: 'Rome', title: 'Ancient Rome', schedule: [{ time: '9:00 AM', title: 'Colosseum & Roman Forum tour', contact_name: 'Your guide (sample)', contact_phone: '+39 000 000 0002', tour: true, note: 'Meet your guide at the Arch of Constantine' }, { time: '1:00 PM', title: 'Lunch in Monti', note: 'Free to explore' }], body: 'The Colosseum and Roman Forum with your own guide, no lines. Afternoon free.', stay: 'Singer Palace Hotel', included: 'Private guide and tickets' },
    { city: 'Rome', title: 'The Vatican', schedule: [{ time: '7:30 AM', title: 'Early entry: Vatican Museums & Sistine Chapel', tour: true, note: 'Meet at the Vatican Museums entrance' }, { time: '11:30 AM', title: 'St. Peter’s Basilica', note: 'Included with your guide' }], body: 'Early entry to the Vatican Museums and Sistine Chapel, then St. Peter’s.', stay: 'Singer Palace Hotel', included: 'Early-entry tickets and guide' },
    { city: 'Rome', title: 'A slow day', schedule: [{ time: '10:00 AM', title: 'Spa morning', note: 'Book at the front desk' }, { time: '6:00 PM', title: 'Trastevere evening walk', note: 'Dinner ideas from us' }], body: 'Nothing planned. Sleep in, enjoy the spa, and wander Trastevere.', stay: 'Singer Palace Hotel', included: 'Dinner ideas from us' },
    { city: 'Florence', title: 'Train to Florence', schedule: [{ time: '9:30 AM', title: 'Hotel pickup', note: 'Driver to Roma Termini' }, { time: '10:20 AM', title: 'First-class train to Florence', note: 'Frecciarossa 9519, arrives 11:56 AM' }, { time: '7:00 PM', title: 'Sunset at Piazzale Michelangelo', tour: true }], checkin: 'Check-in from 3:00 PM', stay_address: 'Piazza Santa Maria Novella 7, Florence', body: 'First class to Florence. Sunset over the city from Piazzale Michelangelo.', stay: 'The Place Firenze', included: 'First-class train and transfers' },
    { city: 'Florence', title: 'Medici Florence', schedule: [{ time: '9:30 AM', title: 'Private Duomo & Medici walk', tour: true, note: 'Meet your guide in the hotel lobby' }], body: 'A private walk through the Duomo and the story of the Medici.', stay: 'The Place Firenze', included: 'Private guide' },
    { city: 'Florence', title: 'Chianti for two', schedule: [{ time: '10:00 AM', title: 'Driver to Chianti', note: 'Pickup at your hotel' }, { time: '1:00 PM', title: 'Winery lunch', tour: true, note: 'Castello di Ama' }, { time: '5:30 PM', title: 'Back in Florence' }], body: 'A driver takes you to a Chianti winery for a long lunch among the vines.', stay: 'The Place Firenze', included: 'Private driver and winery lunch' },
    { city: 'Venice', title: 'Arrive by water', schedule: [{ time: '11:30 AM', title: 'Train to Venice', note: 'Frecciarossa 9411, arrives 1:35 PM' }, { time: '2:00 PM', title: 'Water taxi to your hotel' }, { time: '6:00 PM', title: 'Gondola ride', tour: true, note: 'Meet at the hotel dock' }], checkin: 'Check-in from 2:00 PM', stay_address: 'Riva degli Schiavoni 4171, Venice', body: 'Train to Venice, a water taxi to your hotel, and an evening gondola ride.', stay: 'Hotel Londra Palace', included: 'Water taxi and gondola' },
    { city: 'Venice', title: 'Murano & Burano', schedule: [{ time: '9:30 AM', title: 'Private boat to Murano', tour: true, note: 'From the hotel dock' }, { time: '12:30 PM', title: 'Lunch in Burano' }], body: 'A private boat to the glass studios of Murano and colourful Burano.', stay: 'Hotel Londra Palace', included: 'Private boat and guide' },
    { city: 'Venice', title: 'Your anniversary', schedule: [{ time: '8:00 PM', title: 'Anniversary dinner', note: 'Reserved for two, smart dress' }], body: 'A free morning, then an anniversary dinner we reserve for you.', stay: 'Hotel Londra Palace', included: 'Dinner reservation' },
    { city: 'Milan', title: 'On to Milan', schedule: [{ time: '10:25 AM', title: 'First-class train to Milan', note: 'Frecciarossa 9521, arrives 12:50 PM' }, { time: '4:00 PM', title: 'Duomo rooftops', tour: true, note: 'Skip-the-line tickets' }, { time: '8:00 PM', title: 'Farewell dinner' }], checkin: 'Check-in from 3:00 PM', body: 'First class to Milan. The Duomo rooftops, then a farewell dinner.', stay: 'Park Hyatt Milan', included: 'First-class train, rooftop entry' },
    { city: 'Milan', title: 'Heading home', schedule: [{ time: '9:30 AM', title: 'Private transfer to Malpensa', note: 'Pickup in the hotel lobby' }, { time: '1:10 PM', title: 'Flight home', note: 'AZ 604 to New York' }], body: 'Breakfast, then a private transfer to the airport for your flight home.', stay: 'Home', included: 'Private airport transfer' }
  ]
}];

// The sample trip shown to everyone as "See how your trip will look".
export function sampleTrip() {
  return { ...JSON.parse(JSON.stringify(SAMPLE[0])), id: 'sample', client_name: '', client_email: '', sample: true };
}

const CACHE_KEY = 'elt_trips_cache';
function cacheSet(v) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(v)); } catch (e) {} }
function cacheGet() { try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) { return null; } }
export function cacheClear() { try { localStorage.removeItem(CACHE_KEY); } catch (e) {} }

export async function getSession() {
  if (DEMO) return { user: { email: 'demo@example.com' }, demo: true };
  const c = await sb();
  const { data } = await c.auth.getSession();
  return data.session;
}

export async function sendLink(email, redirectPath) {
  if (DEMO) return { ok: true };
  const c = await sb();
  const redirect = new URL(redirectPath || './', location.href).href;
  const { error } = await c.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect, shouldCreateUser: true } });
  return error ? { ok: false, message: error.message } : { ok: true };
}

// ---------- Password accounts ----------
// New accounts confirm their email with a 6-digit code before they can see any trip.
// (Supabase > Authentication > Providers > Email: keep "Confirm email" ON.)
function res(error) { return error ? { ok: false, message: error.message } : { ok: true }; }

export async function signInPassword(email, password) {
  if (DEMO) return { ok: true };
  const c = await sb();
  const { error } = await c.auth.signInWithPassword({ email, password });
  if (error && /confirm/i.test(error.message)) return { ok: false, unconfirmed: true, message: error.message };
  return res(error);
}

export async function signUpPassword(email, password) {
  if (DEMO) return { ok: true, needsCode: true };
  const c = await sb();
  const { data, error } = await c.auth.signUp({ email, password });
  if (error) return res(error);
  return { ok: true, needsCode: !data.session };
}

export async function verifySignupCode(email, token) {
  if (DEMO) return { ok: true };
  const c = await sb();
  const { error } = await c.auth.verifyOtp({ email, token, type: 'signup' });
  return res(error);
}

export async function resendSignupCode(email) {
  if (DEMO) return { ok: true };
  const c = await sb();
  const { error } = await c.auth.resend({ type: 'signup', email });
  return res(error);
}

// Forgot password: email a code, sign in with it, then set a new password.
export async function sendResetCode(email) {
  if (DEMO) return { ok: true };
  const c = await sb();
  const { error } = await c.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
  return res(error);
}

export async function setNewPassword(password) {
  if (DEMO) return { ok: true };
  const c = await sb();
  const { error } = await c.auth.updateUser({ password });
  return res(error);
}

// Six-digit sign-in code by email. Works inside the store app, where email links can't open the app.
export async function sendCode(email) {
  if (DEMO) return { ok: true };
  const c = await sb();
  const { error } = await c.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  return error ? { ok: false, message: error.message } : { ok: true };
}

export async function verifyCode(email, token) {
  if (DEMO) return { ok: true };
  const c = await sb();
  const { error } = await c.auth.verifyOtp({ email, token, type: 'email' });
  return error ? { ok: false, message: error.message } : { ok: true };
}

// Delete account (required by Google Play and the App Store): removes the client's
// photos, reviews and login. Trips stay with the agency as booking records.
export async function deleteAccount() {
  if (DEMO) return { ok: true };
  const c = await sb();
  const { data: { user } } = await c.auth.getUser();
  if (!user) return { ok: false, message: 'Not signed in' };
  const { data: revs } = await c.from('reviews').select('photos').eq('user_id', user.id);
  const paths = (revs || []).flatMap(r => Array.isArray(r.photos) ? r.photos : []).filter(p => typeof p === 'string' && p.startsWith(user.id + '/'));
  if (paths.length) {
    const { error: e1 } = await c.storage.from('trip-photos').remove(paths);
    if (e1) return { ok: false, message: e1.message };
  }
  const { error } = await c.rpc('delete_my_account');
  if (error) return { ok: false, message: error.message };
  cacheClear();
  try { await c.auth.signOut({ scope: 'local' }); } catch (e) {}
  return { ok: true };
}

export async function signOut() {
  cacheClear();
  if (DEMO) return;
  const c = await sb();
  await c.auth.signOut();
}

// Hotel confirmation numbers for the sample trip.
const CONF = { 'Singer Palace Hotel': 'SAMPLE-4821', 'The Place Firenze': 'SAMPLE-7733', 'Hotel Londra Palace': 'SAMPLE-1904', 'Park Hyatt Milan': 'SAMPLE-5560' };
SAMPLE[0].days.forEach(d => { if (CONF[d.stay]) d.stay_conf = CONF[d.stay]; });

// Trip requests sent from the app ("Request this journey" / "Plan a custom trip").
// They go to Jordan, who replies with a proposal that appears in the app.
export async function submitTripRequest(req) {
  if (DEMO) { if (window.__P && window.__P.request) window.__P.request(req); return { ok: true }; }
  const c = await sb();
  const { data: { user } } = await c.auth.getUser();
  const { error } = await c.from('trip_requests').insert({ ...req, user_id: user ? user.id : null });
  return error ? { ok: false, message: error.message } : { ok: true };
}
export async function myRequests() {
  if (DEMO) return (window.__P && window.__P.requests) ? window.__P.requests() : [];
  const c = await sb();
  const { data, error } = await c.from('trip_requests').select('*').eq('status', 'open').order('created_at', { ascending: false });
  return error ? [] : (data || []);
}
// Marks a payment as made in the preview only. In the live app, Jordan (or the payment provider) confirms payments.
export function demoPaid(tripId, index) { if (DEMO && window.__P && window.__P.pay) window.__P.pay(tripId, index); }

// Admin: open requests, and closing one once a proposal is made.
export async function allRequests() {
  if (DEMO) return [];
  const c = await sb();
  const { data, error } = await c.from('trip_requests').select('*').eq('status', 'open').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function closeRequest(id) {
  if (DEMO) return;
  const c = await sb();
  const { error } = await c.from('trip_requests').update({ status: 'closed' }).eq('id', id);
  if (error) throw error;
}

// Trips visible to the signed-in client (row-level security filters them).
export async function myTrips() {
  if (DEMO) return SAMPLE;
  const c = await sb();
  try {
    const { data, error } = await c.from('trips').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    cacheSet(data);
    return data;
  } catch (e) {
    const cached = cacheGet();
    if (cached) return cached;
    throw e;
  }
}

// Admin helpers
export async function isAdmin() {
  if (DEMO) return true;
  const c = await sb();
  const { data, error } = await c.rpc('is_admin');
  return !error && data === true;
}

let demoStore = JSON.parse(JSON.stringify(SAMPLE));
export async function allTrips() {
  if (DEMO) return demoStore;
  const c = await sb();
  const { data, error } = await c.from('trips').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveTrip(trip) {
  if (DEMO) {
    if (!trip.id) trip.id = 'demo-' + Date.now();
    demoStore = demoStore.filter(t => t.id !== trip.id).concat([trip]);
    return trip;
  }
  const c = await sb();
  const row = { ...trip };
  delete row.created_at;
  if (!row.id) delete row.id;
  row.client_email = (row.client_email || '').trim().toLowerCase();
  const { data, error } = await c.from('trips').upsert(row).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTrip(id) {
  if (DEMO) { demoStore = demoStore.filter(t => t.id !== id); return; }
  const c = await sb();
  const { error } = await c.from('trips').delete().eq('id', id);
  if (error) throw error;
}

// ---------- Reviews ----------
export async function myReview(tripId) {
  if (DEMO) return null;
  const c = await sb();
  const { data } = await c.from('reviews').select('id, rating, created_at').eq('trip_id', tripId).limit(1);
  return (data && data[0]) || null;
}

// photos: JPEG blobs already resized on the phone. onProgress(done, total) after each upload.
export async function submitReview(trip, { rating, text, consent, photos }, onProgress) {
  if (DEMO) { for (let i = 0; i < photos.length; i++) { await new Promise(r => setTimeout(r, 250)); onProgress && onProgress(i + 1, photos.length); } return { ok: true }; }
  const c = await sb();
  const { data: { user } } = await c.auth.getUser();
  if (!user) return { ok: false, message: 'Not signed in' };
  const paths = [];
  for (let i = 0; i < photos.length; i++) {
    const path = user.id + '/' + trip.id + '/' + Date.now() + '-' + i + '.jpg';
    const { error } = await c.storage.from('trip-photos').upload(path, photos[i], { contentType: 'image/jpeg', upsert: false });
    if (error) return { ok: false, message: error.message };
    paths.push(path);
    onProgress && onProgress(i + 1, photos.length);
  }
  const { error } = await c.from('reviews').insert({ trip_id: trip.id, client_email: user.email, rating, body: text || null, share_ok: !!consent, photos: paths });
  return error ? { ok: false, message: error.message } : { ok: true };
}

// Admin: latest reviews with short-lived links to the photos.
export async function allReviews() {
  if (DEMO) return [];
  const c = await sb();
  const { data, error } = await c.from('reviews').select('*').order('created_at', { ascending: false }).limit(50);
  if (error) throw error;
  for (const r of data) {
    const paths = Array.isArray(r.photos) ? r.photos : [];
    if (!paths.length) { r.photoUrls = []; continue; }
    const { data: signed } = await c.storage.from('trip-photos').createSignedUrls(paths, 3600);
    r.photoUrls = (signed || []).map(x => x.signedUrl).filter(Boolean);
  }
  return data;
}

// Only allow real https links for payment buttons.
export function safeLink(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' ? u.href : '';
  } catch (e) { return ''; }
}
