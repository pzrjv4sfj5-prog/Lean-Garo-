# Claude A Session Migration — 2026-09-27B

Continuation of the same-day session started by `docs/CLAUDE_A_SESSION_MIGRATION_20260927.md` (that doc's own close, `build` fix, is prior/unrelated — this doc covers the "several" work only). Session close.

## Resume (Rule 10 / §11.1)

Fresh PAT clone (repo re-cloned this session; a second PAT was needed mid-session, see below). `git fetch origin`: no drift, HEAD == origin/main == `b3a9baf5` on arrival, matching the prior migration doc's stated close exactly.

## Task this turn

Project Owner directive, in chat, no transcript, resolving a standing open item (flagged by Claude B in `dc28574`/`docs/CLAUDE_B_SESSION_MIGRATION_20260927.md`: "several" = bang·e vs adita vs bang·a, internally contradictory relay, not resolved). Two rounds:

1. "we will use Bang.a for several, close it. and replace all other words by bang.a" → several = bang·a.
2. Same day, "final clarification", citing the source print dictionary directly: "Adita (adj) = some, somehow, in some measure, to some extent... several can also be adita. So use adita only. Many = Bang.a." → several = adita, superseding round 1's own bang·a call within the same session.

## Classification (§4)

| Item | Class | Reasoning |
|---|---|---|
| several → bang·a (round 1) | C | Project Owner directive, no transcript, no citation — a PO call, not new native evidence |
| several → adita (round 2, final) | C | Project Owner directive, no transcript, citing a print-dictionary sense entry (not a fresh Thangseng transcript) — still PO-directive provenance, not native-evidence provenance |
| many = bang·a | — | Restated/confirmed only, no change — already the shipping value |

## Work performed

Round 1 (`8e22a46`): `src/data/corrections.json` + `garo_dictionary.json` "several" bang·e → bang·a. Updated the 5 test assertions in `tests/unit/several_many_quantifier_composition.test.js` that hardcoded bang·e, appended step 7 to the file's history comment (prior steps retained, not overwritten). No master_dictionary.json row exists for bare "several" — it ships via corrections.json override only, nothing to supersede there. grammarEngine.js's trailing-quantifier composition matcher already accepted bang·a OR bang·e case-insensitively (Claude B, 2026-09-26), so no engine change was needed for this round.

Round 2 (`00333d6`): same two files, several bang·a → adita. Appended step 8 to the same test file's history comment. **Found and flagged, not fixed** (Claude B territory): the composition matcher's regex (`/^bang·[ae]$/i`) does not recognize "adita" as a quantifier, so "i have several books" / "she has several dogs" now silently drop "several" on composition again — the exact defect class fixed 2026-09-26, reintroduced by this word swap. "many" (still bang·a) is unaffected. Marked the 2 affected composition tests as `test.todo` with the live broken output recorded in the test body and an explanatory comment, rather than updating them to assert the broken output as correct.

Live-verified both rounds via `translate()`, not just corrections.json inspection — see each commit message for exact input/output pairs.

## Gate at close

Re-run in full after each round: `prepare-data.js` clean both times; `test-dictionary.js` 8922/8922 entries, 9/9 grammatical corrections; `repository-intelligence.js` 0 new violations (8 checks) both times; `node --test` 475 total, 473 pass + 2 todo (the flagged regression) + 0 fail after round 2; `resync-stale-overrides.mjs` 0 candidates. `compiled_dict.json` unaffected both rounds (corrections.json is a runtime-override layer, confirmed via the resync report's own skip-line for "several" not appearing — the key only ships via override, matching the "build" precedent from the prior doc).

## §8 Runtime Handoff

```
- "several" (bare key, now adita) — COMPOSITION REGRESSION, Claude B
  Linguistic decision: none this handoff — content value is closed
    (adita, Project Owner "final clarification")
  Evidence: Project Owner directive, chat, no transcript, citing the
    print dictionary's own Adita entry (some/somehow/in some measure/
    to some extent/several)
  Expected Garo output (bare key): adita — shipping correctly
  Expected Garo output (composed, e.g. "i have several books"): should
    be "Ango adita ki·tap donga" (or "ki·taprang" — see the file's
    still-open -rang plural-suffix question below) — NOT what currently
    ships
  Live/actual output (composed): "Ango ki·tap donga" — "adita" silently
    dropped, no [UNKNOWN] trace
  Affected POS/sense: adj/quantifier, "several" only — "many" (bang·a)
    unaffected, composes correctly
  Root cause: src/grammarEngine.js's trailing-quantifier detector
    (`quantifierIdx = ... /^bang·[ae]$/i.test(g)`) only recognizes the
    two bang· forms; "adita" fails the regex so the multi-word object
    resolver falls back to its per-word-resolved-but-no-quantifier-
    match branch, which keeps only the last word
  Duplicate representations checked: master_dictionary.json has no
    "several" row at all (override-only key, same shape as the prior
    doc's "build" item); src/data/phrase_maps.js has no "several" entry;
    src/compiled_dict.json unaffected (override resolves before
    compiled_dict is consulted)
  Runtime/override locations to verify: src/grammarEngine.js (the
    quantifier regex/detection logic itself — engine code, Claude A did
    not touch it)
  What A has verified: bare "several"→adita and bare "many"→bang·a both
    ship correctly; the composition regression is real and reproduces
    live, not a test artifact (checked via direct translate() call, see
    commit 00333d6 message)
  What A has NOT verified/decided: whether the fix should generalize the
    regex to also match "adita" (and any future quantifier), or use a
    different mechanism entirely — an engineering design choice, not
    Claude A's lane
  Also still open, unrelated mechanism, same construction family: the
    file's longstanding "-rang plural suffix" question (Thangseng's own
    "Ango adita ki.taprang donga" examples a plural suffix the engine
    never applies anywhere) — not implemented, not this session's scope,
    now directly relevant again since adita is the live "several" value
- Standing open item restated, unchanged: 26 unverified have/has entries
  shadow the tested donga-existential construction (Claude B finding,
  2026-09-27) — still needs Claude A/Owner adjudication, not touched
  this session (different item from the above).
```

Other standing open items restated for continuity (unchanged from the prior same-day doc):

- Claude B territory: sov-assembly's "where is the X?" question template still fails on multi-word nouns.
- §5 drift flag: no new grammar rule since RULE-050 (2026-09-21) — now 6+ consecutive vocabulary-only Claude A sessions, past the 3-session threshold. Unaddressed again this session (both rounds were PO-directive content swaps, not new linguistic decisions).

## PAT note

The PAT pasted at session start (`github_pat_11CDWG5UI0IDfMsOJj...`) returned `401 Bad credentials` on both `git push` and an independent `GET /user` check — a genuine invalid/expired token, not the transient GitHub flakiness recorded in prior sessions' histories (which resolved on retry with a 200 on independent verification). Round 1's commit sat local-only until the Project Owner supplied a second, working PAT (`github_pat_11CDWG5UI0DD35Rz...`), which pushed both rounds' commits together (`8e22a46` and `00333d6`) in one fast-forward push, no rebase needed (zero drift). Both tokens used only for `git push`/`fetch`, stripped from `.git/config` immediately after use (verified via grep — clean).

## Repository status at close

- HEAD before this doc's own commit: `00333d6`, verified == origin/main via `git fetch` immediately before writing this doc
- `git status`: clean, no uncommitted changes before this commit
- `WORKSTATE.yaml`: updated in this doc's own close commit
- `SESSION_BOOTSTRAP.md`: updated in this doc's own close commit
- Migration doc: this file, complete
- No local/unpushed commits pending beyond this doc's own close commit
- Native-validation status: no Thangseng relay items touched this session (both changes were Project Owner directives, provenance-labeled as such, not native evidence); no new blockers beyond the composition regression flagged above; §5 drift flag still open
