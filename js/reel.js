// Ett hjul: äger sin egen DOM-remsa och snurr/stopp-animationen.
// Positionen hålls i cellenheter (decimaltal) och räknas om till pixlar först
// när den ritas, så att fönsterändringar aldrig ställer till det för hjulet.

import { symbolNode } from './symbols.js';

const VISIBLE_ROWS = 3;

// Bygger ett hjul i ett givet titthål och lämnar tillbaka några funktioner
// man kan styra det med (snurra, hämta mittruta, nollställ vinstmarkering).
export function createReel(windowEl, strip) {
  const length = strip.length;
  const stripEl = document.createElement('div');
  stripEl.className = 'reel-strip';
  
  // Remsan ritas två gånger så att de 3 raderna i titthålet alltid är fyllda,
  // oavsett var i varvet den råkar stå.
  for (const symbol of [...strip, ...strip]) {
    const cell = document.createElement('div');
    cell.className = 'reel-cell';
    cell.appendChild(symbolNode(symbol));
    stripEl.appendChild(cell);
  }
  windowEl.appendChild(stripEl);

  // pos = index på den cell på remsan som visas högst upp i titthålet.
  let pos = topIndexFor(0);
  render();
  window.addEventListener('resize', render);

  // Vinstsymbolen ska hamna i mitten, så toppraden är en cell ovanför den.
  function topIndexFor(stopIndex) {
    return (stopIndex - 1 + length) % length;
  }

  // Hur hög en cell är just nu (räknas ut live så det funkar vid omskalning).
  function cellHeight() {
    return windowEl.clientHeight / VISIBLE_ROWS;
  }

  // Flyttar remsan i höjdled så rätt cell syns. % här är för att "wrappa runt".
  function render() {
    const offset = ((pos % length) + length) % length;
    stripEl.style.transform = `translateY(${-(offset * cellHeight()).toFixed(2)}px)`;
  }

  // Easing-kurva: långsam start, fart i mitten, mjuk inbromsning på slutet –
  // känns som att hjulet drar igång, snurrar på och bromsar in mjukt.
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function spinTo(stopIndex, { loops = 2, duration = 1200 } = {}) { //1200 millisekunder (1,2 sekunder)
    //Räknar ut resan (Start & Mål) och hur långt det är mellan dem, i cellenheter. 
    //Loops är hur många varv den ska snurra innan den stannar på målet.
    const target = topIndexFor(stopIndex);
    const current = ((pos % length) + length) % length;
    const distance = loops * length + ((target - current) % length + length) % length;
    //Håller sitt löfte (Promise) om att animera resan
    return new Promise((resolve) => {
      const startTime = performance.now();
      const from = current;
      //Skapar animationsmotorn
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

  // Ger tillbaka rutan som ligger mitt i titthålet (där vinstlinjen går).
  function centerCell() {
    const top = ((Math.round(pos) % length) + length) % length;
    return stripEl.children[top + 1];
  }

  // Tar bort vinst-glödet från alla rutor inför nästa snurr.
  function clearWin() {
    for (const cell of stripEl.children) {
      cell.classList.remove('win-cell');
    }
  }

  return { spinTo, centerCell, clearWin };
}
