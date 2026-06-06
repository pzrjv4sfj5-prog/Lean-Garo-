/**
 * build-master-dictionary.js
 * Claude A — 2026-06-03
 *
 * Merges garo_dictionary.json (6,137 entries) into master_dictionary.json
 * using composite (english+garo+pos) deduplication — never drops valid alternates.
 * Infers category for every entry. Outputs master_dictionary.json.
 *
 * Run: node build-master-dictionary.js
 */

import fs from 'fs';

// ─── Category inference ───────────────────────────────────────────────────────

const CATEGORY_RULES = [
  ['numbers', (eng, garo) =>
    /^\d+$/.test(eng) ||
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|hundred|thousand|first|second|third|fourth|fifth)\b/.test(eng) ||
    /^(sa·|gni·|gittam|bri·|bonga·|dok·|sni·|chet·|sku·|chiking)/.test(garo)
  ],
  ['family', (eng) =>
    /\b(father|mother|brother|sister|son|daughter|uncle|aunt|grandfather|grandmother|husband|wife|parent|child|children|family|relative|niece|nephew|cousin|in.law|sibling|grandchild|stepfather|stepmother)\b/.test(eng)
  ],
  ['animals', (eng, garo) =>
    /\b(dog|cat|cow|goat|pig|chicken|hen|duck|bird|fish|snake|tiger|elephant|monkey|horse|buffalo|rat|mouse|frog|butterfly|bee|ant|worm|deer|fox|bear|eagle|parrot|crow|sparrow|insect|animal|bull|calf|lamb|sheep|rabbit|gecko|lizard|crab|shrimp|colt)\b/.test(eng) ||
    /\bmang[-‐]/.test(garo)
  ],
  ['food', (eng, garo) =>
    /\b(rice|water|food|eat|drink|cook|meal|meat|vegetable|fruit|salt|sugar|milk|tea|coffee|bread|egg|banana|mango|potato|onion|chili|oil|hungry|thirsty|taste|delicious|tasty|soup|curry|fish|chicken|pork|beef|lunch|dinner|breakfast|snack|bite|chew|swallow|boil|fry|roast|feast)\b/.test(eng) ||
    /^(mi·|chu·|cha·)/.test(garo)
  ],
  ['church', (eng) =>
    /\b(god|jesus|church|prayer|pray|worship|bible|hymn|pastor|sunday|bapti|holy|spirit|cross|heaven|sin|faith|bless|amen|christian|lord|salvation|preach|sermon|gospel|angel|devil|satan|soul|eternal|grace|mercy|forgive|repent|disciple|apostle|prophet|priest|missionary)\b/.test(eng)
  ],
  ['education', (eng, garo) =>
    /\b(school|student|teacher|learn|study|book|write|read|pencil|pen|class|exam|test|lesson|subject|math|science|homework|college|university|knowledge|education|grade|pass|fail|library|blackboard|chalk|notebook|dictionary|alphabet|spell|grammar|language)\b/.test(eng) ||
    /skigipa|ki·tap/.test(garo)
  ],
  ['business', (eng, garo) =>
    /\b(buy|sell|market|price|money|pay|cost|shop|work|job|business|trade|goods|rupee|coin|salary|wage|profit|loss|bank|loan|tax|farm|harvest|crop|field|land|rent|debt|rich|poor|spend|save|count|weigh|measure|barter|exchange)\b/.test(eng) ||
    /tangka|hatta|\bgong[-‐]/.test(garo)
  ],
  ['travel', (eng, garo) =>
    /\b(go|come|walk|run|road|path|river|mountain|village|town|city|house|home|north|south|east|west|near|far|left|right|where|here|there|arrive|leave|journey|travel|bus|car|bridge|forest|field|hill|valley|stream|lake|sea|sky|direction|return|enter|exit|cross|climb|descend|stay|camp)\b/.test(eng) ||
    /-o\b/.test(garo)
  ],
  ['health', (eng) =>
    /\b(sick|pain|doctor|medicine|hospital|head|eye|ear|nose|mouth|hand|foot|leg|arm|body|heart|blood|fever|cough|cold|wound|heal|well|healthy|sleep|tired|strong|weak|hungry|thirsty|die|dead|birth|born|old|young|grow|breathe|sweat|vomit|diarrhea|stomach|back|chest|skin|bone|tooth|tongue|throat|lung|liver)\b/.test(eng)
  ],
  ['verbs', (eng, garo) =>
    /enga$|·enga$|aha$|·aha$|gen$|bo$/.test(garo) ||
    /^(eat|drink|go|come|run|walk|say|speak|give|take|see|hear|know|want|need|make|do|have|sleep|sit|stand|write|read|sing|dance|work|help|love|hate|fear|laugh|cry|play|ask|answer|think|feel|touch|hold|carry|throw|catch|pull|push|cut|break|build|open|close|start|stop|finish|wait|call|send|bring|show|teach|learn|buy|sell|cook|clean|wash|plant|grow|kill|hunt|fish|climb|swim|fly|fall)\b/.test(eng)
  ],
  ['phrases', (eng) =>
    eng.split(' ').length >= 3 ||
    /\b(hello|goodbye|thank|please|sorry|excuse|welcome|good morning|good night|good evening|how are|what is|where is|how much|let me|i am|you are|do you|can you|will you|i want|i need|i have|i don.t|there is|there are|it is|is it|are you|have you)\b/.test(eng)
  ],
];

function inferCategory(english, garo) {
  const eng = (english || '').toLowerCase().trim();
  const g = (garo || '').toLowerCase().trim();
  for (const [cat, rule] of CATEGORY_RULES) {
    if (rule(eng, g)) return cat;
  }
  return 'uncategorized';
}

// ─── Load sources ─────────────────────────────────────────────────────────────

function loadJSON(path) {
  if (!fs.existsSync(path)) {
    console.warn(`  WARN: ${path} not found — skipping`);
    return [];
  }
  const raw = JSON.parse(fs.readFileSync(path, 'utf8'));
  if (Array.isArray(raw)) return raw;
  // Handle object-keyed dicts (compiled_dict.json format)
  return Object.entries(raw).map(([english, garo]) => ({
    english,
    garo: typeof garo === 'string' ? garo : (garo?.garo || ''),
  }));
}

// ─── Merge ────────────────────────────────────────────────────────────────────

const sources = [
  'garo_dictionary.json',
  'garo_dictionary (2).json',
  'master_dictionary.json',
];

console.log('=== Lean-Garo Master Dictionary Builder ===\n');

const seen = new Set();
const merged = [];
let totalLoaded = 0;
let trueSkipped = 0;

for (const src of sources) {
  const entries = loadJSON(src);
  console.log(`  Loaded ${entries.length.toString().padStart(5)} entries from ${src}`);
  totalLoaded += entries.length;

  for (const entry of entries) {
    const eng = (entry.english || entry.English || '').trim();
    const garo = (entry.garo || entry.Garo || '').trim();
    if (!eng || !garo) continue;

    // Composite dedup key
    const pos = (entry.pos || '').toLowerCase().trim();
    const key = `${eng.toLowerCase()}|${garo.toLowerCase()}|${pos}`;

    if (seen.has(key)) {
      trueSkipped++;
      continue;
    }
    seen.add(key);

    // Infer category if missing
    const category = entry.category || inferCategory(eng, garo);

    merged.push({
      english: eng,
      garo: garo,
      pos: entry.pos || null,
      category,
      classifier: entry.classifier || null,
      notes: entry.notes || null,
    });
  }
}

console.log(`\n  Total loaded:       ${totalLoaded}`);
console.log(`  True duplicates:    ${trueSkipped}`);
console.log(`  Final entries:      ${merged.length}`);

// ─── Category summary ─────────────────────────────────────────────────────────

const catCount = {};
for (const e of merged) {
  catCount[e.category] = (catCount[e.category] || 0) + 1;
}
console.log('\n  Category distribution:');
for (const [cat, count] of Object.entries(catCount).sort((a,b) => b[1]-a[1])) {
  console.log(`    ${cat.padEnd(16)} ${count}`);
}

// ─── Write output ─────────────────────────────────────────────────────────────

fs.writeFileSync('master_dictionary.json', JSON.stringify(merged, null, 2), 'utf8');
console.log('\n✅  master_dictionary.json written.\n');

// Also recompile src/compiled_dict.json (array-of-translations per key)
const compiled = {};
for (const entry of merged) {
  const key = entry.english.toLowerCase().trim();
  if (!compiled[key]) compiled[key] = [];
  compiled[key].push({
    garo: entry.garo,
    pos: entry.pos || null,
    category: entry.category,
    classifier: entry.classifier || null,
  });
}

if (!fs.existsSync('src')) fs.mkdirSync('src');
fs.writeFileSync('src/compiled_dict.json', JSON.stringify(compiled), 'utf8');
console.log(`✅  src/compiled_dict.json recompiled — ${Object.keys(compiled).length} keys.\n`);
