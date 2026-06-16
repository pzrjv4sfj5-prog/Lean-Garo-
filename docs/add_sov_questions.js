// Run: node add_sov_questions.js
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('src/data/corrections.json'));

const newEntries = {
  "did you drink": "Na·a Ringaha ma?",
  "have you drunk": "Na·a Ringjok ma?",
  "are you drinking": "Na·a Ringenga ma?",
  "did you sleep": "Na·a Tusieaha ma?",
  "have you slept": "Na·a Tusijok ma?",
  "are you sleeping": "Na·a Tusienga ma?",
  "did you go": "Na·a Re·anga ma?",
  "have you gone": "Na·a Re·angjok ma?",
  "are you going": "Na·a Re·angenga ma?",
  "did you come": "Na·a Rebaaha ma?",
  "have you come": "Na·a Rebajok ma?",
  "are you coming": "Na·a Rebaenga ma?",
  "did you eat": "Na·a Cha·aha ma?",
  "have you eaten": "Na·a Cha·jok ma?",
  "are you eating": "Na·a Cha·enga ma?",
  "did you work": "Na·a Dakaha ma?",
  "have you worked": "Na·a Dakjok ma?",
  "are you working": "Na·a Dakenga ma?",
  "did you study": "Na·a Poraha ma?",
  "have you studied": "Na·a Porajok ma?",
  "are you studying": "Na·a Poraenga ma?",
  "did you pray": "Na·a Bi·aaha ma?",
  "have you prayed": "Na·a Bi·ajok ma?",
  "are you praying": "Na·a Bi·aenga ma?",
  "did you run": "Na·a Kataha ma?",
  "have you run": "Na·a Katjok ma?",
  "did you give": "Na·a On·aha ma?",
  "have you given": "Na·a On·jok ma?",
  "are you giving": "Na·a On·enga ma?",
  "did you see": "Na·a Nik·aha ma?",
  "have you seen": "Na·a Nik·jok ma?",
  "are you seeing": "Na·a Nik·enga ma?",
  "did you speak": "Na·a Agan·aha ma?",
  "have you spoken": "Na·a Agan·jok ma?",
  "are you speaking": "Na·a Agan·enga ma?",
  "did you write": "Na·a Seaha ma?",
  "have you written": "Na·a Sejok ma?",
  "are you writing": "Na·a Seenga ma?",
  "did you read": "Na·a Poraha ma?",
  "have you read": "Na·a Porajok ma?",
  "are you reading": "Na·a Poraenga ma?",
  "did you buy": "Na·a Breaaha ma?",
  "have you bought": "Na·a Breajok ma?",
  "are you buying": "Na·a Breaenga ma?",
  "did you sell": "Na·a Palaaha ma?",
  "have you sold": "Na·a Palajok ma?",
  "are you selling": "Na·a Palaenga ma?",
  "did you play": "Na·a Kal·aha ma?",
  "have you played": "Na·a Kal·jok ma?",
  "are you playing": "Na·a Kal·enga ma?",
  "did you cook": "Na·a Song·aha ma?",
  "have you cooked": "Na·a Song·jok ma?",
  "are you cooking": "Na·a Song·enga ma?",
  "did you wash": "Na·a Su·srongaha ma?",
  "have you washed": "Na·a Su·srongjok ma?",
  "are you washing": "Na·a Su·srongenga ma?",
  "did you help": "Na·a Chakaha ma?",
  "have you helped": "Na·a Chakjok ma?",
  "are you helping": "Na·a Chakenga ma?",
  "did you call": "Na·a Donaha ma?",
  "have you called": "Na·a Donjok ma?",
  "are you calling": "Na·a Donenga ma?",
  "did you understand": "Na·a Uiaha ma?",
  "have you understood": "Na·a Uijok ma?",
  "did you love": "Na·a Ka·saaha ma?",
  "have you loved": "Na·a Ka·sajok ma?",
  "are you loving": "Na·a Ka·saenga ma?",
  "did you laugh": "Na·a Ka·dingaha ma?",
  "have you laughed": "Na·a Ka·dingjok ma?",
  "are you laughing": "Na·a Ka·dingenga ma?",
  "did you cry": "Na·a Grapaha ma?",
  "have you cried": "Na·a Grapjok ma?",
  "are you crying": "Na·a Grapenga ma?",
  "are you running": "Na·a Katenga ma?"
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
