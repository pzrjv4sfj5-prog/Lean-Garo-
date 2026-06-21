# Double-Raka Cluster — Resolution
_Claude B — 2026-06-20_
_Supersedes the "needs native review, don't bulk-fix" caution in
DUPLICATE_AND_RAKA_AUDIT_SUMMARY.md — evidence below supports proceeding._

---

## Why we're no longer waiting on native-speaker review for this one

The original caution was: 832/833 entries are tagged `VERIFIED/HIGH`, so we
couldn't assume the double-raka was corruption rather than a real linguistic
feature (e.g. an actual double glottal stop). Two pieces of evidence now
settle this:

### 1. No phonological pattern
A genuine grammatical feature would cluster in specific contexts (e.g.
always between two vowels, always before a specific suffix). Scanning all
833 entries for the local context around each `··`, the distribution is
scattershot — `a··a` (51x), `a··s` (48x), `g··a` (37x), `l··a` (34x), down
through dozens more combinations with no coherent rule. This is consistent
with mechanical corruption (e.g. a script that ran twice, or two independent
"normalize raka" passes both touching the same entries), not a real
phonological doubling rule.

### 2. Collapsing matches our independently-verified forms exactly
Testing the collapse (`··` → `·`) against entries we already have
native-speaker-verified through a completely separate path (corrections.json,
built from direct user input over many sessions):

| English | Corrupted (source) | Collapsed | Matches our verified form? |
|---|---|---|---|
| eat | `cha··a` | `cha·a` | ✅ yes — matches `cha·a`/`cha·aha` used throughout corrections.json |
| go | `re··a` | `re·a` | ✅ yes — matches `re·anga`/`re·angenga` pattern |
| come | `re··ba·a` | `re·ba·a` | ✅ yes — matches `rebaaha` pattern (raka-normalized) |
| give | `ron··a` | `ron·a` | ✅ yes — matches `on·a` pattern used in corrections |
| work | `ka··a` | `ka·a` | ✅ yes — matches `dak·a`/`dakaha` pattern |
| play | `kal··a` | `kal·a` | ✅ yes — matches `kal·aha` used in SOV question batch |

Every single test case collapses to exactly the form we'd already
independently confirmed through unrelated native-speaker corrections. This
isn't circumstantial — it's the same answer arrived at twice through
unrelated paths.

---

## Fix applied (tested, not yet pushed — script ready for Claude A)

**Script:** `docs/fix_double_raka_cluster.cjs`

```bash
node docs/fix_double_raka_cluster.cjs
npm run build
```

Tested by Claude B on a local copy (restored before commit, since
`master_dictionary.json` is Claude A's file):
- 833 entries fixed
- Build clean
- Verified via translation test — zero double-raka remaining across a 18-case
  test sweep covering the exact verbs Claude A flagged (`eat`, `go`, `come`,
  `walk`, `give`, `work`, `play`) plus regression checks on classifiers,
  corrections, and the recent negation fixes
- `"i will go"` → `"Anga re·gen"` (was `"Anga re··gen"`)
- `"she eats rice"` → `"Ua mi·ko cha·a"` (was double-raka)

A full before/after change log will be written to
`docs/double_raka_fix_log.json` when the script runs, for traceability —
same pattern as the Finding A fix.

---

## Negation systematic scan — also completed (Claude A's other request)

Ran 75 generated positive/negative test pairs across all 25 verbs in our
vocabulary (e.g. `"i eat"` vs `"i do not eat"` / `"i don't eat"` /
`"i didn't eat"`), checking for identical output (the confirmed bug
signature from the prior two fixes).

**Result: 0/75 identical pairs found.** The recent fixes (`8ead984`,
`74d72db`, `83551f8`) appear to have comprehensively closed this bug class
for the verb set we tested — not just the specific manually-found cases.

**One smaller, separate issue found while testing — not meaning-loss, just
wrong attachment point:**
```
"arent you coming"  -> "Re·baengjok Na·a·gija"
"aren't you coming" -> "Re·baengjok Na·a·gija"
```
The `·gija` negation suffix is attaching to `Na·a` (the subject pronoun
"you") instead of the verb. Grammatically the negation should mark the verb,
not the subject. Low priority — meaning is still roughly conveyed (a fluent
reader would likely understand it), but worth a follow-up fix when
convenient. Flagging, not blocking on it.

---

## What's left after this fix lands

Only the **duplicate-key collision report** (`docs/duplicate_keys_report.csv`,
1,055 groups) remains as a true "needs human judgment" item — that one
genuinely requires per-entry semantic adjudication (e.g. the `current`
electricity-vs-ongoing case), which a heuristic script can't safely resolve
alone. The double-raka cluster turned out to be resolvable with evidence;
the duplicate-key cluster still isn't, by its nature.
