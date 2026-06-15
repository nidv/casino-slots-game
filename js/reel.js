// One reel: owns its DOM strip and the spin/stop animation.
// Position is tracked in cell units (floats) and converted to pixels at
// render time, so window resizes never corrupt the reel state.

import { symbolNode } from './symbols.js';

const VISIBLE_ROWS = 3;

export function createReel(windowEl, strip) {
  const length = strip.length;
  const stripEl = document.createElement('div');
  stripEl.className = 'reel-strip';
  // The strip is rendered twice so the 3-row window is always covered,
  // whatever the wrap offset.
  for (const symbol of [...strip, ...strip]) {
    const cell = document.createElement('div');
    cell.className = 'reel-cell';
    cell.appendChild(symbolNode(symbol));
    stripEl.appendChild(cell);
  }
  windowEl.appendChild(stripEl);

  // pos = index of the strip cell shown on the top visible row.
  let pos = topIndexFor(0);
  render();
  window.addEventListener('resize', render);

  function topIndexFor(stopIndex) {
    return (stopIndex - 1 + length) % length;
  }

  function cellHeight() {
    return windowEl.clientHeight / VISIBLE_ROWS;
  }

  function render() {
    const offset = ((pos % length) + length) % length;
    stripEl.style.transform = `translateY(${-(offset * cellHeight()).toFixed(2)}px)`;
  }

  // Slow-fast-slow over the whole travel: reads as spin-up, spin, ease to stop.
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function spinTo(stopIndex, { loops = 2, duration = 1200 } = {}) {
    const target = topIndexFor(stopIndex);
    const current = ((pos % length) + length) % length;
    const distance = loops * length + ((target - current) % length + length) % length;
    return new Promise((resolve) => {
      const startTime = performance.now();
      const from = current;
      function frame(now) {
        const t = Math.min((now - startTime) / duration, 1);
        pos = from + distance * easeInOutCubic(t);
        render();
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          pos = target;
          render();
          resolve();
        }
      }
      requestAnimationFrame(frame);
    });
  }

  function centerCell() {
    const top = ((Math.round(pos) % length) + length) % length;
    return stripEl.children[top + 1];
  }

  function clearWin() {
    for (const cell of stripEl.children) {
      cell.classList.remove('win-cell');
    }
  }

  return { spinTo, centerCell, clearWin };
}
