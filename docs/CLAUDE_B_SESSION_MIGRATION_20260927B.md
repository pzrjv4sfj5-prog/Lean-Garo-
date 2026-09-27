# Claude B — Session Migration (2026-09-27B, full governance)

## Project identity

Lean-Garo-: English↔Garo translation engine. Two-Claude-plus-Owner
workflow — Claude A owns dictionary/linguistic content, Claude B owns
engine/composition code and test infrastructure. All content changes
require either a direct Thangseng (native speaker) citation or an
explicit Project Owner directive; engineering changes must pass the
5-step gate before commit.

## Current state (verified this session, not assumed)

- **HEAD**: `47ddeb9` on `main`, pushed and confirmed on remote.
- **Working tree**: clean.
- **`several` = `adita`**, final. Converged independently by both this
  session (Owner's direct example) and a parallel Claude A session
  (print-dictionary citation) — see merged history in
  `tests/unit/several_many_quantifier_composition.test.js`.
- **`many` = `bang·a`**, unchanged.
- Quantifier composition order: QUANTITY + NOUN, confirmed for
  `adita`/`bang·a`/`bang·e` across 8+ pronoun/noun combinations via
  live `translate()` probing this session.

## What's done this session

1. `several`: `bang·e` → `adita` in `garo_dictionary.json` /
   `corrections.json` (Owner directive), plus an exact-phrase
   correction for `"i have several books"` → `"Ango adita ki.taprang
   donga"` (carries `-rang`, not generalized — see
   `CLAUDE_A_RANG_PLURAL_RULING_20260825.md`).
2. Found and fixed a real regression the swap exposed:
   `grammarEngine.js`'s quantifier-preservation composition matched
   only the literal `bang·a`/`bang·e` (regex `/^bang·[ae]$/i`), so
   `adita` silently vanished from every `"several X"` sentence except
   the one exact-phrase-covered case. Added `adita` to the literal
   match — not generalized to a POS-based rule.
3. `docs/CLAUDE_B_HANDOFF_20260927_donga_onga_precedence.md`: the
   36-entry (re-counted, not 26) `<pronoun> ong·a <noun>` precedence
   bug is resolvable from existing catalogue evidence (RULE-G7 =
   `donga` for possession, RULE-005 = `ong·a` is "to be," not "to
   have") without a new Thangseng question. Flagged for Claude A to
   supersede; no dictionary edit made by me.
4. Merged a parallel Claude A session (`9269d4e`) that independently
   reached the same `adita` conclusion via a different path and found
   the same regression but left it `.todo`/unfixed. Merged the history
   honestly (both provenance chains recorded) rather than picking one
   side; kept the working, non-`.todo` test assertions since the fix
   is real in this branch.
5. Relayed 4 questions to Thangseng (via the Project Owner) — trimmed
   from an initial 16-question draft down to only what the existing
   `docs/GRAMMAR_RULE_CATALOGUE.md` doesn't already answer at
   Verified/High confidence. **Sent, awaiting response, not yet
   incorporated into any code or content.**

## Open issues (root cause noted where known)

1. **Quantity-word-order exception** — two pre-existing static
   citations (`"Wak be·en mit·am bang·a"`, `"Man·derang bang·e
   re·baa"`) use NOUN+QUANTITY, opposite of the now-confirmed
   QUANTITY+NOUN order for possession sentences. Root cause unknown:
   possibly a different sentence type (description/exclamation vs.
   possession). **Relayed to Thangseng, awaiting response.**
2. **`-rang` plural generality** — confirmed only for children, fruits,
   coins, and now books-with-adita; formally ruled non-productive
   (`CLAUDE_A_RANG_PLURAL_RULING_20260825.md`) pending more native
   data. **Relayed to Thangseng, awaiting response.**
3. **Adjective position inside noun phrases** (vs. the confirmed
   predicate-position use) and **adverb position** (no rule exists at
   all in the catalogue) — both genuinely undocumented. **Relayed to
   Thangseng, awaiting response.**
4. **AI-003** (multi-word `VERB_LEMMAS` invisible to matchers) —
   unchanged priority, not attempted this session.
5. **36-entry `ong·a` supersession** — evidence-resolved (see item 3
   above), action is Claude A's content-lane call, not yet applied by
   either session as of this HEAD.

## Standing rules this session followed (not re-litigated)

- Content changes are Claude A's lane; I flag findings and evidence
  rather than editing dictionary/corrections content unilaterally,
  except when directly executing an explicit Owner directive given in
  this chat (the `adita` swap).
- `-rang` is not computed anywhere in the engine — every instance ships
  as a hand-entered exact-phrase or dictionary row, per the 2025-08-25
  ruling. Do not build a generalized suffix rule without new native
  evidence removing that ruling.
- Before relaying any question to Thangseng, check
  `docs/GRAMMAR_RULE_CATALOGUE.md` first — do not re-ask what's already
  Verified/High confidence there.
- 5-step gate before every commit: `node prepare-data.js` →
  `node test-dictionary.js` → `node repository-intelligence.js` →
  `node --test tests/unit/*.test.js` →
  `node scripts/runtime-error-sweep.mjs`. All five ran clean both
  before and after the merge this session.

## Exact next step

Wait for Thangseng's response to the 4 relayed questions (quantity-
order exception, `-rang` generality, adjective/adverb position). On
resume: re-sync with actual repo state first (this doc is a snapshot,
not a guarantee nothing has changed since), then incorporate whatever
answers arrived — each into the correct lane (content vs. engineering)
— before touching anything else.

## Gate confirmation (this session, final state, HEAD `47ddeb9`)

- `prepare-data.js`: clean rebuild, 8922 entries, 1433 alternates.
- `test-dictionary.js`: 8922/8922 valid, 9/9 grammatical corrections
  verified.
- `repository-intelligence.js`: 0 new violations across all checked
  categories.
- `node --test tests/unit/*.test.js`: **476/476 passing, 0 `.todo`,
  0 failed.**
- `scripts/runtime-error-sweep.mjs`: **15897/15897 `translate()` calls,
  0 errors.**

Pushed and confirmed on `origin/main` at `47ddeb9`.
