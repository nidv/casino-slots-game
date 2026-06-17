// Pure game logic. No DOM, no I/O: testable with node --test.

export const STRIP_LENGTH = 12; //requirement of 12 symbols per reel

// Symbolordningen på varje hjul (tre hjul = tre listor). Det är den här
// ordningen man "snurrar förbi" och stannar på.
export const REEL_STRIPS = [
  ['cherry', 'seven', 'lemon', 'bar', 'grape', 'bell', 'diamond', 'lemon', 'horseshoe', 'grape', 'seven', 'bell'],
  ['lemon', 'grape', 'seven', 'cherry', 'bell', 'bar', 'lemon', 'diamond', 'grape', 'horseshoe', 'bell', 'seven'],
  ['bell', 'lemon', 'cherry', 'grape', 'seven', 'diamond', 'bar', 'grape', 'lemon', 'horseshoe', 'seven', 'cherry'],
];

// Multiplier applied to the bet, keyed by match count on the center line.
export const PAYOUTS = { 2: 2, 3: 10 };

// Lottar fram var varje hjul ska stanna. Ger tillbaka tre slumptal (ett index
// per hjul). rng går att skicka in för att kunna testa med ett förutsägbart tal.
export function spin(rng = Math.random) {
  return REEL_STRIPS.map(() => Math.floor(rng() * STRIP_LENGTH));
}

// Översätter stopp-positionerna till vilka symboler som hamnar på mittlinjen.
export function centerLine(stops) {
  return stops.map((stop, reel) => REEL_STRIPS[reel][stop]);
}

// Kollar mittlinjen: räknar hur många av varje symbol och plockar ut den
// vanligaste. Vinst om man fått minst två lika.
export function evaluate(line) {
  const counts = new Map();
  for (const symbol of line) {
    counts.set(symbol, (counts.get(symbol) ?? 0) + 1);
  }
  let best = { symbol: null, count: 0 };
  for (const [symbol, count] of counts) {
    if (count > best.count) best = { symbol, count };
  }
  return { win: best.count >= 2, count: best.count, symbol: best.symbol };
}

// Räknar ut vinsten: insatsen gånger multiplikatorn för antalet lika symboler.
// Ingen vinst ger 0.
export function payout(result, bet) {
  if (!result.win) return 0;
  return bet * PAYOUTS[result.count];
}
