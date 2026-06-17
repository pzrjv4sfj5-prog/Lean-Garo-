// Run: node docs/add_native_batch2.cjs
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const newEntries = {
  "dog bite me": "Angko a·chak chika",
  "dog is chasing me to bite": "Angko a·chak chikna rika",
  "chasing me": "rika",
  "head is itching": "Sko brika",
  "my back is itching": "Angko janggil brikat",
  "back": "janggil",
  "smile": "Ka·dinga",
  "child is crying": "Bi·sa grapenga",
  "do you know how to cook": "Na·a bijak songna changa?",
  "do you know": "Changa?",
  "cook": "Songna",
  "my backbone is hurting": "Angni kangkare sadikenga",
  "backbone": "kangkare",
  "hurting": "sadikenga",
  "are you coming home or not": "Nokchi re·bama re·bakuja?",
  "not coming": "re·bakuja",
  "coming": "Re·bama",
  "my throat is drying": "Gitok ranenga",
  "drying": "ranenga",
  "water is not flowing in my house": "Noko chi jokjaenga",
  "in my house": "Noko",
  "water": "Chi",
  "not flowing": "jokjaenga",
  "our well is dry": "Chingni chiakol de tipjok",
  "well": "chiakol",
  "dried": "tipjok",
  "snake bit me": "Angko chipu sua",
  "snake": "chipu",
  "let's eat": "Hai, cha·na!",
  "let's eat food": "Hai, mi cha·na!"
};

let added = 0, skipped = [];
Object.entries(newEntries).forEach(([k, v]) => {
  if (c[k]) { skipped.push(k); return; }
  c[k] = v;
  added++;
});

fs.writeFileSync('src/data/corrections.json', JSON.stringify(c, null, 2));
console.log('Added:', added, '| Skipped (already exist):', skipped.length);
if (skipped.length) console.log('Skipped keys:', skipped);
console.log('New total corrections:', Object.keys(c).length);
