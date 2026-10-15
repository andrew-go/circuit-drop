# Balance tooling (dev only, not part of the game)

`node dev/sim.js [experiment.js]` runs the real game code headless (canvas stubbed) and lets a bot play stages.
`dev/bot.js` is the bot: it picks the placement with the best `placementScore` (shortest remaining path across the board);
`eps` is how often it plays a random placement instead (0 = careful, 0.3 = some mistakes, 0.5 = sloppy).
`dev/experiment.js` prints win rate and tiles needed per stage. Tunables live in `index.html`: `GOALS`, `BAL`, `BOSSES[n].riseEvery`.
