// Boss 3 should behave like the version that was live (mercy 2, rows every 8, insulators 5.4%).
console.log('insulator prob by stage:', [1,2,3,4,5,6,7,8,9].map(st => { level = st; return +pInsulator().toFixed(3); }).join(' '));
for (const eps of [0, 0.3, 0.5]) console.log('boss 3 eps', eps, JSON.stringify(BOT.batch(3, eps, 40, { maxPieces: 400 })));
