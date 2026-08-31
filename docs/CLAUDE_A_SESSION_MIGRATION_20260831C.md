# Claude A Session Migration — 2026-08-31C

**Session type:** Joint Claude A + Claude B grammar/morphology/tense audit
(Project Owner-issued audit brief). This document covers Claude A's
linguistic half only. Migration-mode close per explicit Project Owner
instruction: audit, record, do NOT fix the open items this session.

Full audit report (superseded in detail by this document, kept as the
canonical write-up of methodology + findings-as-first-discovered):
`docs/CLAUDE_A_GRAMMAR_MORPHOLOGY_TENSE_AUDIT_20260831.md`.

---

## 1. What was audited

Cross-checked `docs/GRAMMAR_RULE_CATALOGUE.md` (all 45 rules) against
`docs/THANGSENG_NATIVE_VALIDATION.md` and against live `translate()`
output at HEAD, across the audit brief's shared test matrix: simple
present/past/future, continuous, negative, imperative, negative
imperative, yes/no question, object+`-ko`, classifier construction,
unknown/OOV word, multi-word object. Also spot-checked the audit
brief's specific named items: verb roots vs. derived forms, POS
distinctions, want/need/can, eat/drink, go/walk/went/will-go/
will-not-go/will-not-be-going, classifier constructions.

No engine code was read or modified — that half of this audit belongs
to Claude B, not run in this session.

## 2. Confirmed correct (live-verified, no discrepancy vs. native evidence)

- **Tense/aspect:** RULE-002 (`-aha` past/perfect unification),
  RULE-023 (`-gen` future, no raka), RULE-013 (`chim` discontinued
  past), RULE-025 (`-jaha` cessative), RULE-026/RULE-028 (`-manaha`
  completive, confirmed spoken-register overlap with `-aha`).
- **Negation:** RULE-017/RULE-027 (`-ja` covers both present and
  past-referring negation — confirmed absence of a dedicated
  past-negative suffix, not a gap).
- **Imperative/hortative:** RULE-003b (subject-drop), RULE-029 (`-bo`
  single form for imperative and hortative); negative imperative
  `-nabe` reproduces correctly.
- **Question formation:** RULE-046 (`-ma` joins directly to the verb,
  no space) — live-verified correct project-wide, including the three
  sentences the catalogue itself still listed as open (see Fix 1
  below).
- **"Go" paradigm (RULE-030, NV-100):** `re·a`("to walk"/"go"),
  `re·anga`("went"), `re·jawa`("will not go"), `re·angjawa`("will not
  be going") — four distinct, non-competing forms, live-verified
  correct for all four, exactly matching the audit brief's own
  shared-evidence block.
- **want/need vs. push-insert:** `ska`/`skenga`("want"/continuous),
  `nanga`("need") correctly kept distinct from `sika`/`sikenga`
  ("push/insert") at both dictionary and runtime level — no collision
  found live.
- **Classifier construction:** noun+classifier+number-suffix confirmed
  live for `mang` (animals) and `king` (flat objects/books).
- **`film-ko` object construction / `-ko` object marking:**
  no object-loss found in any tested sentence with a resolvable
  object.
- **OOV handling:** unresolved content words surface as an explicit
  `[UNKNOWN]` marker rather than being silently dropped (engineering
  fix, Claude B, already shipped 2026-08-29B/30 — confirmed still
  correct, not new this session).

## 3. Remaining open findings

### Finding A — RULE-046 catalogue text was stale (FIXED this session, docs-only)

`docs/GRAMMAR_RULE_CATALOGUE.md` RULE-046 still listed three sentences
(`"are you eating?"`, `"is there rice?"`, `"have you eaten
breakfast?"`) as shipping the wrong space-before-`ma` form. Live
re-verified 2026-08-31: all three are actually correct
(`Na·a Cha·engama?`, `Mi dongama?`, `Na·a nastha cha·ahama?`) — matches
WORKSTATE.yaml's own record of a 2026-08-28 repo-wide sweep that
fixed the underlying data but never updated the catalogue text.
**Status: CLOSED.** Catalogue rewritten in the prior commit
(6aa558f) to reflect the correct, already-shipped state.
No further action needed on this item.

### Finding B — Ability modal "can" (`ama`): native-confirmed, unimplemented in the engine — OPEN, B-owned

**Linguistic status: CLOSED, High confidence, since 2026-07-25.**
NV-008 gives a direct, unambiguous three-verb paradigm:
- "I can eat" = `Anga cha'na ama`
- "I can go" = `Anga re'angna ama`
- "I can work" = `Anga kam ka'na ama`

Homonymy with `ama`="mother" explicitly confirmed and resolved by
Thangseng (true homonym pair, same pattern as `senga`(wait)/`senga`
(smell) — not a single polysemous word, no disambiguation-by-context
needed at the lexical level).

**Engineering status: still not implemented, reconfirmed live
2026-08-31.** `grep -rn "\bama\b\|man·a" src/*.js` returns zero hits —
the modal exists only as a bare dictionary gloss, never as a
grammatical construction:
- `"i can eat"` → `"Anga Cha·a"` (0.82, grammar-assembly) — `ama`
  silently dropped, output indistinguishable from plain "I eat."
- `"he can go"` → `"Ua re·a"` (0.82) — same silent drop.
- `"i cannot eat"` → `"Anga [UNKNOWN] Cha·a"` (0.65, morphology) —
  "cannot" surfaces as a literal `[UNKNOWN]` token instead of `ama` +
  negation.
- `"can you help me?"` is the only working modal-"can" sentence, and
  only because of its own literal `corrections.json` override — does
  not generalize.

**Not LINGUISTICALLY UNRESOLVED** — the native data is complete. This
is a pure B-owned engineering handoff: grammarEngine.js needs a
"can/cannot + verb" modal-detection branch inserting `ama` before the
verb stem, with negation composing as `ama` + `-ja` (RULE-017's
general mechanism) instead of defaulting to `[UNKNOWN]`.

**One loose linguistic thread, not blocking the fix:** NV-008's own
trailing note flags that `master_dictionary.json` independently
carries a second citation, `"can": "man·a"`, whose relationship to
`ama` (synonym / register variant / distinct sense) was never
disambiguated. Not guessed at. Does not block implementing `ama`'s
already-complete paradigm first.

## 4. Evidence index

| Finding | Evidence | Location |
|---|---|---|
| A (RULE-046 stale) | 2026-08-28 sweep commit record; live `translate()` re-check 2026-08-31 | `.ai/WORKSTATE.yaml` claude_a history; this session's live spot-check |
| B (modal "can") | Full 3-verb paradigm + homonymy resolution, Thangseng direct, closed 2026-07-25 | `docs/THANGSENG_NATIVE_VALIDATION.md` NV-008 |
| B (engine gap) | `grep` zero hits; live `translate()` repro of silent-drop and `[UNKNOWN]`-leak | this session, reproducible via the commands in the audit report |

## 5. What requires Thangseng (new relay question, not yet sent)

One item, low priority, does not block Finding B's fix:

> **"can" — `ama` vs. `man·a`.** We have two words on record for "can":
> `ama` (full paradigm confirmed — "I can eat" = Anga cha'na ama, "I
> can go" = Anga re'angna ama, "I can work" = Anga kam ka'na ama) and
> a second, less-attested citation `man·a`. Are these the same word
> (free variant/spelling), or do they differ in register, formality, or
> a specific sense (e.g. permission vs. ability)? When would a speaker
> use one over the other?

Not sent this session — flagging only, per the audit brief's "do not
invent, mark LINGUISTICALLY UNRESOLVED and ask precisely" instruction.

## 6. What belongs to Claude B

- **Finding B, priority item:** implement the `ama`("can") modal
  construction in grammarEngine.js per NV-008's closed paradigm — no
  native data missing, implementation only. Suggested shape: detect
  English "can"/"cannot"/"can't" + verb, insert `ama` immediately
  before the (correctly-formed) verb stem for the main clause; for
  negation, compose `ama` + the verb's negative form via the existing
  RULE-017 `-ja` mechanism rather than the current fallback that
  produces a literal `[UNKNOWN]`. Regression coverage should include
  at minimum the three NV-008 paradigm sentences (eat/go/work) plus a
  negative case ("i cannot eat") and a non-can control case to confirm
  no other modal/verb path regresses.

## 7. Exact next-session priorities (in order)

1. **Resume protocol first** (Rule 10 + governance doc): `git fetch
   origin`, compare local HEAD to `.ai/WORKSTATE.yaml`'s recorded
   `head`, `git log <head>..HEAD --oneline` to review anything landed
   since this close (in particular check whether Claude B has already
   picked up Finding B — if so, re-verify live via `translate()`
   rather than re-implementing), read `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md`
   in full before any linguistic work.
2. **Finding B is Claude A's only currently-open linguistic-adjacent
   item**, but the fix itself is B-owned engineering — Claude A's
   next-session action is to (a) confirm Finding B is still open (or
   already fixed by Claude B, in which case live-reverify and close
   this item, don't re-audit from scratch), and (b) if a Thangseng
   answer to the §5 `ama`/`man·a` question has arrived in the interim,
   process it using the standard evidence-first NV-numbering workflow.
3. Otherwise: no other linguistic item is currently open. If the
   Project Owner has not supplied a new task, re-run a fresh
   pass of the audit brief's shared test matrix against whatever HEAD
   has advanced to (in case Claude B's engineering-side work surfaced
   new discrepancies), rather than assuming Finding A/B are the only
   possible findings going forward.

## 8. What must NOT be repeated

- Do not re-derive or re-litigate the "go"/`re·a`/`re·anga`/`re·jawa`/
  `re·angjawa` paradigm — fully resolved (NV-100), confirmed live
  again this session, closed.
- Do not re-run the full RULE-046 space-before-`ma` sweep from
  scratch — it is closed project-wide (2026-08-28 data fix + this
  session's catalogue-text fix); only re-check if a *new* sentence is
  reported broken, not the three previously-flagged ones.
- Do not treat Finding B as `LINGUISTICALLY UNRESOLVED` or send it to
  Thangseng as a relay question — the paradigm is already fully
  confirmed (NV-008); only the `ama`-vs-`man·a` side-question in §5 is
  genuinely open, and it does not block implementing `ama`.
- Do not invent an implementation for Finding B in a Claude A
  session — it is engineering-scope (grammarEngine.js), out of role
  per the standing role boundary (Claude A never touches engine code).
- Do not assume nothing changed since this close — Claude B may pick
  up Finding B independently; verify live before re-auditing.

## 9. Runtime Handoff

No runtime/dictionary/compiled data was touched by any A-owned fix
this session beyond the RULE-046 documentation text (docs-only, no
code/data path reads that file). `master_dictionary.json`,
`compiled_dict.json`, `corrections.json`, `phrase_maps.js` are all
byte-identical to session start. Full gate re-verified clean at close:
8200/8200 dictionary entries, 9/9 grammatical corrections, 271/271
unit tests, 0 new `repository-intelligence.js` violations (all
checks). No runtime errors found or introduced.

## 10. Repository status at close

- HEAD: to be confirmed by the closing commit (this file itself is
  part of that commit) — verify `git log -1` == `origin/main` after
  push, before ending the session.
- Working tree: clean after commit + push.
- `.ai/WORKSTATE.yaml`: updated in the same close (see next commit).
- `docs/GRAMMAR_RULE_CATALOGUE.md`: RULE-046 already corrected
  (commit 6aa558f, prior session close), unchanged this close.
- No local-only commits; nothing left uncommitted or unpushed.
