// Inline SVG markup per symbol id, so the game ships no binary assets.
// The markup is static and author-controlled; it is parsed once per node
// via DOMParser rather than injected as raw HTML.

// Här ligger ritningen (SVG-kod) för varje symbol, en per nyckel. Allt ritas
// alltså i kod istället för att ladda in bildfiler.
const SYMBOL_SVGS = {
  cherry: `<svg viewBox="0 0 64 64" aria-label="cherry"><path d="M32 8 C26 20 18 26 16 36" fill="none" stroke="#3e7d2f" stroke-width="4" stroke-linecap="round"/><path d="M32 8 C40 18 46 24 46 34" fill="none" stroke="#3e7d2f" stroke-width="4" stroke-linecap="round"/><circle cx="16" cy="45" r="11" fill="#d2222a"/><circle cx="46" cy="43" r="11" fill="#e8323c"/><circle cx="12" cy="41" r="3" fill="#f4757c"/><circle cx="42" cy="39" r="3" fill="#f4757c"/></svg>`,
  lemon: `<svg viewBox="0 0 64 64" aria-label="lemon"><ellipse cx="32" cy="36" rx="21" ry="14" fill="#f7d117" transform="rotate(-20 32 36)"/><circle cx="48" cy="21" r="4" fill="#e3b800"/><ellipse cx="26" cy="32" rx="6" ry="3" fill="#fbe98a" transform="rotate(-20 26 32)"/></svg>`,
  grape: `<svg viewBox="0 0 64 64" aria-label="grape"><path d="M32 6 C32 12 30 16 26 18" fill="none" stroke="#3e7d2f" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="26" r="8" fill="#7b3fa0"/><circle cx="40" cy="26" r="8" fill="#8d4bb5"/><circle cx="16" cy="38" r="8" fill="#8d4bb5"/><circle cx="32" cy="38" r="8" fill="#7b3fa0"/><circle cx="48" cy="38" r="8" fill="#9c5cc4"/><circle cx="24" cy="50" r="8" fill="#9c5cc4"/><circle cx="40" cy="50" r="8" fill="#7b3fa0"/></svg>`,
  bell: `<svg viewBox="0 0 64 64" aria-label="bell"><path d="M32 8 c10 0 14 9 14 19 0 9 3 13 7 15 H11 c4 -2 7 -6 7 -15 0 -10 4 -19 14 -19 z" fill="#f5c542" stroke="#c9971c" stroke-width="2"/><circle cx="32" cy="48" r="5" fill="#c9971c"/><rect x="29" y="4" width="6" height="6" rx="2" fill="#c9971c"/></svg>`,
  seven: `<svg viewBox="0 0 64 64" aria-label="seven"><text x="32" y="50" text-anchor="middle" font-size="50" font-family="'Arial Black', Arial, sans-serif" font-weight="900" fill="#e8323c" stroke="#8f0f16" stroke-width="2" paint-order="stroke">7</text></svg>`,
  diamond: `<svg viewBox="0 0 64 64" aria-label="diamond"><polygon points="32,8 52,24 32,56 12,24" fill="#3bb3e8"/><polygon points="32,8 42,24 32,56 22,24" fill="#7fd4f5"/><polygon points="12,24 52,24 32,32 32,32" fill="#2a93c4" opacity="0.5"/></svg>`,
  horseshoe: `<svg viewBox="0 0 64 64" aria-label="horseshoe"><path d="M17 52 C10 38 12 14 32 14 C52 14 54 38 47 52" fill="none" stroke="#c9971c" stroke-width="9" stroke-linecap="round"/><circle cx="17" cy="44" r="2.5" fill="#8a660f"/><circle cx="47" cy="44" r="2.5" fill="#8a660f"/><circle cx="20" cy="26" r="2.5" fill="#8a660f"/><circle cx="44" cy="26" r="2.5" fill="#8a660f"/></svg>`,
  bar: `<svg viewBox="0 0 64 64" aria-label="bar"><rect x="6" y="21" width="52" height="22" rx="6" fill="#1c1c2e" stroke="#f5c542" stroke-width="3"/><text x="32" y="38" text-anchor="middle" font-size="14" font-family="Arial, sans-serif" font-weight="bold" fill="#f5c542" letter-spacing="1">BAR</text></svg>`,
};

const parser = new DOMParser();
const SVG_NS = 'http://www.w3.org/2000/svg';

// Tar ett symbolnamn (t.ex. "cherry") och ger tillbaka ett färdigt SVG-element
// som man kan stoppa in på sidan.
export function symbolNode(symbol) {
  // XML parsing needs the namespace declared or the result is not real SVG.
  // Vi smyger in xmlns-attributet så att webbläsaren förstår att det är en SVG.
  const markup = SYMBOL_SVGS[symbol].replace('<svg ', `<svg xmlns="${SVG_NS}" `);
  // Tolkar texten till riktig SVG och returnerar själva elementet.
  return parser.parseFromString(markup, 'image/svg+xml').documentElement;
}
