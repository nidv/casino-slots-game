# Lucky Sevens - Casino Slot Game

A browser-based 3-reel slot game built with plain HTML, CSS, and JavaScript. Symbols are inline SVG and the win sound is synthesized with the Web Audio API.

## How to run

With Node.js:

1. `npm install` (once)
2. `npm run dev` (starts `http-server` bound to `127.0.0.1:8000`, so the game is only reachable from this machine, not the network)
3. Open `http://localhost:8000` in a browser.

Without Node.js, any static server works the same way, for example `python3 -m http.server 8000` from the project root.

## How to play

- Press **SPIN** to spin the three reels. The current bet is deducted from your credits.
- **BET** cycles the bet through 1, 2, 5, 10. **MAX BET** sets it to 10.
- You win when at least 2 identical symbols land on the center horizontal line (the red payline). A pair pays 2x bet, three of a kind pays 10x bet.
- Wins are indicated by a pulsing highlight on the matching symbols, a flashing message, and a jingle.

## Game rules and interpretation

The spec says "2 same icons in any reel at same horizontal position means player wins". This is implemented as: at least 2 identical symbols anywhere on the center row, whether adjacent or split across reels 1 and 3. Real slots usually require left-aligned matches; the looser reading follows the spec wording.

Each reel has its own fixed strip of 12 symbols (`js/engine.js`), and each spin picks an independent uniform random stop index per reel.

## Project structure

```
index.html           markup: cabinet, status bar, reels, message bar, controls
css/style.css        layout, responsive sizing, win animations
js/main.js           entry point: game state machine, wiring engine to UI
js/engine.js         pure logic: reel strips, RNG, win evaluation, payouts
js/reel.js           one reel's DOM strip and spin/stop animation
js/symbols.js        inline SVG markup per symbol
js/ui.js             DOM helpers: displays, message bar, buttons
js/audio.js          Web Audio win jingle
```

Design notes:

- Game logic (`engine.js`) is pure and DOM-free, with the RNG injected, so the win evaluation is deterministic and easy to verify.
- Reels animate only `transform: translateY` (compositor-friendly). Each reel renders its strip twice inside an overflow-hidden 3-row window and wraps modulo strip height; reel position is kept in cell units so window resizes cannot corrupt state.
- Each `spinTo` call returns a Promise; the game awaits all three before inspecting the result, so evaluation runs strictly after the reels stop. Reels stop left to right via increasing travel distance and duration.
- The spin button and bet buttons are disabled while spinning (idle/spinning state machine in `main.js`).


### Learning objectives

This project demonstrates:

- Building an interactive app with JavaScript
- Semantic HTML structure
- Responsive web design for phone and tablet
- Separation of game logic from presentation
- DOM-based animation using CSS transforms
- Working with native browser APIs (inline SVG and the Web Audio API)
- Clean and maintainable front-end code organization


## Course

Created as part of a Front-End Development course project.


