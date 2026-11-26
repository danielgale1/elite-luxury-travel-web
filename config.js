// Elite Luxury Travel client app settings.
// Leave SUPABASE_URL empty to run in demo mode with the sample trip.
// The anon key is Supabase's public browser key; access is protected by the
// row-level security rules in schema.sql.
export const SUPABASE_URL = 'https://rytthbqmyghwyaeiipho.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dHRoYnFteWdod3lhZWlpcGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1MjQwNjUsImV4cCI6MjExMTEwMDA2NX0.TXgAo1xzaqaTW0KiaIFVS14CcHNGDiJ8UqkBRdd1TOc';

export const BRAND = {
  name: 'Elite Luxury Travel',
  email: 'office@eliteluxurytravel.llc',
  privacyUrl: 'https://www.eliteluxurytravel.llc/privacy-policy',
  advisor: 'Jordan Barnes',
  // Optional phone number for the Call button, international format (e.g. '+15551234567').
  phone: '+15593698563',
  // Optional WhatsApp number in international format, digits only (e.g. '15551234567').
  whatsapp: '',
  // Photo on the sign-in screen (from the Elite website).
  // "Plan a new trip" opens the booking page on the Elite website.
  // Optional: your Google review link. Happy reviewers (4-5 stars) get a button to post there too.
  googleReviewUrl: '',
  planUrl: 'https://www.eliteluxurytravel.llc/plan-your-journey',
  signinImage: 'https://images.unsplash.com/photo-1530476219733-88085e45aa2c?w=1200&q=80&auto=format&fit=crop'
};

// Curated journeys from the Elite website, shown on the "New trip" tab.
// Each opens the website's booking form with that journey picked.
const SQ = 'https://images.squarespace-cdn.com/content/6a3ead383af5dc37cc4928a6/';
const UN = id => 'https://images.unsplash.com/' + id + '?w=900&q=80&auto=format&fit=crop';
export const JOURNEYS = [
  { slug: 'rome-and-florence', title: 'Rome & Florence', meta: 'Italy · 7 nights', image: SQ + '75860ccc-dcf7-4ca9-b710-58485a5af1e4/Ys1jQraWs2CqD086mLRf1lZqlLkvJCdTGYLhYich7JA6sfV7Ku5YsYaG1YUbeoNANeE1MqLMgGX24ivaPHaMrFUBrSRCw4LPJO6iqMQT-YcMyIy751cE6llvhOtr0TJVBKbtAhIz1XfunvR9CYdrRknlh8DOybM_V2LqJRoqDJD4L9v2MVG7vxF5drzXFTSb.jpg?format=750w' },
  { slug: 'paris-beautifully-arranged', title: 'Paris, Beautifully Arranged', meta: 'France · 4 nights', image: UN('photo-1502602898657-3e91760cbb34') },
  { slug: 'maldives-unhurried', title: 'Maldives, Unhurried', meta: 'Maldives · 6 nights', image: UN('photo-1514282401047-d79a71a590e8') },
  { slug: 'tokyo-and-kyoto', title: 'Tokyo & Kyoto', meta: 'Japan · 8 nights', image: SQ + 'e89e9123-f4b8-4994-9e76-98ecd9b6a051/KxfAP6rNT9NL3XmTSbwmsTCUIDzbOerATqL30xoQtRmeIphwG1qWHP6-pqEdqwzpcgaJgCMT-k45HQ_MeCFfl8xPr4ZU_FJ5pW9n952vPfm4Lg7bicEiqaNZDxH75C63i1iE3osXeZmT3Khu76ATTiZebFcVpTB3zl8_o5EVXg19tbc4Q0-iVkZ1ZZKOZh9h.jpg?format=750w' },
  { slug: 'riviera-maya-retreat', title: 'Riviera Maya Retreat', meta: 'Mexico · 5 nights', image: UN('photo-1510097467424-192d713fd8b2') },
  { slug: 'manila-and-boracay', title: 'Manila & Boracay', meta: 'Philippines · 6 nights', image: UN('photo-1507525428034-b723cf961d3e') }
];
