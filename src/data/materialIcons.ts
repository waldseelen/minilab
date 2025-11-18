// Lightweight mapping of common materials to icons (served from /icons or small SVG data URIs)

const iconBase = '/icons';

// Generic inline SVG badges for quick coverage
const svg = {
  bottle: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="4" rx="1" fill="#60a5fa"/><path d="M8 6h8v12a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6z" fill="#93c5fd" stroke="#1d4ed8"/></svg>'
  )}`,
  jar: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="4" rx="1" fill="#9ca3af"/><rect x="5" y="7" width="14" height="14" rx="3" fill="#e5e7eb" stroke="#6b7280"/></svg>'
  )}`,
  scissors: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="6" cy="7" r="3" fill="#ef4444"/><circle cx="6" cy="17" r="3" fill="#ef4444"/><path d="M9 8l11-5M9 16l11 5" stroke="#111827" stroke-width="2"/></svg>'
  )}`,
  straw: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 20l10-16 2 1-10 16z" fill="#f59e0b"/><rect x="15" y="2" width="5" height="3" transform="rotate(30 15 2)" fill="#fde68a"/></svg>'
  )}`,
  tape: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="11" cy="12" r="7" fill="#fbbf24" stroke="#92400e"/><circle cx="11" cy="12" r="3" fill="#fff"/><rect x="13" y="11" width="8" height="2" fill="#92400e"/></svg>'
  )}`,
  leaf: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 14c0-6 6-10 12-10 0 6-4 12-10 12H4z" fill="#10b981"/><path d="M4 14c6 0 10-4 12-10" stroke="#065f46" stroke-width="2"/></svg>'
  )}`,
  seed: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="6" ry="8" fill="#8b5cf6"/><path d="M12 4c2 3 2 7 0 10" stroke="#4c1d95" stroke-width="2"/></svg>'
  )}`,
  battery: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3" y="7" width="16" height="10" rx="2" fill="#111827"/><rect x="5" y="9" width="12" height="6" fill="#10b981"/><rect x="19" y="10" width="2" height="4" fill="#6b7280"/></svg>'
  )}`,
  magnet: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 3h4v6H7a4 4 0 0 0 0 8h4v4H7a8 8 0 1 1 0-16z" fill="#ef4444"/><path d="M13 3h4a8 8 0 1 1 0 16h-4v-4h4a4 4 0 1 0 0-8h-4V3z" fill="#3b82f6"/></svg>'
  )}`,
  bulb: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3a7 7 0 0 1 5 12c-1 1-1 2-1 3H8c0-1 0-2-1-3a7 7 0 0 1 5-12z" fill="#fde68a" stroke="#f59e0b"/><rect x="9" y="18" width="6" height="3" fill="#374151"/></svg>'
  )}`,
  compass: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#e5e7eb" stroke="#6b7280"/><path d="M12 6l3 6-6 3 3-9z" fill="#3b82f6"/></svg>'
  )}`,
  egg: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3c4 0 7 6 7 10a7 7 0 0 1-14 0c0-4 3-10 7-10z" fill="#fde68a"/></svg>'
  )}`,
  ziploc: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="#bfdbfe" stroke="#3b82f6"/><rect x="3" y="5" width="18" height="3" fill="#60a5fa"/></svg>'
  )}`,
  brush: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 3l7 7-8 8-5 1 1-5 8-8z" fill="#f472b6"/><path d="M4 20c2 0 3-1 3-3H4v3z" fill="#9ca3af"/></svg>'
  )}`,
  plate: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#e5e7eb"/><circle cx="12" cy="12" r="5" fill="#fff"/></svg>'
  )}`,
  stone: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 16l4-8 8-2 4 10-6 4-6-4z" fill="#9ca3af"/></svg>'
  )}`,
};

export function getMaterialIcon(material: string): string | undefined {
  const m = material.toLowerCase();
  // chemistry & fluids
  if (/(baking soda|karbonat)/.test(m)) return `${iconBase}/chemistry.svg`;
  if (/(vinegar|sirke)/.test(m)) return `${iconBase}/chemistry.svg`;
  if (/(food coloring|gıda boyası)/.test(m)) return `${iconBase}/chemistry.svg`;
  if (/(glue|tutkal|borax|boraks)/.test(m)) return `${iconBase}/chemistry.svg`;
  if (/(lemon|limon)/.test(m)) return `${iconBase}/chemistry.svg`;

  // environment & water/sand
  if (/(water|su)/.test(m)) return `${iconBase}/environment.svg`;
  if (/(sand|kum|gravel|çakıl|charcoal|aktif karbon)/.test(m)) return `${iconBase}/environment.svg`;
  if (/(leaf|yaprak)/.test(m)) return svg.leaf;

  // physics & motion
  if (/(balloon|balon)/.test(m)) return `${iconBase}/physics.svg`;
  if (/(string|ip)/.test(m)) return svg.straw;
  if (/(straw|pipet)/.test(m)) return svg.straw;
  if (/(tape|bant)/.test(m)) return svg.tape;

  // engineering & tools
  if (/(battery|pil)/.test(m)) return svg.battery;
  if (/(light bulb|ampul)/.test(m)) return svg.bulb;
  if (/(magnet|mıknatıs)/.test(m)) return svg.magnet;
  if (/(scissors|makas)/.test(m)) return svg.scissors;
  if (/(bottle|şişe)/.test(m)) return svg.bottle;
  if (/(jar|kavanoz)/.test(m)) return svg.jar;
  if (/(paper plate|kağıt tabak)/.test(m)) return svg.plate;
  if (/(marker|kalem)/.test(m)) return svg.brush;
  if (/(stone|taş|marker|işaretleyici)/.test(m)) return svg.stone;

  // biology & seeds
  if (/(seed|tohum|fasulye)/.test(m)) return svg.seed;

  // misc
  if (/(egg|yumurta)/.test(m)) return svg.egg;
  if (/(ziploc|kilitsiz poşet|poşet)/.test(m)) return svg.ziploc;

  // paper & stationery default
  if (/(paper|kağıt|defter)/.test(m)) return `${iconBase}/engineering.svg`;
  if (/(cotton|pamuk)/.test(m)) return `${iconBase}/biology.svg`;

  return undefined;
}


