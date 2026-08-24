# Claude B — `-rang` Plural Marking Audit (2026-08-24)

Per explicit Project Owner instruction: audit only, no linguistic ruling made.
This document reports what was verified, does not choose between the
possible interpretations, and hands the open question to Claude A with
the evidence needed to decide it.

## 1. Every runtime/compiler rule involving `-rang`

**There is none.** Grepped all of `src/*.js`, `repository-intelligence.js`,
and every build script for any code path that appends, strips, or
otherwise generates a `-rang` (or `rang`) suffix. Zero hits outside
literal dictionary-string content (`phrase_maps.js`'s `'wash': 'Su·sranga'`
etc. — `rang` there is inside an unrelated root, not a suffix operation).

`-rang` exists in this codebase **only** as a substring baked into
specific, individually-relayed Garo strings inside
`master_dictionary.json` / `corrections.json` / `compiled_dict.json`.
No function computes it from a noun root at runtime or at build time.

## 2. Noun classes/forms currently receiving automatic `-rang`

**None automatically.** Three VERIFIED/HIGH master_dictionary.json
entries happen to carry a manually-supplied `-rang`-suffixed plural
form, each entered as its own independent dictionary row from a
distinct native-relay session — not derived from each other or from any
rule:

| English | Garo (VERIFIED/HIGH) | Singular root | Source |
|---|---|---|---|
| children | `Bi·sarang` | `Bi·sa` (child) | NV-054, 2026-08-08 relay |
| fruits | `biterang` | `Bite` (fruit) | NV-?, 2026-08-11 relay |
| coins | `tangka bisilrang` | `Tangka·bisil` (coin) | NV-089, 2026-08-21 relay |

Every other plural bare-noun key checked (`dogs`, `trees`, `apples`,
`students`, `books`, `people`) has **no** dictionary entry of its own.
At runtime these fall through to `assembleSentenceSOV`'s fallback,
which strips the English `-s`/`-es` and looks up the **singular**
Garo root (see §3) — i.e. they render identically to their singular
form, carrying no plural marking of any kind, `-rang` or otherwise.

## 3. Where `-rang` is hard-coded vs. grammatically assembled

100% hard-coded. Confirmed by reading `src/sentenceBuilder.js`'s
`assembleSentenceSOV` (the only fallback path a bare plural noun with
no dedicated dictionary entry can reach):

```js
return lookupPhrase(lw) || lookupGaro(lw)
  || IRREGULAR_VERBS[lw]
  || ingLookup || lookupGaro(lw.replace(/ed$/,''))
  || lookupGaro(lw.replace(/s$/,'')) || lookupGaro(lw.replace(/es$/,'')) || null;
```

The last two clauses are the plural-noun path: strip English `-s`/`-es`,
look up the bare **singular** Garo root, return it unmarked. No
suffix — `-rang` or any other — is ever appended here or anywhere else
in the codebase. `garo_classifier.js`'s `IRREGULAR_PLURALS` table
(`people→person`, `children→child`, etc.) exists solely to normalize
the **English** side before a *counted-noun* classifier phrase is
built (`achak mang·gni` = "two dogs") — it has nothing to do with
`-rang` and does not touch bare, uncounted plurals at all.

## 4. Does the implementation assume `-rang` is universally productive?

**No — the implementation makes no assumption about `-rang` at all.**
It does not apply `-rang` universally, does not apply it selectively by
noun class, and does not have a concept of "productive plural suffix"
anywhere in its logic. The three `-rang` forms that exist are inert
dictionary data, reachable only by an exact key match. There is no
code that could over- or under-apply the rule, because no code applies
it.

## 5. Live runtime tests across noun types

Ran `translate()` directly against representative nouns spanning
animate/inanimate and count/mass categories:

| Input | Output | Method | Notes |
|---|---|---|---|
| dog / dogs | `Achak` / `Achak` | phrase-map / sov-assembly | identical string, no marking |
| child / children | `Bi·sa` / `Bi·sarang` | phrase-map / exact-phrase | **animate**, marked |
| fruit / fruits | `Bite` / `biterang` | exact-phrase / exact-phrase | **inanimate, count**, marked |
| coin / coins | `Tangka·bisil` / `tangka bisilrang`* | correction / correction | **inanimate, count**, marked |
| student / students | `Chattro` / `Chattro` | exact-phrase / sov-assembly | identical string, no marking |
| tree / trees | `Bol` / `Bol` | correction / sov-assembly | identical string, no marking |
| book / books | `Ki·tap` / `Ki·tap` | phrase-map / exact-phrase | identical string, no marking |
| person / people | `mande` / `mande` | correction / correction | identical string, no marking |
| apple / apples | `Apple` / `Apple` | correction / sov-assembly | identical string, no marking |
| water | `Chi` | correction | mass noun, singular/plural N/A |
| rice | `Mi` | phrase-map | mass noun, singular/plural N/A |

*`coins` output shown post-fix — see §6.

**Observation directly relevant to the open linguistic question:**
`-rang` marking is attested on one **animate** noun (child) and two
**inanimate, count** nouns (fruit, coin). This is native-confirmed
data, not a derivation — but it directly contradicts a strict
"animate-only" hypothesis for `-rang`, since two of the three
confirmed cases are inanimate. It does **not** by itself establish
universal productivity either, since the large majority of common
nouns checked (dog, tree, apple, book, student, person) have zero
attested plural form of any kind — an absence of data, not evidence
that they take no plural marker.

## 6. Independent engineering bug found and fixed

While tracing `coins`, found the runtime was shipping `tangka bisil`
(identical to the singular) instead of master's own VERIFIED/HIGH
`tangka bisilrang` (NV-089). Traced to `corrections.json`'s
exact-match override, which had never been synced after NV-089 added
the plural form — the same shadowing pattern as every prior Rule 8 fix
in this repo (stale `corrections.json` beating a VERIFIED master
value). `master_dictionary.json` and `compiled_dict.json` already
carried the correct value; only the runtime override was stale.

This is a pure engineering sync fix — the target value was already
Claude A's own VERIFIED/HIGH citation, nothing new was invented or
decided. Fixed, confirmed live (`translate('coins')` now returns
`tangka bisilrang`, method `correction`), full gate re-verified green
(229/229 tests, `repository-intelligence.js` 0 new violations).
Committed separately from this audit doc.

**No other pluralization-related engineering bugs found.** Every other
bare-plural noun checked resolves consistently with what its own
dictionary data supports — nouns with a dedicated VERIFIED plural
entry ship it correctly; nouns without one correctly fall through to
the unmarked singular (not a wrong guess — literally no plural data
exists for the engine to draw on).

## 7. Engineering consequence of each possible ruling

None of these requires new engine architecture — `assembleSentenceSOV`
already has a single, well-isolated substitution point (the two
`lookupGaro(lw.replace(/s$/,''))` / `.replace(/es$/,'')` fallback
clauses in §3). Whichever ruling Claude A/the Project Owner makes,
implementation is additive at that one point, not a rewrite.

- **`-rang` universally productive (attach to any noun's root for
  bare/uncounted plural):** Smallest engineering change — one new
  fallback clause: if no dedicated plural entry exists, look up the
  singular root and append `-rang` (or `·rang`, pending Claude A's
  orthography call on the raka/hyphen question already answered
  elsewhere in this file for other suffixes) before falling through to
  the bare singular. Risk: would retroactively make every currently
  "correctly unmarked" noun (dog, tree, book, ...) *newly* produce a
  guessed form with no per-word native confirmation — exactly the kind
  of engineering-invents-linguistic-content move Rule 13 and the A/B
  role split exist to prevent. Would need Claude A's explicit sign-off
  that this is safe to generalize, not just a ruling that the pattern
  exists.
- **`-rang` restricted to certain noun classes (e.g. only animate, or
  only count nouns):** Requires a noun-class/animacy field that does
  not currently exist anywhere in `master_dictionary.json`'s schema
  (confirmed — no `animacy`, `noun_class`, or similar column). Same
  gap already flagged by the `garo_classifier.js` CLASSIFIER_MAP
  design (classifier choice is itself the closest proxy this repo has
  to a noun-class system) — the classifier-family a noun already
  belongs to (`mang`=animals, `sak`=people, `rong`=roundish, `ge`=
  general, etc.) could plausibly be reused as that signal without
  inventing a new field, but confirming *that* mapping is itself a
  linguistic call, not an engineering one. This ruling requires Claude
  A to specify the exact class boundary before any code is written; a
  wrong guess here (e.g. keying off CLASSIFIER_MAP without native
  confirmation that classifier family predicts `-rang` eligibility)
  would ship fabricated plurals under a plausible-sounding rule.
- **`-rang` only used where explicitly confirmed (status quo,
  formalized):** Zero engineering change needed — this is exactly
  what the current code already does, whether or not anyone intended
  it as a deliberate policy. The three existing `-rang` forms keep
  working via their dictionary rows; everything else keeps falling
  through to the unmarked singular. If this is the ruling, the only
  action item is documentation (state explicitly in
  `.ai/SESSION_BOOTSTRAP.md`/`WORKSTATE.yaml` that this is intentional
  policy, not an unaddressed gap), so a future session doesn't
  re-discover the same "bug" that isn't one.

## 8. Explicit hand-off to Claude A

The question this audit cannot answer: **is `-rang` a productive Garo
plural morpheme at all, and if so what governs which nouns take it?**
The three native-confirmed data points (child/children, fruit/fruits,
coin/coins) are consistent with several different underlying rules
(all count nouns; a specific semantic class that happens to include
these three; free variation with no rule; something else) and are too
few to distinguish between them without further native input. This
audit deliberately does not guess — per instruction, handing the exact
question to Claude A with the evidence above, not a proposed answer.
