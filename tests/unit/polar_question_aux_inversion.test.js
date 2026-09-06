import test from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

// Handoff B item 2, HIGH (docs/HANDOFF_CLAUDE_B_20260906.md, partially
// closed 2026-09-06 Claude B). Root cause: analyzeGrammar's aux-inversion
// recognition (added 2026-08-04 for "is he going to school?") only
// covered is/are/was/were. Any other aux-inverted polar question ("did
// he eat?", "will he eat?", "does she eat?", negated forms) never even
// entered the subject/verb search, so grammar.subject/grammar.verb both
// stayed null, assembleGrammar returned null unconditionally, and the
// WHOLE sentence — tense, negation, subject, everything — silently fell
// through to assembleSentenceSOV, which has no question-marking of its
// own. The already-general, already-VERIFIED "+ ma?" suffix composer
// (sentenceBuilder.js assembleGrammar) was correct all along; it just
// never got a chance to run for these auxiliaries.
//
// Fix: widened the same closed-class aux-inversion recognition to
// did/will/does/do/has/have — but ONLY when the input ends with "?",
// to avoid re-capturing declarative-mood sentences that happen to start
// with "did" (e.g. the item-3/5 fixture below, which has no question
// mark and is deliberately not a question).
//
// Still NOT fixed by this change (explicitly out of scope, see the
// comment in grammarEngine.js): wh-questions ("what did he eat?"), and
// any subject/tense combination beyond what applyTense already handles
// via the existing tense-attachment logic — no new paradigm data was
// invented here.

test('"did he eat?" composes with past tense + polar "-ma?" marker', async () => {
  const r = await translate('did he eat?');
  assert.equal(r.garo, 'Ua Cha·aha ma?');
  assert.equal(r.method, 'grammar-assembly');
});

test('"will he eat?" composes with future tense + polar "-ma?" marker', async () => {
  const r = await translate('will he eat?');
  assert.equal(r.garo, 'Ua Cha·gen ma?');
});

test('negated polar questions ("did/will you not eat?") stay negative and still get "-ma?"', async () => {
  const past = await translate('did you not eat?');
  assert.ok(past.garo.endsWith('ma?'));
  assert.ok(!/Cha·aha/.test(past.garo), `expected negative form, got: ${past.garo}`);

  const future = await translate('will you not eat?');
  assert.ok(future.garo.endsWith('ma?'));
  assert.ok(!/Cha·gen\b/.test(future.garo), `expected negative form, got: ${future.garo}`);
});

test('"does/do" polar questions also compose with "-ma?"', async () => {
  const does = await translate('does she eat?');
  assert.ok(does.garo.endsWith('ma?'));
  const doForm = await translate('do they eat?');
  assert.ok(doForm.garo.endsWith('ma?'));
});

// Regression guard: the pre-existing is/are/was/were behavior (which
// deliberately does NOT require a "?") must be unaffected.
test('regression guard: "are you going" (no question mark) is still detected as a question', async () => {
  const r = await translate('are you going');
  assert.ok(r.garo.toLowerCase().includes('ma?'), `expected polar question marker, got: ${r.garo}`);
});

// Regression guard: a declarative sentence that happens to start with
// "did" but has no "?" must NOT be swept into question composition —
// this exact sentence is a fixture for an unrelated adjective-ordering/
// verb-identification fix and must keep going through sov-assembly.
test('regression guard: declarative "did"-initial sentence without "?" is unaffected', async () => {
  const r = await translate('did you see the two small dogs');
  assert.equal(r.method, 'sov-assembly');
  assert.ok(!r.garo.includes('ma?'), `must not be treated as a question, got: ${r.garo}`);
});
