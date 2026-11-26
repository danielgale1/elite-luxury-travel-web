// Colour weather icons drawn for this app. Open-Meteo weather codes -> picture.
const DEFS = `<defs>
<radialGradient id="wxSun" cx="40%" cy="38%" r="65%"><stop offset="0" stop-color="#FFE28A"/><stop offset=".6" stop-color="#F7BE45"/><stop offset="1" stop-color="#EE9F2E"/></radialGradient>
<radialGradient id="wxGlow" r="50%"><stop offset="0" stop-color="#FFD66B" stop-opacity=".55"/><stop offset="1" stop-color="#FFD66B" stop-opacity="0"/></radialGradient>
<linearGradient id="wxCloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D9E1EA"/></linearGradient>
<linearGradient id="wxCloudBack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3F6F9"/><stop offset="1" stop-color="#C9D3DE"/></linearGradient>
<linearGradient id="wxDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A3AEBC"/><stop offset="1" stop-color="#6E7A89"/></linearGradient>
<linearGradient id="wxDrop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7DB8F2"/><stop offset="1" stop-color="#2F7FD3"/></linearGradient>
<linearGradient id="wxBolt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE07A"/><stop offset="1" stop-color="#F2A41F"/></linearGradient>
<filter id="wxShadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="1.6" stdDeviation="1.4" flood-color="#5B6B7E" flood-opacity=".28"/></filter>
</defs>`;

const CLOUD_PATH = 'M15 35h29.5a10.5 10.5 0 0 0 1.4-20.9A14.5 14.5 0 0 0 18.2 11.6 11.5 11.5 0 0 0 15 35z';
const cloud = (x, y, s, fill = 'url(#wxCloud)') =>
  `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#wxShadow)"><path d="${CLOUD_PATH}" fill="${fill}"/></g>`;
const sun = (cx, cy, r) =>
  `<circle cx="${cx}" cy="${cy}" r="${r * 1.9}" fill="url(#wxGlow)"/>` +
  `<g class="wx-spin" style="transform-origin:${cx}px ${cy}px">${[0, 45, 90, 135, 180, 225, 270, 315].map(a =>
    `<rect x="${cx - 1.5}" y="${cy - r - 9}" width="3" height="5.5" rx="1.5" fill="#F7BE45" transform="rotate(${a} ${cx} ${cy})"/>`).join('')}</g>` +
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#wxSun)"/>`;
const drop = (x, y, k) => `<path class="wx-drop" style="animation-delay:${(k * 0.28).toFixed(2)}s" d="M${x} ${y}c-2.2 3-3.2 4.8-3.2 6.2a3.2 3.2 0 0 0 6.4 0c0-1.4-1-3.2-3.2-6.2z" fill="url(#wxDrop)"/>`;
const drops = n => Array.from({ length: n }, (_, i) => drop(19 + i * (n === 4 ? 8.5 : 11), 45 + (i % 2) * 4, i)).join('');
const flake = (x, y, k) => `<g class="wx-drop" style="animation-delay:${(k * 0.35).toFixed(2)}s" stroke="#8EC1EE" stroke-width="2" stroke-linecap="round">` +
  [0, 60, 120].map(a => `<line x1="${x}" y1="${y - 3.5}" x2="${x}" y2="${y + 3.5}" transform="rotate(${a} ${x} ${y})"/>`).join('') + '</g>';
const fog = `<g class="wx-drift" stroke="#B9C4D0" stroke-width="3.4" stroke-linecap="round"><line x1="12" y1="46" x2="44" y2="46"/><line x1="20" y1="53" x2="52" y2="53"/><line x1="14" y1="60" x2="36" y2="60"/></g>`;

const PICS = {
  clear: () => sun(32, 32, 12.5),
  partly: () => sun(23, 22, 9.5) + `<g class="wx-drift">${cloud(8, 15, 0.92)}</g>`,
  cloudy: () => `<g class="wx-drift">${cloud(-2, 5, 0.72, 'url(#wxCloudBack)')}</g>` + cloud(6, 14, 0.95),
  fog: () => cloud(4, 0, 0.92) + fog,
  drizzle: () => cloud(4, 2, 0.95) + drops(3),
  rain: () => cloud(4, 2, 0.95, 'url(#wxDark)') + drops(4),
  showers: () => sun(44, 15, 7.5) + cloud(3, 7, 0.9) + drops(3),
  snow: () => cloud(4, 2, 0.95) + [[20, 49], [32, 54], [44, 49]].map(([x, y], k) => flake(x, y, k)).join(''),
  storm: () => cloud(4, 2, 0.95, 'url(#wxDark)') + `<path class="wx-flash" d="M33 38l-8 12h6.5l-3.5 11 11-15h-6.5l3.5-8z" fill="url(#wxBolt)"/>` + drop(18, 46, 0) + drop(46, 46, 1)
};

export function wxKind(code) {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2) return 'partly';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 67) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 80 && code <= 82) return 'showers';
  if (code >= 95) return 'storm';
  return 'cloudy';
}

export function wxIcon(code, size) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 64 64');
  s.setAttribute('class', 'wx-icon' + (size ? ' ' + size : ''));
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = DEFS + PICS[wxKind(code)]();  // static markup built above, no user data
  return s;
}
