// Dev-only balance harness (not part of the game). Load from the console: add a <script src="dev-bot.js">.
window.BOT = (function () {
  function choose(eps) {
    const t = cur.tile, orig = t.mask, opts = [], rots = (orig === 0) ? [0] : [0, 1, 2, 3];
    for (const rot of rots) {
      let m = orig; for (let i = 0; i < rot; i++) m = rotCW(m);
      for (let c = 0; c < COLS; c++) {
        let ok = true; const step = Math.sign(c - cur.col);
        for (let x = cur.col; x !== c; x += step) { if (!canMove(cur.row, x + step)) { ok = false; break; } }
        if (!ok) continue;
        let r = cur.row; while (canMove(r + 1, c)) r++; if (!canMove(r, c)) continue;
        t.mask = m; grid[r][c] = t; let s;
        if (t.kind === 'bomb') { let n = 0; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { if (inRange(r + dr, c + dc) && grid[r + dr][c + dc]) n++; } s = -30 * n - (ROWS - r) * 2; }
        else s = placementScore(r, c, t);
        grid[r][c] = null; opts.push({ s, c, m, r });
      }
    }
    t.mask = orig; if (!opts.length) return null;
    if (Math.random() < eps) return opts[(Math.random() * opts.length) | 0];
    return opts.reduce((a, b) => b.s > a.s ? b : a);
  }
  function playStage(stage, eps, o = {}) {
    heat = o.heat || 0; newRun(); run.stage = stage; for (const k in (o.perks || {})) run.perks[k] = o.perks[k];
    startStage(); if (state === 'briefing') beginStage();
    let pieces = 0, steps = 0, maxChain = 0; const f0 = run.fuses;
    while (steps < 80000 && !['over', 'stagewin', 'shop', 'victory'].includes(state) && pieces < (o.maxPieces || 300)) {
      steps++;
      if (state === 'play' && cur) { const ch = choose(eps); if (ch) { cur.tile.mask = ch.m; cur.col = ch.c; curX = ch.c; } actDrop(); pieces++; }
      else update(16);
      maxChain = Math.max(maxChain, stageMaxChain);
    }
    return { win: ['stagewin', 'shop', 'victory'].includes(state), pieces, fuseLoss: f0 - run.fuses, maxChain };
  }
  function batch(stage, eps, n, o = {}) {
    let wins = 0, pieces = 0, fl = 0, ovr = 0, stalled = 0, ch = 0;
    for (let i = 0; i < n; i++) {
      const r = playStage(stage, eps, o);
      if (r.win) { wins++; pieces += r.pieces; } else if (r.fuseLoss >= BAL.fuses) ovr++; else stalled++;
      fl += r.fuseLoss; if (r.maxChain >= 2) ch++;
    }
    return { stage, eps, win: +(wins / n).toFixed(2), piecesToWin: wins ? Math.round(pieces / wins) : null, overload: ovr, stalled, fuseLoss: +(fl / n).toFixed(2), chain2: ch };
  }
  return { choose, playStage, batch };
})();
