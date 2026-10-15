// Final check with the values from index.html: boss 3 and the laser-machine final boss.
for (const st of [3, 9]) for (const eps of [0, 0.3]) console.log('stage', st, 'eps', eps, JSON.stringify(BOT.batch(st, eps, 20, { maxPieces: 400 })));
