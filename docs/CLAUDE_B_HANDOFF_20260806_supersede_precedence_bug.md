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

## Update, same day — the identical bug class exists in `phrase_maps.js` too

`phrase_maps.js` is a separate, hand-maintained data file (`translate()`
checks it *before* `compiled_dict.json` in the resolution cascade) — its
values were never re-synced when Claude A superseded the corresponding
`master_dictionary.json` entries on 2026-08-01. Confirmed via a live native
example (`Ka·dinga` vs `Ka·ding·a` for "laugh"): `phrase_maps.js` had the
wrong, already-flagged-SUPERSEDED value independently of
`master_dictionary.json`, meaning **fixing the `prepare-data.js` precedence
bug alone will not fix `phrase_maps.js`-covered words** — they're a fully
separate override layer with its own stale data.

Cross-referenced all 78 `phrase_maps:*` entries already baselined in
`src/data/known_cross_source_conflicts.json` (Check F) against the 337-key
SUPERSEDED-wrong list above: 5 more hits — `forest`, `some`, `all`, `god`,
`white`. Fixed all 6 (including `laugh`) directly in `phrase_maps.js`
(Claude A's own data file, own header attribution — no engine-code
territory issue). `forest`/`some` had exactly one VERIFIED/HIGH
replacement each, fixed with full confidence. `all`/`god`/`white` each had
2-3 VERIFIED synonym candidates with no native tie-breaker on record —
picked the orthographically-closest match to the legacy spelling as a
provisional single value (inline-commented as provisional, not asserted as
a firm linguistic conclusion). No `known_cross_source_conflicts.json`
change needed — baseline entries are key-presence-only, not value-pinned,
so they continue to (harmlessly) cover these keys either way.

**This raises the obvious question for Claude B: are there more
override/cascade layers beyond `phrase_maps.js` and `compiled_dict.json`
that could be holding stale copies of pre-2026-08-01 SUPERSEDED data?**
Worth a full audit of every runtime-cascade source once the core
`prepare-data.js` fix lands, not just these two.

## Update, same day — source-level cleanup for the "laugh"/"smile" cluster specifically, plus a repo-wide hyphen→raka pass

The Project Owner directed Claude A to eliminate the wrong `Ka·ding·a`
entry entirely (not just SUPERSEDED-mark it) once native confirmation
made clear it was wrong for *both* "laugh" and "smile" candidates it had
been used for. Traced it to source: `garo_dictionary.json` — a live
compile-pipeline input (`dict1` in `prepare-data.js`) — had 4 raw
`Ka·ding·a` entries, almost certainly the original entry point for this
bug into the corpus. Removed/corrected all 4, plus 3 related `smile`
entries in the same file, plus 1 in the orphaned (non-pipeline)
`final_entries.json`. Combined with the `master_dictionary.json` and
`phrase_maps.js`/`corrections.json` fixes from earlier, `Ka·ding·a` is
now at zero occurrences anywhere in the repo's live data.

Separately, the Project Owner also authorized the full hyphen→raka
conversion flagged earlier as a known-but-unauthorized gap (328
entries never received the one-time 2026-06-18 global conversion).
Executed repo-wide: 327 `master_dictionary.json` entries + 332
`pending_lexicon.json` promotion records converted and kept in sync.
This doesn't change the precedence-bug diagnosis above (that's still
`prepare-data.js`'s `pickPrimary()` logic, still Claude B's fix to make)
but does substantially shrink its blast radius — a large share of the
337 affected keys were legacy-vs-corrected pairs that differed by
exactly this hyphen/raka distinction, so several of the underlying
SUPERSEDED entries themselves are now cleaner even before the
precedence fix lands.
