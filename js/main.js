import { REEL_STRIPS, spin, centerLine, evaluate, payout } from './engine.js';
import { createReel } from './reel.js';
import { playWinJingle } from './audio.js';
import * as ui from './ui.js';

const BET_STEPS = [1, 2, 5, 10];
const START_CREDITS = 100;

let credits = START_CREDITS;
let betIndex = 0;
let state = 'idle';

const reels = [...document.querySelectorAll('.reel-window')].map(
  (el, i) => createReel(el, REEL_STRIPS[i]),
);

function bet() {
  return BET_STEPS[betIndex];
}

function refresh() {
  ui.setCredits(credits);
  ui.setBet(bet());
}

async function handleSpin() {
  if (state !== 'idle') return;
  if (credits < bet()) {
    ui.setMessage('Not enough credits for this bet');
    return;
  }
  state = 'spinning';
  credits -= bet();
  ui.setWin(0);
  refresh();
  ui.setMessage('Spinning...');
  ui.setControlsEnabled(false);
  for (const reel of reels) reel.clearWin();

  const stops = spin();
  // Later reels travel further and longer, so they stop left to right.
  await Promise.all(
    reels.map((reel, i) => reel.spinTo(stops[i], { loops: 2 + i, duration: 1100 + i * 350 })),
  );

  const line = centerLine(stops);
  const result = evaluate(line);
  if (result.win) {
    const pay = payout(result, bet());
    credits += pay;
    ui.setWin(pay);
    refresh();
    ui.setMessage(result.count === 3 ? `BIG WIN! +${pay} credits` : `WIN! +${pay} credits`, true);
    playWinJingle(result.count === 3);
    reels.forEach((reel, i) => {
      if (line[i] === result.symbol) reel.centerCell().classList.add('win-cell');
    });
  } else {
    ui.setMessage('No win this time. Spin again!');
  }

  state = 'idle';
  ui.setControlsEnabled(true);
  if (credits < BET_STEPS[0]) {
    ui.setMessage('Out of credits. Reload the page to start over.');
  }
}

ui.buttons.spin.addEventListener('click', handleSpin);

ui.buttons.bet.addEventListener('click', () => {
  if (state !== 'idle') return;
  betIndex = (betIndex + 1) % BET_STEPS.length;
  refresh();
});

ui.buttons.maxBet.addEventListener('click', () => {
  if (state !== 'idle') return;
  betIndex = BET_STEPS.length - 1;
  refresh();
});

refresh();
