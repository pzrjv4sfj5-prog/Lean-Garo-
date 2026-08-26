# Claude B — AI/Web Fallback Research Prototype: Design & Findings (2026-08-24)

Engineering investigation only, per the task brief. No linguistic decisions
made; no `master_dictionary.json`/`corrections.json`/`compiled_dict.json`
changes. New code lives entirely under `src/research/`, not wired into
`translate()`'s cascade.

## 1. Where unresolved words can currently be detected

Nowhere reliably, at the assembled-output level. Two independent silent-loss
mechanisms exist in the existing cascade — full trace in code comments at
the top of `src/research/detectUnresolved.js`:

- **`assembleSentenceSOV`** (`sentenceBuilder.js:100`): `.filter(p => p.garo)`
  drops any content word whose lookup returned `null`, with no `[UNKNOWN]`
  marker and no signal in the output. Confirmed live: `"she is carrying a
  widget"` → `"Ua gat·a"` (widget vanishes entirely, `method=sov-assembly`,
  `confidence=0.75` — looks like a normal, complete translation).
- **`assembleGrammar`'s object loop** (`grammarEngine.js:544-545`): when a
  multi-word object phrase's full-phrase lookup fails, it falls back to
  looking up only the *last* word of that phrase. If an earlier word is the
  one that's actually unresolved but a later word in the same phrase happens
  to resolve on its own, the wrong (but real) word silently takes the
  object slot. Confirmed live: `"i bought a gadget yesterday"` →
  `"Anga mejal·ko breaha"` — `"mejal"` ("yesterday") wrongly takes the
  object-marker slot; `"gadget"`, the actually-unresolved word, disappears
  with zero trace. This is worse than a drop: it evades the existing
  `result.includes('[UNKNOWN]')` safety check at `sentenceBuilder.js:314`
  entirely, because no `[UNKNOWN]` string ever appears in the output.

The existing `'[UNKNOWN]'`-string checks (`sentenceBuilder.js:314/389/433`,
`translationEngine.js:287-291/312`) are real and do work for the cases they
were built for (a single word that has no fallback-resolvable substitute) —
but they cannot catch either mechanism above, since neither one ever
produces the literal string `[UNKNOWN]` in final output.

**Consequence for this prototype's design:** detection cannot be built by
parsing `translate()`'s final Garo string. `detectUnresolvedWords()`
instead re-derives resolution status directly from the *original* English
content words, using the identical lookup chain (`lookupPhrase`/
`lookupGaro`, same `ing`/`ed`/`s`/`es` stripping order) the real engine
already uses internally — so a word this detector calls "resolved" is
resolved by the same rule the real engine would apply, and it can't be
fooled by whichever assembly path happens to win the cascade.

## 2. Where words are silently dropped

Answered above (§1) — the two confirmed mechanisms, with live repro
transcripts in `src/research/demo.js`'s run output (see `git log` / rerun
`node src/research/demo.js`).

## 3. Where a fallback hook can safely be inserted

`detectUnresolvedWords()` can run either **before** `translate()` (to
pre-flag which words in the input have zero dictionary presence at all,
independent of sentence assembly) or **after** it (to decide whether the
result is trustworthy enough to show as-is). Neither requires modifying
`translate()`, `assembleSentenceSOV`, or `assembleGrammar` — the detector
imports the same lookup primitives those files already export
(`lookupGaro`, `lookupPhrase`, `STOP_WORDS`, `AUXILIARY_SKIP`) rather than
patching into their internals. `researchMissingWord()` is a fully separate
async call, triggered only when `detectUnresolvedWords().isComplete` is
`false` — the existing cascade runs exactly as it does today whether or not
this module is ever imported.

**Not yet wired into `translationEngine.js`.** Per "do not build
everything," this phase stops at demonstrating the pipeline stands alone
correctly (`demo.js`). Wiring it in for real would mean `translate()`
optionally accepting a `{ research: true }` option that, on a detected gap,
attaches a `research` field to its return value alongside the existing
`garo`/`method`/`confidence` — additive, not a replacement of the existing
return shape.

## 4. What existing API/server architecture can host the research service

None exists yet in this repo — there is no server process, only a library
(`translate()`) called directly by tests/scripts. `researchMissingWord()`
is written provider-agnostic for exactly this reason: it takes an injectable
`{search, synthesize}` provider object rather than a hardcoded HTTP client
or SDK import, so it doesn't force a choice of web-search API (Google CSE,
Bing, SerpAPI, ...) or AI model (Claude, Gemini, OpenAI, ...) at this
stage, matching "do not commit to a provider unnecessarily." Whatever
server this project eventually stands up can wrap `researchMissingWord()`
with a real provider without touching its logic or call signature.

`src/research/demo.js`'s `demoProvider` demonstrates the shape a real
provider fills in — its `search()`/`synthesize()` are the only two methods
a real integration needs to implement.

## 5. What data structure should hold research results

`researchMissingWord()`'s return shape (see JSDoc in
`src/research/researchFallback.js`) matches the brief's spec exactly:
`english`, `candidate_garo`, `candidates[]` (each with its own `garo`/
`confidence`/`source`), `confidence`, `sources[]`, `evidence[]`, `status`,
`requires_native_validation`, plus `timestamp` and `fromCache` for
operational visibility.

Storage: an in-memory `Map` for this prototype phase (`_cache` in
`researchFallback.js`), keyed on `english word + surrounding context`.
Explicitly **not** `master_dictionary.json`/`corrections.json` — the file
header states why in comments so a future contributor can't casually
"simplify" by merging them: a persistent version of this cache in a real
deployment must live under a clearly separate, non-canonical path (e.g.
`.research-cache.json` or a dedicated table) that no dictionary-loading
script would ever read, specifically so it can never be mistaken for
confirmed dictionary data.

## 6. How the system prevents AI-generated values from entering the canonical dictionary

Four independent barriers, not just one:

- **No write path exists.** Nothing in `src/research/` imports `fs`'s
  write functions against `master_dictionary.json`/`corrections.json`/
  `compiled_dict.json`, or against any file under `.ai/`. Confirmed by
  inspection — the only I/O this module does is the injected `provider`'s
  `search()` call and the in-memory cache `Map`.
- **Status can never reach `CONFIRMED`.** `STATUS` in
  `researchFallback.js` defines `PROVISIONAL`/`NO_EVIDENCE_FOUND`/
  `UNRESOLVED`/`NATIVE_VALIDATION_REQUIRED` — there is no `CONFIRMED`
  value in this module at all. Only `translate()`'s real dictionary
  cascade can return dictionary-backed results; promotion to confirmed
  status is out of scope for this layer by construction, not by a
  runtime check that could be bypassed.
- **`requires_native_validation` is hardcoded `true`** on every non-empty
  result path — there's no code path that sets it `false`.
- **No silent single-answer collapse.** When multiple candidates disagree,
  `candidate_garo` stays `null` (only set when exactly one candidate
  exists) precisely so a caller can't casually read `.candidate_garo` off
  a result and treat it as *the* answer when the evidence itself
  disagreed — matching the brief's "if multiple possible Garo forms are
  found, DO NOT choose one silently."

## 7. How the feature can later be disabled without affecting normal translation

Trivially: it already is. `translationEngine.js` has zero references to
`src/research/*` as of this commit — `translate()`'s behavior, output
shape, and the full 229-test gate are byte-identical before and after this
prototype existed (confirmed: full suite + `repository-intelligence.js`
rerun clean after adding these files, zero diffs to any existing file).
When this is eventually wired in as an opt-in `{ research: true }` flag
(§3), disabling it is deleting or feature-flagging that one call site —
the research module itself never needs to be touched or removed to turn
the feature off.

## Proof of concept — what was actually demonstrated

`src/research/demo.js` runs three real cases end-to-end (rerun via
`node src/research/demo.js`):

1. `"she is carrying a widget"` — demonstrates the `assembleSentenceSOV`
   silent-drop mechanism (§1) and shows `detectUnresolvedWords()` catching
   it (`unresolvedWords: ["widget"]`) where the raw `translate()` output
   gives no indication anything is missing.
2. `"i bought a gadget yesterday"` — demonstrates the worse
   wrong-substitution mechanism (§1) and the same successful catch.
3. `"i need a computer for work"` — same pattern, plus demonstrates the
   evidence-ranking/source-recording behavior using a **real** web search
   performed this session (not simulated by the script, which has no web
   egress in this sandbox): a genuine English-Garo dictionary resource
   (Glosbe, `glosbe.com/en/grt`) was found to exist, but its specific
   `"computer"` entry was not fetched/parsed in this phase, so the result
   correctly stays `NO_EVIDENCE_FOUND` with the resource recorded under
   `sources` as a lead — not fabricated into a candidate.

A companion real search for `"gadget"`/`"widget"` found **no** Garo-specific
result at all (only English/French/Greek/Dutch general-dictionary entries
and unrelated software-"widget" hits) — confirming that "no usable evidence
exists" is a normal, expected outcome for a low-resource language that the
system must handle honestly (`NO_EVIDENCE_FOUND`), not something to paper
over with a plausible-sounding guess.

## Success criteria — answered

- **Can we detect dropped words reliably?** Yes — by checking original
  content words independently of assembly output, not by parsing the
  final Garo string (which two confirmed bugs can silently defeat).
- **Can we identify exactly which word was lost?** Yes —
  `unresolvedWords[]` names the specific English word(s).
- **Can we search the web for evidence?** Interface is built and proven
  with real evidence in the demo; no live search call is wired into the
  Node sandbox itself (no general web egress here) — that's the one piece
  intentionally left for a real deployment's provider implementation.
- **Can AI synthesize multiple sources?** Interface supports it
  (`provider.synthesize`); not implemented with a real model in this
  phase, per "do not commit to a provider unnecessarily."
- **Can we return a useful provisional translation?** Yes, when evidence
  exists — structure proven, `candidate_garo` intentionally withheld on
  disagreement per the "don't choose silently" requirement.
- **Can we guarantee unverified AI output cannot silently become
  canonical?** Yes — four independent barriers in §6, verified by
  inspection: no write path to any dictionary file exists in this module
  at all.
- **Can this be integrated later without destabilizing the existing
  engine?** Yes — zero existing files touched, full gate unchanged
  (229/229 tests, 0 new `repository-intelligence.js` violations).

## Discovered but out of scope this session

The `assembleGrammar` object-loop wrong-substitution bug (§1, "gadget"
case) is a genuine engineering bug independent of this feature — it can
silently misassign an unrelated resolved word (e.g. a time adverb) into
the object slot whenever the true object is multi-word and only its last
token happens to resolve. `detectUnresolvedWords()`'s design sidesteps it
(it never relies on `assembleGrammar`'s object extraction), so it wasn't a
blocker for this prototype — flagging here for a future dedicated
engineering session, not fixed in this one, since fixing it wasn't
necessary to accomplish the task and this session's brief was scoped to
the fallback-research investigation, not general cascade bug-hunting.

## Addendum, 2026-08-26 (Claude B) — AI-002 closed; PROVISIONAL path demonstrated; automated isolation tests added

- **The bug flagged above is fixed.** See `docs/CLAUDE_B_ENGINEERING_
  GOVERNANCE.md` §4 (AI-002, marked `FIXED 2026-08-25`) and
  `docs/CLAUDE_B_SESSION_MIGRATION_20260825.md`. Independently re-verified
  live via `translate()` this session (not just unit tests) — full detail
  in this session's migration document.
- **Gap closed: this doc's own "Can we return a useful provisional
  translation?" claim was structure-only** — `demo.js`'s two cases both
  land on `NO_EVIDENCE_FOUND`, never actually exercising the PROVISIONAL
  shape. Added `src/research/mockProvider.js` (explicitly-labeled
  fabricated/mocked evidence and candidate — not real linguistic content)
  and `src/research/demoProvisional.js`, which runs `researchMissingWord()`
  through a provider that *does* return a candidate and asserts every
  field of the documented shape (`candidates[]` with `garo`/`confidence`/
  `source`, `evidence[]`, `sources[]`, `confidence`, `status===PROVISIONAL`,
  `requires_native_validation===true`). All checks pass live
  (`node src/research/demoProvisional.js`).
- **Added `tests/unit/researchFallback.test.js`** (12 tests, now part of
  the standard gate) covering: `STATUS` has no `CONFIRMED` key;
  `DEFAULT_PROVIDER` fails closed; invalid input → `UNRESOLVED`; the full
  PROVISIONAL shape (mocked provider); disagreeing candidates leave
  `candidate_garo` null; cache hit/miss behavior;
  **structural isolation** — no file under `src/` or `src/data/` imports
  `src/research/`, and `researchFallback.js`/`detectUnresolved.js`/
  `mockProvider.js` never import `node:fs` (so they have no code path
  capable of writing any file, canonical or otherwise);
  **behavioral isolation** — `translate()`'s output for an unchanged
  sentence is identical before and after calling `researchMissingWord()`,
  and `master_dictionary.json`/`corrections.json`/`compiled_dict.json` are
  read and confirmed byte-identical before/after a research call (not just
  asserted by inspection, as this doc's §6/success-criteria section had
  previously done).
- **Still not done, unchanged from this doc's original scope:** no real
  `provider` implementation (still `DEFAULT_PROVIDER`'s honest
  no-op + the two demo/mock providers, none live-search-backed); not wired
  into `translate()`'s cascade; `STATUS.CONFIRMED` still does not exist
  anywhere in the module. See this session's migration document for the
  full "what remains before production integration" list.
