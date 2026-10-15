// Full-run check with the values from index.html (no overrides). eps = how often the bot plays a random placement.
const rows = []; let total = 0;
for (let st = 1; st <= 9; st++) {
  const row = { stage: st, goal: goalFor(st), mercy: BAL.mercy[st - 1] };
  for (const eps of [0, 0.3, 0.5]) { const r = BOT.batch(st, eps, 40, { maxPieces: 400 }); row['win@' + eps] = r.win; row['pcs@' + eps] = r.piecesToWin; if (eps === 0.3) total += r.piecesToWin || 0; }
  rows.push(row);
}
console.table(rows);
console.log('pieces for a whole run at eps 0.3:', total, ' ~minutes at 2.5s/piece:', Math.round(total * 2.5 / 60));
