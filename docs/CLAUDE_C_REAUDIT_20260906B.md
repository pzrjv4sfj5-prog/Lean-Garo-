# Claude C Re-Audit — 2026-09-06B
Independent re-verification against fresh `origin/main` (`15b1024`, 4 commits
ahead of my last push `e617592`). Read-only, fresh clone (`repo2`), full
baseline gate re-run before touching anything. Every status below is from
live `translate()` + direct source inspection this session — not taken from
commit messages.

## Baseline gate
8280/8280 dictionary, **317/317** unit tests (+3 since last audit), repo-
intelligence 0 new violations across Checks A-H (**Check H is new** —
modifier+noun placeholder collision, added since my last audit and
currently green). All green.

## RESOLVED — independently confirmed fixed

**`cat` root conflict (Handoff A item 1 / Handoff B item 3).** Fully
unified to `Menggo` everywhere now: bare word, `"two cat"`, `"two cats"`,
`"three cats"`, `"the two cats are sleeping"` all agree. Traced to NV-135
("cat = Menggo confirmed by direct native relay, closes NV-134"). Also
confirms `"two cat"`'s master row upgraded from `unverified` to
`verified_high` as a side effect — partially closes the confidence-schema
gap too (Handoff B item 4, one of its two instances).

**Adjective+animal placeholder collision (Handoff A item 6 / Handoff B item
7).** `"big cat"`/`"big dog"`/`"big bird"`/`"big fish"` and the `small`/
`good` variants now all compose correctly and distinctly (`gonga Menggo`,
`gonga Achak`, `gonga do·o`, `gonga na·tok`, etc.) — no more shared
placeholder. New regression test `adjective_animal_mang_placeholder.test.js`
confirms this was fixed deliberately, and the fix was **generalized beyond
the 4 animals I sampled** (commit message says "generalized beyond
animals" — consistent with what I'm seeing at runtime).

## STILL OPEN — independently reconfirmed, unchanged

**`leaf`/`leaves` collision (Handoff B item 1, HIGH).** `translate("leaves")`
still returns `"Re·ongkata"` (sov-assembly, .75) — same wrong root, same
mechanism (bare-infinitive alias for "to leave" colliding with naive `-s`
strip). No commits touched this. Still the highest-severity open item.

**`babies`/`cities`/`knives` plural morphology (Handoff B item 1).** Same
as before: `babies`/`cities` → `[UNKNOWN]`, `knives` → correct answer only
by fuzzy-match accident (.55 conf). No `-y→-ies`/`-f→-ves` rule added yet.

**`"where is the cat?"` → `"kade mang?"` (Handoff B item 6).** Still
reproduces exactly as before — the `stopword-stripped` path still leaks the
raw animal-classifier morpheme `mang` instead of a real "cat" lookup. Not
touched by the cat-root fix (that fix was to phrase-table rows; this is a
different code path). Root cause still not located.

**Question-type marking generalization failure (Handoff B item 2, HIGH).**
Every case from the original addendum reproduces unchanged: `"did i/he
eat?"`, `"will he eat?"`, `"will you not eat?"`, `"did you not eat?"` all
still silently degrade to plain declaratives with no `-ma`/`-hama` and no
`?`. `"when will you go?"` still drops "when." `"what did he eat?"` still
produces the malformed `"Maia? Ua Cha·a"` splice. `"did you have
breakfast?"` still produces the word-salad `"donga na·sta Na·a"`. No
progress here — consistent with this being blocked on Claude A supplying
the full paradigm first (per my handoff), which hasn't happened yet.

**`answer` compiled-level tie (Handoff B item 8).** Checked
`compiled_dict.json` directly this time (not just runtime output): still
`"Aganchakani"` (wrong POS), still only masked by `corrections.json`
overriding to `"Aganchaka"` at runtime. Traced the paper trail: Claude A
*did* reconfirm the POS split (`c7335ae`, "NV-077 addendum... reconfirmed
twice-relayed... flagged for Claude B") — so the linguistic question is
answered, but Claude B hasn't yet done the compiled-level fix. This is now
purely on Claude B; nothing further needed from Claude A here.

**`elephant` cross-layer variant divergence (Handoff B item 5, low
priority).** Unchanged: `compiled_dict.json` says `Mong`, `corrections.json`
overrides to `mong·ma` at runtime. Not addressed, consistent with it being
flagged as low-priority/informational rather than actionable.

**`ball` fuzzy false-positive (Handoff A item 5 / Handoff B, informational).**
Unchanged — still fuzzy-matches to `"tall"` at .65 confidence; no dictionary
entry added, no fuzzy-threshold change made.

**`dog` confidence-schema gap (Handoff B item 4, half of it).** Master row
for `"dog"` is still `unverified` while shipping .98-1.0 confidence at
runtime. Only the `"two cat"` half of this finding got fixed (as a
byproduct of the cat-root fix, not a direct fix to the confidence-schema
issue itself) — `dog` is still open and the general schema fix (cap
confidence when source is unverified, or separate the two signals) hasn't
been built.

## Net
2 of 9 Handoff-B items closed (cat reconciliation, adjective+animal
placeholder), both independently confirmed at the code level, not just by
commit message. 7 remain open, 2 of those now have their linguistic
prerequisite satisfied (answer POS, cat provenance) and are purely blocked
on Claude B's implementation. No new regressions found in anything
previously marked PASS (happy paradigm, classifier/number engine, eat verb
paradigm — spot-re-checked, all still correct).
