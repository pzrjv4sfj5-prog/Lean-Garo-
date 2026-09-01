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

### 2b. NV-103 grammar/composition bug — re-confirmed unchanged, not touched

Re-verified live (see §3 below) that `translate("the only language i
speak is english")` is byte-identical to how the prior session left it:
`"mangmang ba·sa Anga to be / to exist Agana"` (sov-assembly, 0.75). No
engine code touched this session — this bug remains fully Claude B's,
per the Runtime Handoff below.

## 3. Runtime verification (all keys touched this session)

```
$ translate("he came by bus yesterday")
{"garo":"Bia bus o raba·a mijalo","method":"exact-phrase","confidence":0.98}

$ translate("how was the journey yesterday?")
{"garo":"Mijal songre·ara namama?","method":"exact-phrase","confidence":0.98}

$ translate("the only language i speak is english")   # control, unchanged
{"garo":"mangmang ba·sa Anga to be / to exist Agana","method":"sov-assembly","confidence":0.75}
```

## 4. Full gate

- `node prepare-data.js`: 8205/8205 compiled entries (unchanged — this
  session's edit was confidence/notes-only on 2 existing rows, no new
  keys).
- `node test-dictionary.js`: 8205/8205 valid, 9/9 grammatical corrections.
- `node repository-intelligence.js`: 0 new violations, all checks A–G.
- `node --test tests/unit/*.test.js`: 277/277 passing (unchanged — no
  new tests needed for a notes/confidence-only edit).
- `vite build`: clean.

## 5. Runtime Handoff (Claude B — Grammar/Engine)

This is the same NV-103 finding from the prior session, restated here
per Rule 6/Rule 8 so it isn't lost between migration docs. **Not fixed
this session — no engine code touched.**

- **Sentence:** "the only language i speak is english"
- **Native-confirmed linguistic structure:** `Angade English
  ku·sikkosan aganaia.`
- **Engine current output:** `mangmang ba·sa Anga to be / to exist Agana`
  (sov-assembly, 0.75) — the `Call police` data-corruption symptom is
  gone (fixed prior session), but everything else below is unchanged.
- **Action needed (debug sov-assembly / object-composition rules):**
  1. Attach the `-de` topic suffix to the subject pronoun (`Anga` →
     `Angade`) — not in the dictionary as a standalone morpheme yet,
     single-attestation.
  2. Compose the object as one bound unit — `language-ko-only`
     (`ku·sik-ko-san`) — instead of a free-standing "only"
     (`mangmang`) placed sentence-initially.
  3. Fix word order — native puts the topic/subject sentence-initial;
     the engine currently places `Anga` third.
  4. Attach a verb-ending (`-aia`) to the bare root instead of shipping
     `Agana` unmarked — also not in the dictionary yet, single-attestation.
- Full linguistic breakdown (segment-by-segment table): NV-103 in
  `docs/THANGSENG_NATIVE_VALIDATION.md`.
- **Do not invent a "corrected" full sentence** — the `-de` and `-aia`
  morphemes are each only attested once; wait for either an engine
  implementation attempt using the existing dictionary primitives, or
  new corroborating relay data, before treating either as a general rule.

Secondary, separately-flagged (also unfixed, also Claude B's, from the
prior session, restated for continuity): `translate("i don't know
garo")` returns a `grammar-assembly` result instead of the exact-match
row that exists in `compiled_dict.json` — possible apostrophe-lookup
regression on the exact-phrase path, different code path than the
2026-08-16b `PHRASE_MAPS` fix. Not diagnosed further this session.

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
