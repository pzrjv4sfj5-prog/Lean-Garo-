const fs = require('fs');
const correctionsPath = 'src/data/corrections.json';
const c = JSON.parse(fs.readFileSync(correctionsPath, 'utf8'));
console.log('BEFORE:', JSON.stringify(c["let's go to market"]));
c["let's go to market"] = 'Hai Bajal Anti Re·na';
c['lets go to market'] = 'Hai Bajal Anti Re·na';
fs.writeFileSync(correctionsPath, JSON.stringify(c, null, 2));
const c2 = JSON.parse(fs.readFileSync(correctionsPath, 'utf8'));
console.log('AFTER:', JSON.stringify(c2["let's go to market"]));
