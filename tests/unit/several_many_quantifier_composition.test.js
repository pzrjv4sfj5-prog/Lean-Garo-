// several_many_quantifier_composition.test.js
//
// History (all same session, 2026-09-26):
// 1. Claude B, chat: "several/many is also bang·a, like we used for pig fat
//    statement" -> 'several' set to bang·a (matching 'many' at the time).
// 2. While investigating, found and fixed the real root cause of the open
//    composition-gap item from docs/CLAUDE_B_SESSION_MIGRATION_20260925.md:
//    grammarEngine.js's multi-word object resolver only kept the LAST
//    word's translation when every word in the object phrase resolved
//    individually — any leading modifier was silently dropped with no
//    [UNKNOWN] trace. Confirmed live before that fix: "i have several/many
//    books" and even "i have good/big books" all produced "Angao ki·tap
//    donga" — the modifier fully vanished.
// 3. Investigating a follow-up word-order bug ("she has several dogs" /
//    "we have many students" producing wrong order via a different, buggy
//    fallback path — sov-assembly), also fixed: plural object nouns with
//    no direct dictionary entry (only the singular does) now resolve via
//    garo_classifier.js's singularize(), so these sentences succeed in
//    grammar-assembly and never reach sov-assembly at all.
// 4. Native-speaker correction from Thangseng in chat superseded step 1:
//    "i have several books" -> "Ango adita ki.taprang donga" (several =
//    adita, not bang·a) and "we have many students" -> "Chingo bang·a
//    chattrorang donga" (confirming many = bang·a is correct). Then
//    superseded again, same message: "we will use Bang.e instead of
//    adita, log it." -> several = bang·e (not adita, not bang·a).
//
// 5. 2026-09-27, Project Owner relaying Thangseng again: quantifier order
//    reversed to Quantifier + Noun ("Bang.a chattrorang", not "chattrorang
//    bang.e") -- confirmed deliberate, not a typo: noun-then-quantifier
//    would read as "students in large numbers". Conflicts with two
//    pre-existing static corrections.json citations that still use
//    noun-then-quantifier ("Wak be·en mit·am bang·a", "Man·derang bang·e
//    re·baa") -- flagged, not touched (Claude A's lane, static entries).
// 6. Same message: "Angao" (naive "Anga"+"o" concatenation) flagged
//    incorrect -- "Anga; ang+o = ango". Fixed in sentenceBuilder.js,
//    scoped to "Anga" specifically (not generalized to other pronouns).
//
// 7. 2026-09-27, Claude A session, Project Owner directive (chat, no
//    transcript): "we will use Bang.a for several, close it." -> several
//    = bang·a (not bang·e, not adita) -- interim, later reversed.
// 8. 2026-09-27, same Claude A session, "final clarification" (chat, no
//    transcript, citing the source print dictionary directly): "Adita
//    (adj) = some, somehow, in some measure, to some extent... several
//    can also be adita. So use adita only. Many = Bang.a." -> several =
//    adita (reversing step 7), many = bang·a unchanged. This is the
//    fourth value several has held across two days (bang·a -> adita ->
//    bang·e -> bang·a -> adita).
// 9. 2026-09-27, separately in this (Claude B) session, Project Owner
//    reconfirms the same adita conclusion via a direct example: "we
//    will use i have several books = Ango adita ki.taprang donga not
//    Ango bang·e ki·tap donga" -- converges with step 8 on the same
//    final answer via a different message. garo_dictionary.json/
//    corrections.json's "several" entry updated; "i have several
//    books" also given its own exact-phrase correction (only entry
//    attested with -rang, per CLAUDE_A_RANG_PLURAL_RULING_20260825.md
//    -- not generalized to other nouns).
// 10. Both sessions independently found the same regression: the
//    quantifier-preservation composition path (grammarEngine.js) was
//    scoped to the literal regex /^bang·[ae]$/i and did not recognize
//    "adita" -- every "several X" sentence except the one exact-phrase-
//    covered "books" silently dropped the quantifier entirely (AI-002-
//    shaped bug, surfaced by the content swap in both sessions). Claude
//    A's session logged it as a handoff item (tests marked .todo,
//    broken output recorded, not fixed). RESOLVED in this (Claude B)
//    session: "adita" added to the literal match in grammarEngine.js;
//    tests below restored from .todo to real passing assertions.
//
// Current, live state: several = adita, many = bang·a, quantifier
// composes BEFORE the head noun for both, 1st-person possessor is
// "Ango". "i have several books" ships as an exact-phrase correction
// (with -rang); every other "several X" composes via grammar-assembly
// without -rang (unmarked), since -rang is not computed anywhere in
// this codebase -- see CLAUDE_A_RANG_PLURAL_RULING_20260825.md.
//
// STILL NOT addressed (relayed to Thangseng 2026-09-27, awaiting
// response, not implemented here): whether "-rang" plural marking or
// the quantifier-before-noun order generalizes beyond the individually
// native-confirmed cases; the noun-then-quantifier order in the two
// pre-existing static citations ("Wak be·en mit·am bang·a", "Man·derang
// bang·e re·baa"); adjective position in noun phrases; adverb position.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translate } from '../../src/translationEngine.js';

test('"i have several books" uses the Owner-confirmed exact form (adita, with -rang)', async () => {
  const r = await translate('i have several books');
  assert.equal(r.garo, 'Ango adita ki.taprang donga');
});

test('"i have many books" keeps the quantifier (bang·a), not silently dropped', async () => {
  const r = await translate('i have many books');
  assert.match(r.garo, /bang·a/);
  assert.match(r.garo, /ki·tap/i);
});

test('"several" alone resolves to adita via the corrections override', async () => {
  const r = await translate('several');
  assert.equal(r.garo, 'adita');
});

test('"many" alone resolves to bang·a via the corrections override', async () => {
  const r = await translate('many');
  assert.equal(r.garo, 'bang·a');
});

test('AI-002 regression guard is untouched: an unresolved object word still surfaces [UNKNOWN]', async () => {
  const r = await translate('i bought a gadget yesterday');
  assert.match(r.garo, /\[UNKNOWN\]/);
});

test('numeral object composition (a different, already-working path) is untouched', async () => {
  const r = await translate('i have three books');
  assert.match(r.garo, /king·gittam/);
});

test('"she has several dogs" uses grammar-assembly with correct SOV order (adita), not the sov-assembly fallback', async () => {
  const r = await translate('she has several dogs');
  assert.equal(r.method, 'grammar-assembly');
  assert.equal(r.garo, 'Uao adita achak donga');
});

test('regression guard: "adita" survives quantifier-preservation composition like bang·a/bang·e do (AI-002-shaped bug, independently found by both Claude A and Claude B sessions 2026-09-27, fixed in this one)', async () => {
  const r = await translate('he has several trees');
  assert.equal(r.method, 'grammar-assembly');
  assert.match(r.garo, /adita/);
});

test('"we have many students" uses grammar-assembly with correct SOV order (bang·a), not the sov-assembly fallback', async () => {
  const r = await translate('we have many students');
  assert.equal(r.method, 'grammar-assembly');
  assert.equal(r.garo, 'An·chingo bang·a chattro donga');
});

test('"i have several books" uses "Ango" (not "Angao") for the 1st-person possessor', async () => {
  const r = await translate('i have several books');
  assert.match(r.garo, /^Ango\b/);
  assert.doesNotMatch(r.garo, /Angao/);
});

test('plural object noun with no quantifier still resolves via the singularize fallback ("she has cats")', async () => {
  const r = await translate('she has cats');
  assert.equal(r.method, 'grammar-assembly');
  assert.match(r.garo, /menggo/);
});
