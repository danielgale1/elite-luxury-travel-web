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
  whatsapp: '15593698563',
  // Photo on the sign-in screen (from the Elite website).
  // "Plan a new trip" opens the booking page on the Elite website.
  // Optional: your Google review link. Happy reviewers (4-5 stars) get a button to post there too.
  googleReviewUrl: '',
  planUrl: 'https://www.eliteluxurytravel.llc/plan-your-journey',
  signinImage: 'https://images.unsplash.com/photo-1530476219733-88085e45aa2c?w=1200&q=80&auto=format&fit=crop'
};

// Curated journeys from the Elite website (eliteluxurytravel.llc/curated-journeys).
// Each opens its journey page on the website.
const SQ = 'https://images.squarespace-cdn.com/content/6a3ead383af5dc37cc4928a6/';
const UN = id => 'https://images.unsplash.com/' + id + '?w=900&q=80&auto=format&fit=crop';
const SITE = 'https://www.eliteluxurytravel.llc';
export const JOURNEYS = [
  { title: 'Rome, Florence & Venice', meta: 'Italy · 10 days', from: 'From $8,900', url: SITE + '/journey-italy-rome-florence-venice', image: SQ + '75860ccc-dcf7-4ca9-b710-58485a5af1e4/Ys1jQraWs2CqD086mLRf1lZqlLkvJCdTGYLhYich7JA6sfV7Ku5YsYaG1YUbeoNANeE1MqLMgGX24ivaPHaMrFUBrSRCw4LPJO6iqMQT-YcMyIy751cE6llvhOtr0TJVBKbtAhIz1XfunvR9CYdrRknlh8DOybM_V2LqJRoqDJD4L9v2MVG7vxF5drzXFTSb.jpg?format=1000w' },
  { title: 'Amalfi Coast & Capri', meta: 'Italy · 8 days', from: 'From $8,900', url: SITE + '/journey-amalfi-coast-capri', image: UN('photo-1530476219733-88085e45aa2c') },
  { title: 'Athens, Mykonos & Santorini', meta: 'Greece · 9 days', from: 'From $7,900', url: SITE + '/journey-athens-mykonos-santorini', image: SQ + '700e399d-adec-4d79-9dd3-e8b21285ee13/um3Ox-Y8A8wDi1jJZD5dyf0LtGG2s6CgSg8tHOEPz6N2ooaOyvFXbPYydrk1Beh_4OmGVLWFgpCmRTrPKqjWlEJmpmcnB-EZsqMHelIRJVbCF5ilv9BgLsHer6By4crSl7ULN1qs_XEBSEtLk11N_NcqRzwhdjTRJXIeFUHcCkk1hbMFUZobjd5klkNanafG.jpg?format=1000w' },
  { title: 'Paris & the French Riviera', meta: 'France · 9 days', from: 'From $8,900', url: SITE + '/journey-paris-french-riviera', image: UN('photo-1502602898657-3e91760cbb34') },
  { title: 'The Swiss Alps by Rail', meta: 'Switzerland · 9 days', from: 'From $8,500', url: SITE + '/journey-swiss-alps', image: UN('photo-1527668752968-14dc70a27c95') },
  { title: 'Japan: Tokyo to Kyoto', meta: 'Japan · 10 days', from: 'From $9,500', url: SITE + '/journey-japan-tokyo-kyoto', image: SQ + 'e89e9123-f4b8-4994-9e76-98ecd9b6a051/KxfAP6rNT9NL3XmTSbwmsTCUIDzbOerATqL30xoQtRmeIphwG1qWHP6-pqEdqwzpcgaJgCMT-k45HQ_MeCFfl8xPr4ZU_FJ5pW9n952vPfm4Lg7bicEiqaNZDxH75C63i1iE3osXeZmT3Khu76ATTiZebFcVpTB3zl8_o5EVXg19tbc4Q0-iVkZ1ZZKOZh9h.jpg?format=1000w' },
  { title: 'Maldives Overwater Retreat', meta: 'Maldives · 7 days', from: 'From $9,500', url: SITE + '/journey-maldives-overwater', image: UN('photo-1514282401047-d79a71a590e8') },
  { title: 'Bora Bora & Moorea', meta: 'French Polynesia · 9 days', from: 'From $11,900', url: SITE + '/journey-bora-bora-moorea', image: UN('photo-1589197331516-4d84b72ebde3') },
  { title: 'Masai Mara & Serengeti Safari', meta: 'Kenya & Tanzania · 10 days', from: 'From $12,900', url: SITE + '/journey-safari-kenya-tanzania', image: UN('photo-1516426122078-c23e76319801') },
  { title: 'Cape Town, Winelands & Safari', meta: 'South Africa · 10 days', from: 'From $9,500', url: SITE + '/journey-cape-town-safari', image: UN('photo-1580060839134-75a5edca2e99') }
];
