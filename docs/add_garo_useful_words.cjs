// Run: node docs/add_garo_useful_words.cjs
// Adds vocabulary from garo_useful_words.docx (native verified, 2026-06-24).
// Includes both standalone words AND example sentences.
// Overwrites compiled_dict forms where doc gives a better native form.

const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const newEntries = {
  "delay": "Ru·utata",
  "defect": "namgijani",
  "decline": "Komianga",
  "chickenpox": "Uri ba sasep",
  "lips": "ku'chil",
  "length": "Gro",
  "dance": "Chroka",
  "daily": "Salanti",
  "deceive": "Tol·napa",
  "clever": "seng·a",
  "luck": "rasong",
  "knowledge": "Uiani ba ma·siani",
  "language": "ku·sik",
  "mountain": "A'bri",
  "must": "nang·a",
  "carpet": "Am",
  "chameleon": "gara",
  "cheek": "pe",
  "choose": "basea",
  "job": "kam",
  "knee": "ja·sku",
  "last year": "da·sikkari",
  "long": "ro·a",
  "many": "bang·a",
  "sleep on the carpet": "Amo tusibo",
  "i saw a chameleon": "Anga garako nika",
  "choose anything": "Jekoba basibo",
  "he is clever": "Ua man·de seng·a",
  "my knee hurts": "Ang ja·sku sa·dika",
  "you know this language": "Na·a ia ku·sikko man·a",
  "last year we went to balpakram": "Da·sikkari chinga Balpakram re·anga",
  "why do you laugh": "Maina na·a ka·dinga?",
  "listen to me": "Angko knabo",
  "so many people came": "Man·derang bang·e re·baa",
  "i have no money": "Ango tangka gri",
  "i am waiting for you": "Anga nangko sengenga",
  "what job do you do": "Na·ara mai kamko ka·a?",
  "the creator blessed us": "Dakgipa rukgipa an·chingko pattiaha"
};

let added = 0, updated = 0, skipped = 0;
Object.entries(newEntries).forEach(([k, v]) => {
  if (!c[k]) {
    c[k] = v;
    added++;
  } else if (c[k] !== v) {
    console.log('UPDATE:', JSON.stringify(k), ':', JSON.stringify(c[k]), '->', JSON.stringify(v));
    c[k] = v;
    updated++;
  } else {
    skipped++;
  }
});

fs.writeFileSync('src/data/corrections.json', JSON.stringify(c, null, 2));
console.log('Added:', added, '| Updated:', updated, '| Skipped (same):', skipped);
console.log('New total corrections:', Object.keys(c).length);
