# Handoff to Claude B — number/classifier runtime generation bugs

Source: full linguistic re-audit, 2026-09-11 (Claude A, Project Owner
directive). Full audit report is in this session's chat transcript,
not re-copied here in full — this doc is the actionable engineering
subset only. **Linguistic contract (Sections B/C of that audit) is
VERIFIED clean — the data is correct.** The bugs below are entirely
in generation/composition code, confirmed via live `translate()` calls
against unseen combinations (numbers/nouns not pre-seeded as literal
dictionary rows).

Claude A did not touch any of the files below — audit + data-layer
fixes only, per standing role boundary.

**UPDATE, same day, post-rebase:** a concurrent Claude B session
(commits `e40f17e`/`9627230`/`e7c54cf`) landed while this doc was
being written and fixed Bug 2 **for the `sak` classifier specifically**
(41/55/67 students now correctly produce `chattro saksotbri sa` etc.,
matching the approved surface exactly) plus bare-digit number parsing
(now correctly routes through `number-engine`, independent of Claude
A's data-layer digit-key supersession below). **UPDATE 2026-09-12
(Claude A): Bug 1 (`king` only — the `sak` half was a misreading, see
Bug 1 Addendum #2) and Bug 5 are now also fully resolved. Bugs 2
(beyond `sak`), 3, and 4 remain open** — see the corrected bug
sections and verification table below for current status.

## Bug 1 — `king` missing from `RAKA_CLASSIFIERS` (addendum, same day, continued Claude A session) — FIXED (commit `3ba97c3`)
`src/garo_classifier.js:90`: `RAKA_CLASSIFIERS = new Set(['mang', 'ge', 'gong', 'te'])`.
`king` is missing, despite the dictionary-established, citation-backed
form `ki·tap king·sa` ("one book") using the dot. Result: unseen counts
for `king`-classified nouns (e.g. "7 books") compile without the dot
(`kingsni` instead of `king·sni`).

**`sak` is NOT part of this bug — see the 2026-09-12 correction below.
The original text of this section had claimed `sak` was also missing
and should be added; that was wrong.**

**Fix:** `king` only, already applied.

**Addendum, 2026-09-12 (Claude A):** the standing question of whether
`ge`/`te` (already in the set) are genuine confirmed exceptions or
simply wrong is now CLOSED -- both are real, richly-cited raka
classifiers (`ge`: 18-row VERIFIED/HIGH pen paradigm; `te`: 10-row
VERIFIED/HIGH house paradigm). No removal needed. See RULE-038.yaml
for full citations.

**Addendum #2, 2026-09-12 (Claude A) — CORRECTION, the `sak` claim was
wrong, do not implement it:** the `sak·sa`/`sak·gni`/`sak·gittam`
forms originally cited above (with a dot) came from *prose in notes
and code comments* — the "man·de sak·sa" phrasing in NV-072's note,
and a `grammarEngine.js:643` comment ("three children" -> `bi·sa
sak·gittam`). Checked the actual stored values: every real
VERIFIED/HIGH `garo` field for a `sak`-classified count (`mande
saksa`, `mande sakgni`, both citation-backed) has NO dot, and
`grammarEngine.js`'s own functional string (`Angan saksa kamkam
chatro`, line 893) also has no dot. This matches RULE-038.yaml's
explicit standing rule ("sak takes NO raka dot before the number
suffix — corrected 2026-09-03, see NV-124"), which the 2026-09-11
audit apparently missed by reading a comment's illustrative spelling
as if it were the authoritative citation. The current engine
behavior for `sak` at n<=19/20 (`sakgittam`, no dot) is **already
correct** — do not add `sak` to `RAKA_CLASSIFIERS`; doing so would
introduce a real regression, undoing NV-124. The `bi·sa sakgittam`
"three children" row in the verification table below is a false
positive for the same reason — corrected there too. Separately, the
`grammarEngine.js:643` comment itself is stale/wrong for future-reader
clarity (doesn't affect runtime output, so not urgent).

## Bug 2 — 20–99 composition (`getClassifierSuffix`, `garo_classifier.js:100-102`) — PARTIALLY FIXED (sak only)
For n in 20-99, the code takes the two-word number-table form (e.g.
`"Sotbri Sa"`, capitalized per its citation form) and does
`.replace(/ /g, '·')` — blind space→dot substitution, no case
normalization. Combined with `buildClassifierPhrase`'s
`${classifier}${suffix}` fuse-with-no-separator for non-`RAKA_CLASSIFIERS`
members, this produces e.g. `"41 students"` → `sakSotbri·sa` — wrong
capitalization mid-word, spurious dot, no space. This does **not**
match the Owner-approved human-40+ surface form
(`saksotbri sa` — lowercase, plain space, no internal dot; see
`data/garo_number_classifier_engine_machine_ready.json`
`surface_policy.human_40_plus` and its `worked_examples`).
**Fix:** lowercase the tens-portion before composing, and stop
replacing the internal space with a dot — the approved surface keeps
a plain space there, it does not fuse to a dot.
**Also applies to non-human classifiers, but NOT as originally stated
below** — see the 2026-09-12 correction.

**Addendum, 2026-09-12 (Claude A) — CORRECTION, retracting my own
earlier note today:** I originally wrote here that the contract's
`surface_policy.default_display` settles this toward plain-space
(`NOUN SPACE CLASSIFIER SPACE NUMBER`) for `bol`/`dot`/`dam`/`roa`/
`rong`, citing that policy field's `confirmed_examples`. That was
wrong — I hadn't checked those examples against actual
master_dictionary.json rows before writing it. Doing so now: `A·bri
dotsa`, `Song damsa`, `Rama dilsa`, and `Gari bolsa` (mountain/
village/road/car) are all directly Thangseng-cited, VERIFIED/HIGH,
and FUSED with no space ("no raka dot (classifier-level property,
like pang/rong/dot/dam/dil/bol)" — direct quote from those rows'
citation notes, native relay session 2026-08-13). The contract's
spaced `confirmed_examples` for these four were a stale draft
assumption that predates those citations and was never reconciled —
corrected the contract file itself
(`data/garo_number_classifier_engine_machine_ready.json`) to match
the actual native evidence. **Corrected fix:** `sak`/`rong`/`pang`/
`dot`/`dam`/`dil`/`bol` all fuse with NO space and NO raka dot — i.e.
the current `${classifier}${suffix}` behavior in
`buildClassifierPhrase` for non-`RAKA_CLASSIFIERS` members is already
correct for these. Nothing to fix here after all; Bug 2's real scope
is only the human-sak-40+ dot/capitalization issue described above.
Separately, `rong` for water/beer (`Chi rong sa`, `beer rong sa`) has
no backing master_dictionary.json citation at all — flagged
unconfirmed in the contract, not resolved either way.

## Bug 3 — exact-hundred composition (`buildLargeClassifierPhrase`, `garo_classifier.js:120-141`)
When `remHundred === 0` (i.e. an exact multiple of 100), the code
pops the hundreds-word and appends `${classifier}sa` (classifier +
**one**) as a placeholder tail. Result: `"100 students"` →
`"chattro ritcha saksa"` (reads as "student hundred person-one", not
100) and `"one hundred dogs"` → `"achak mang·sa"` (hundred silently
dropped entirely, reads as "one dog"). This is a real semantic bug,
not just a formatting one — it silently ships a wrong count.
**Fix:** an exact-hundred count needs to attach the classifier to the
hundred-multiplier itself, not substitute a count of 1.

## Bug 4 — `parseCountingPhrase` doesn't handle "hundred"/"thousand" words
Only handles the two-word `[tens][unit]` compound (e.g. "forty one").
No handling for multiplier words at all, so `"one hundred dogs"`
parses as `count=1`, silently dropping "hundred" before it ever
reaches Bug 3's broken composer.
**Fix:** extend the word-number parser to recognize
hundred/thousand multipliers per
`data/garo_number_system_machine_ready.json`'s composition rules.

## Bug 5 — unseeded nouns fall through the classifier engine entirely — FIXED
Nouns without a literal pre-seeded count row (e.g. "mango", not
pre-generated 1-20 like "apple" was) used to not route through the
classifier composer at all — they fell to a different code path
(`sov-assembly`, confidence 0.75) which ignored the `rong` classifier
and produced wrong word order: `"seven mangoes"` → `"Sni te·ga·chu"`
(bare number+noun, no classifier, number-first).
**Re-verified 2026-09-12 (Claude A):** `"seven mangoes"` now correctly
returns `"te·ga·chu rongsni"` (method: `classifier`, not
`sov-assembly`) — noun-classifier-number order, `rong` correctly
applied. Fixed by a concurrent Claude B session sometime between
2026-09-11 and 2026-09-12; no corresponding commit note found in this
doc's history, but the runtime behavior is confirmed correct now.

## Verification data (live `translate()` calls, re-verified 2026-09-12)
| Input | Output | Status |
|---|---|---|
| 41 students | `chattro saksotbri sa` | ✅ FIXED — matches approved surface exactly |
| 55 students | `chattro saksotbonga bonga` | ✅ FIXED |
| 67 students | `chattro saksotdok sni` | ✅ FIXED |
| 71 students | (not yet live-tested via `translate()`; `countNoun` gives `chatro saksotsni sa`, correct) | ✅ correct via countNoun |
| 100 students | `chattro ritcha saksa` | ❌ still Bug 3 — reads as count=1 |
| one hundred dogs | `achak mang·sa` | ❌ still Bug 3/4 — "hundred" dropped |
| seven mangoes | `te·ga·chu rongsni` | ✅ FIXED — Bug 5 resolved, see above |
| 7 books | `ki·tap king·sni` | ✅ FIXED — Bug 1 (`king`), commit `3ba97c3` |
| 19 books | `ki·tap king·Chi·sku` | ✅ FIXED |
| three children | `bi·sa sakgittam` | ✅ correct, not a bug — see Bug 1 Addendum #2 (2026-09-12); the "should be `bi·sa sak·gittam`" claim was based on a misread comment |
| 41 cars | `gari bolSotbri·sa` | ❌ still Bug 2 — wrong capitalization ("Sotbri"), spurious dot before "sa"; same root cause as the pre-fix `sak` case, just not yet generalized to `bol`/other classifiers |
| 4 / 10 (bare digit) | `bri` / `chiking` via `number-engine` | ✅ FIXED — now routes correctly (previously stale dictionary junk) |

**Remaining open bugs, in priority order:** Bug 2 (generalize the
already-working `sak`-specific tens-composition capitalization/dot
fix to every classifier — `bol`/`dot`/`dam`/`dil`/`king`/`mang`/etc.,
all currently broken the same way `sak` was before its fix), Bug 3
(exact-hundred composition), Bug 4 (parser doesn't recognize
hundred/thousand words — blocks Bug 3's fix from ever being reached
for "one hundred X" phrasing). Bug 1 and Bug 5 are fully resolved.

**Separately (2026-09-12, Claude A, RESOLVED — see NV-157):** whether
the `sak` 40+ fusion pattern generalizes past 70/80/90 is now
confirmed. Thangseng: "12 is correct" (in response to the exact
question of whether 71 = `Chattro saksotsni sa` following the same
pattern). Generalizes cleanly through the 70s/80s/90s using
`Sotsni`/`Sotchet`/`Sotsku` — no change in the pattern past 60.
Worked examples added to
`data/garo_number_classifier_engine_machine_ready.json`
(`human_70_plus` field + 71/81/91 entries). Safe for Bug 2's fix to
cover the full 40-99 range for `sak`, not just 40-67.
