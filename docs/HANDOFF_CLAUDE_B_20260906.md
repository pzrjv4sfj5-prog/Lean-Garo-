# Claude C → Claude B Handoff
**Date:** 2026-09-06 | **From:** the two independent full-scale audits run 2026-09-05
(`CLAUDE_C_AUDIT_20260905.md` + `CLAUDE_C_AUDIT_20260905B_ADDENDUM.md`)
**Companion:** `HANDOFF_CLAUDE_A_20260906.md` (linguistics side of the same findings)
**Baseline at time of audit:** HEAD `b00ffb9`, gate green (8280/8280 dict,
314/314 unit tests, 0 new repository-intelligence violations). All repros
below are live against that HEAD; audits were read-only, nothing committed.

---

## Item 1 (HIGH, root-caused) — `leaf`→`leaves` collides with an auto-generated bare-infinitive alias for the unrelated verb "to leave"
**Repro:** `translate("leaves")` → `"Re·ongkata"` (sov-assembly, .75 conf) —
completely wrong root, not just a dropped plural marker.

**Root cause, fully traced:** `master_dictionary.json` has no entry for bare
`"leave"`, only `"to leave"` → `Re·ongkata` (unverified). `prepare-data.js`'s
bare-infinitive alias generator (787 aliases this build, "to X" → "X" where
"X" has no entry) auto-created `compiled_dict["leave"] = "Re·ongkata"` as a
byproduct. The plural-stripping layer then does a naive `-s` strip on
`"leaves"` → `"leave"`, which now resolves to that alias instead of to
`"leaf"`. Two individually-reasonable features colliding — not a bad data
row.

**Ask:**
1. Add proper `-y→-ies` and `-f/-fe→-ves` pluralization rules that run
   *before* the generic `-s` strip, so `"leaves"` lemmatizes to `"leaf"`
   directly instead of falling through to naive `-s` stripping at all.
2. Independent of #1: audit whether the bare-infinitive alias generator
   should exclude aliases that would collide with an existing noun's
   plural-stripped form — this collision class is very likely not unique to
   leaf/leave (didn't sweep all 787 aliases against all pluralizable nouns
   this session; recommend a scripted check: for each bare-infinitive
   alias, check whether `alias + "s"` matches any existing noun key).
3. Related, lower severity, same missing-rule family: `"babies"`/`"cities"`
   currently hard-fail to `[UNKNOWN]` (no y→ies rule at all, not even a
   wrong-answer fallback) and `"knives"` only resolves correctly by
   accident via fuzzy-match at .55 confidence (no f→ves rule either). Same
   fix as #1 covers all three.
4. Blocked on Claude A for the actual Garo plural forms if any of
   babies/cities/leaves turn out to need a genuinely irregular native form
   rather than regular pluralization — see companion doc item 4-5.

## Item 2 (HIGH) — question-type marking silently drops on any input that isn't a literal stored citation
This generalizes the already-known NV-119/120 gap (previously scoped to
"can" + one "have lunch" paraphrase) much further than documented:

| input | output | issue |
|---|---|---|
| did he/she/they eat? | plain declarative, no `-hama`, no `?` | question marking dropped entirely |
| will he eat? | plain declarative | same, future tense |
| will you not eat? / did you not eat? | plain declarative negative | negative polar questions lose marking for **every** subject, including "you" |
| when will you go? | `"Na·a Re·anggen"` — no "when," no `?` | wh-word dropped (contrast: `"when did you eat?"`, a citation, correctly keeps `basako`) |
| what did **he** eat? | `"Maia? Ua Cha·a"` | malformed — stray `"Maia?"` fragment spliced in front of a plain declarative rather than composed into one sentence (contrast: `"what did you eat?"`, a citation, is well-formed) |

**Pattern:** every one of these works correctly only when it matches a
stored citation almost verbatim (usually "you," present/simple past). The
moment subject, tense, or negation changes, most paths silently degrade to
a declarative sentence with **no drop in reported confidence** (`sov-
assembly` still reports .75, identical to a correctly-composed statement) —
there's no signal to a caller that a question got mistranslated as a
statement.

**One asymmetry worth noting while scoping the fix:** the narrowly-patched
`"did/have X eaten/had lunch"` polar construction (.85 conf) *does*
generalize correctly across subjects (I/he/you all work) — it's actually
more robust than the plain "eat" polar path it was meant to patch around.
Might be a useful template for how the general fix should be structured.

**Ask:** build (or generalize an existing) question-composition rule that
applies `-ma`/`-hama` and wh-word placement based on the sentence's actual
subject/tense/polarity rather than requiring a literal citation match. This
likely needs Claude A to first supply the correct target forms across the
full paradigm (subject × tense × polarity), the same way the `happy`
paradigm was supplied — the current code has no generalized rule to fall
back on because it's never been given one.

## Item 3 (MEDIUM) — `cat`: two independent, never-reconciled data chains, plus a confidence-schema issue
Fully traced (see also companion doc item 1 for the linguistic side of this):
- Bare-word chain (`cat` key): `meng·gong`, verified_high, consistent
  master→compiled→phrase-map.
- Counting-citation chain (`"one cat"`/`"three cat"` as literal keys):
  `menggo` (no dot), verified_high, independently sourced, never
  cross-checked against the bare-word chain.
- Live classifier-composition path (`"two cats"`/`"three cats"`, plural
  forms): has **zero master_dictionary.json rows of its own** — generated
  at runtime from the bare-word lookup + `buildClassifierPhrase`, which is
  *why* it inherits `meng·gong` while the singular "N cat" citations use
  `menggo`. These were never the same code path.
- Bonus: `"two cat"`'s own master row is tagged **unverified** (unlike
  `"one cat"`/`"three cat"`, both verified_high) yet ships at .98 confidence
  via `exact-phrase` — same confidence-schema issue as item 4 below.

**Ask:** once Claude A adjudicates which root is correct (or confirms both
are valid register variants), reconcile the two chains so the
citation-lookup path and the classifier-composition path agree. Also add a
`repository-intelligence.js` check for "same lexeme, different confirmed
root across citation-keys vs. bare-word key" — Check A/B/etc. don't appear
to catch this class today (it's how this shipped invisibly for as long as
it did).

## Item 4 (MEDIUM) — confidence score doesn't reflect verification status of the underlying master row
Two confirmed instances: `dog` (`Achak`) ships at .98-1.0 confidence at
runtime, but its *only* `master_dictionary.json` row is tagged
`unverified`. Same for `"two cat"` (item 3 above). Runtime confidence
currently reflects "which cascade layer answered" (exact-phrase/correction
= high, sov-assembly = .75, fuzzy = .5-.65) rather than "how well-evidenced
is this value" — the two have been silently decoupled for at least these
two entries. Recommend either (a) capping runtime confidence at some lower
ceiling when the backing master row is `unverified`, regardless of which
cascade layer answers, or (b) surfacing verification status as a separate
field from confidence so callers/QA can distinguish "high confidence in the
*lookup*" from "high confidence in the *evidence*." Didn't sweep for how
many other entries share this gap — recommend a scripted cross-check of
all `unverified` master rows against their runtime confidence.

## Item 5 (LOW-MEDIUM) — `elephant`: three verified_high variants split unreconciled across cascade layers
`master_dictionary.json` has `Mong`/`ha·ti`/`mong·ma`, all verified_high
(genuine register variants per the notes — not an error). `compiled_dict.json`
and `phrase_maps.js` both independently say `Mong`; `corrections.json`
independently holds `mong·ma`, and wins at runtime per the stated cascade
order. Currently harmless (all three are attested), but it means
`compiled_dict.json` alone gives a wrong answer to "what does the app
actually ship for elephant" — you have to know `corrections.json`
overrides it. Recommend a repository-intelligence check that flags any
`corrections.json` entry whose value disagrees with `compiled_dict.json`/
`phrase_maps.js` for the same key, purely so this kind of divergence is
visible/intentional rather than silent (not asking you to change which
variant wins — just to make the disagreement visible).

## Item 6 (MEDIUM, root cause not yet found) — new `cat` → `"mang"` bug via a `stopword-stripped` path
`"where is the cat?"` → `"kade mang?"` — `mang` is the bare animal-classifier
morpheme (see `CLASSIFIER_MAP`), not a translation of "cat." Reproducible,
but I did not trace the `stopword-stripped` code path this session to find
where it's pulling `mang` from instead of doing a real dictionary lookup.
Needs investigation.

## Item 7 (LOW, mechanical) — adjective+animal placeholder collision, narrower scope than previously assumed
`"big"`/`"small"`/`"good"` × {cat, dog, bird, fish} all ship an identical
generic placeholder (e.g. `"gonga mang"` for "big") instead of composing.
**Scope check done:** animals *without* their own placeholder row (cow,
goat, tiger, snake, monkey, pig, rat) already correctly fall through to
`sov-assembly` and compose correctly (e.g. `"big cow"` → `ma·su dal·a`) — so
this is a small number of bad `master_dictionary.json` rows, not a
composition-engine defect. Recommend: delete the placeholder rows for the
affected animal×adjective combos and let the existing working `sov-assembly`
path handle them (same as cow/goat/etc already do) — no new composition
logic needed. Full row count not enumerated (only 8 animals × 3 adjectives
sampled) — recommend a full sweep before closing this out.

## Item 8 (LOW) — `answer`: pickPrimary tie is still open at the compiled level, only masked by a correction override
`compiled_dict.json["answer"]` still holds `"Aganchakani"` (the noun form,
per NV-077 notes) while runtime ships `"Aganchaka"` (verb form) purely
because `corrections.json` overrides it. This is the same systemic
`.toLowerCase()` key-collapsing issue already tracked as open (merging
distinct-POS entries under one lowercased key) — flagging again because a
prior audit re-verification (mine, in the first 2026-09-05 report)
incorrectly took the runtime output at face value and reported this as
"appears fixed." It is not fixed at the data level; the override is
papering over it. If the correction is ever removed, the shipped word
silently reverts to the wrong POS. Recommend prioritizing the actual
POS-tracking fix (schema needs a POS field so pickPrimary doesn't merge verb
and noun forms under one key) rather than relying on the override
long-term. Blocked on Claude A's confirmation this is genuinely two POS,
not one wrong form (companion doc item 3).

## Item 9 (informational, no action) — number/classifier composition engine: 160/160 checks passed
Full sweep across all 10 `CLASSIFIER_MAP` categories × 16 counts
(1-101, covering units/teens/tens/hundreds and raka vs. no-raka categories)
found zero mismatches between the standalone classifier engine and the
full runtime pipeline. No fix needed — flagging so this subsystem isn't
re-audited from scratch next time; it's solid.
