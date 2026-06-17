// Run: node docs/add_conversation_batch3.cjs
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const newEntries = {
  "how are you": "Na·a namenga ma?",
  "i am fine": "Anga namenga",
  "what is your name": "Nang ni bimung mai?",
  "where are you going": "Na·a bano re·angenga?",
  "where do you live": "Na·a bano tanga?",
  "i live in meghalaya": "Anga Meghalaya-o tanga",
  "where is the market": "Bajal bano?",
  "it is near": "Sepanga",
  "it is far": "Chel·a",
  "turn left": "Pila chepbo",
  "turn right": "Rikka chepbo",
  "go straight": "Sang re·angbo",
  "how much is this": "Iako baita dam?",
  "it is expensive": "Dam-raka",
  "it is cheap": "Dam-nom·a",
  "can you reduce the price": "Dam-ko on·tisa komiatbo",
  "this is my father": "Ia ang-ni apa",
  "this is my mother": "Ia ang-ni ama",
  "this is my brother": "Ia ang-ni dada",
  "this is my wife": "Ia ang-ni jik",
  "this is my husband": "Ia ang-ni ang-se",
  "do you have children": "Nang·o de dong·a ma?",
  "i have two children": "Ang·o gini de dong·a",
  "younger sibling": "Jong / No",
  "i am sick": "Anga sakamenga",
  "i have a headache": "Ang-ni sko-saa",
  "i am tired": "Anga neng·enga",
  "i am happy": "Anga han·-sengenga",
  "i am sad": "Anga duk ong·enga",
  "i am scared": "Anga kena",
  "i don't care": "Anga Dal·e Ra·ja",
  "are you okay": "Na·a am ma?",
  "i am okay": "Anga am",
  "take care": "An·tangko simsakbo",
  "be careful": "Chimsakbo!",
  "get well soon": "Mangmang an·sengpibo"
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
