import { REEL_STRIPS, spin, centerLine, evaluate, payout } from './engine.js';
import { createReel } from './reel.js';
import { playWinJingle } from './audio.js';
import * as ui from './ui.js';

// Detta är "limmet" som kopplar ihop allt: spel-logik, hjul, ljud och UI.

const BET_STEPS = [1, 2, 5, 10]; // insatsnivåer man kan stega mellan
const START_CREDITS = 100;       // hur mycket pengar man börjar med

let credits = START_CREDITS;
let betIndex = 0;        // var i BET_STEPS vi står just nu
let state = 'idle';      // 'idle' = redo, 'spinning' = hjulen snurrar

// Skapar ett hjul-objekt för varje titthål i HTML:en.
const reels = [...document.querySelectorAll('.reel-window')].map(
  (el, i) => createReel(el, REEL_STRIPS[i]),
);

// Aktuell insats just nu.
function bet() {
  return BET_STEPS[betIndex];
}

// Uppdaterar siffrorna i topplisten så de matchar nuläget.
function refresh() {
  ui.setCredits(credits);
  ui.setBet(bet());
}

// Hela snurr-förloppet från knapptryck till resultat.
async function handleSpin() {
  if (state !== 'idle') return;            // ignorera klick medan det redan snurrar
  if (credits < bet()) {                   // har man inte råd, säg ifrån
    ui.setMessage('Not enough credits for this bet');
    return;
  }
  state = 'spinning';
  credits -= bet();                        // dra insatsen direkt
  ui.setWin(0);
  refresh();
  ui.setMessage('Spinning...');
  ui.setControlsEnabled(false);
  for (const reel of reels) reel.clearWin();

  const stops = spin(); // lotta fram var hjulen ska stanna
  // Later reels travel further and longer, so they stop left to right.
  // Varje hjul snurrar lite längre än det förra, så de stannar i tur och ordning.
  await Promise.all(
    reels.map((reel, i) => reel.spinTo(stops[i], { loops: 2 + i, duration: 1100 + i * 350 })),
  );

  // Hjulen har stannat – kolla vad som hamnade på mittlinjen och om det vann.
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

  // Klart – lås upp knapparna igen och kolla om pengarna tagit slut.
  state = 'idle';
  ui.setControlsEnabled(true);
  if (credits < BET_STEPS[0]) {
    ui.setMessage('Out of credits. Reload the page to start over.');
  }
}

// SPIN-knappen kör igång snurret.
ui.buttons.spin.addEventListener('click', handleSpin);

// BET-knappen stegar till nästa insatsnivå och börjar om från början på slutet.
ui.buttons.bet.addEventListener('click', () => {
  if (state !== 'idle') return;
  betIndex = (betIndex + 1) % BET_STEPS.length;
  refresh();
});

// MAX BET hoppar direkt till högsta insatsen.
ui.buttons.maxBet.addEventListener('click', () => {
  if (state !== 'idle') return;
  betIndex = BET_STEPS.length - 1;
  refresh();
});

// Sätter startvärdena på skärmen när sidan laddas.
refresh();
