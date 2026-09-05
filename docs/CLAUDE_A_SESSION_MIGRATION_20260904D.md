# Claude A Session Migration — 2026-09-04D

> **Correction, 2026-09-05:** This doc's NV-127/128/129 collided with
> Claude B's own NV-127/128/129 (merge `009df0f`, same day, already
> canonical in `THANGSENG_NATIVE_VALIDATION.md`). Renumbered to
> NV-130/131/132 respectively — see
> `docs/CLAUDE_A_SESSION_MIGRATION_20260905.md` and the
> "Numbering-collision correction" entry in
> `docs/THANGSENG_NATIVE_VALIDATION.md`. This file is left otherwise
> unedited as the historical record of what happened at the time.

## Resume sequence (Rule 10)
Continuation of same session (2026-09-04B close, HEAD `7acf794`,
verified clean/pushed). No new resync needed — no other Claude
touched the repo between B and this close.

## Work this session (NV-127, NV-128, NV-129)

### NV-127 — boy/girl/man/woman (CLOSED)
Direct Thangseng relay via Tridip, WhatsApp 4/9/2026 1:53–1:55pm:
> Me'chik can mean both female and woman. Me.chikma is a married or an
> elderly woman... me.chik bi.sa = girl, me.a bi.sa = boy, me.asa =
> male/man, me.apa = married or an elderly man.

Applied:
- Promoted existing `man`=`Me·asa` and `man (male)`=`me·a` from
  unverified to VERIFIED/HIGH
- Added new rows: `male`=`Me·asa`, `female`=`Me·chik`, `married or
  elderly man`=`me·apa`, `married or elderly woman`=`Me·chikma`,
  `boy`=`me·a bi·sa`, `girl`=`me·chik bi·sa` (all VERIFIED/HIGH)
- The new `boy`/`girl` compound rows are tagged `variant/VERIFIED/
  HIGH` and the pre-existing `Boy`=`ko·ka`/`Girl`=`ko·ki` rows were
  moved to the end of `master_dictionary.json`'s array, so
  `pickPrimary`'s tie-break logic keeps `ko·ka`/`ko·ki` as the shipped
  primary — live translation unchanged, new compositional forms ship
  as genuine VERIFIED alternates, not replacements.
- This surfaced a `repository-intelligence.js` Check F failure
  (runtime-cascade mismatch: `compiled_dict.json`'s new primary vs.
  `phrase_maps.js`'s hardcoded `boy`/`girl`) — resolved via the
  variant-tag + reorder above (Rule 8: fixed the actual cause, not
  allowlisted).
- Project Owner clarified mid-session that `bi·sa` keeps its existing
  "kid/child" sense — `me·chik`/`me·a` are the female/male roots doing
  the gendering in the compound. No dictionary change needed; already
  consistent with how this was recorded.

### NV-128 — purpose `-na` (CLOSED)
Same relay, 4/9/2026: confirmed `-na` as the normal "to + verb"
marker, with native examples (`Anga cha·na re·baa.`=I came to eat;
`Anga kam ka·na re·baa.`=I came to work; both also given
subject-omitted). Added 4 new VERIFIED/HIGH rows (`i came to eat`,
`came to eat`, `i came to work`, `came to work`), extending NV-111's
existing "went" pair. `RULE-009.yaml` updated with the NV-128
citation.

### NV-129 — adjective order (OPEN/PRELIMINARY, per explicit
Project Owner instruction — NOT closed, NOT generalized)
Same relay: `Dal·gipa gitchak nok.`="The big red house.",
`Chon·gipa gipok nok.`="The small white house." Recorded verbatim as
2 new rows at `confidence: "open"` (`the big red house`, `the small
white house`). Explicitly NOT marked VERIFIED and NOT used to infer a
general adjective-order rule, per instruction. Does not reconcile with
the pre-existing 3 tied VERIFIED "big red house" orderings from
NV-110 — left as a genuine open question for future native
clarification.

## Gate at close
- `node prepare-data.js`: clean rebuild, 8274 unique entries
- `node test-dictionary.js`: 8274/8274 valid, 9/9 grammatical
  corrections
- `node repository-intelligence.js`: PASSED, 0 new violations (after
  the NV-127 tag/reorder fix for Check F)
- `node --test tests/unit/*.test.js`: 314/314 pass
- Live `translationEngine.js` spot-check: `boy`→`ko·ka`, `girl`→
  `ko·ki` (unchanged), `man`/`male`→`Me·asa`, `woman`/`female`→
  `Me·chik`, `married or elderly man/woman`→`me·apa`/`Me·chikma`,
  `i/came to eat/work` (all 4 forms) — all confirmed correct.

## Runtime Handoff (Rule 6)
None new this session. Still outstanding from prior sessions:
- `RAKA_CLASSIFIERS` in `src/garo_classifier.js` still includes
  `'sak'` (NV-124 handoff, unaddressed) — affects only the
  classifier-composition fallback path, not any exact dictionary
  lookup.

## Repository status at close
- [x] HEAD hash: (see git log after this commit)
- [x] origin/main match: to be pushed and verified
- [x] `git status` clean after commit
- [x] WORKSTATE.yaml updated (NV-127/128/129 entries added)
- [x] SESSION_BOOTSTRAP.md — no standing-rule changes, not touched
- [x] Migration doc complete (this file)
- [x] No local-only commits after push
- [x] No uncommitted changes after push
- [x] Native-validation/blocker status: NV-127 and NV-128 closed;
      NV-129 deliberately left open/preliminary

## Open items carried forward (thread getting long — logging for a
## fresh session)
1. **Claude B engine handoff (NV-124):** `RAKA_CLASSIFIERS` in
   `src/garo_classifier.js` still includes `'sak'`. Fallback-only bug,
   no live dictionary phrase is affected. Fix: remove `'sak'` from
   that set, then update the intentionally-stale assertion in
   `tests/unit/rong_classifier.test.js` (`countNoun('mande', 1,
   'person')`) in the same commit — it's currently asserting the
   known-stale value on purpose, with a comment explaining why.
2. **RULE-038 / NV-109 bare-form tension:** Thangseng gave
   `sak·sa`/`sak·gni`/`sak·gittam` (now `saksa`/`sakgni`/`sakgittam`
   post-NV-124) as valid standalone answers without a stated head
   noun — tension with RULE-038's "noun always stated" claim. Still
   open, still not shipped to the dictionary, unrelated to this
   session.
3. **NV-129 adjective order:** genuinely open, needs a dedicated
   Thangseng question to reconcile the now-4 different orderings
   recorded for "big red/small white house" — see NV-129 above.
4. **`Chattri`/`Chattro` full range vs. NV-127 boy/girl:** no known
   conflict, just noting both gendered-pair systems (student vs.
   person) now coexist in the dictionary using the same underlying
   `me·a`/`me·chik` roots — worth a light sanity pass sometime, not
   urgent.

## Exact next step
None mandatory — all requested work is closed or explicitly logged as
open above. If resuming, start by pasting this doc, then Rule 10's
resume sequence (git fetch, HEAD check, read WORKSTATE.yaml/
SESSION_BOOTSTRAP.md) before picking an item from "Open items carried
forward."
