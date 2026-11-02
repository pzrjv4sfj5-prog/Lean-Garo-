# Thangseng relay 2026-11-02 (commands, requests, tenses), Claude B, NV-250

Source: Thangseng native, pasted by the Owner in chat 2026-11-02 (two messages). Thangseng typed `.` for the middle dot; stored as `·`. Overlaps Claude A's NV-248 batch (2026-11-01, same speaker); A's master rows are the dictionary authority, B owns corrections pins, engine and tests.

| English (tense) | Thangseng | Action |
|---|---|---|
| Write a letter. | Chitti sebo (variant Chitti kingsa sebo, not pinned) | corrections pin |
| Drink water. / Eat rice. | Chi ringbo / Mi cha·bo | A's master rows + engine fix (all surface forms) |
| read books | Ki·taprangko poraibo | already right, test |
| Please read the book. | Ka·sapae ki·taprangko poraibo | corrections pin |
| Drink! / Ask! / Dance! / Please come. | Ringbo / Sing·bo / Chrokbo / Ka·sapae re·babo | already right, tests |
| He is running away. (present continuous) | Ua katangenga | A's NV-248 row; test |
| I knew it. (past) | Anga uko hai·aha (variant Anga uko u·iaha) | already right, test; variant not pinned |
| I brought it. (past) / I will bring it. (future) | Anga uko ra·baaha / Anga uko ra·bagen | already right |
| Are those your dogs? (present, question) | Ua nang·ni achakrangma? (variant Ua achakrang nang·nima?) | already right |
| Is this my house? (present, question) | Ia angni nokma? | already right |
| Run fast. | Ta·rake katbo, "Override: Kata ta·rak·a" | HELD, engine unchanged (reply ambiguous) |

Engine (src/translationEngine.js, imperative-object-ko): objects rice/water take no -ko in any command surface form (`Eat rice!`, `eat the rice!`, `please eat rice`), and `Ka·sapae` no longer takes a full stop (Thangseng's two polite examples have none). Other nouns keep -ko (`read the book` = `Ki·tapko poraibo`). This closes Claude A's handoff docs/HANDOFF_CLAUDE_B_20261101_imperative_bare_noun.md ask (1); ask (2) stays limited to rice and water, the only ruled nouns.

Tests: tests/unit/nv250_thangseng_commands_20261102.test.js; imperative_object_ko.test.js updated.

Held: (1) Run fast (which form). (2) Is bare habitual object a rule beyond rice/water (bread, milk, tea)? (3) Plural ki·taprangko for singular `the book`, pinned as given. (4) `Ka·sapae.` with full stop still appears in the other please-paths? Not audited; only the imperative-object-ko path changed.

## Second Thangseng message, same day (rulings applied)
- `run away` = katanga. `He/she is running away.` (present continuous) = Ua katangenga. Applied as pins plus a grammar rule (below).
- `Run fast.` (imperative) = Ta·rake katbo. Pinned (`run fast`, `run fast!`); the earlier hold is closed. `Kata ta·rak·a` is retired for this sentence.
- `I do not know.` = Anga u·ija (dot form). Spelling `uija` replaced by `u·ija` in corrections, phrase_maps (`i don't know`), and the know paradigm negative. `i do not understand` still `Anga uija` (not ruled; ask).
- Engine, DERIVED from native exact forms (flag for native check): know negatives take the stem u·ia in every person/tense (`I do not know him.` = Anga biko u·ija, `He does not know.` = Ua u·ija, `I will not know.` = Anga u·ijawa); positives unchanged (hai·a). Closes B 20261101 Open 1 by derivation, pending native confirmation of the non-bare forms.
- Engine, particle verbs (2-word attested lemma, e.g. run away): -ing = present continuous (strip a + enga), irregular/-ed past = stem + ha (`He ran away.` = Ua katangaha, derived), subjectless command `Run away!` = Katangbo! (RULE-029, derived). Matching now handles doubled consonants (running, sitting) and irregular pasts (ran, sat, woke...).

## Third round (same day): particle-verb commands, open items
- `Sit down!` = Asongbo (one word, no `!`; row native-confirmed NV-091). Same one-word form for `Run away!` = Katangbo (derived), `Stand up!` = Chadengbo (dictionary), `Get up!` = Chakatbo (derived from Chakata, unverified row).
- `Come in!` ships the dictionary row `Ning·chi re·babo` (unverified); `Wake up!` ships `Chakatboha` (weak/OCR row, its `-boha` ending does not fit the -bo command). Both leak-free but NOT confirmed.
- `I do not understand` spelling updated to `Anga u·ija` (dotted, same token as the know negative); the master/phrase_map row `i don't understand` = `Anga man·ja` is a different Garo word and was left alone: Owner, which is right?
- HELD, not invented: `He is waking up.` (present continuous), `He woke up.` (past): no verified stem for `wake up`; still shows `[UNKNOWN]ko kosak`. Thangseng list: Wake up! (imperative) / He is waking up. (present continuous) / He woke up. (past) / Come in! (imperative).
