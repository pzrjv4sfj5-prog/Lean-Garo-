# Claude A Session Migration — 2026-09-21B

**Resumed from:** `docs/CLAUDE_A_SESSION_MIGRATION_20260921.md`, via a
fresh clone of `pzrjv4sfj5-prog/Lean-Garo-` and a PAT pasted live by
the Project Owner in this session (used only in-session, embedded
nowhere, rotated at close per standing rule).

**Role:** Claude A — linguistic authority only. No engine code
(Claude B territory) or OCR ingestion (Claude D territory) touched.

---

## Resync on arrival

That prior migration doc stated HEAD `b1289eb`. Actual `origin/main`
on arrival was 3 commits ahead:
- `5dd0677` — Claude A: session close, migration doc 20260921 (the
  doc's own close commit)
- `d20a5c4` — Claude B: fix RULE-046 space bug + purpose-clause -ko
  drop
- `4836730` — Claude B: sync `phrase_maps.js` 'skin' with 2026-09-21
  Bigil spelling fix

No conflict with Claude A's prior close — both Claude B commits are
engineering, no `master_dictionary.json` overlap. Read
`.ai/WORKSTATE.yaml` and `.ai/SESSION_BOOTSTRAP.md` per standing
resume protocol. Full gate reconfirmed green before starting new
work: 8824/8824 dictionary, 9/9 grammatical corrections, 458/458 unit
tests, 0 new repository-intelligence violations.

---

## Work this session

### 1. Closed the ama/man·a pickPrimary tie-tagging gap (4 of 19)

The Owner directly reconfirmed the ama/man·a "can" paradigm (i can
eat/go/work/speak Garo) and directed the pattern be treated as fully
general (any verb, not the 4 attested).

Investigation found this wasn't new linguistic uncertainty — NV-117
(2026-09-03) had already closed ama/man·a as full synonyms across
eat/go/work. The 6 rows for those 3 verbs (plus `able`'s 2 rows) were
VERIFIED/HIGH but never tagged `variant`, so `pickPrimary` was
flagging them as unresolved non-variant ties in
`docs/PICKPRIMARY_VERIFIED_TIES.md`. This was a citation-tagging gap,
not a content question.

**Action:** tagged all 8 rows `variant/VERIFIED/HIGH`, citing NV-117
and the new NV-160 (this session's reconfirmation). Zero runtime
change — `translate()` output for all 5 keys (able, i can eat/go/
work/speak-garo) identical before and after; compiled artifacts
byte-identical for the first edit (notes-only), net +0 entries.

### 2. RULE-050.yaml + catalogue entry + NV-160

New rule formalizing the ama/man·a synonymy (Verified — NV-008,
NV-103, NV-117, NV-160) and the Owner's any-verb generality claim
(Derived confidence — a Project Owner directive, not itself a new
per-verb native confirmation, per the project's evidence-first
discipline). Added to `docs/GRAMMAR_RULE_CATALOGUE.md`. Noted in
passing, not acted on: RULE-049 exists in
`docs/grammar_rules_structured/` but was never added to the catalogue
— a pre-existing gap, flagged for a future cleanup pass, not this
session's scope.

### 3. Live-demonstrated the modal-drop gap, diagnosed "she can cook"

At the Owner's request, ran `translate()` live on unseeded verbs
("i can sleep/run", "she can cook", "can you swim"). All fall through
to `grammar-assembly`/`sov-assembly` with the `ama`/`man·a` modal
silently dropped — no error, no low-confidence flag on the missing
modal specifically, just a different (wrong) sentence shipped at
0.75–0.82 confidence.

"She can cook" → `Ua Song·timgipa` diagnosed in detail: `Song·timgipa`
is the dictionary's `Cook` (occupation noun, agentive `-gipa`
nominalizer, same pattern as `Skigipa`=teacher, `Sam·on·gipa`=doctor),
not a verb form. The engine matched the noun sense and prepended the
pronoun, shipping "She [is a] Cook" — compounding the modal-drop bug
with a POS collision, because no native-verified bare-verb form of
`song-` exists (only the noun `Song·timgipa`/`song·a` and the NV-095
gerund `Song·enga` are native-confirmed; "to cook" is on file as
`Song·a` but tagged superseded/unverified).

Composed `Ua Song·na ama.` / `Ua Song·na man·a.` for the Owner by
direct application of RULE-009 (`-na` infinitive) + RULE-050. **Did
not file this in `master_dictionary.json`** — it's an engine-composed
candidate, not itself Thangseng-confirmed, and evidence-first
discipline means composed-by-rule sentences don't get filed
VERIFIED/HIGH on Claude A's own inference. Recommended for the next
Thangseng relay batch.

### 4. POS field investigation + real bug found

Owner proposed adding POS tagging. Found the `pos` field is **not
new** — already exists in the schema (7116/9919 rows carry the key,
2298 with a real non-null value; existing convention: `n.`, `v.`,
`adj.`, `adv.`, `vi.`, `vt.`, `pr.`, `int.`, `pron.`, `suffix`, and a
few combined forms like `v. & n.`). It's already read in two places:
`prepare-data.js` uses `pos === 'v.'` for `pickPrimary` tie-breaking;
`sentenceBuilder.js` uses POS for verb detection during composition.

**Real bug found (not fixed — Claude B territory):**
`sentenceBuilder.js` line ~218 checks `e?.pos === 'verb'` — the full
word — against data that has never once used that value; every real
row uses the abbreviated `'v.'`. This comparison has silently never
matched a single row since it was written; verb detection in
`sentenceBuilder.js` has been running on regex-suffix-guessing alone
(`/enga$|aha$|gen$|bo$|na$|·a$/`) this whole time, with the POS
signal it's supposed to combine with permanently dead. Directly
relevant to the "cook" bug above — this is one reason a live POS
signal wasn't available to override the noun-sense match.

### 5. POS-tagging pilot (3 entries, per Owner directive)

- `goldsmith` → `Sonari` — new entry, `pos: n.`, `category: general`
  (matches carpenter/blacksmith/tailor/farmer convention)
- `time` → `Somoi` — existing row, was `unverified`; Owner
  reconfirmed directly in chat, promoted to `verified_high`, added
  `pos: n.`. Garo form unchanged.
- `to pass time` → `Somoi re·ata` — new entry, `pos: v.`,
  `category: time`; compositional (`somoi` "time" n. + `re·ata`
  "pass" v.)

All provenance-labeled "Project Owner directive (2026-09-21, direct
chat statement, POS-tagging initiative)" — not conflated with native
Thangseng evidence, per standing provenance-separation rule.

Live-verified via `translate()`: `goldsmith`→`Sonari`,
`time`→`Somoi`, `to pass time`→`Somoi re·ata`, all `exact-phrase`,
0.98 confidence.

### 6. Category and alphabetization — discussed, not actioned

Owner asked about alphabetizing `master_dictionary.json` and
backfilling categories. Gave assessment: category field already
45% populated (30 categories in use, `general`/`uncategorized` most
common); alphabetizing is runtime-safe (lookups are key-based) but
costly (one massive diff, scrambles insertion-order-as-history for
SUPERSEDED/VERIFIED pairs) and belongs to Claude B as a scripted,
deterministic, separately-committed pass if done at all. Owner
acknowledged ("ok") — no action taken, no file touched for this item.

---

## Push collisions (2, both clean, zero overlap)

1. After committing the tie-tagging + RULE-050 work, a concurrent
   Claude B session-close commit (`44cce00`, WORKSTATE.yaml + migration
   doc only) had landed. Rebased clean, rebuilt, gate re-verified
   green, pushed. HEAD `7436049`.
2. After committing the POS pilot, two more concurrent Claude B
   commits had landed (`7a906e9` — fix for `findVerbForm` silent-e +d
   fallback, engine code; `4926e0d` — Claude B's own session close).
   Rebased clean — no overlap with `master_dictionary.json` or docs
   Claude A touched. Rebuilt against the new engine code, full gate
   re-verified green post-rebase. HEAD `176bdcf`.

---

## Runtime Handoff to Claude B

Restated/new items, none picked up this session (Claude A does not
touch engine code):

1. **(New, this session)** `sentenceBuilder.js` line ~218:
   `e?.pos === 'verb'` never matches — data convention is `'v.'`.
   Fix the comparison (and audit for the same string-mismatch pattern
   elsewhere, since `prepare-data.js` correctly uses `'v.'` — only
   `sentenceBuilder.js` has the wrong string).
2. **(Restated)** The general `[Verb-na] ama/man·a` ability-modal
   composition has no engine implementation — ships only for the 4
   attested verbs via exact-phrase rows. RULE-050 (new this session)
   formalizes the pattern to implement against. Same long-standing
   gap flagged since 2026-08-31C.
3. **(Restated, sharpened by this session's live demo)** Unseeded
   verbs fall through to grammar-assembly/sov-assembly with no
   modal-drop detection — no low-confidence signal specifically for a
   dropped modal, so wrong output ships at normal-looking confidence
   (0.75–0.82). Worth a dedicated regression check once (1) is fixed.

---

## Next Recommended Tasks

1. **Thangseng relay**: get native confirmation for `Song·na`
   (bare-verb "cook") — currently only composed-by-rule, not
   confirmed. Good candidate to bundle with the still-unsent `us`
   accusative relay drafts (`THANGSENG_RELAY_QUESTION_20260920.md`,
   `...20260920B.md`) and NV-160-adjacent items.
2. **POS backfill, collision-set first**: generate the list of
   English keys with multiple senses across different parts of speech
   (the `cook` shape — noun + verb + gerund on the same root) as the
   priority queue, since these are where the engine currently guesses
   wrong. Bulk-backfill of the remaining ~7621 untagged rows is a
   larger, lower-urgency pass.
3. **Remaining 15 of 19 pickPrimary verified-ties** still unresolved
   (unclassified: agree, brave, early, empty, greedy, horn, last, leg,
   lie, outside, per the 2026-09-11 audit, plus others) — no citation
   found in session history for any of them; needs either Thangseng
   relay or Owner directive per item.
4. **Category/alphabetization**: no action pending unless Owner
   revisits.

---

## Repository status at close

- HEAD: `176bdcf`
- `origin/main`: `176bdcf` — verified match via `git fetch` + `git log -1`
- `git status`: clean, no uncommitted changes
- `WORKSTATE.yaml`: updated (`repository.head` → `176bdcf`,
  `claude_a.next_action` updated, prior renamed
  `next_action_prior_20260921`) — validated as parseable YAML
  post-edit
- `SESSION_BOOTSTRAP.md`: updated (new dated section appended)
- Migration doc: this file, complete
- No local commits ahead of origin
- No uncommitted changes
- Native-validation status: 1 new relay-candidate item queued
  (`Song·na`), not yet sent; no blockers
- Gate at close: 8827/8827 dictionary, 9/9 grammatical corrections,
  458/458 unit tests, 0 new repository-intelligence violations
