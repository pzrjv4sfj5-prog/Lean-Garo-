import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// RC-CANDIDATE-009 (fixed 2026-07-23) / RC-CANDIDATE-039 (regressed and
// re-fixed 2026-08-16): "i want to drink" repeatedly reverts to
// "Anga ring·na sikenga" — the raka'd "ring·a"="sing" homophone
// (raka_roots.json: root "ring" is no-raka for the drink verb; ring·a is
// a genuinely different word meaning "sing", not a stray mark). The
// raka'd form means "want to sing," not "want to drink." git history
// shows this exact key flip-flopping between raka/no-raka at least three
// times across sessions (see docs/PENDING_REGRESSION_CASES.md
// RC-CANDIDATE-039). 2026-08-16: root cause traced to
// master_dictionary.json (the canonical compile source, which
// corrections.json edits alone don't override for compiled_dict.json
// population) also carrying the raka'd value under a bare, uncited
// "VERIFIED/native-speaker" tag — fixed there too. corrections.json is
// checked FIRST at runtime (translationEngine's top-priority override
// layer, see src/lookupEngine.js), so this test asserts against
// translate() output, not compiled_dict.json, to match what a user
// actually sees.
// 2026-08-26 (Claude A): expected value updated from stale
// "Anga ringna sikenga" to "Anga ringna ska" — Thangseng's final evidence
// (relayed via Tridip) closed the ska-vs-skenga question left open in
// docs/PENDING_LINGUISTIC_PROPOSAL_20260718_sikenga_ska_sika.md: ska =
// simple want, skenga = continuous of ska. Homophone assertion below is
// unaffected and still holds.
test('RC-CANDIDATE-009/039: "i want to drink" does not carry the ring·a="sing" homophone', async () => {
  const result = await translate('i want to drink');
  assert.ok(result && result.garo, 'expected translate() to return a garo value for "i want to drink"');
  assert.ok(!/ring·na/i.test(result.garo),
    `"i want to drink" carries the raka'd "sing" homophone (means "want to sing"): ${result.garo}`);
  assert.equal(result.garo, 'Anga ringna ska');
});

test('RC-CANDIDATE-009: companion drink-verb forms remain raka-free (sanity check, unaffected roots)', async () => {
  assert.equal((await translate('i want water')).garo, 'Anga chi ringna skenga');
  assert.equal((await translate('drink')).garo, 'Ringa');
});

test('RC-CANDIDATE-009: genuine ring·a="sing" homophone forms are unaffected (not a false fix)', async () => {
  assert.equal((await translate('sing')).garo, 'ring·a');
});

