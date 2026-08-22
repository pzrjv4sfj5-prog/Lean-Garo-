/**
 * scripts/promote-lexicon.js — the ONLY path from Pending Lexicon into
 * production (master_dictionary.json). This is the engineering half of
 * the promotion boundary: it enforces that only entries Claude A has
 * explicitly marked review_status="approved" can ever be promoted, but
 * it makes no linguistic judgment of its own — the approval itself must
 * already exist in src/data/pending_lexicon.json before this tool runs.
 *
 * Marking review_status/review_notes/reviewed_by is Claude A's job,
 * done by editing src/data/pending_lexicon.json directly (it's just
 * JSON — no special tool needed to review, only to promote). This tool
 * refuses to promote anything not already marked "approved" — it is
 * not a review interface and cannot become one.
 *
 * History/provenance: promoting an entry does NOT delete or shrink its
 * pending_lexicon.json record. The record stays permanently, with
 * promotion_status flipped to "promoted" and promoted_date stamped —
 * so every production dictionary entry sourced through this pipeline
 * keeps a permanent, queryable link back to its source/page/import
 * batch/reviewer. Only the (english, garo, category, pos, classifier,
 * notes, confidence, confidence_source) fields get copied into
 * master_dictionary.json; provenance and review metadata are not
 * production-engine concerns and stay here.
 *
 * confidence/confidence_source (added 2026-08-22, docs/
 * PROPOSAL_CONFIDENCE_SCHEMA_20260822.md step 1): optional structured
 * fields, pass-through only -- this tool does not infer or default
 * either one. prepare-data.js does not read confidence yet (still
 * regex-parses notes per AI-001); this is schema/writer support only,
 * ahead of the cutover in step 4 of that proposal. A promoted entry
 * with no confidence set behaves exactly as before.
 *
 * USAGE:
 *   node scripts/promote-lexicon.js --id PL-0000001 [--id PL-0000002 ...]
 *   node scripts/promote-lexicon.js --all-approved
 *
 * Either form is a dry run unless --apply is also passed.
 * After a real promotion, run `npm run build` to regenerate
 * compiled_dict.json and re-run repository-intelligence.js (Check C
 * will now audit the newly-promoted entries too).
 */
import fs from 'fs';
import { buildExistingIndex, normalize, buildNormalizedGaroIndex, findNearDuplicates } from './import-dictionary.js';

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const allApproved = args.includes('--all-approved');
  const ids = [];
  args.forEach((a, i) => { if (a === '--id') ids.push(args[i + 1]); });

  if (!allApproved && ids.length === 0) {
    console.error('Usage: node scripts/promote-lexicon.js --id PL-0000001 [--id PL-0000002 ...] | --all-approved [--apply]');
    process.exit(1);
  }

  const pending = loadJSON('src/data/pending_lexicon.json');
  const master = loadJSON('master_dictionary.json');

  const candidates = allApproved
    ? pending.filter(e => e.review_status === 'approved' && e.promotion_status === 'pending')
    : pending.filter(e => ids.includes(e.id));

  const toPromote = [];
  const skipped = [];

  for (const e of candidates) {
    if (!ids.length && allApproved) {
      toPromote.push(e); // already filtered above
      continue;
    }
    if (e.review_status !== 'approved') {
      skipped.push({ id: e.id, reason: `review_status is "${e.review_status}", not "approved"` });
      continue;
    }
    if (e.promotion_status !== 'pending') {
      skipped.push({ id: e.id, reason: `promotion_status is "${e.promotion_status}", already handled` });
      continue;
    }
    toPromote.push(e);
  }

  // catch explicitly-requested IDs that don't exist at all
  if (!allApproved) {
    for (const id of ids) {
      if (!pending.some(e => e.id === id)) skipped.push({ id, reason: 'no such pending entry' });
    }
  }

  console.log(`Candidates: ${toPromote.length} promotable, ${skipped.length} skipped.`);
  for (const s of skipped) console.log(`  SKIP ${s.id}: ${s.reason}`);
  for (const e of toPromote) console.log(`  ${apply ? 'PROMOTE' : 'WOULD PROMOTE'} ${e.id}: "${e.english}" -> "${e.garo}"`);

  if (!apply) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply to commit these promotions.');
    return;
  }
  if (toPromote.length === 0) {
    console.log('\nNothing to promote.');
    return;
  }

  // Re-check against master's CURRENT state immediately before writing —
  // not the copy loaded at the top of main(). A pending entry can sit
  // approved for days; master may gain the same (english, garo) pair in
  // the meantime via a different path (another promotion run, or Claude
  // A editing master_dictionary.json directly). Re-loading fresh here
  // closes that window. Exact-match only, same equality rule used
  // throughout import-dictionary.js — no linguistic judgment, just
  // re-checking a fact that may have changed since main() started.
  const currentExistingByKey = buildExistingIndex('master_dictionary.json');
  const now = new Date().toISOString();

  const actuallyPromote = [];
  const alreadyInMaster = [];
  for (const e of toPromote) {
    const k = normalize(e.english);
    const existingValues = currentExistingByKey.get(k);
    if (existingValues && existingValues.has(e.garo.trim())) {
      alreadyInMaster.push(e);
    } else {
      actuallyPromote.push(e);
    }
  }

  if (alreadyInMaster.length) {
    console.log(`\n${alreadyInMaster.length} candidate(s) already exist in current master_dictionary.json (added since this pending entry was staged/approved) — not re-promoted, pending record still marked promoted (nothing left to do for it):`);
    for (const e of alreadyInMaster) console.log(`  SKIP ${e.id}: "${e.english}" -> "${e.garo}" already in master`);
  }

  // Item 2 — near-duplicate warning, same fresh-reload point as the
  // exact-match re-check above. Advisory only: never blocks, skips, or
  // auto-resolves a promotion. Flags cases where the entry about to be
  // written normalizes the same as a value already in master under
  // different raka/hyphen/parenthetical-gloss formatting — Claude A's
  // call on review, not engineering's to decide here.
  const normGaroIndex = buildNormalizedGaroIndex('master_dictionary.json');
  for (const e of actuallyPromote) {
    const nearDupMatches = findNearDuplicates(e.garo, normGaroIndex);
    if (nearDupMatches.length) {
      const matchDesc = nearDupMatches.map(m => `"${m.garo}" (${m.english})`).join(', ');
      console.log(`  WARN near_duplicate ${e.id}: "${e.english}" -> "${e.garo}" normalizes the same as existing master entr${nearDupMatches.length > 1 ? 'ies' : 'y'}: ${matchDesc} — proceeding with promotion, not blocked; flag for review.`);
    }
  }

  const promotedIds = new Set(toPromote.map(e => e.id)); // pending records for ALL candidates are closed out, including already-in-master ones — nothing left pending for them either way
  const newMasterEntries = actuallyPromote.map(e => {
    const entry = { english: e.english, garo: e.garo, category: e.category };
    if (e.pos) entry.pos = e.pos;
    if (e.classifier) entry.classifier = e.classifier;
    if (e.notes) entry.notes = e.notes;
    if (e.confidence) entry.confidence = e.confidence;
    if (e.confidence_source) entry.confidence_source = e.confidence_source;
    return entry;
  });
  const updatedMaster = master.concat(newMasterEntries);
  const updatedPending = pending.map(e =>
    promotedIds.has(e.id) ? { ...e, promotion_status: 'promoted', promoted_date: now } : e
  );

  fs.writeFileSync('master_dictionary.json', JSON.stringify(updatedMaster, null, 2) + '\n');
  fs.writeFileSync('src/data/pending_lexicon.json', JSON.stringify(updatedPending, null, 2) + '\n');

  console.log(`\n${actuallyPromote.length} entries promoted to master_dictionary.json${alreadyInMaster.length ? ` (${alreadyInMaster.length} skipped as already-present)` : ''}.`);
  console.log('Pending Lexicon records preserved (promotion_status updated, not deleted).');
  console.log('Run `npm run build` next to regenerate compiled_dict.json and re-run Check C.');
}

main();
