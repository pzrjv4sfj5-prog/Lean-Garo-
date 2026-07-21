# Dictionary Error Audit — 2026-07-19 (Claude B, investigation only)

_Triggered by RC-CANDIDATE-022 ("do·o" = chicken, not "two"/"bird").
Full audit, no fixes implemented. Every finding below is either a hard
count from the actual files or explicitly marked as needing native
confirmation — nothing here is a linguistic decision._

## 1. Where the pipeline collapses multiple candidates into one (traced per request)

`master_dictionary.json` (+ `garo_dictionary.json`) → `prepare-data.js`
→ `compiled_dict.json` → `EN_INDEX` → `lookupGaro()` → translation
output. The collapse happens in exactly one place:

1. **`normalizeFile()`** reduces each source file to `{english: [garo,
   garo, ...]}`, keeping only `item.english`/`item.garo` — `notes`
   (including `VERIFIED/HIGH` tags), `category`, `pos`, `classifier`
   are all dropped here and never seen again downstream.
2. **`mergedValues`** concatenates `garo_dictionary.json` (dict1) →
   (dict2, doesn't exist, empty) → `master_dictionary.json` (dict3),
   in that order, deduplicating by first-occurrence.
3. **`pickPrimary()`** (`prepare-data.js` line 94): `return
   values[values.length - 1]` — picks the *last* distinct value by
   encounter order across dict1-then-dict3. **This is the single
   collapse point.** It is order-driven, not correctness-driven, and
   was deliberately built this way after a prior "smarter" heuristic
   (shortest-string, then VERIFIED-tag preference) corrupted other
   entries (documented in the function's own comment — a corrupted
   3-character fragment `"i·a"` was tagged `VERIFIED/HIGH` for both
   `"go"` and `"come"` and would have silently won).
4. Everything not picked survives only in `compiled_dict_alternates.json`
   — confirmed nothing currently reads this file for scoring or
   fallback; it's write-only at present.

Separately, there's a **runtime routing split**, not a collapse: for a
standalone number+noun phrase, `translate("two dogs")` correctly
returns `"achak mang·gni"` via `garo_classifier.js`'s dynamic
`countNoun`/`parseCountingPhrase` engine (method `classifier`,
confidence 0.96) — a real, working numeral-classifier construction that
bypasses the static dictionary entirely. But `analyzeGrammar`'s
object-extraction (used for full sentences like `"he has two dogs"`,
`translationEngine.js` line ~498) does a flat
`lookupPhrase(objEng) || lookupGaro(objEng)` instead, which reads the
corrupted static `EN_INDEX` value. The correct mechanism already
exists; the sentence-level path just doesn't call it for object
phrases.

## 2. Audit A — every `VERIFIED`-tag conflict, not just "two dogs"

Of the 1118 known conflicting keys (`src/data/known_dictionary_conflicts.json`
baseline), 80 have exactly one distinct value tagged `VERIFIED*` among
their conflicting duplicates (0 have competing/contradictory `VERIFIED`
tags — the `go`/`come` failure mode Claude A already hit doesn't recur
here). Checked all 80 against what `pickPrimary()` actually picks
today:

**41 of 80 (51%) currently resolve to the WRONG (non-verified) value.**
Not a small edge case — literally half.

Full list of the 41 wrongly-resolved keys: `3, answer, axe, bag,
bridge, clean, cook, cup, elephant, fast, fly, friend, grandfather,
listen, noon, one dog, one person, pot, push, slow, son, ten birds,
three books, throw, two dogs, "what is your name?", "why do you
laugh?", yesterday, certain, food, riddle, solid, somehow, swift, to
answer, to commit adultery, to predict, to reveal, to speak, to
support, to whisper`.

(The other 39 already happen to resolve correctly — `pickPrimary`'s
order-driven pick coincides with the verified value by chance in those
cases, same mechanism, opposite outcome.)

**Not proposing "always prefer VERIFIED" as a fix** — Claude A already
tried and reverted that exact heuristic once for a real, documented
reason. Flagging the 41-key list as a candidate batch for review, not
a rule to script.

## 3. Audit B — the numbers-category template, checked systematically

`category: "numbers"` has 239 entries: 10 number-prefixes (one through
ten) × ~24 noun classes each (persons/dogs/birds/fish/teachers/
students/books/houses/trees/cars/apples/bananas/water/rivers/
villages/coins/leaves/knives/...), all built from the same
`[number-prefix] [noun-classifier]·gni`-style template. Checked
whether each of the 10 number-prefixes has an unrelated independent
meaning elsewhere in the dictionary (the same test that caught
`do·o`):

| Number | Prefix | Entries using it | Independent meaning found | Verdict |
|---|---|---|---|---|
| one | `sa` | 10 | = confirmed "one" | OK |
| **two** | **`do·o`** | **17** | **= confirmed "chicken"** | **SUSPECT — native-confirmed wrong (RC-022)** |
| **three** | **`na·tok`** | **16** | **= confirmed "fish"** | **SUSPECT — unconfirmed, same pattern** |
| four | `brang` | 16 | none found | looks OK |
| five | `bonga` | 16 | = confirmed "five" | OK |
| six | `dokka` | 16 | none found | looks OK |
| seven | `sni` | 16 | = confirmed "seven" | OK |
| eight | `chet` | 16 | = confirmed "eight" | OK |
| nine | `sku` | 16 | = confirmed "nine" | OK |
| **ten** | **`chi`** | **34** | **= confirmed "water"** | **SUSPECT — unconfirmed, same pattern** |

**Three of ten number-prefixes exactly match an unrelated, common,
everyday noun — the identical shape of error the Project Owner already
confirmed for `do·o`.** Combined: 17 + 16 + 34 = **67 entries (28% of
the entire numbers category)** carry this specific risk pattern. Only
`do·o` (two) is native-confirmed wrong so far; `na·tok` (three, =
"fish") and `chi` (ten, = "water") are flagged on pattern-match alone
and need the same native check `do·o` just got — they could turn out
to be genuine homonyms (bound numeral-classifier forms that happen to
share a written form with an unrelated noun), which does happen in
real languages, so this is not a confirmed-error count, only a
confirmed-*risk* count.

The other 7 number-prefixes (one/four/five/six/seven/eight/nine) show
no such conflict — either they match the dictionary's own confirmed
standalone number word, or have no competing meaning at all. No
evidence of a problem there.

### CONFIRMED (2026-07-19, native table relayed by Project Owner)

Both flagged risks are now resolved to CONFIRMED ERROR, with the
correct standalone word identified — but the exact compound
*construction* is still not implemented (see caveat below):

- **`na·tok` (used as "three" in 16 entries) is confirmed WRONG.**
  Native table: `"na·tok" = fish` (explicitly restated), and
  **`"three" = "Gittam"`** — which already exists correctly as the
  dictionary's own standalone `"three": "Gittam"` entry. The 16
  `na·tok`-prefixed numbers-category entries don't match the
  dictionary's own already-correct word.
- **`chi` (used as "ten" in 34 entries) is confirmed WRONG, but with
  an important nuance.** Native table: **`"ten" = "Chiking"`**
  (matches the dictionary's own existing standalone `"ten": "Chiking"`
  entry exactly). Separately, `"chi"` **is** a legitimate prefix — for
  **eleven through nineteen** (`chi·sa`=11, `chi·gni`=12, ...,
  `chi·sku`=19, all independently confirmed in the native table and
  already present correctly in the dictionary as standalone entries).
  The Project Owner's relay explicitly notes this `chi`-as-teen-prefix
  vs `chi`-as-"water" homonymy was "resolved earlier" and is not the
  error. **The error is specifically that the "ten X" numbers-category
  entries use bare `chi` (which means either "water" or is the teen-
  series prefix, never "ten" alone) instead of `"Chiking"`.**

**Still not implemented:** knowing the correct root word (`Gittam`,
`Chiking`) doesn't by itself tell us the correct *compound* form for
"three dogs"/"ten dogs" — e.g. whether it's `Gittam mang·gittam` (echoing
the `do·o mang·gni`/`achak mang·gni` pattern where the classifier
suffix itself changes per number, not just gets appended raw) or some
other construction. That's still Claude A's call, consistent with
RC-CANDIDATE-018/022's established position that word-identity and
construction-correctness are separate questions.

### Bonus findings from cross-checking the native table against the dictionary

While verifying `Gittam`/`Chiking`, checked the rest of the relayed
table (ones, teens, tens, ordinals, half/quarter/double/zero) against
`master_dictionary.json`:
- **Already correct and consistent**, no action needed: one-two-five-
  seven-eight-nine, all teens (eleven-nineteen), twenty through
  ninety, hundred, one thousand, quarter (`Daldal`), double
  (`Gni·bita`/`Gni-bita`, cosmetic hyphen-vs-raka difference only).
- **Genuinely missing from the dictionary** (new vocabulary, not yet
  logged anywhere): `"second"`, `"third"` (ordinals), `"zero"`/`"none"`.
- **New conflict found:** `"first"` already has `"skang"` in
  `master_dictionary.json`, but the native table gives
  `"Chipprangni"` — a third candidate, not previously tracked. Needs
  Claude A same as any word-choice conflict, not assumed resolved by
  this table alone.
- `"last"` (3-way conflict: `Baksangni`/`bai·a`/`ses`) and `"half"`
  (4-way conflict: `Jatchi`/`a·dra`/`bon·jang·chi·a`/`pak·sa`) both
  already contain the native table's answer among their existing
  conflicting values — consistent, but the conflicts themselves are
  pre-existing and untouched by this table.

## 4. What this audit does NOT do

- Does not fix `pickPrimary()`, `master_dictionary.json`, or any
  compiled artifact.
- Does not decide `na·tok`/`chi` are wrong — only that they match
  `do·o`'s error shape closely enough to warrant the same check.
- Does not propose a general classifier-engine redesign — that's
  explicitly Claude A's, per the Project Owner's original request
  (RC-CANDIDATE-022).
- Does not touch the runtime routing split (classifier-engine bypass
  in `analyzeGrammar`'s object extraction) — noted as a second,
  independent issue, not fixed.

## 5. Suggested next step (not started)

Two independent, differently-scoped review batches for Claude A:
1. The 41-key `pickPrimary` list (Section 2) — mostly individual
   word-choice confirmations, same shape as RC-012/016/019.
2. The `na·tok`/`chi` risk (Section 3) — two targeted native-speaker
   questions ("is `na·tok` really 'three', or does 'fish' win?" / same
   for `chi`/"ten" vs "water"), same shape as the `do·o` question that
   started this audit.
