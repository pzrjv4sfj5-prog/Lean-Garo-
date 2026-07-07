# Garo Morphology Specification — v1.0

Chief Linguistic Scientist deliverable. Defines the verb-suffix paradigm
as a formal system, not a list of examples. Source: `THANGSENG_RULES_LOOKUP.md`
Rules 1–2, 13, 15–29.

## 1. Definitions

- **Root**: smallest meaningful verb unit, carries no grammatical
  information (`cha·`, `dak`, `re·ang`, `ring`, `am·`).
- **Dictionary form**: root + default suffix `-a` (citation form only,
  not grammatically privileged).
- **Stem**: root with its citation-form vowel removed per the Stem
  Formation Rule (§2).
- **Productive suffix**: applies to any verb stem via a general rule,
  yielding a predictable meaning even for previously-unattested roots.
- **Lexical vs. grammatical change**: a lexical change alters the root
  itself (different word); a grammatical change alters only the suffix
  (same word, different tense/aspect/polarity). These can look identical
  on the surface — see the `song`/`song·` (cook vs. distinct raka-bearing
  sense) caution in §5.

## 2. Stem Formation Rule (Rule 15)

> "We get the stem by removing a letter from the principal word. If a
> word has a raka, the letter(s) after the raka is removed, the raka is
> retained."

| Root | Stem | Operation |
|---|---|---|
| `daka` | `dak` | strip trailing `a` |
| `cha·a` | `cha·` | strip vowel after raka, retain raka |
| `nama` | `nam` | strip trailing `a` |

**Exception (Rule 24, "full-root-append"):** `-ha` (past/perfect, Rule 2)
and `-chim` (Rule 13) attach to the **full root**, not the stripped stem.
`cha·a + ha = cha·aha` (not `*cha·ha`); `donga + chim = dongachim` (not
`*dongchim`). This exception is itself a confirmed, systematic rule — not
an irregularity to special-case per verb.

**Status:** Verified. **Priority:** P0 — this is the single
highest-leverage rule in the whole morphology; every suffix's correct
application depends on knowing which formation rule (stem vs. full-root)
it follows.

## 3. Suffix Paradigm Table

| Suffix | Formation | Category | Meaning | Status |
|---|---|---|---|---|
| `-a` | citation | — | unmarked default form | Verified |
| `-aha` | full-root | Tense/Aspect | simple past **and** perfect (unified, no split) | Verified |
| `-manaha` | stem | Aspect | completive ("has done," "finished") | Verified |
| `-jaha` | stem | Aspect | cessative ("was doing, has stopped") — NOT past negation | Verified (corrects a documented 2026-07-01 error) |
| `-ja` | stem | Polarity | negative (present **and** past-referring) | Verified |
| `-jawa` | stem | Tense+Polarity | future negative ("will not") | Verified |
| `-gen` | stem | Tense | future — never carries raka regardless of root | Verified |
| `-bo` | stem | Mood | imperative **and** hortative (dual function, one form) | Verified |
| `-nabe` | stem | Mood+Polarity | negative imperative | Verified |
| `-enga` | stem | Aspect | continuous/progressive | Verified |
| `chim` (separate word) | post-continuous | Aspect | discontinued-past-continuous, attaches AFTER a fully-formed continuous verb, not fused | Verified |
| `-ode` | stem | Subordination | if-clause marker | Verified |

## 4. Aspect vs. Tense — Explicit Disambiguation

Garo's suffix system privileges **aspect** (is the action bounded,
ongoing, completed, or discontinued) over **tense** (when it happened).
Three aspectually-distinct suffixes can all describe a past-referring
event with different implications:
- `cha·aha` — ate (simple factual past/perfect, no aspectual commentary)
- `cha·manaha` — has eaten (completive: the eating reached its endpoint)
- `cha·jaha` — has stopped eating (cessative: was an ongoing pattern, now discontinued)

**These are not interchangeable and not redundant**, despite `-aha`/
`-manaha` overlapping in casual spoken usage per direct native confirmation
(Rule 28) — that overlap is itself a documented fact, not an engine gap.
**Status:** Verified. **Priority:** P0 for the three-way distinction;
the spoken-overlap nuance is P1 (refinement, not launch-blocking).

## 5. Homophone/Lexical-Split Caution

Some root-letter-sequences correspond to **different words**, not
different grammatical forms of one word:
- `song` (to cook) vs. `song·` (distinct sense, raka-bearing) — Rule 21.
- `nokkima`/`kokkima` (under) vs. `Ka·ma` (down) — surface-similar but
  unrelated; a historical implementation error conflated these (see
  Validation Corpus entry for the correction).

**Recommendation for Grammar Rule Catalogue:** any new root entry should
be checked against this caution before assuming raka presence/absence is
"just" a suffix-application detail — it may indicate a different lexical
item entirely. **Priority:** P0 (this exact confusion class caused two
confirmed production bugs already).

## 6. Productivity Boundary

The suffix table in §3 is confirmed productive for the following
root-classes with directly-attested examples: `cha·` (eat), `ring` (drink),
`dak` (do/work), `re·ang` (go), `am·`-family (search-adjacent), `song·`
(cook), `agan` (speak), `nika` (see), `asong` (sit), `bre·a` (buy),
`sandia` (search). Productivity for roots outside this attested set is
**Derived**, not Verified — apply with the standard "never guess" caveat;
a new root's raka status and any lexical-split risk (§5) should be
confirmed before assuming the suffix table applies mechanically.

**Status:** Derived (for unattested roots). **Priority:** P1.
