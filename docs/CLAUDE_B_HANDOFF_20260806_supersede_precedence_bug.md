# CRITICAL — Compile-time precedence bug ships 334 wrong translations; duplicate audit + clean-pipeline proposal

**2026-08-06, Claude A. Priority: highest — this is live in production, not a
future risk.**

## The bug, precisely

`prepare-data.js`'s `pickPrimary()` has an `isRealCaseCollision` branch (added
for the book/teacher register-variant pattern — a genuinely correct rule for
that case): when exactly one non-variant candidate exists and its *raw key
casing* differs from the variant-tagged candidates', the non-variant one wins
outright, bypassing last-write-wins.

That heuristic doesn't know about the `SUPERSEDED —` notes convention Claude A
has been using since 2026-08-01 to mark legacy/wrong imports while retaining
them for citation-discipline. A `SUPERSEDED` entry is *always* non-variant
(`isVariant` is false — it was never tagged `variant/...`) and frequently has
different original-import casing than its later, corrected, `variant/`-tagged
VERIFIED/HIGH replacement (legacy imports: lowercase `"pineapple"`; later
corrected entries: capitalized `"Pineapple"` — a systematic pattern, not
coincidence). Result: `isRealCaseCollision` fires, and the **wrong, superseded
value wins**, silently, every time this shape occurs.

Confirmed live: `translate("pineapple")` (and `getAllVocabulary()`, and
`compiled_dict.json` directly) currently returns `"Anaros"` — the flagged-wrong
legacy import — not `"a·na·ros"`, the VERIFIED/HIGH corrected form Claude A
already put in `master_dictionary.json` on 2026-08-01.

## Scale

- 454 distinct English keys carry a `SUPERSEDED —` entry in
  `master_dictionary.json`.
- **334 of them ship the superseded (wrong) value in `compiled_dict.json`
  right now** — verified by diffing every `SUPERSEDED`-tagged `garo` value
  against what `compiled_dict.json` actually resolves for that key.
- The other 3 have no better alternative on record (SUPERSEDED is their only
  entry) — not a precedence bug, just an unresolved single legacy import,
  separate issue.
- Full list of the 337 affected keys (334 true bugs + 3 no-alternative):
  `docs/CLAUDE_B_HANDOFF_337_KEYS_20260806.json`.

## Why no existing gate caught this

Checked every `repository-intelligence.js` check:
- **Check C** (dictionary self-consistency) only flags that a key has
  *multiple* `garo` values in `master_dictionary.json` — it doesn't know
  which one `compiled_dict.json` actually ships, so a SUPERSEDED/VERIFIED
  pair is exactly the kind of "known conflicting key" it allowlists and
  moves on from. It cannot distinguish "conflict resolved correctly" from
  "conflict resolved to the wrong side."
- **Check F** (runtime-cascade agreement) only compares `corrections.json`/
  `phrase_maps.js` against `compiled_dict.json` — a completely different
  layer, doesn't touch `master_dictionary.json`'s own compile-time selection
  at all.
- Nothing anywhere asserts "a value whose own notes say SUPERSEDED must never
  be the one that ships." **This is a genuine blind spot in the verification
  pipeline itself**, not just an unlucky miss.

## Proposed fix (Claude A's assessment — Claude B's call to implement, this is `prepare-data.js`)

Cleanest fix: filter out any entry whose `notes` starts with `SUPERSEDED` at
the `addValue()` stage in `normalizeFile()` (same place `isVariant`/
`isVerified` are already parsed from `notes`) — a `SUPERSEDED` entry should
never enter `pickPrimary`'s candidate pool at all. It's not a "neutral vs.
variant" ambiguity to arbitrate; it's Claude A already having said "this one
is wrong, keep it only for citation history." Excluding it at the source
means `isRealCaseCollision`, the VERIFIED-neutral branch, and last-write-wins
all naturally stop seeing it, with no new special-case logic needed in
`pickPrimary` itself.

**Recommend pairing this with a new repository-intelligence.js check** (Check
G?): for every entry whose `notes` starts with `SUPERSEDED`, assert
`compiled_dict.json[key] !== that entry's garo value`. This closes the blind
spot permanently — the class of bug can't silently recur even if the
SUPERSEDED convention is used differently in the future.

## Duplicate audit — everything else found (full sweep, per Project Owner request)

Beyond the 454 SUPERSEDED pairs above:

**Removed (Claude A, data-only, no engine change needed):**
- 2 genuine literal duplicate rows — identical `(english, garo, pos, category)`
  content repeated verbatim: `"Tax"→"Kajina"` (kept the copy with the fuller
  native-confirmation citation) and `"business"→"Kam"`.
- `master_dictionary.json`: 9147 → 9145 entries. Rebuilt, verified clean
  (8060/8060, 0 new violations, 177/177 tests).

**Left alone, correctly retained (NOT duplicates, don't touch):**
- The remaining ~452 SUPERSEDED/VERIFIED pairs — this is the citation-
  discipline design working as intended (once the compile-precedence fix
  above lands, these become inert history, not active bugs).
- ~15 same-english-key groups already properly tagged `variant/VERIFIED/HIGH`
  (e.g. `fly` → `Tampi`/`tam·pi`) — genuine confirmed register/loanword
  alternates, not accidental duplication.

**New — genuinely unresolved, need native input, NOT guessed at (added to
`docs/THANGSENG_NATIVE_VALIDATION.md` open-items list):** ~9 same-english-key
pairs with *no* SUPERSEDED or variant tag on either side — neither entry is
marked as correct or wrong, so there's no evidence-first basis to pick one:
`laugh` (`Ka·ding·a` vs `Ka·dinga`), `mouth` (`Ku·sik` vs `Kusik`), `joking`
(`kal·akenga` vs `Ka·lakenga`), `at` (`·o` vs `O`), `bright` (`ching·a` vs
`Ching·a`), `sad` (`duk ong·a` vs `Duk ong·a`), `"praise the lord"`
(`Gitelna rasong` vs `Gitel na rasong`), `direct`/`straight` (both keys share
one `tong·tang`/`·tong·tang·` pair — likely one wrong headword-copy for a
shared sense, unconfirmed which). These are raka-placement or exact-form
questions across ~9 words — small enough for one relay batch if the Project
Owner wants them closed too.

## Verification this session

`prepare-data.js`, `test-dictionary.js` (8060/8060), `repository-intelligence.js`
(0 new violations, all checks, both before and after the literal-dup removal),
177/177 unit tests. The 334-key precedence bug is **not** fixed by this
commit — it requires a `prepare-data.js` change, which is Claude B's engine
code, outside Claude A's territory. Flagging as the top-priority open item.
