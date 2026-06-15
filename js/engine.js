// Pure game logic. No DOM, no I/O: testable with node --test.

export const STRIP_LENGTH = 12; //requirement of 12 symbols per reel

export const REEL_STRIPS = [
  ['cherry', 'seven', 'lemon', 'bar', 'grape', 'bell', 'diamond', 'lemon', 'horseshoe', 'grape', 'seven', 'bell'],
  ['lemon', 'grape', 'seven', 'cherry', 'bell', 'bar', 'lemon', 'diamond', 'grape', 'horseshoe', 'bell', 'seven'],
  ['bell', 'lemon', 'cherry', 'grape', 'seven', 'diamond', 'bar', 'grape', 'lemon', 'horseshoe', 'seven', 'cherry'],
];

// Multiplier applied to the bet, keyed by match count on the center line.
export const PAYOUTS = { 2: 2, 3: 10 };

export function spin(rng = Math.random) {
  return REEL_STRIPS.map(() => Math.floor(rng() * STRIP_LENGTH));
}

export function centerLine(stops) {
  return stops.map((stop, reel) => REEL_STRIPS[reel][stop]);
}

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

export function payout(result, bet) {
  if (!result.win) return 0;
  return bet * PAYOUTS[result.count];
}
