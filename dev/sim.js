// Dev-only: runs the real game code headless (canvas stubbed) so a bot can playtest balance quickly.
//   node dev/sim.js            -> default report
// Edit BAL / GOALS in the experiment section (or pass JSON via the BAL env var) and re-run.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const code = html.match(/<script>([\s\S]*)<\/script>/)[1];

const noop = () => {};
const ctx2d = new Proxy({}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 0 }) : k === 'createLinearGradient' ? () => ({ addColorStop: noop }) : noop), set: () => true });
const canvas = { getContext: () => ctx2d, style: {}, addEventListener: noop, getBoundingClientRect: () => ({ left: 0, top: 0, width: 1, height: 1 }), width: 0, height: 0 };
const sandbox = {
  console, Math, Date, JSON, Set, Map, Array, Object, Number, String, performance,
  document: { getElementById: () => canvas },
  window: {}, innerWidth: 1000, innerHeight: 800, devicePixelRatio: 1,
  matchMedia: () => ({ matches: false }),
  addEventListener: noop, requestAnimationFrame: noop,
  localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
  setTimeout, clearTimeout, setInterval, clearInterval,
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: 'game.js' });

const harness = fs.readFileSync(path.join(__dirname, 'bot.js'), 'utf8');
vm.runInContext(harness, sandbox, { filename: 'bot.js' });

const experiment = fs.readFileSync(path.join(__dirname, process.argv[2] || 'experiment.js'), 'utf8');
vm.runInContext(experiment, sandbox, { filename: 'experiment.js' });
