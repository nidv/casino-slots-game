// Win jingle synthesized with the Web Audio API: no audio files to ship.
// The AudioContext is created lazily on the first call, which always happens
// inside a click handler, satisfying browser autoplay policies.

let ctx;

// Skapar (eller återanvänder) ljudmotorn. Görs först vid behov eftersom
// webbläsare bara tillåter ljud efter att man klickat.
function context() {
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

// Spelar en enda ton: frekvens, när den ska starta, hur länge och hur högt.
// gain-rampen gör att tonen tonas in snabbt och sedan klingar ut mjukt.
function note(freq, startOffset, duration = 0.35, volume = 0.25) {
  const audio = context();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const t = audio.currentTime + startOffset;
  osc.type = 'triangle';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

// C5 E5 G5 C6 arpeggio; big win repeats it an octave run higher.
// Spelar vinst-jingeln: fyra toner i följd uppåt. Vid storvinst spelas en
// extra, ljusare omgång ovanpå.
export function playWinJingle(bigWin = false) {
  const arpeggio = [523.25, 659.25, 783.99, 1046.5];
  arpeggio.forEach((freq, i) => note(freq, i * 0.12));
  if (bigWin) {
    arpeggio.forEach((freq, i) => note(freq * 1.5, 0.5 + i * 0.12, 0.4, 0.3));
  }
}
