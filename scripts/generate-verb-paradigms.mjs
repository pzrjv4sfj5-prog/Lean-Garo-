// Generates src/data/verb_paradigms.json + docs/VERB_PARADIGMS.md (NV-207, Claude B, 2026-10-25).
// Paradigm rules are the ones the engine already uses (morphologyEngine.applyTense/applyNegation) plus the
// native-attested continuous -enga and infinitive -na. A form is `pinned` when the same string already
// exists as a verified/native row in corrections.json or irregular_verbs.json; otherwise `derived`
// (rule-based, NOT native-verified). Only clean single-token roots ending in -a are generated; anything else
// is listed as `manual` (irregular / needs a native paradigm) rather than guessed.
import fs from 'node:fs';
import { VERB_LEMMAS, lookupGaro } from '../src/lookupEngine.js';
import { applyTense, applyNegation } from '../src/morphologyEngine.js';
import { translate } from '../src/translationEngine.js';

const corr = JSON.parse(fs.readFileSync('src/data/corrections.json', 'utf8'));
const irr = JSON.parse(fs.readFileSync('src/data/irregular_verbs.json', 'utf8'));
const pinnedSet = new Set([...Object.values(corr), ...Object.values(irr)].map(v => String(v).toLowerCase().replace(/[!.?]$/, '')));
const stem = (r) => r.replace(/a$/i, '');
const forms = (root) => ({
  present: root,
  continuous: stem(root) + 'enga',
  past: applyTense(root, 'past'),
  future: applyTense(root, 'future'),
  negative: applyNegation(root),
  negative_future: applyTense(root, 'negative_future'),
  command: applyTense(root, 'command'),
  negative_command: applyTense(root, 'negative_command'),
  infinitive: stem(root) + 'na',
});
const out = { _meta: { generated: '2026-10-25', note: 'derived = rule-based, unverified; pinned = also present as a row in corrections/irregular_verbs' }, verbs: {}, manual: [], review: {} };
// common verbs whose dictionary key is the bare English word (not `to X`), so VERB_LEMMAS misses them
const EXTRA = ['eat','drink','give','run','sleep','work','walk','sit','stand','speak','say','come','go','buy','sell','play','sing','laugh','wash','hear','take','want','need','like','know','do','make','read','write','cook','carry','call','wait','help','love','open','close','ask','tell','think','learn','teach','live','die','cry','dance','swim','jump','throw','catch','bring','send','keep','stay','meet','start','stop','try','use','wear','wake'];
for (const v of [...new Set([...VERB_LEMMAS, ...EXTRA])].sort()) {
  if (!/^[a-z]+$/.test(v)) continue;
  const root = lookupGaro(v);
  if (!root || /\[UNKNOWN\]|[\s,;()]/.test(root) || !/a$/i.test(root) || root.length < 2) { out.manual.push(v); continue; }
  const r = root.charAt(0).toLowerCase() + root.slice(1);
  const f = forms(r);
  // cross-check: the live engine must produce the same future / negative future for `I will (not) V`
  const eng = async (en) => (await translate(en)).garo.toLowerCase().replace(/^anga\s+/, '').replace(/[.!?]$/, '').trim();
  const ef = await eng('I will ' + v), en2 = await eng('I will not ' + v);
  if (ef !== f.future.toLowerCase() || en2 !== f.negative_future.toLowerCase()) { out.review[v] = { root: r, derived_future: f.future, engine_future: ef, derived_neg_future: f.negative_future, engine_neg_future: en2 }; continue; }
  // continuous: the raka dot is dropped in some attested verbs (onenga, breaenga, dakenga) and kept in others
  // (cha·enga, asong·enga), so a rule is unreliable. Adopt the engine's own `I am V-ing` when it gives a clean -enga form.
  const ing = /^[^aeiou]*[aeiou][^aeiouwxy]$/.test(v) ? v + v.slice(-1) + 'ing' : /[^e]e$/.test(v) ? v.slice(0, -1) + 'ing' : v + 'ing';
  const ec = await eng('I am ' + ing);
  let contSrc = 'derived';
  if (/^[^\s\[]+enga$/.test(ec)) { if (ec !== f.continuous.toLowerCase()) f.continuous = ec; contSrc = 'engine'; }
  out.verbs[v] = { root: r, forms: f, status: Object.fromEntries(Object.entries(f).map(([k, x]) => [k, pinnedSet.has(x.toLowerCase()) ? 'pinned' : (k === 'continuous' && contSrc === 'engine' ? 'engine' : 'derived')])) };
}
// Native Thangseng paradigms override the rule output (NV-205): watch = Nia, see / find = Nika.
const NATIVE = {
  watch: { present: 'nia', continuous: 'nienga', command: 'nibo', negative_command: 'ninabe', past: 'niaha', future: 'nigen', negative_future: 'nijawa', infinitive: 'nina' },
  see: { present: 'nika', command: 'nikbo', negative_command: 'niknabe', past: 'nikaha', future: 'nikgen', negative_future: 'nikjawa' },
  find: { present: 'nika', command: 'nikbo', negative_command: 'niknabe', past: 'nikaha', future: 'nikgen', negative_future: 'nikjawa', infinitive: 'nikna' },
};
for (const [v, nf] of Object.entries(NATIVE)) {
  const base = out.verbs[v] || { root: nf.present, forms: forms(nf.present), status: {} };
  base.forms = { ...base.forms, ...nf };
  for (const k of Object.keys(base.forms)) base.status[k] = k in nf ? 'native' : (base.status[k] || 'derived');
  out.verbs[v] = base;
}
fs.writeFileSync('src/data/verb_paradigms.json', JSON.stringify(out, null, 1) + '\n');
const cols = ['present', 'continuous', 'past', 'future', 'negative', 'negative_future', 'command', 'negative_command', 'infinitive'];
let md = `# Verb paradigms (NV-207, generated by scripts/generate-verb-paradigms.mjs)\n\n**native** = Thangseng-attested (NV-205). **engine** = the live engine's own output for "I am V-ing". **derived** = engine suffix rules applied to the dictionary root, NOT native-verified; treat as proposals until Claude A / Thangseng confirm. Roots that are not clean single tokens ending in -a are in the Manual list, not guessed.\n\n| English | ${cols.join(' | ')} |\n|---|${cols.map(() => '---').join('|')}|\n`;
for (const [v, e] of Object.entries(out.verbs)) md += `| ${v} | ${cols.map(c => e.forms[c] + (e.status[c] === 'native' ? ' ✅' : e.status[c] === 'pinned' ? ' 📌' : '')).join(' | ')} |\n`;
md += `\n## Review (${Object.keys(out.review).length}): rule output disagrees with the live engine; not emitted\n\n| English | derived future | engine future | derived neg. future | engine neg. future |\n|---|---|---|---|---|\n${Object.entries(out.review).map(([v, e]) => `| ${v} | ${e.derived_future} | ${e.engine_future} | ${e.derived_neg_future} | ${e.engine_neg_future} |`).join('\n')}\n`;
md += `\n## Manual (${out.manual.length}): irregular or unclean roots, need a native paradigm\n\n${out.manual.join(', ')}\n`;
fs.writeFileSync('docs/VERB_PARADIGMS.md', md);
console.log('verbs:', Object.keys(out.verbs).length, 'review:', Object.keys(out.review).length, 'manual:', out.manual.length);
