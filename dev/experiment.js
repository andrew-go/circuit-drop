// Win rate per boss (random extra skills as in a real run). Targets at eps 0.3 / 0.5: easy ~95/85, medium ~85/60, hard ~70/20.
// eps = how often the bot plays a random placement; the bot does not dodge beams and ignores fog/drift/static, so these are floors.
const out = [];
for (const [st, tier] of [[3, 'easy'], [6, 'medium'], [9, 'hard']]) {
  for (const b of BOSS_POOL[tier]) {
    const row = { tier, boss: b.id };
    for (const eps of [0.3, 0.5]) { const r = BOT.batch(st, eps, 30, { bossId: b.id, maxPieces: 400 }); row['win@' + eps] = r.win; if (eps === 0.3) row.pcs = r.piecesToWin; }
    out.push(row);
  }
}
console.table(out);
