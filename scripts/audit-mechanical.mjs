// NV-227 (Claude B, 2026-10-29): mechanical audit of translate() behaviour. REPORT-ONLY (exit 0), prints counts + first examples.
//   1. paradigm check: engine output for `I V.` / `I will V.` / `I do not V.` / `V!` vs src/data/verb_paradigms.json
//   2. invariance: final punctuation / case / spacing must not change the output
//   3. irregular English pasts must not leave [UNKNOWN]
//   4. output hygiene: [UNKNOWN], `··`, mid-string sentence punctuation, the forbidden extra-dot `re·ba·`
//   5. mid-sentence capital letters (report only; needs a Project Owner ruling)
// usage: node scripts/audit-mechanical.mjs [--json out.json]
import fs from 'fs';
import { translate } from '../src/translationEngine.js';
const P = JSON.parse(fs.readFileSync(new URL('../src/data/verb_paradigms.json', import.meta.url), 'utf8'));
const IRR = JSON.parse(fs.readFileSync(new URL('../src/data/english_irregular_pasts.json', import.meta.url), 'utf8'));
const strip = s => String(s || '').toLowerCase().replace(/[.!?,]/g, '');
const norm = g => String(g || '').toLowerCase().replace(/[.!?,\s]+$/, '').replace(/\s+/g, ' ').trim();
const report = { paradigm: {}, invariance: [], irregular: [], hygiene: [], midcap: 0, probes: 0 };
const hyg = (en, g) => {
  if (!g || !String(g).trim()) report.hygiene.push([en, g, 'empty']);
  else if (/\[UNKNOWN\]/.test(g)) report.hygiene.push([en, g, 'unknown']);
  else if (/··/.test(g)) report.hygiene.push([en, g, 'double-dot']);
  else if (/re·ba·/i.test(g)) report.hygiene.push([en, g, 'extra-dot re·ba·']);
  else if (/[.!?]\s+\S/.test(g)) report.hygiene.push([en, g, 'mid-string punctuation']);
  if (String(g).trim().split(/\s+/).slice(1).some(t => /^[A-Z]/.test(t))) report.midcap++;
};
const frames = { present: v => `I ${v}.`, future: v => `I will ${v}.`, negative: v => `I do not ${v}.`, command: v => `${v}!` };
for (const t of Object.keys(frames)) report.paradigm[t] = [];
for (const [v, e] of Object.entries(P.verbs)) {
  if (/\s/.test(v)) continue;
  for (const [t, f] of Object.entries(frames)) {
    const want = e.forms[t]; if (!want) continue;
    const en = f(v), r = await translate(en); report.probes++; hyg(en, r.garo);
    if (!strip(r.garo).split(/\s+/).includes(strip(want))) report.paradigm[t].push([v, want, r.garo, e.status?.[t]]);
  }
}
const subj = ['I', 'you', 'we', 'they'], verbs = ['see', 'eat', 'like', 'take', 'give', 'want', 'know', 'buy'], objs = ['the house', 'water', 'the book', 'the car', 'rice', 'that house'];
for (const s of subj) for (const v of verbs) for (const o of objs) {
  const en = `${s} ${v} ${o}.`, g0 = norm((await translate(en)).garo); report.probes++;
  for (const alt of [en.replace(/\.$/, ''), en.toLowerCase(), en.toUpperCase(), `  ${en} `]) if (norm((await translate(alt)).garo) !== g0) { report.invariance.push([en, alt.trim(), g0, norm((await translate(alt)).garo)]); break; }
}
for (const [p, l] of Object.entries(IRR)) { if (p.startsWith('_')) continue; const en = `I ${p} it.`, r = await translate(en); report.probes++;
  const base = await translate(`I ${l} it.`); if (/\[UNKNOWN\]/.test(base.garo)) continue; // lemma itself has no Garo: vocabulary gap, not an engine bug
  hyg(en, r.garo); if (/\[UNKNOWN\]/.test(r.garo)) report.irregular.push([en, r.garo]); }
const out = { probes: report.probes, paradigm_mismatch: Object.fromEntries(Object.entries(report.paradigm).map(([k, v]) => [k, v.length])), invariance_divergences: report.invariance.length, irregular_past_unknown: report.irregular.length, hygiene_violations: report.hygiene.length, mid_sentence_capitals: report.midcap };
console.log(JSON.stringify(out));
for (const [k, v] of [['paradigm', Object.values(report.paradigm).flat()], ['invariance', report.invariance], ['irregular', report.irregular], ['hygiene', report.hygiene]]) for (const row of v.slice(0, 5)) console.log(`  ${k}:`, JSON.stringify(row));
const ji = process.argv.indexOf('--json'); if (ji > 0) fs.writeFileSync(process.argv[ji + 1], JSON.stringify(report, null, 1));
