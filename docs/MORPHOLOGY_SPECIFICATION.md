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

## 7. Derivational/Compound-Forming Suffixes (Academic Source, Distinct from §3)

**Source classification:** an unidentified printed Garo-English
dictionary, page-photographed 2026-07-14 (title/author/edition not yet
established — ask before citing externally). Treated at the same
evidentiary tier as `GARO_GRAMMAR_VALIDATED.md`'s academic sources:
citable, valuable, **not** equivalent to direct native-session
confirmation. Every item below is Needs Native Validation unless stated
otherwise, regardless of how confidently the source states it.

These are a different category from §3's tense/aspect/mood suffixes —
derivational, forming compound verbs/adjectives from a root, several
class-labeled by the source itself:
- **`-gri`** — appended to nouns, meaning non-existence/absence
  (`segri`="having no husband, a widow," `chigri`="waterless,"
  `rasonggri`="no luck, unlucky").
- **`-grima`** — appended to verbs, meaning "together in a whole crowd"
  (`kam ka·grima`="to work together in a crowd").
- **`-grika`** — appended to verbs, reciprocal (`dokgrika`="to beat each
  other," `on·grika`="to give and take," `sepanggrika`="near to each
  other, as two places"). Distinct dictionary entry from standalone
  `Grika`, v. "to dance" — same string, different lexical items,
  flagged so they aren't conflated (see NV-013 update below).
- **`-gronga`** — appended to verbs, "to meet" (`re-grong`="to meet by
  chance").
- **`-gopa`** — "indicating something entire or complete, whole,"
  appended to verbs (`ra·gopa`="take the entire quantity,"
  `rimgopa`="capture whole lot," `cha·gopa`="to eat all, by himself
  alone," `bamgopa`="to bow; to include all," `man·gopa`="to include
  all, to comprise" — note `man·gopa`'s `man·` root plausibly connects
  to the already-tracked polysemous `man·` root, `NV-008`/`VERB_
  INVENTORY.md`, worth checking together, not assumed the same without
  confirmation).
- **`-breja`** — appended to verbs/adjectives, "to be not to the
  standard (used only before the negative particle)" (`nambreja`="not
  very good, not to one's satisfaction" — `nam`="good," already
  confirmed root, RULE-001 raka-free). Possibly relevant to `RULE-018`
  (`-gija` verbal-adjective) territory — a second "approximates but
  falls short of X" derivational pattern, not yet reconciled with it.
- **`-brina`** — verb suffix, "to mix" (`donbrina`="to put together
  things of different kinds," `cha·brina`="to eat together" — `cha·`
  root, directly extends `docs/verbs/CHA_EAT.md`'s attested paradigm
  with a new compound form not currently documented there).

**Vocabulary note, resolved 2026-07-14 (native-confirmed):** `Grika`,
v. "to dance" — **not** a competing general-purpose synonym for
`Chroka` as initially flagged. Native-confirmed: `Chroka` is the common
word for "dance"; `Grika` names a specific ceremonial dance performed
by the male lead dancer in Wangala (sword-and-shield dance), not
"dance" in general. The dictionary's gloss was accurate but under-
specified — a real lesson about this source's granularity for future
entries from it, not an error. See `THANGSENG_NATIVE_VALIDATION.md`
NV-013 and `VERB_INVENTORY.md` for the cultural-vocabulary note.

**Status:** Needs Native Validation (direct) for all remaining items —
academic source only, zero native-session confirmation yet. **Priority:** P2 —
none of these are launch-blocking; `-breja`'s possible overlap with
`RULE-018` is the one item worth prioritizing if a native session opens
on this topic, since it could affect an already-implemented rule's
scope.

**Methodological note, added 2026-07-15 (a gap in the original
extraction pass):** this source's entries frequently carry two glosses
across word classes on one headword — worth checking systematically
for future entries mined from it, not just the ones below. Two kinds,
worth distinguishing rather than treating uniformly:
- **Homonymy** (unrelated meanings, coincidental shared form):
  `Grika` — v. "to dance" (see `VERB_INVENTORY.md`'s cultural-
  vocabulary note; native-confirmed as the Wangala ceremonial-dance
  term) **and, separately, unrelated** — adj. "clear; transparent;
  limpid." Missed in the original pass; corrected now specifically
  because real linguistic work was already built around the dance
  sense without registering the other exists.
- **Polysemy via category-flexibility** (related meanings, same root
  functioning across word classes — a real, structured pattern, not
  noise): `Gong-raka` — adj. "swift, fast, strong, fleet" / v. "to
  make haste, to hasten, to hurry up" (stative ↔ inchoative sense of
  one root). `Guala` — v. "to forget, to make a mistake" / n.
  "mistake, error, fault" (verb ↔ its nominalization). Neither
  native-confirmed; logged as vocabulary candidates only, not
  promoted to any rule.

## 8. Pending Affix Candidates — Not Native-Validated, Not Rules

Source dictionary pages 114–115 (imported 2026-07-22) each carried a
handful of entries the OCR extraction correctly tagged `entry_type:
"example"` rather than `"lexical"` — worked example pairs illustrating
an affix's usage rather than standalone dictionary headwords. These
were pulled out of the normal vocabulary-import pipeline (they don't
fit a single-headword/single-gloss row, and `flip-garo-to-english.js`
deliberately refuses to guess how to handle a type it doesn't
recognize — see its error message). They are **not** in
`master_dictionary.json` or `pending_lexicon.json`. Logged here as
raw evidence only. Tentative hypotheses below are Claude A's first
pass, not confirmed — do not cite these as settled grammar, do not
build engine logic on them, and do not let them anchor later
interpretation the way the `RC-CANDIDATE-022` "bird" mislabel almost
did.

**`-kal` / `-kal-a` — possible comparative marker ("than"):**
```
"go"                      -> "re·angkal-let (one)"
"stay"                    -> "rokal-let (him)"
"this is better than that" -> "Una batede ian namkala"
"He reads more than I (do)" -> "Angna batede uan poraibatkala"
```
Tentative: `-kal`/`-kal-a` may mark the standard-of-comparison in a
comparative construction, with `-let` marking the compared referent
("one"/"him"). Not confirmed — needs a native check on at least one
minimal pair before any rule number is assigned.

**`-kama` — possible durative/sufficiency marker:**
```
"to remain in the house for some length of time" -> "noko dongkama"
"to reach the destination; to be long enough for the purpose" -> "sokkama"
```
Tentative: `-kama` may mark "for a sufficient duration" or "to a
sufficient degree," attached to a verb root (`dong`="stay"?,
`sok`="reach"?). Not confirmed.

**`-kamkama` — possible intensified/exclusive form of `-kama`:**
```
"his only son died" -> "Uni saksakamkam depanteba siangkamkama"
```
Only one data point, and it's a full sentence rather than an isolated
morpheme — too little to hypothesize a specific meaning beyond "some
reduplicated/intensified relative of `-kama`." Needs several more
examples before even a tentative gloss is worth writing down.

**Status:** all three logged for the next native relay batch, phrased
as open questions, not sent yet. Not blocking anything — pages
114–115's actual vocabulary entries (81 + 82 flat entries respectively)
were processed normally and are already in production.

