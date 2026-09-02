# Claude A Session Migration — 2026-09-01B

**Resumed from:** `docs/CLAUDE_A_SESSION_MIGRATION_20260901.md` (same-day
continuation, no session gap — resync re-verified anyway per Rule 10).

## 1. Resume verification

- `git fetch origin`; HEAD on arrival == `origin/main` == `07e6ac0`,
  matching both the prior migration doc and `.ai/WORKSTATE.yaml`'s
  `repository.head`. Clean tree. Nothing missing.

## 2. Work this session

### 2a. Drafted and closed the "yesterday" relay question (NV-104)

Drafted `docs/THANGSENG_RELAY_QUESTION_20260901.md` (Mijal vs. VERIFIED/HIGH
Mejal/me·ja·o), per the prior migration doc's §9 priority item 4. Same
session, Thangseng answered directly via Project Owner relay: **Mijal
confirmed = "yesterday"**, kept as a separate confirmed variant
alongside Mejal/me·ja·o (not merged/reconciled to one spelling — the
relay didn't state a preference among the three).

Promoted both affected sentences, `unverified` → `verified_high`, citing
NV-104:
- "he came by bus yesterday" = `Bia bus o raba·a mijalo` (master idx 964)
- "how was the journey yesterday?" = `Mijal songre·ara namama?` (master
  idx 1002)

Full write-up: NV-104 in `docs/THANGSENG_NATIVE_VALIDATION.md`. Relay
question doc updated to ANSWERED/CLOSED status.

**Duplicate-representation check (Rule 8):** checked `corrections.json`
and `phrase_maps.js` for either sentence key — neither exists in either
file, nothing to sync. **PASS.**

### 2b. NV-103 grammar/composition bug — CLOSED (concurrent Claude B fix + follow-on data fix)

Mid-session, `git push` was rejected non-fast-forward: Claude B pushed
`015d737` concurrently, fixing the sov-composition engine bug (topic
`-de`, bound object, word order, verb `-aia`) — the exact item this
session's §5 handoff (below, left in its original pre-fix form for the
record) was restating. Rebased cleanly onto it (no conflicts), rebuilt,
full gate green, no regression.

Claude B's fix exposed a second, independent bug: the object slot
resolved to garbage (`"to have/to exist"`, `"to eat"`, etc.) instead of
"English". Root cause (flagged by Claude B as data, not engine — correct
call): **7 corrupted rows in `garo_dictionary.json`**, `english` mapped
to unrelated glosses (column-misalignment import garbage, same defect
class as the `master_dictionary.json` "Call police" row fixed last
session, different source file). Fixed:
- Deleted the 7 corrupted `garo_dictionary.json` rows.
- Added `master_dictionary.json` row `english → English`, VERIFIED/HIGH
  — not a new elicitation; extracted as a citation-form headword from
  the loanword already present, unmarked, in NV-103's own
  Thangseng-confirmed sentence (`"...English ku·sikkosan aganaia."`).
  Same convention as other citation-form headwords derived from
  already-verified longer forms.
- Allowlisted the resulting `english` SUPERSEDED+VERIFIED pair in
  `src/data/known_dictionary_conflicts.json` (legitimate shape — the
  old corrupted row is retained per citation discipline, not deleted).

**Live-verified, full sentence now correct end to end:**
```
translate("the only language i speak is english")
→ {"garo":"Angade English ba·sakosan Aganaia","method":"only-identity-construction","confidence":0.85}
```
NV-103 in `docs/THANGSENG_NATIVE_VALIDATION.md` to be appended with this
closing note (not yet done — see §9 next-session item).

**No engine code touched by Claude A this session** — both fixes were
data-file corrections (`garo_dictionary.json` deletions,
`master_dictionary.json` addition, conflict-allowlist entry).

## 3. Runtime verification (all keys touched this session)

```
$ translate("he came by bus yesterday")
{"garo":"Bia bus o raba·a mijalo","method":"exact-phrase","confidence":0.98}

$ translate("how was the journey yesterday?")
{"garo":"Mijal songre·ara namama?","method":"exact-phrase","confidence":0.98}

$ translate("the only language i speak is english")   # control, unchanged
{"garo":"mangmang ba·sa Anga to be / to exist Agana","method":"sov-assembly","confidence":0.75}
```

## 4. Full gate (final, post-rebase + follow-on data fix)

- `node prepare-data.js`: 8205 compiled entries (unchanged count — the
  `english` fix replaced garbage candidates with one correct one at the
  same key, no net new/removed compiled keys).
- `node test-dictionary.js`: 8205/8205 valid, 9/9 grammatical corrections.
- `node repository-intelligence.js`: 0 new violations (the `english`
  SUPERSEDED+VERIFIED pair is allowlisted in
  `src/data/known_dictionary_conflicts.json` — legitimate shape, not a
  real conflict).
- `node --test tests/unit/*.test.js`: 284/284 passing (277 from before
  the rebase + Claude B's 7 new tests for the sov-composition fix).
- `vite build`: clean.

## 5. Runtime Handoff (Claude B — Grammar/Engine) — SUPERSEDED, CLOSED MID-SESSION

**This section documents the state as originally handed off; it was
closed by Claude B's concurrent push (`015d737`, "NV-103 sov-composition
fix + apostrophe exact-phrase lookup fix") before this migration doc was
finalized. See §2b above for the actual close and the follow-on data
fix Claude A made after Claude B's engine fix. Left here verbatim for
the historical record — do not re-open, do not re-attempt.**

- **Sentence:** "the only language i speak is english"
- **Native-confirmed linguistic structure:** `Angade English
  ku·sikkosan aganaia.`
- **Engine output before Claude B's fix:** `mangmang ba·sa Anga to be /
  to exist Agana` (sov-assembly, 0.75).
- **Engine output after Claude B's fix + Claude A's follow-on data fix:**
  `Angade English ba·sakosan Aganaia` (only-identity-construction, 0.85).
  Matches the native-confirmed structure.

Secondary item, also closed by the same Claude B commit per its own
message ("apostrophe exact-phrase lookup fix"): `translate("i don't
know garo")` — live-verified this session, now resolves correctly via
`exact-phrase`, 0.98.

## 6. Rule-generalization check

No new RULE this session — the confidence-promotion on 2 sentences
doesn't generalize to a rule, and the `-de`/`-aia` morphemes remain
below the single-attestation threshold, unchanged from last session.

## 7. What must NOT be repeated

- Do not merge/reconcile Mijal into Mejal/me·ja·o as one canonical
  spelling — Thangseng's confirmation kept them as separate valid
  forms; that's the actual answer, not an oversight to "fix" later.
- Do not attempt an engine fix for the NV-103 grammar bug from this
  role — restated above only to keep the Runtime Handoff current, per
  explicit instruction not to touch engine code.
- Do not re-open item (2) ("can" — ama vs man·a) as answered by this
  session — it is untouched, still queued, unrelated to NV-104.

## 8. Repository status at close

- HEAD immediately before this close commit: `e1fd390` (the relay-question
  draft commit from earlier this session) — verified via `git log -1`.
- This session's close commit (NV-104 fix + docs) will be `HEAD` after
  push; verify `== origin/main` immediately after.
- Working tree: clean after commit + push.
- `.ai/WORKSTATE.yaml`: `claude_a.pending_thangseng_questions` updated to
  reflect NV-104's closure; `claude_a.next_action`/`migration_doc` to be
  updated in the same commit.
- `docs/THANGSENG_NATIVE_VALIDATION.md`: NV-104 added this session.
- `docs/THANGSENG_RELAY_QUESTION_20260901.md`: marked ANSWERED/CLOSED.
- `master_dictionary.json`/`src/compiled_dict.json`: updated and
  rebuilt this session; gate green (8205/8205 entries, 9/9 grammatical
  corrections, 277/277 unit tests, 0 new repository-intelligence
  violations).
- No local-only commits; nothing left uncommitted or unpushed.
