// Thin DOM layer: status displays, message bar, control buttons.

// Hämtar de element vi behöver byta text i (siffrorna och meddelanderaden).
const creditsEl = document.getElementById('credits');
const betEl = document.getElementById('bet');
const winEl = document.getElementById('win');
const messageEl = document.getElementById('message');

// Samlar de tre knapparna i ett objekt så de är lätta att nå härifrån.
const buttons = {
  spin: document.getElementById('spin-button'),
  bet: document.getElementById('bet-button'),
  maxBet: document.getElementById('max-bet-button'),
};

export { buttons };

// Skriver ut nya credits-värdet i topplisten.
export function setCredits(value) {
  creditsEl.textContent = value;
}

// Skriver ut aktuell insats.
export function setBet(value) {
  betEl.textContent = value;
}

// Skriver ut senaste vinsten.
export function setWin(value) {
  winEl.textContent = value;
}

// Visar ett meddelande. isWin = true lägger på guld/blink-stilen.
export function setMessage(text, isWin = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle('message-win', isWin);
}

// Slår på/av alla knappar – används för att låsa dem medan hjulen snurrar.
export function setControlsEnabled(enabled) {
  for (const button of Object.values(buttons)) {
    button.disabled = !enabled;
  }
}
