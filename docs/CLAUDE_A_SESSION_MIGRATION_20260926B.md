# Claude A Session Migration — 2026-09-26B

THIS IS THE AUTHORITATIVE MIGRATION DOC as of 2026-09-26B. Read this first on resume, before `.ai/WORKSTATE.yaml`. Supersedes `docs/CLAUDE_A_SESSION_MIGRATION_20260926.md` (same-day, prior close — that doc's content stands, this one adds governance-doc-mandated structure that was missing from it plus one more work item and a mandatory drift flag).

## Governance doc read

`.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` read in full this session (last updated 2026-08-22, no changes since my last read). This migration doc follows its §11 mandatory session workflow and §15 required sections, applied retroactively to this continuous session's work (the prior same-day migration doc predates this read and did not use this format).

## Resume (Rule 10 / §11.1)

Continued session, container/clone already present. Ran the mandatory resume sequence fresh: `git fetch origin` found drift — 4 commits ahead (`dd3c90e`, `ed8cc08`, `939bce3`, `53e193e`, all Claude B: "several"/"many" quantifier-composition fix, "for some reason or other" embedded-sentence fix, session close). Local had no unpushed commits, so fast-forwarded clean (`git merge --ff-only`), no rebase needed. Read `docs/CLAUDE_B_SESSION_MIGRATION_20260926.md` and checked `.ai/WORKSTATE.yaml` for anything addressed to Claude A — none found.

Checked whether Claude B's session touched the multi-word-noun `sov-assembly` bug flagged in the prior migration doc: it did not (it fixed a different, related composition gap — quantifier-drop, not the question-template noun-phrase issue). Re-confirmed live that the flagged bug still reproduces unchanged:

```
"where is the mosquito net?" -> "Bano Ganggua jal"   (still wrong)
```

## Task this turn

No new linguistic item was given. Task was: bring this session's already-completed work (buffalo, beef, a bull, Matchota, mosquito net — closed in the prior same-day doc — plus Matchotaha/Matchotata, closed just before this doc) into full compliance with `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md`'s mandatory structure, which the prior doc was written without consulting.

## Classification (§4)

| Item | Class | Reasoning |
|---|---|---|
| buffalo = Matma | A | Project Owner directive overriding a prior citation (mo·si) — not derivable from existing grammar, a lexical fact only the Owner could supply |
| beef = Matchu be·en | D | Value already existed as `unverified`; this was a stale-confidence resolution (citation-only promotion), not a new discovery |
| a bull = Matchu Bipa | A | New root, no prior entry in any form |
| to finish/complete/to end = Matchota | A | New root |
| mosquito net = Mosori | A | Overrides a prior citation (mo·sa·ri), Project Owner directive |
| finished = Matchotaha | A | New inflected form; also resolves a §10 POS/sense default question (see below) |
| to get something completed = Matchotata | A | New distinct causative/completive sense of the Matchota root |

No class B, C, or E items this session — flagged as a concern below (Rule-generalization check).

## §10 POS/sense governance — "finished"

```
Key: "finished"
  Sense A: bon·a (unverified, pre-existing) — status: still unverified, unchanged
  Sense B: bon·chot·a (unverified, pre-existing, variant) — status: still unverified, unchanged
  Sense C: mat·chot·a (unverified, pre-existing, variant) — status: still unverified, unchanged
  Sense D: ses (unverified, pre-existing, variant) — status: still unverified, unchanged
  Sense E: Matchotaha (NEW, verified_high, this session) — status: shipping
  Default for bare key: E (Matchotaha) — sole verified_high candidate, pickPrimary
    resolves to it automatically now; A-D remain on file as unverified
    variants, none superseded (no evidence any of them is wrong, only that
    Matchotaha is now confirmed correct)
  Reasoning: Project Owner directive supplied a confirmed form where four
    citation-less unverified candidates previously tied. Not claiming A-D
    are incorrect — no evidence either way — only that E is now the
    confirmed default.
```

## Rule-generalization check (§5) — DRIFT FLAGGED

The Matchota / Matchotaha / Matchotata triplet (bare / -aha completive / -ata causative-completive) is a **suggestive** morphological pattern — a single root taking what look like distinct aspectual/valency suffixes. This is exactly the kind of observation §5 asks Claude A to notice. It is **not** being promoted to a `RULE-XXX.yaml` this session: three related forms from one Project Owner message is not the same as a native-confirmed productive paradigm (§2's over-derivation warning applies directly — see also §6's caution against bulk-deriving from a pattern that merely looks obvious). Recorded here as a candidate for future investigation, not acted on.

**Explicit drift flag, per §5's mandatory threshold:** the last new grammar rule committed to `docs/grammar_rules_structured/` was RULE-050, 2026-09-21 (commit `7436049`). Every Claude A session since — 2026-09-23 (x2), 2026-09-24, 2026-09-25, and both parts of 2026-09-26 including this one — has been vocabulary-only, zero new or updated rules. This is well past the three-consecutive-session threshold in §5 and is flagged explicitly to the Project Owner here, not left to pass silently. Recommend a future session's task be specifically framed as rule-generalization review (starting candidates: the Matchota suffix pattern above, and the bi·sa productive-suffix gap already flagged in `claude_a.pending_handoff_from_claude_a_20260909`, still unaddressed since 2026-09-09).

## §7 Duplicate representation check: PASS

Checked for all 7 keys touched this session (buffalo, beef, a bull, Matchota, mosquito net, Matchotaha, Matchotata):

- `master_dictionary.json` — source of all edits, verified directly
- `garo_dictionary.json` — checked explicitly this pass (had not been checked in the prior same-day doc). Found `cow`/`Cow`/`buffalo`/`Buffalo`/`beef` already present and already correct (independently in sync — not edited). `a bull`, `Matchota`'s senses, and `mosquito net` are simply absent from this file (it is a curated subset, not a full mirror — absence is normal, not a stale value, for entries never previously in it)
- `src/data/corrections.json` — grepped for all 7 keys, zero matches, nothing to fix
- `src/data/phrase_maps.js` — `cow`→`Matchu` and `buffalo`→`Matma` both present and correct (buffalo fixed this session per Rule 8); no override exists or is needed for beef/a bull/Matchota/mosquito net/Matchotaha/Matchotata (none needed one — all resolve correctly via dictionary lookup alone)
- `src/compiled_dict.json` — not assumed correct from source; spot-checked live via `translate()` for every key, both cases (`buffalo`/`Buffalo`, `Beef`, `a Bull`), and in composed sentences (`i have a buffalo`, `two buffalo`, `where is the buffalo?`, `i have finished`, `is it finished?`)
- Case variants — checked live, listed above
- Singular/plural — not applicable (none of these 7 keys have a distinct plural form in the dictionary)
- Grammar-rule representations — not applicable, no rule touched (see drift flag above)

## §8 Runtime Handoff

```
- "buffalo" / "Buffalo"
  Linguistic decision: buffalo = Matma, mo·si demoted to superseded (retained)
  Evidence: Project-Owner-directed, 2026-09-26, chat, no transcript
  Expected Garo output: Matma
  Affected POS/sense: n. (bare noun), also feeds classifier composition
  Duplicate representations checked: see §7 above
  Runtime/override locations to verify: src/data/phrase_maps.js (fixed,
    Rule 8), corrections.json (none needed)
  What A has verified: bare, capitalized, "i have a buffalo", "two
    buffalo", "where is the buffalo?" — all live via translate()
  What A has NOT verified: nothing outstanding for this key

- "beef"
  Linguistic decision: confidence-only promotion, value unchanged
  Evidence: Project-Owner-directed, 2026-09-26, citation-only (value
    already existed unverified)
  Expected Garo output: matchu be·en
  Affected POS/sense: n.
  Duplicate representations checked: see §7 above
  Runtime/override locations to verify: none — no override existed
  What A has verified: bare, "Beef" capitalized
  What A has NOT verified: composition in a full sentence (not asked for,
    not tested)

- "a bull"
  Linguistic decision: new entry, no prior citation of any kind
  Evidence: Project-Owner-directed, 2026-09-26
  Expected Garo output: Matchu Bipa
  Affected POS/sense: n.
  Duplicate representations checked: see §7 above
  Runtime/override locations to verify: none needed
  What A has verified: bare, "a Bull" capitalized
  What A has NOT verified: composition in a full sentence; bare "bull"
    (without "a") remains unwired, matching the dictionary's existing
    "a X" naming convention for this class of noun — not a bug

- "to finish / complete / to end"
  Linguistic decision: new root Matchota, deliberately coexisting with
    the already-VERIFIED "finish"->bon·a (NV-140), not merged/overriding
  Evidence: Project-Owner-directed, 2026-09-26
  Expected Garo output: Matchota
  Affected POS/sense: v.
  Duplicate representations checked: see §7 above
  Runtime/override locations to verify: none needed
  What A has verified: bare key resolves Matchota; confirmed "finish"
    (the separate bare key) still independently resolves bon·a, unaffected
  What A has NOT verified: whether Matchota and bon·a are true synonyms
    or distinct senses — left as two coexisting citations, not resolved,
    per evidence-first discipline (no basis to merge or rank them)

- "mosquito net"
  Linguistic decision: mosquito net = Mosori, mo·sa·ri demoted to
    superseded (retained)
  Evidence: Project-Owner-directed, 2026-09-26
  Expected Garo output: Mosori
  Affected POS/sense: n.
  Duplicate representations checked: see §7 above. Created a new Check C
    (dictionary self-consistency) conflict, confirmed intentional and
    allowlisted in src/data/known_dictionary_conflicts.json citing this
    session, per repository-intelligence.js's own instruction
  Runtime/override locations to verify: none — no override existed
  What A has verified: bare, "Mosquito net" capitalized, "i have a
    mosquito net" grammar-assembly. "where is the mosquito net?" was
    tested and found WRONG ("Bano Ganggua jal") — this is the
    pre-existing sov-assembly multi-word-noun bug (see Resume section
    above and Claude B territory note below), NOT a dictionary-data
    problem — bare "mosquito net" and "Mosori" are both correct in the
    dictionary; the engine's question-composition path fails to use the
    full two-word phrase
  What A has NOT verified: nothing else outstanding

- "finished" / Matchotaha
  Linguistic decision: see §10 POS/sense governance above
  Evidence: Project-Owner-directed, 2026-09-26
  Expected Garo output: Matchotaha
  Affected POS/sense: v.; resolves the bare-key default per §10
  Duplicate representations checked: see §7 above
  Runtime/override locations to verify: none needed
  What A has verified: bare "finished", "i have finished" (grammar-
    assembly, correctly routes through a different construction —
    "Anga dongmanaha" — not Matchotaha directly, which is expected since
    "have finished" is a distinct perfect-tense construction, not a
    request for the bare adjective), "is it finished?" (sov-assembly,
    correctly resolves Matchotaha — a single-word noun/predicate case,
    unaffected by the multi-word bug above)
  What A has NOT verified: nothing else outstanding

- "to get something completed" / Matchotata
  Linguistic decision: new distinct causative/completive sense
  Evidence: Project-Owner-directed, 2026-09-26
  Expected Garo output: Matchotata
  Affected POS/sense: v.
  Duplicate representations checked: see §7 above
  Runtime/override locations to verify: none needed
  What A has verified: bare key only (exact phrase match)
  What A has NOT verified: composition in any sentence context — the
    English gloss itself is a full clause, unlikely to appear as a
    sub-phrase elsewhere; not tested further as there's no composition
    context to test against
```

Standing restated handoff (unchanged, still open, Claude B territory): `sov-assembly`'s "where is the X?" question template fails on multi-word nouns generally. Confirmed again this session on `mosquito net` (new case) in addition to the previously-confirmed `cow dung`/`little boy`/`water buffalo`. Not fixed — engine code, not a linguistic decision.

## Gate at close

No dictionary/code changes were made in this doc's own session turn (this turn was a governance-compliance write-up of already-closed and already-gate-verified work, plus a fast-forward pull of Claude B's unrelated commits). Re-ran the gate once, post-fast-forward, to confirm the merge introduced no regression against this session's own entries:

```
test-dictionary.js:        8922/8922 dictionary entries, 9/9 grammatical corrections
repository-intelligence.js: 0 new violations, 8 checks
node --test:                all unit tests passing (count grew with Claude B's
                             2 new test files; none of this session's work
                             touched or was touched by those tests)
```

## Repository status at close

- HEAD before this doc's own commit: `53e193e` (Claude B's session-close, fast-forwarded onto cleanly)
- `origin/main` match: verified via `git fetch` immediately before starting this doc
- `git status`: clean, no uncommitted changes before this commit
- `WORKSTATE.yaml`: to be updated in this doc's own close commit
- `SESSION_BOOTSTRAP.md`: to be updated in this doc's own close commit
- Migration doc: this file, complete
- No local/unpushed commits pending beyond this doc's own close commit
- Native-validation status: no open Thangseng relay items touched this session; no new blockers; the rule-generalization drift (above) is the one item requiring Project Owner attention
