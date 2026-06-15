// Thin DOM layer: status displays, message bar, control buttons.

const creditsEl = document.getElementById('credits');
const betEl = document.getElementById('bet');
const winEl = document.getElementById('win');
const messageEl = document.getElementById('message');

const buttons = {
  spin: document.getElementById('spin-button'),
  bet: document.getElementById('bet-button'),
  maxBet: document.getElementById('max-bet-button'),
};

export { buttons };

export function setCredits(value) {
  creditsEl.textContent = value;
}

export function setBet(value) {
  betEl.textContent = value;
}

export function setWin(value) {
  winEl.textContent = value;
}

export function setMessage(text, isWin = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle('message-win', isWin);
}

export function setControlsEnabled(enabled) {
  for (const button of Object.values(buttons)) {
    button.disabled = !enabled;
  }
}
