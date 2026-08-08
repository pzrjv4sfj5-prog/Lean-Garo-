# Claude A Session Migration — 2026-08-06 (C)

## Project identity

Lean-Garo — Garo language dictionary + English→Garo translation engine.
`github.com/pzrjv4sfj5-prog/Lean-Garo-`. Claude A = linguistic authority
only (grammar/morphology/dictionary quality/native validation review).
Never touches engine code (Claude B) or OCR ingestion (Claude D).

## Repository status at close

- HEAD: `a7ca2d6bc204e95077a254c623c3c441b260648a`
- origin/main: matches exactly (`git fetch` confirmed)
- `git status`: clean, no uncommitted changes, nothing local-only
- `WORKSTATE.yaml`: updated (`claude_a.latest_8`)
- `SESSION_BOOTSTRAP.md`: updated (raka-normalization ruleset entry from
  earlier this session)
- `THANGSENG_NATIVE_VALIDATION.md`: updated (all closures below logged)
- Build gates: `prepare-data.js` → `test-dictionary.js` (8061/8061) →
  `repository-intelligence.js` (0 new violations, all checks) →
  `node --test tests/unit/*.test.js` (177/177) — all clean, verified
  immediately before this document was written
- Native-validation/blocker status: see "Open items" below — nothing
  blocking a deploy; the one critical item is a known, documented,
  not-yet-applied fix in Claude B's territory

## What's done this session (chronological, four PO messages)

1. **Full repo gap audit** (`docs/CLAUDE_A_GAP_AUDIT_20260806.md`) — swept
   every open item across `THANGSENG_NATIVE_VALIDATION.md`, all
   `PENDING_*` docs, and `repository-intelligence.js` allowlists. Closed
   2 stale-doc gaps needing no native input.
2. **5 native answers closed**: `Boka Boka` polysemy (→ `dabia`), `Kajia`
   = fight, `jegrika` meaning reconfirmed (orthography still open), `Bal`
   flower sense rejected (→ `bibal`/`pul`), `bika so'a`/`hel·hel` dead-ended.
3. **"laugh" orthography closed** (`Ka·dinga` confirmed) — which led to
   discovering and diagnosing a **critical, still-open production bug**:
   `prepare-data.js`'s `pickPrimary()` ships the wrong (SUPERSEDED)
   value for 334 of 454 flagged-wrong English keys, due to a
   case-collision heuristic misfiring on SUPERSEDED-vs-VERIFIED pairs.
   Full diagnosis + fix recommendation in
   `docs/CLAUDE_B_HANDOFF_20260806_supersede_precedence_bug.md` +
   `docs/CLAUDE_B_HANDOFF_337_KEYS_20260806.json`. **Not fixed** —
   `prepare-data.js` is Claude B's engine code.
4. **Full elimination of `Ka·ding·a`** (not just SUPERSEDED-marking) once
   native confirmed it was wrong for both "laugh" and "smile" candidates
   — removed from `master_dictionary.json`, traced to and fixed at the
   source in `garo_dictionary.json` (a live pipeline input), and cleaned
   from the orphaned `final_entries.json`. Added `laughter`=`Ka·dingani`,
   `smiled`=`Ka·dingsmitaha`.
5. **Global hyphen→raka conversion**, PO-authorized: 327
   `master_dictionary.json` entries + 332 `pending_lexicon.json`
   promotion records converted (kept in sync so Check D wouldn't flag
   staleness).

## Held / not done, and why

- **The 334-key `prepare-data.js` precedence bug is diagnosed but not
  fixed.** This is the single highest-priority item in the project.
  Claude A does not touch engine code — needs Claude B.
- **~452 remaining SUPERSEDED/VERIFIED pairs and ~15 `variant/VERIFIED`
  groups** are correctly-designed citation-discipline retention, not
  duplicates — deliberately left alone.
- **9 same-english-key orthography pairs with no confidence tag on
  either side** (`laugh`/`mouth`/`joking`/`at`/`bright`/`sad`/etc. minus
  `laugh`, which closed this session) — no evidence-first basis to pick
  one without asking; logged in `THANGSENG_NATIVE_VALIDATION.md`'s open
  items list.
- **`all`/`god`/`white` in `phrase_maps.js`** — fixed away from the
  confirmed-wrong SUPERSEDED value, but the specific single value chosen
  among 2-3 valid synonyms is a provisional pick (orthographically
  closest to the legacy import), inline-commented as such, not asserted
  as a firm linguistic conclusion.

## Open items requiring native input (not guessable, per evidence-first discipline)

| Item | Ref |
|---|---|
| `jegrika` raka placement (meaning confirmed twice, orthography never given) | NV-028 |
| `Bal` = air / bundle / load / big basket (only the flower sense was addressed) | NV-020 |
| "adolescent" — no replacement since `dil·ding bal·jak` rejected | NV-064 |
| "under" pseudo-verb (`Kokkimaoja`) — distinct stative verb or bug? | `RC-CANDIDATE-017` |
| `-ma` interrogative present/past forms (only future confirmed) | NV-031 |
| 9 unresolved orthography pairs (mouth/joking/at/bright/sad/"praise the lord"/direct-straight) | duplicate audit |

## Open items requiring engineering/Project Owner scope

| Item | Notes |
|---|---|
| **`prepare-data.js` SUPERSEDED-precedence bug** | **Highest priority.** See handoff doc. |
| "right"/"work" headword splits (RULE-040/041) | Linguistic call made, Claude B design still unclaimed |
| 115-entry placeholder backlog | `known_placeholder_entries.json`, per-entry native calls needed |
| Reverse translation (Garo→English) | Blocked on Project Owner acquiring a dictionary source |
| "who gave you this" trailing `?` | JSON key-naming, not linguistic |

## Standing rules in effect (unchanged, confirmed working this session)

- One-task-per-session discipline; historical-resolution audit before
  starting; evidence-first methodology; SUPERSEDED entries retained not
  deleted *unless* the Project Owner explicitly overrides (as happened
  this session for `Ka·ding·a`); `.ai/CLAUDE_D_HANDOUT.md` sole channel
  for Claude D; nothing ends a session without `git status` clean +
  `git fetch` + HEAD == origin/main confirmed.
- New this session: when the Project Owner gives a direct override
  instruction (e.g. "eliminate from the entire repo," not just mark),
  that takes precedence over the default retain-for-citation convention
  — but flag the reasoning and any factual nuance (e.g. the string being
  legitimately correct elsewhere) before complying, rather than
  executing blindly.

## Exact next step

Hand `docs/CLAUDE_B_HANDOFF_20260806_supersede_precedence_bug.md` to
Claude B — the 334-key precedence bug is the top-priority open item in
the entire project. Once that lands, re-run the duplicate audit's
"337 wrong keys" check to confirm the fix actually closes them (the list
is saved at `docs/CLAUDE_B_HANDOFF_337_KEYS_20260806.json` for that
re-check).

**Start a new conversation and paste this document in to resume.**
