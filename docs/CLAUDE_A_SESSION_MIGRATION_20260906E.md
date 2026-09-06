# Claude A Session Migration — 2026-09-06E

## Resume sequence (Rule 10)
`git fetch` confirmed actual `origin/main` = `7afc92b` — **not** `a52f5e5`
as claimed by a stale audit note pasted into this session's opening
prompt. That note (describing `bdc5af7` as unpublished duplicate work,
and NV-136/NV-137 documentation as "genuinely unpublished") was already
moot on arrival:
- `bdc5af7` ("Fix cat phrase-table rows (15)... unblocked by NV-135") is
  already an ancestor of `origin/main` — confirmed via
  `git merge-base --is-ancestor`.
- The `NV-136` referenced in that stale note (described as a
  leaf/ball/babies/cities investigation) does not match this repo's
  actual `NV-136`, which is the "big": predicate-vs-attributive
  (`dal·a`/`dal·gipa`) item — already closed, already pushed (`e058884`,
  "Fix 'big [noun]' phrase-table rows (15)... per NV-136"), already
  re-audited by Claude C (`a52f5e5`).
No action was taken on that stale note beyond this verification — it
described a repo state that no longer (and, on the NV-136 numbering, never
did) exist here.

## Work this session
Processed a 2026-09-05-evening native-evidence batch, direct Thangseng
relay via Project Owner/WhatsApp. NV numbers assigned starting after the
verified current highest (NV-136, confirmed via grep across
`docs/THANGSENG_NATIVE_VALIDATION.md`/`master_dictionary.json`):

- **NV-137** — distance sentence (Williamnagar→Guwahati). Promoted
  `hour`/`five`/`distance` (`Konta`/`Bonga`/`Chel·a`) from `unverified`
  to `verified_high`; added the full sentence row.
- **NV-138** — duration sentence (Williamnagar→Tura). Added `songrena`
  ("travel"), `nangaha` ("took", past), both `unverified` (single-
  sentence attestation). Flagged, not merged: new form `gnisan` for
  "two" vs. existing `Gni` (also unverified) — real discrepancy, not
  guessed at.
- **NV-139** — grammatical template (`__oni __ona banggija somaisan
  (lit. konta) nangaia.`) for "it takes only a few hours", logged as a
  template in the validation doc, not a single dictionary sentence.
  Added `banggija`/`somaisan`/`nangaia`, `unverified`.
- **NV-140** — verb batch: `finish`=`bon·a`, `find`=`nika`, `earn`=
  `kamaia` promoted `verified_high`. `get`=`man·a` **deliberately not
  promoted** — it reuses the string already `verified_high` for `can`;
  logged as an open collision, not a resolution.
- **NV-141** — `migil` (milled/husked rice grain) added as a new
  distinct `verified_high` entry. The `mi`/`merong` cooked/uncooked
  resolution itself was **not** new — already NV-133 (2026-09-05) —
  this relay just re-confirms it; only `migil` was actually new.
- **NV-136 addendum** — appended the original-source citation (exact
  Thangseng timestamp, 2026-09-05 6:13pm) to the existing NV-136 entry.
  Not a new entry.
- **Item 7** (tied candidates for "she will not be able to finish the
  difficult work tomorrow") — both candidates added `unverified`,
  cross-referenced, not picked. Not an NV (no native confirmation of
  either).

Drafted `docs/THANGSENG_RELAY_QUESTION_20260906.md` — 3 open items for
the next Thangseng batch: the `get`/`can` `man·a` collision, the
`Gni`/`gnisan` "two" discrepancy, and the tied "finish the difficult
work" pair. **Not sent.**

**Rule 8 duplicate-representation check:** new `master_dictionary.json`
self-consistency conflicts (4 keys: `two`, `earn`, `find`, the tied
sentence) added to `src/data/known_dictionary_conflicts.json` with
this session as the citation trail (Check C). One runtime-cascade
mismatch (`phrase_maps:two` still serves `Gni` while the unverified
`gnisan` candidate is now also on file) added to
`src/data/known_cross_source_conflicts.json` — intentional: an
unconfirmed alternate must not silently flip live `translate()` output,
so `phrase_maps.js` was left untouched, still serving `Gni`.

## Gate at close
- `node prepare-data.js`: 8287 unique entries (+7 net from baseline
  8280 — new rows added minus none removed)
- `node test-dictionary.js`: 8287/8287 valid, 9/9 grammatical
  corrections
- `node repository-intelligence.js`: 0 new violations across all
  checks (after the two allowlist additions above)
- `node scripts/resync-stale-overrides.mjs`: 0 new candidates (1
  pre-existing `build`/`Rika` skip, unrelated to this session)
- `node --test tests/unit/*.test.js`: 319/319 pass (unchanged from
  baseline — no test touched this session)

Live-verified via `translate()` post-rebuild: `finish`→`bon·a`,
`find`→`nika`, `get`→`sik·a` (unchanged — `man·a` correctly did NOT
become primary), `earn`→`kamaia`, `hour`→`Konta`, `five`→`Bonga`,
`distance`→`Chel·a`, `two`→`Gni` (unchanged), `milled rice`→`migil`.

## Runtime Handoff (Claude B)
None. Entirely data/documentation this session — no engine code
touched, no new engineering item created.

## Push and resync
Committed. `git fetch` immediately before push showed no further
remote movement (`origin/main` still `7afc92b`). Pushed fast-forward.

## Repository status at close
- [x] HEAD hash: verified == `origin/main` (see final push output)
- [x] `git status` clean, no untracked files
- [x] `.ai/WORKSTATE.yaml` updated (this session's work + prior chained
      below it)
- [x] `.ai/SESSION_BOOTSTRAP.md` — no standing-rule changes, not touched
- [x] Migration doc complete (this file)
- [x] No local-only commits — pushed and verified
- [x] No uncommitted changes
- [x] Native-validation/blocker status: NV-137–NV-141 logged; `get`/
      `can` collision, `two` Gni/gnisan discrepancy, and the tied
      "finish the difficult work" pair carried forward as open,
      un-sent relay questions
- [x] PAT: none used this session (no push credential embedded, per
      standing policy)

## Exact next step (for next Claude A)
1. Send `docs/THANGSENG_RELAY_QUESTION_20260906.md` (3 items) — not yet
   sent.
2. Standing carried-forward items, unchanged: `RULE-038`/`NV-109`
   tension; `NV-127` (only-X third-person); the 2 slash-variant rows;
   `final_entries.json`'s stale `Cat`→`meng·gong` row (cosmetic,
   non-pipeline, low priority); `leaf`/`leaves`/`Re·ongkata` and
   `ball`/`pole`/`babies`/`cities` (per `docs/CLAUDE_A_SESSION_MIGRATION_20260906D.md`
   items 1–2, still open, untouched this session).
