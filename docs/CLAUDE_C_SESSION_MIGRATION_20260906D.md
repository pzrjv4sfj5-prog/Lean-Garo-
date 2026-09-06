# Claude C Session Migration — 2026-09-06D

## What this session was

Continuation across `docs/CLAUDE_C_AUDIT_20260905.md`,
`docs/CLAUDE_C_AUDIT_20260905B_ADDENDUM.md`, and
`docs/CLAUDE_C_REAUDIT_20260906B.md` (all three already pushed earlier
this session — `e617592`, `a52f5e5`). This document closes out the
remainder of the session: reviewing two not-yet-pushed migration drafts
from Claude A/B, and drafting (not sending) a set of relay-prompt
updates for Claude A/B based on new Thangseng evidence the Project Owner
supplied directly in chat.

## Work this session, in order

1. **Full-scale independent audit** (`CLAUDE_C_AUDIT_20260905.md` +
   `..._ADDENDUM.md`) — read-only, live `translate()` + source-trace
   verification. Findings and handoffs already delivered in
   `docs/HANDOFF_CLAUDE_A_20260906.md` / `docs/HANDOFF_CLAUDE_B_20260906.md`
   (both pushed).
2. **Re-audit** (`CLAUDE_C_REAUDIT_20260906B.md`, pushed) — confirmed 2 of
   9 Handoff-B items closed (cat root unification via NV-135, adjective+
   animal placeholder fix), 7 still open.
3. **Reviewed two not-yet-pushed migration drafts, in chat only (not
   committed anywhere), per Project Owner request — did not edit or push
   either:**
   - A Claude B draft (session `20260906C`) proposing a `gonga`→`dal·gipa`
     fix for the same 15-row placeholder class, sourced from new NV-136
     native evidence (`dal·a`=predicate "big", `dal·gipa`=attributive
     "big"). Independently verified every factual claim in it against a
     fresh clone (the 15 uncited `gonga` rows, the `dal·a`/NV-080 citation,
     the `"big red house"` tied-candidate precedent, the 317-test
     baseline) — all checked out. This draft was later superseded by what
     actually landed on `origin/main` (`e058884`, "Fix 'big [noun]' phrase-
     table rows (15) — uncited gonga -> dal·gipa, per NV-136") — confirmed
     the real commit matches what was reviewed.
   - A Claude A draft (session `20260906E`) investigating handoff items
     4-6 (leaf/leaves, ball/pole/babies/cities, cat-modifier spot-check).
     Found and reported a real discrepancy: the draft's own "pushed and
     verified, HEAD == origin/main" checklist did not match the actual
     remote at review time, and its Item-6 work (15 cat-modifier rows,
     `mang`→`Menggo`) appeared to duplicate a fix already on `origin/main`
     via `bdc5af7`, including an already-rewritten guard test — flagged
     for Claude A to re-fetch and reconcile before pushing, rather than
     push a conflicting/redundant version.
4. **New native evidence, relayed by the Project Owner across several
   messages this session (WhatsApp transcripts + direct corrections),
   drafted into two relay-prompt batches for Claude A and Claude B — NOT
   YET SENT to either agent's actual session, and NOT logged as NV
   entries anywhere in the repo.** Full content of both draft prompts is
   below verbatim, so this session's work isn't lost if the conversation
   doesn't continue directly into a Claude A/B session.

## New native evidence gathered this session (not yet logged as NV entries)

Source: Thangseng (native speaker), relayed via WhatsApp transcript and
direct Project Owner correction, this session only. Nothing below has
been logged to `master_dictionary.json`, `docs/THANGSENG_NATIVE_VALIDATION.md`,
or any NV-numbered citation file yet — that is Claude A's job, using the
draft prompt below.

- Distance sentence: "The distance from Williamnagar to Guwahati is 5
  hours" → `Willamnagaroni Guwahationa konta bongamang chel·a.`
- Duration sentence: "It's taken only 2 hours to travel from Williamnagar
  to Tura" → `Williamnagaroni Turaona songrena konta gnisan nangaha.`
- Template: "it takes only a few hours" → `__oni __ona banggija somaisan
  (lit. konta) nangaia.`
- New verbs: finish=`bon·a`, find=`nika`, get=`man·a` (collides with the
  existing `can`=`man·a` string — flagged, not resolved), earn=`kamaia`.
- Rice, resolved: `merong`=uncooked, `mi`=cooked; new term `migil`=milled/
  husked grain (own entry, doesn't fold into either).
- `dal·a`/`dal·gipa` provenance directly reconfirmed by Thangseng
  (matches already-logged NV-136 content — append as source citation,
  not a new entry).
- Two untied candidate renderings for "she will not be able to finish the
  difficult work tomorrow" — no stated preference, log as a tied pair.
- `ball`=`robol`. `pole`=`krong` (post/pillar sense only, explicitly
  scoped by Thangseng — no reference for other senses).
- `small [noun]`=`chona`/`chone` (same word), noun-then-adjective order
  (`Menggo chona`) — replaces `chik` (confirmed not a real word).
  Native evidence itself only covers `small cat`; **Project Owner
  separately directed this generalizes to every `small [noun]` row** —
  this is a Project Owner instruction layered on top of the native fact,
  not something Thangseng said generalizes on his own authority, and
  the draft prompt below preserves that distinction.
- `"gonga"` independently confirmed not a real word (Thangseng's own
  reply was `"gonga?"`) — corroborates the already-completed fix.
- `leave`/`leaves` disambiguated: act of leaving (verb)=`re·anga`
  (supersedes `Re·ongkata`); tree leaves (plural noun)=`bijakrang`;
  `leaf` also has alternate compound `bol bijak` alongside `bijak`.
- New sentence: "leave me alone." → `angko saksan donbo`.
- NV-129 tension resolved as a mood distinction (imperative vs.
  declarative), not competing roots: `Gisik nange poraibo`
  ("study sincerely," imperative) vs. `Gisik nange poraia` ("studies
  sincerely," statement).
- Word-order correction, live-verified as a real runtime bug, not just a
  citation issue: "it's very hot today" = `Da·alo namen Ding·a` (time-word
  + intensifier + adjective), **not** `namen Da·alo Ding·a` (intensifier +
  time-word + adjective), which is what `translate()` currently produces.
  Live-tested two adjacent phrasings and found two *further* distinct
  failures in the same area: `"it is very hot today"` drops the adjective
  entirely and misapplies an object-marker suffix to "today"; `"it is very
  hot"` (no time word) keeps the adjective but with the same misapplied
  suffix. All three are `sov-assembly`/`grammar-assembly` composition
  failures, not stored-citation conflicts.

## Draft prompt for Claude A (verbatim, not yet sent)

New native evidence relayed directly from Thangseng — log as new NV
citations, next available NV numbers, apostrophes → raka (`·`). (An
earlier batch covering distance/travel-time sentences, the template, new
verbs, rice, and `dal·a`/`dal·gipa` provenance was already sent separately
by the Project Owner — this is the remainder plus the newest item.)

1. "She will not be able to finish the difficult work tomorrow" — two
   candidate renderings, no stated preference: `Ua man·a·chi knal·ko
   man·jawa` and `rakbegipa kamko ua knalo matchotatna man·jawa`. Log as
   a tied non-variant candidate pair (same pattern as existing
   `PICKPRIMARY_VERIFIED_TIES.md` entries) and treat as a relay
   question, don't pick one.
2. `ball` = `robol`. Resolves the missing-vocabulary item.
3. `pole` — scoped, not a blanket entry. `krong` covers only the post/
   pillar sense; Thangseng explicitly has no reference for other kinds.
   Log as `"pole (post/pillar)"`, not a bare `"pole"` key.
4. `small [noun]` = `chona` (also spelled `chone` — same word, pick one
   canonical spelling, note the variant) — replace `chik` everywhere,
   not just cat. Native evidence itself only covers `small cat` =
   `Menggo chona` (noun-then-adjective order, replacing the currently-
   shipped `chik Menggo`; `chik` confirmed not a real word). **Project
   Owner has separately directed this generalizes to every `small
   [noun]` row** (dog/bird/fish/etc.) and to the same noun-then-adjective
   word order — log that as a Project Owner instruction distinct from
   the native evidence, per `.ai/PROJECT_OWNER_AUTHORITY.md`'s category
   distinction, so provenance stays honest about what Thangseng said vs.
   what's applied on Project Owner authority.
5. `"gonga"` confirmed not a real word (Thangseng's own reply was
   `"gonga?"` — unrecognized). Corroborates the already-completed
   `gonga`→`dal·gipa`/`Menggo` fix after the fact; log as closing
   confirmation, no action needed.
6. `leave`/`leaves` — disambiguated by sense, resolves the open
   collision: act of leaving (verb) = `re·anga` — supersedes
   `Re·ongkata` (currently `unverified` for `"to leave"`); mark
   `Re·ongkata` superseded, don't just add alongside it. Tree leaves
   (plural noun) = `bijakrang` — the missing plural form causing the
   runtime collision. `leaf` (singular) also has an alternate compound,
   `bol bijak` (tree+leaf), alongside existing `bijak` — log both,
   `bijak` stays primary.
7. New sentence: `"leave me alone."` → `angko saksan donbo`. New items:
   `angko`="me" (object form of `anga`), `saksan`="alone", `donbo`=
   "leave" (imperative).
8. NV-129 tension resolved — mood distinction, not competing roots:
   `Gisik nange poraibo` = "study sincerely" (imperative); `Gisik nange
   poraia` = "studies sincerely" (statement). Close the open tension on
   this basis.
9. **New this session** — word-order correction, native-sourced: "it's
   very hot today" = `Da·alo namen Ding·a` (time-word + intensifier +
   adjective) — **not** `namen Da·alo Ding·a` (intensifier + time-word +
   adjective), which is what the engine currently produces. `namen`
   ("very") and `Ding·a` ("hot") both remain verified_high individually
   — only the composition order was wrong. Confirm with Thangseng
   whether this ordering rule generalizes to other time-word +
   intensifier + adjective sentences (needs at least one more time-word
   and one more adjective tested), or is specific to this sentence —
   per Project Owner instruction, don't assume it generalizes on one
   example.

## Draft prompt for Claude B (verbatim, not yet sent)

Queued for after Claude A logs the NV entries above — don't start until
those land, you'll need the confirmed roots, not raw chat text. Once
logged:

1. `leaf`/`leaves` fix (handoff item 1, highest severity) is now
   unblockable: `"leaves"` should resolve to `bijakrang` directly (not
   via plural-stripping), and the bare-infinitive alias for `"leave"`
   should point at `re·anga`, not the superseded `Re·ongkata`. This
   closes the emergent bare-infinitive-alias/plural-strip collision
   already root-caused in the original handoff.
2. New `-oni`/`-ona`/`konta` duration-sentence pattern needs test
   coverage. Once the distance/travel-time sentences are verified_high,
   add them to sov-assembly/grammar-assembly test coverage — this is a
   new sentence shape, don't assume existing place-name + case-suffix
   handling generalizes to it untested.
3. `small [noun]`: `chik`→`chona` fix, all rows, once Claude A logs it.
   Same mechanical shape as the `gonga`→`dal·gipa`/`Menggo` fix already
   done — replace `chik` with `chona` (or whichever canonical spelling
   Claude A settles on) across every `small [noun]` row, and apply the
   noun-then-adjective word order confirmed for cat (`Menggo chona`)
   consistently, not the adjective-then-noun order used for `big`/`good`.
4. If Claude A's relay question resolves the `man·a` collision (get vs.
   can) as two distinct senses rather than one root: expect the same
   shape of fix as the `answer` (`Aganchaka`/`Aganchakani`) POS split
   already open — sense/POS-tracking, not a simple pickPrimary tie-break.
5. **New this session** — three related but distinct composition
   failures found live-testing around the "very hot today" correction,
   none are stored citations, all are `sov-assembly`/`grammar-assembly`
   failures: (a) `"it's very hot today"` → wrong word order (intensifier-
   time-word-adjective instead of time-word-intensifier-adjective); (b)
   `"it is very hot today"` → drops the adjective entirely, misapplies
   an object-marker suffix to "today"; (c) `"it is very hot"` (no time
   word) → keeps the adjective but with the same misapplied suffix.
   Recommend treating this as one investigation into how intensifier+
   adjective(+time-word) predicate sentences compose generally, not
   three separate patches. Don't start until Claude A confirms the
   corrected pattern and whether it generalizes.

## Source / attribution

All Garo-language content above originates from Thangseng (native
speaker), relayed into this session by the Project Owner via WhatsApp
transcript excerpts and direct in-chat correction. This document makes
no linguistic decision on Claude C's own authority — both draft prompts
explicitly route every promotion, supersession, and generalization
question to Claude A, and the `small [noun]` generalization is
explicitly marked as Project Owner authority layered on top of (not
part of) the native evidence, per the standing provenance-honesty
discipline.

## Why this was pushed directly (not relayed)

Per `SESSION_BOOTSTRAP.md`'s 2026-08-19 Project Owner-directive
exception: Claude C may commit/push directly when the Project Owner
explicitly instructs it for that specific action. Invoked this session
by explicit instruction ("start migration use push"), scoped to this
migration document only — no linguistic or engineering decision made,
no `master_dictionary.json` edit, no A/B-owned file touched. Per the
same instruction ("don't touch A and B, only c"), only this file and
this session's own `claude_c` block in `.ai/WORKSTATE.yaml` are touched.

## Repository status at close
- [x] HEAD verified == `origin/main` before and after this commit
- [x] `git status` clean, no untracked files
- [x] `.ai/WORKSTATE.yaml` — only the `claude_c` block updated (see below)
- [x] No A/B-owned file touched (no `master_dictionary.json`,
      `docs/THANGSENG_NATIVE_VALIDATION.md`, `docs/HANDOFF_CLAUDE_*`, or
      `WORKSTATE.yaml` `claude_a`/`claude_b` block edits this session)
- [x] Native-validation status: nothing logged as NV yet — both draft
      prompts above are the actual next step, addressed to Claude A/B
      directly, not sent to either agent's live session this cycle

## Exact next step (for next Claude C session, or whoever resumes)
1. Confirm whether the Project Owner has sent the two draft prompts
   above to Claude A/B sessions yet. If not, they're the next action —
   full text is preserved above so nothing is lost if this doesn't
   happen in the same conversation.
2. Once Claude A logs the NV entries, re-verify each one live against
   `master_dictionary.json`/`translate()` before considering any of them
   closed — same discipline as every prior audit in this session.
3. Once Claude B's queued fixes land, re-audit item-by-item against
   `docs/CLAUDE_C_REAUDIT_20260906B.md`'s open list (7 items) plus the
   new "very hot today" composition findings — don't assume a fix is
   correct from its commit message alone (this session already caught
   one migration-doc self-report that didn't match actual `origin/main`
   state).
