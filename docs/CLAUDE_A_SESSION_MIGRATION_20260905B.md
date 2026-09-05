# Claude A Session Migration — 2026-09-05B

## Resume sequence (Rule 10)
Resumed via pasted `docs/CLAUDE_A_SESSION_MIGRATION_20260905.md` filename
(Project Owner referenced it; content matched the already-authoritative
`ad8e819`/`ab3f7bd` close). `git fetch` clean, HEAD `ab3f7bd` ==
`origin/main` on arrival, clean tree. Read `.ai/WORKSTATE.yaml` and
`.ai/SESSION_BOOTSTRAP.md` before starting. Checked highest NV number in
`docs/THANGSENG_NATIVE_VALIDATION.md` post-fetch per the prior session's
own instruction: NV-132, so this session's new entry is NV-133.

## Directive this session
Project Owner supplied 3 items: (1) new native evidence resolving the
open `merong`/`mi` rice tension (flagged since NV-129) plus a new
example sentence; (2) a pointer to Claude C's latest audit
(`docs/HANDOFF_CLAUDE_A_20260905B.md`/`HANDOFF_CLAUDE_B_20260905B.md`,
commit `7382f75`) to review; (3) a claim that `cat`=`Menggo` and
`elephant`=`mongma` are wrong, "clean the dictionary." Explicit
instruction: one task at a time.

## Work this session — NV-133 (rice) + elephant data-hygiene fix

**NV-133:** Thangseng confirmed `mi`=cooked rice, `merong`=uncooked rice
— resolves the tension NV-129 flagged open. Also supplied a direct
`-na`-purposive citation for "i went to the market to buy rice" (`Anga
bajalchi merong brena re·anga`), which fully resolves
`GARO_GRAMMAR_REFERENCE.md` §8's item that NV-129 had only closed via a
"so that" near-equivalent. 4 `master_dictionary.json` rows touched:
promoted `rice (uncooked)`=`Merong` to VERIFIED/HIGH, added `cooked
rice`=`Mi` (new), updated bare `rice`=`mi`'s notes/confidence, added the
new sentence row. Full detail, citations, and the flagged-not-resolved
`-ko`-on-bare-mass-noun note: see NV-133 in
`docs/THANGSENG_NATIVE_VALIDATION.md`. `GARO_GRAMMAR_REFERENCE.md` §8
updated in place per its own convention.

**Elephant/cat check (Project Owner's specific claim):** Investigated
before acting, per standing discipline (claims aren't taken at face
value). `cat` was ALREADY CORRECT — `Menggo` has been tagged SUPERSEDED
since the 2026-08-01 corpus audit, live `translate("cat")` already
correctly ships `meng·gong`; no bug, no action taken. `elephant` WAS a
real bug, but not the one claimed — `mongma` is actually the NV-089
native-preferred VERIFIED/HIGH primary, not wrong. The actual live bug:
`corrections.json["elephant"]` was shipping `"buring·o"` (this
dictionary's root for "forest" — an unrelated, corrupted value, not any
of the three legitimate elephant citations). Fixed directly per Rule 8
(no new native input needed, existing NV-089 citation used): changed to
`mong·ma`. Documented as a non-NV data-hygiene item in
`docs/THANGSENG_NATIVE_VALIDATION.md` (own section, right after NV-133)
so the reasoning/evidence trail is preserved.

## Claude C's audit (commit `7382f75`) — reviewed, NOT actioned this session
Read `docs/HANDOFF_CLAUDE_A_20260905B.md` in full. Two items addressed
to Claude A, neither started (one-task-per-session discipline; flagged
for next session):
1. **`man·a` lexical collision** (able/finish/find/get/earn/can modal
   all compile to the identical string `man·a`) — linked to a live
   silent-constituent-drop bug in complex sentences. Claude C is
   explicitly asking Claude A to determine whether this is genuine
   Garo polysemy (one root, needs a disambiguating suffix/construction)
   or an import-merge artifact (several distinct roots collapsed) —
   needs either a relay question or corpus-internal archaeology before
   any fix. NOT investigated this session.
2. **2 of Claude B's 34 "slash-leak" `X / Y` rows may be grammatically-
   conditioned allomorphs, not free variants:** `"you (object)"` →
   `Nang·na / Nang·ko` (dative vs. accusative, likely verb-conditioned)
   and `"our / ours"` → `Chingni / An·chingni` (likely the existing
   inclusive/exclusive "we" distinction, not free variation). Claude C
   is asking Claude A to flag these two out of Claude B's mechanical
   split-and-promote sweep before it ships a coin-flip pronoun choice
   for either. NOT investigated this session.
3. **Item 1 (carried over, `build` bare key)** — unchanged, still open,
   also not touched.

## Gate at close
- `node prepare-data.js`: clean rebuild, 8280 unique entries (was 8278,
  +2 new unique keys: `cooked rice`, the new rice sentence)
- `node test-dictionary.js`: 8280/8280 valid, 9/9 grammatical
  corrections
- `node repository-intelligence.js`: PASSED, 0 new violations
- `node --test tests/unit/*.test.js`: 314/314 pass (unchanged — no
  test file touched this session)
- Live spot-check via `translate()`: `rice`→`Mi` (unchanged,
  phrase-map, 0.99), `cooked rice`→`Mi` (exact-phrase, 0.98, was
  `Mi Song·aha` via sov-assembly pre-session), `elephant`→`mong·ma`
  (correction, 1.0, was `buring·o`), `cat`→`meng·gong` (unchanged,
  phrase-map, 0.99), `i went to the market to buy rice`→`Anga bajalchi
  merong brena re·anga` (exact-phrase, 0.98, was `Anga bajalchi
  merong·ko bre·na re·anga` via grammar-assembly pre-session)

## Runtime Handoff (Claude B)
None new — the `-ko`-on-bare-mass-noun note in NV-133 is flagged as an
open question, not a specific bug repro, and doesn't block anything.
Still outstanding from prior sessions, untouched: `RULE-038`/`NV-109`
bare-form tension; Claude B's `NV-127` (only-X third-person scope,
blocked on an actual third-person sentence); Claude C's `man·a`
collision (item 1 above); Claude C's 2-of-34 slash-variant flag (item 2
above).

## Push and resync
Committed locally, then `git fetch` found `origin/main` had advanced by
2 commits (Claude B session-close, migration doc + WORKSTATE update,
docs-only, zero code/data overlap). Rebased clean, no conflicts.
Rebuilt (`prepare-data.js`) and reran the full gate post-rebase —
byte-identical artifacts, nothing to amend. Pushed `39df832..045cb6f`,
fast-forward, confirmed clean via `git fetch` immediately after (no
further remote movement).

## Repository status at close
- [x] HEAD hash: `045cb6f` (== `origin/main`, confirmed via `git fetch`)
- [x] origin/main match: confirmed, fast-forward push, no divergence
- [x] `git status` clean, no untracked files
- [x] `.ai/WORKSTATE.yaml` updated (this session's `next_action`, prior
      chained)
- [x] `.ai/SESSION_BOOTSTRAP.md` — no standing-rule changes, not touched
- [x] Migration doc complete (this file)
- [x] No local-only commits — pushed and verified
- [x] No uncommitted changes
- [x] Native-validation/blocker status: NV-133 closed; elephant
      data-hygiene fix closed; Claude C's `man·a` collision and 2-of-34
      slash-variant flag are new, genuinely open, carried forward, not
      force-resolved

## Exact next step (for next Claude A)
One task at a time, per Project Owner instruction. In priority order:
1. Claude C's `man·a` lexical-collision question (item 1 above) —
   needs a decision on relay-question vs. corpus-internal archaeology
   before Claude B can fix the associated silent-drop bug.
2. Claude C's 2 flagged slash-variant rows (`you (object)`,
   `our/ours`) — flag or resolve before Claude B's mechanical 34-key
   split sweep reaches them.
3. Standing carried-forward items, unchanged: `RULE-038`/`NV-109`
   tension; Claude B's `NV-127` (only-X third-person, needs an actual
   third-person sentence from Thangseng); the `study`=`Gisik nange
   poraibo` vs. `po·ri·a` tension from the same NV-129 close that
   produced this session's rice tension (still unresolved, no
   Thangseng question sent yet).
