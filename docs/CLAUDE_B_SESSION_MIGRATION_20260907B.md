# Claude B Session Migration — 2026-09-07 (B)

## Project identity
Lean-Garo: English→Garo translation engine (`translate()` in
`src/translationEngine.js`, cascading through phrase/dictionary lookup,
stopword-stripping, grammar-assembly, sov-assembly fallback).

## Current commit / state
- `origin/main` tip: **`20d53f5`** — "Bug A fix: intensifiers no longer
  wrongly elected as the finite verb". Pushed and confirmed on origin
  this session.
- Session opened at `origin/main` = `5c53794` (per the prior migration
  doc, `docs/CLAUDE_B_SESSION_MIGRATION_20260907.md`, close hash
  `762a20f` → `17c630e` bookkeeping commit → NV-148 through NV-151
  landed → `5c53794`).
- While this session was in progress, **Claude A landed 3 more
  commits** on top: `eaef5f3` (NV-152, elephant primary spelling —
  closes the NV-089 tie from open item 4 below), `aaa3a2e` (Claude A's
  own 2026-09-07 migration doc), `672fcf3` (WORKSTATE.yaml bookkeeping).
  My Bug A commit was rebased (not merged) onto that tip before
  pushing, per standing rules. Full gate was re-run and confirmed
  clean against the merged state before push (see below) — this was
  the "re-run the gate once at the top" step, done twice: once at
  session start against `5c53794`, once again after the rebase onto
  `672fcf3`.
- Working tree is clean. Nothing local, nothing uncommitted, nothing
  unpushed.

## What's done vs. held, and why

### Done this session
**Open item 1, Bug A (grammar-assembly intensifier-as-verb) — FIXED,
tested, pushed.**
- Root cause: `grammarEngine.js`'s verb-finding loop (`analyzeGrammar`)
  had no restriction against electing a non-verb dictionary word as
  the finite verb. Intensifiers like "very" have their own real
  dictionary entry ("very"→"namen"), so the loop elected the
  intensifier as the verb before ever reaching the real predicate
  adjective, stranding the adjective as a leftover object with an
  incorrectly-applied `-ko` marker.
- Fix: new closed-class table `INTENSIFIER_WORDS`
  (`normalizationEngine.js`, same discipline as `STOP_WORDS`/
  `AUXILIARY_SKIP`) covering `very/too/quite/really/extremely/rather/
  somewhat` (`so` deliberately excluded — already in `STOP_WORDS` and
  filtered before the verb loop even sees it). Wired into **both** the
  verb-finding loop and the object-extraction loop in
  `grammarEngine.js` — fixing only the verb-loop left the intensifier
  wrongly falling into the object slot with a `-ko` marker instead, so
  both call sites needed the guard.
- Scope discipline: this is purely the verb-misidentification /
  wrong-marker fix. It does **not** attempt to place the intensifier's
  own translation anywhere in the output (it's currently dropped, same
  as `STOP_WORDS`/negation words are dropped elsewhere in this
  cascade) — correct placement of intensifiers generally is open item
  3 below, explicitly blocked pending native evidence, and is a
  linguistic question, not an engineering one.
- Tests: `tests/unit/intensifier_not_elected_as_verb.test.js` (5 new
  tests). Deliberately uses "cold"/"tired"/"happy", not "hot" — "it is
  very hot [today]" is caught by `tryVeryHotConstruction`'s exact regex
  match before grammar-assembly ever runs, which would mask whether
  the general fix works on its own. Includes a regression guard that
  `tryVeryHotConstruction` itself is unaffected, plus a regression
  guard on an ordinary object sentence ("i eat rice").
- Gate: verified clean twice (pre-rebase against `5c53794`, post-rebase
  against `672fcf3`) — `prepare-data.js` (zero diff vs. committed
  artifacts), `test-dictionary.js` (8257/8257), `repository-
  intelligence.js` (0 new violations), `runtime-error-sweep.mjs` (0
  errors / 14755 calls), `node --test` (350/350, up from 345/345).

### Held — not started / not finished
**Open item 2, Bug B (sov-assembly contraction subject detection) —
INVESTIGATED, NOT FIXED. No code changes made. This is the main
carry-forward item.**

The prior migration doc described this as one bug ("it's"/"he's"/
"she's" all fail subject detection the same way, PRONOUN_MAP has "it"
not "its", apostrophe stripped before lookup). Investigation this
session found **the actual behavior is not uniform** — three different
failure/success paths, not one bug:

1. **`"it's eating"` → subject silently dropped entirely**, not just
   misrouted to the weaker fallback. Trace: `translationEngine.js`
   strips apostrophes early (line ~125, `it's`→`its`), then step 4 of
   the cascade (`stopword-stripped`, ~line 300-316) filters `words`
   against `STOP_WORDS` *before* grammar-assembly or sov-assembly ever
   run. `"its"` is already a `STOP_WORDS` entry (the possessive "its",
   e.g. "its color") — so `"it's eating"` → `["its","eating"]` → "its"
   gets stripped as a stopword → looks up `"eating"` alone → returns
   `method: "stopword-stripped"`, confidence 0.88, **short-circuiting
   before either assembly path runs**, subject lost with no fallback.
   Confirmed live: `translate("it is very cold")`-style probe shows
   output `"cha·enga"` with no "Ua".

2. **`"he's eating"` / `"she's eating"` → already correct**, output
   `"Ua cha·enga"` via `method: "sov-assembly"`. Confirmed via direct
   call: `assembleSentenceSOV(['hes','eating'], false, 'present')` →
   `"Ua cha·enga"`. This was surprising given `analyzeGrammar("he's
   eating")` returns `subject: null` (PRONOUN_MAP has no "hes" key,
   same as the doc predicted) and `lookupGaro('hes')` also returns
   `null` directly — yet `assembleSentenceSOV` still produces the
   right subject somehow. **The actual mechanism inside
   `assembleSentenceSOV`'s word-mapping (around line 100-145 of
   `sentenceBuilder.js`) was not identified before the tool budget for
   this investigation ran out** — I was mid-trace into whether it's a
   fuzzy-match candidate, a `lookupPhrase` hit, or something else, when
   I had to stop. This needs to be understood before touching
   anything, so a fix for `"it's"` doesn't accidentally break whatever
   is making `"he's"`/`"she's"` work today.

3. **`"the dog's bone"`-style true possessives** — spot-checked as a
   regression guard (`translate("the dog's bone is here")` →
   `"Achak Greng Iano"` via sov-assembly, looks sane), but not
   exhaustively tested against whatever fix eventually lands for #1/#2.

**Next-session starting point for Bug B:** resume the trace inside
`assembleSentenceSOV` (`sentenceBuilder.js`, roughly lines 100-145) to
find what's actually resolving `"hes"`/`"shes"` to `"Ua"` today, before
designing a fix. Once that's understood, the likely fix shape is still
what the prior doc suggested — contraction expansion or PRONOUN_MAP
awareness before subject matching, careful not to collide with
possessive `'s` on nouns — but it needs to also (a) stop `"it's"` from
being intercepted and dropped by the `STOP_WORDS`-based stopword-strip
step in `translationEngine.js` before grammar/sov assembly ever runs,
and (b) not disturb whatever mechanism already makes `"he's"`/`"she's"`
work.

**Open item 3 (very-hot generalization)** — untouched, correctly still
blocked. Not generalized beyond the one attested sentence.

**Open item 4 (Elephant NV-089 tie)** — **CLOSED by Claude A**, not by
this session. `eaef5f3` (NV-152) landed on origin while this session
was running and resolved it (mongma, no raka). No action needed here.

**Open item 5 (`ball` fuzzy false-positive)** — untouched, still low
priority, not investigated.

## Open issues, with root cause where known
- Bug B: see above — three-part issue, root cause of parts 1 and (main
  cause of) 2 identified, part 2's actual resolution mechanism still
  unidentified.
- No other new issues surfaced this session. `repository-
  intelligence.js` and `runtime-error-sweep.mjs` both clean at 0 on
  every gate run.

## Standing rules (unchanged, confirmed followed this session)
- `git fetch` before every push — done twice, caught Claude A's
  concurrent NV-152 landing correctly.
- Rebase, not merge, on conflicts — one rebase this session, clean, no
  conflicts.
- Regenerate `compiled_dict.json`/reports via `node prepare-data.js`
  from merged source rather than hand-merging — done, zero diff
  confirmed both times.
- One task per commit, don't batch — Bug A is its own commit; Bug B
  intentionally left uncommitted rather than batched in.
- Migration doc written and pushed before ending the session — this
  file.

## Note on this session's credential handling
Two PATs were provided in-chat over the course of this session. The
first was rejected outright by GitHub itself ("Invalid username or
token. Password authentication is not supported for Git operations.")
on every write operation (confirmed via direct `git-receive-pack` and
REST API calls — not a sandbox/network restriction, a real 401 from
GitHub) despite successfully authenticating `fetch`/`clone`, which
turned out to be because `Lean-Garo-` is a public repo and anonymous
reads succeed regardless of credential validity. The second PAT,
provided after regeneration, authenticated correctly for push and was
used for the push in this doc. Both tokens were used only in-session
and were not written to any file in this repo; the remote URL
currently embeds the working token in `.git/config` in the sandbox
working copy only (not committed, not visible to future sessions
unless the sandbox state is reused). **Recommend rotating this token
after this session**, per the general practice of treating any token
pasted into a chat as potentially exposed.

## Exact next step for the next session
1. `git fetch origin`, confirm `HEAD` at `20d53f5` or later (check for
   anything Claude A landed in the meantime).
2. Re-run the gate once at the top (do **not** re-verify Bug A —
   already confirmed fixed and tested in this doc).
3. Resume the Bug B trace at `sentenceBuilder.js` ~line 100-145
   (`assembleSentenceSOV`'s word-mapping loop) to find what currently
   resolves `"hes"`/`"shes"` correctly, then design and implement the
   fix per the shape described above (contraction awareness before
   subject matching, without breaking `"he's"`/`"she's"`'s current
   accidental correctness or true possessive `'s` on nouns).
4. Commit Bug B alone, run the full gate, push, write the closing
   migration doc.
