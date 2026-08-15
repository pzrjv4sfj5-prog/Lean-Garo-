> **CLOSED / ARCHIVED 2026-08-15.** Both `next_action` items verified
> resolved live (student's bare-noun root; 85-key stale-override
> resync) — see `docs/CLAUDE_C_AUDIT_20260815B.md` §1.1–1.2 for the
> independent re-verification. Kept here for historical citation only;
> not an open action item. Current findings live at the file
> `.ai/WORKSTATE.yaml`'s `claude_c.latest_report` points to.

# Claude C Independent Audit — Handoff to Claude A & Claude B

**HEAD audited:** `6ce3785` (2026-08-14 21:23 UTC), verified `== origin/main`, working
tree clean throughout this audit. No files modified — Claude C is read-only per role
charter; this document was not committed or pushed.

**Auditor:** Claude C (independent QA/repository auditor), read-only session,
2026-08-15.

**Trigger:** Resume-as-Claude-C brief (full 18-section audit template) plus a direct
request to identify the coordination gap between Claude A and Claude B, not just
individual bugs.

**Scope actually run** (state this explicitly per Rule 7 — do not assume anything
beyond this list was checked):
- `npm install`, `node prepare-data.js`, `node test-dictionary.js`,
  `node repository-intelligence.js`, `node --test tests/unit/*.test.js` (215/215),
  `npm run lint` (0 errors), `npx vite build` (succeeds in this sandbox).
- Live `translate()` execution (not just source-reading) for: the `student` case,
  a 37-word sample of the 334-entry `known_cross_source_conflicts.json` allowlist,
  and ~20 other spot-checks across counting, negation, and novel-sentence assembly.
- Did **not** run: the full 20-noun/all-classifier counting sweep (§6 of the audit
  brief), a full re-verification of all 334 Check-F allowlist entries or all 1,533
  Check-C allowlist entries, Claude D ingestion audit, or historical drift review
  (§16) beyond what's cited below.

---

## 1. Executive summary

Two things are true at once, and both matter:

1. **This session's own engineering work (Session E: exact-phrase precedence fix,
   SUPERSEDED-only filtering fix) is correct and verified live.** No regression, no
   overclaim in the migration docs. Full gate green.
2. **A known bug *class* — corrected root superseded, but a runtime override layer
   still serves the old value — is not a closed issue, it's a recurring pattern with
   no closing mechanism.** It has now surfaced and been individually patched four
   separate times (`salt`/`wait`, 2026-08-04; `book`/`table`/`buy`/`door`,
   2026-08-07; `angry` phrase_maps entry, still open as of this HEAD) and, per this
   audit, is confirmed live in **at least 28 more words** sitting inside the
   "known/allowlisted" Check F list, which the build gate currently treats as
   settled.

The second point is the one worth real attention: it isn't a single bug to fix, it's
a **process gap between how Claude A closes linguistic work and how Claude B's
override tables get resynced** — see §4.

---

## 2. Findings for Claude A (linguistic)

### 2.1 `student` bare-noun root — unresolved, blocks correct plural output

`master_dictionary.json`'s `"student"` entry (`garo: "Porai·gipa"`) carries **no
VERIFIED tag at all** — not stale-but-confirmed, just never resolved. NV-073 already
fixed the *phrase-level* form (`"twenty student"` → `Chattro sak·Kolgrik`,
VERIFIED/HIGH), but the bare noun itself was never reconciled to the same root.

Confirmed live at HEAD `6ce3785`:
```
translate('student')          -> Porai·gipa        (exact-phrase, unconfirmed root)
translate('twenty student')   -> Chattro sak·Kolgrik (exact-phrase, correct — NV-073)
translate('twenty students')  -> porai·gipa sak·Kolgrik (classifier fallback, stale root)
```
Plural input has no phrase-level override, so it falls through to classifier
composition and exposes the unconfirmed root directly.

**Action needed:** native confirmation — is `Chattro` the correct bare-noun root
(same word NV-073 confirmed at phrase level), or is `Porai·gipa` a distinct,
separately valid form? This sits inside the same person/student/teacher
111-candidate root conflict already open since 2026-08-11/12 — worth resolving
together rather than as an isolated word.
**Classification: LINGUISTIC DECISION REQUIRED — CLAUDE A.**

### 2.2 Open mass-noun classifier question is already being silently answered "yes" at runtime

Whether `water`, `rice`, `food`, `house` etc. take a numeral classifier the way count
nouns do has been an open question since the 2026-08-10 sweep. That hasn't stopped
the engine: `translate('one water')` → `chi ge·sa`, `translate('one rice')` →
`mi ge·sa`, both via classifier-composition fallback at 0.96 confidence — i.e. the
system is already generating and shipping an answer as if these nouns *do* take a
classifier, while the linguistic question behind that assumption is still marked
open. Not a new discovery, but confirming it's live, not theoretical.

### 2.3 On the 28-word finding in §3 below

None of those 28 words are new linguistic questions — every one already has a
VERIFIED replacement sitting correctly in `compiled_dict.json`. Nothing for Claude A
to re-decide. Flagging only so the corpus's own signal isn't misread: an entry
appearing in the Check-F "known/allowlisted" list is **not** evidence that its
current runtime value was ever re-confirmed correct after a later supersession —
see §4.

---

## 3. Findings for Claude B (engineering)

### 3.1 This session's fixes — verified correct, no action needed

Both `6187b2a` (exact-phrase-before-classifier-composition precedence) and `5ac363f`
(SUPERSEDED-only candidates withheld rather than shipped) were re-executed directly
against the live engine, not just re-read from the migration doc:
- `translate('twenty student')` correctly hits exact-phrase before classifier
  composition would have.
- `'eight dogs'`, `'eight food'` confirmed **absent** from `src/compiled_dict.json`
  (matches the 190-key `docs/SUPERSEDED_ONLY_KEYS.md` list) rather than shipping a
  known-wrong SUPERSEDED value.

Full gate: 215/215 tests, lint 0 errors, `prepare-data.js` 8132 entries (matches
claim), `repository-intelligence.js` Check A–F 0 new violations, `vite build`
succeeds.

### 3.2 New finding: 28 words confirmed serving `SUPERSEDED` roots at the highest-confidence runtime layers

Sampled 37 of the 334 entries in `src/data/known_cross_source_conflicts.json`
(Check F's permanent allowlist). For each, compared the live `translate()` output
against `master_dictionary.json`'s tagged candidates. **28 of 37 are confirmed —
not inferred from JSON text alone, executed live — to return an explicitly
`SUPERSEDED` value, at `method: "correction"` (confidence 1.0) or
`method: "phrase-map"` (confidence 0.99), while an unused `VERIFIED` alternative
sits correctly compiled in `compiled_dict.json`.**

| word | runtime output | method | confidence | matches SUPERSEDED value | unused VERIFIED value |
|---|---|---|---|---|---|
| work | `Daka` | correction | 1.0 | `Dak·a` | `ga·a` |
| sleep | `Tusia` | correction | 1.0 | `Tusia` | `chu·a` |
| food | `Mi` | phrase-map | 0.99 | `Mi` | `al·a` |
| teacher | `Skigipa` | phrase-map | 0.99 | `Skigipa` | `di·di` |
| mountain | `A'bri` | correction | 1.0 | `A·bri` | `ha·bri` |
| window | `Kelki` | correction | 1.0 | `Kelki` | `ja·na·la` |
| boy | `Pante` | phrase-map | 0.99 | `Pante` | `ko·ka` |
| answer | `Aganchaka` | correction | 1.0 | `Aganchaka` | `Aganchakani` |
| bamboo | `wa·a` | correction | 1.0 | `Wa·a` | `wa·` |
| cook | `Song·a` | correction | 1.0 | `Song·a` | `Song·timgipa` |
| green | `tangsek` | correction | 1.0 | `Tangsek` | `git·ting` |
| language | `ku·sik` | correction | 1.0 | `Ku·sik` | `ba·sa` |
| long | `ro·a` | correction | 1.0 | `Ro·a` | `chong·dang·dang` |
| rain | `mikka` | correction | 1.0 | `Mikka` | `ba·du·ri·a` |
| room | `kuturi` | correction | 1.0 | `kuturi` | `Room` |
| snake | `chipu` | correction | 1.0 | `Chipu` | `chip·pu` |
| take care | `An·tangko simsakbo` | correction | 1.0 | (same) | `Ong·bo dakbo` |
| always | `Pangnan` | phrase-map | 0.99 | `Pangnan` | `jring·jring` |
| bear | `Matmak` | phrase-map | 0.99 | `Matmak` | `ba·a` |
| big | `Dal·a` | phrase-map | 0.99 | `Dal·a` | `·ma` |
| blue | `Tang·sim` | phrase-map | 0.99 | `Tang·sim` | `niil` |
| boil | `Rita` | phrase-map | 0.99 | `Rita` | `bi·rot·ma·mong` |
| buffalo | `Matma` | phrase-map | 0.99 | `Matma` | `mo·si` |
| build | `Rika` | phrase-map | 0.99 | `rik·a` | `ba·nai·a` |
| catch | `Rim·a` | phrase-map | 0.99 | `Rim·a` | `ra·chak·a` |
| church | `Gilja·nok` | phrase-map | 0.99 | `Gilja·nok` | `giil·ja·nok` |
| clean | `Rongtala` | phrase-map | 0.99 | `Rongtala` | `Rongtal·ata` |
| close | `Chip·a` | phrase-map | 0.99 | `Chip·a` | `grim` |

9 of the 37 sample words checked clean (e.g. `tree`, `goat`) — verified no
discrepancy, values match VERIFIED entries. **This is a 37-word sample of a
334-entry allowlist; the true scope across all 334 is not known and should not be
assumed to be ~76% without a full pass.**

### 3.3 Still-open, previously flagged, confirmed still present
`phrase_maps.js`'s `'i am angry': 'Anga ka·o nanga'` (spaced) is stale against the
now-final root `Ka·onanga` (closed 2026-08-14 via NV-078 pass 3). Already logged in
`docs/CLAUDE_A_SESSION_MIGRATION_20260814F.md`; confirmed still present at this HEAD.
Same bug shape as §3.2, smaller scope (1 word, already known).

### 3.4 Suggested fix, same shape as the 2026-08-04/07 precedent
1. Full mechanical pass over all 334 `known_cross_source_conflicts.json` entries:
   for each, check whether the `corrections.json`/`phrase_maps.js` value
   byte-matches (raka/case-normalized) an explicitly-`SUPERSEDED` candidate for that
   key in `master_dictionary.json`. No native input needed — this is the exact
   check used to produce the table above.
2. Where it matches: resync the override to the VERIFIED value directly — same
   precedent as the `salt`/`book`/`table`/`buy`/`door` fixes, no new linguistic
   content, no Claude A gate required.
3. Where it doesn't match (the genuinely intentional overrides — the actual purpose
   of these tables): leave as-is; consider re-confirming the baseline citation is
   still accurate.
4. Consider whether Check F's allowlist needs a periodic re-validation step, not
   just a permanent bucket — see §4, this is the second time "allowlisted" has
   masked a live defect at scale rather than a settled decision.

---

## 4. The working gap between Claude A and Claude B

This is the part worth fixing at the process level, not just patching the 28 words.

### 4.1 What exists today
Governance Rule 6 (adopted 2026-08-02) requires every migration document that
closes a Native Validation (NV) to include a **Runtime Handoff** section — an
explicit list of which corrected forms are *not yet confirmed* to reach the actual
compiled/runtime output, so Claude B knows exactly what to check.

### 4.2 What it doesn't cover
Rule 6 is scoped to individual NV closures — one word or sentence, confirmed by
Thangseng, in a given session. It was never extended to Claude A's periodic
**corpus-internal audits**, where large batches of entries get tagged `SUPERSEDED`
at once purely from cross-checking the corpus against itself (no native input
needed, no single "NV" to attach a handoff to):

- 2026-08-01 — 476 entries tagged SUPERSEDED
- 2026-08-10 — 523 entries tagged SUPERSEDED
- 2026-08-12/13 — ~230+ more entries tagged SUPERSEDED

None of these sessions' migration docs produced a Runtime Handoff list of "these
newly-SUPERSEDED values might still be live in `corrections.json`/`phrase_maps.js`."
The 28-word finding in §3.2 traces almost entirely back to those three sweeps.

### 4.3 Why it's a gap *between* the roles, not inside either one
Neither role is failing at its own job:
- Claude A's boundary stops at `master_dictionary.json`. Tagging an entry
  `SUPERSEDED` there is linguistically complete and correct.
- Claude B's `compiled_dict.json` regeneration (`prepare-data.js`) *does*
  automatically pick up the change — that half of the pipeline works.
- But `corrections.json`/`phrase_maps.js` are hand-maintained override tables —
  engineering territory — and nothing currently signals to Claude B that a given
  bulk-supersession event might affect one of them. Claude A has no reason to check
  engineering override tables (out of scope). Claude B has no reason to know a bulk
  audit even happened unless the migration doc is re-read line by line.
- Rule 5 (migration docs report only the authoring role's own work, cross-role
  effects go in a separate lower-visibility "Cross-role updates" section) makes this
  worse in practice: a bulk-supersession session's migration doc is written entirely
  in linguistic terms, and the override-table implication for Claude B's tables
  isn't the kind of thing that section is designed to surface.

**Net effect:** the fix has only ever landed reactively — per word, whenever
someone happens to live-test the right input (`salt`/`wait` in one session,
`book`/`table`/`buy`/`door` in another) — never proactively, because nothing in the
process obligates a sweep after a bulk-supersession event.

### 4.4 Recommended fix (Project Owner decision, not something either role should
just start doing unilaterally — flagging for sign-off)

Extend Rule 6's Runtime Handoff requirement to cover bulk-supersession sessions, not
just individual NV closures:
- Any session that tags entries `SUPERSEDED` in bulk (corpus-internal audit, not
  native-validation-driven) should close with a mechanical list of the affected
  `english` keys — no linguistic judgment required, just the key list.
- Claude B (or Claude C, on a scheduled basis) greps that list against
  `corrections.json`/`phrase_maps.js` once, closing the loop that currently only
  closes when a stale word happens to get hit in live testing.
- This doesn't require new tooling — the mechanical check used to produce §3.2's
  table (compare override value against tagged-SUPERSEDED candidates) is ~15 lines
  and could run as part of `repository-intelligence.js`'s existing Check F pass,
  or as a standing item in the migration-close checklist for any bulk-supersession
  session specifically.

---

## 5. Ownership matrix (this document's findings)

| Finding | Owner | Native input needed? |
|---|---|---|
| `student` bare-noun root | Claude A | Yes |
| Mass-noun classifier question (water/rice/food) | Claude A | Yes (already open) |
| 28-word SUPERSEDED-override resync | Claude B | No — mechanical |
| `phrase_maps.js` "angry" resync | Claude B | No — mechanical, already flagged |
| Full 334-entry Check F re-pass | Claude B (or next Claude C session) | No — mechanical |
| Runtime Handoff rule extension to bulk sweeps | Project Owner (process decision) | N/A |

---

## 6. What was NOT audited (state explicitly, per Rule 7)

Full stale-artifact grep across every file listed in the original audit brief's §4;
full runtime-path map (§5 of that brief); full 1–20/all-noun-class counting sweep
(§6); item-by-item re-verification of the remaining 297 Check-F entries or any of
the 1,533 Check-C allowlist entries; Claude D ingestion layer; historical drift
review beyond this session's own claims. These remain open for a future audit pass,
not assumed clean.

---
*Produced by Claude C, read-only session, HEAD `6ce3785`. Not committed to the
repository — Claude C has no write access this session. If this document should
become part of the repo's `docs/` history, it needs to be committed by whichever
role (A or B) has push access this session, per the project's own PAT policy.*
