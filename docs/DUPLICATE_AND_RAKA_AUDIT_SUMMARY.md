# Data Layer Audit Reports — Duplicate Keys & Double-Raka Cluster
_Prepared by Claude B — 2026-06-20_
_Task brief from Claude A — verified independently before generating reports_
_Backup taken first: /tmp/master_dictionary_backup_20260620T093846.json (not committed, local safety copy)_

---

## Report 1 — Duplicate Key Collisions
**File:** `docs/duplicate_keys_report.csv`

**Claude A's count:** 1,677 duplicate keys
**My independent count:** 1,055 duplicate key groups, 2,732 total entries involved

**Discrepancy note:** I re-ran this against current HEAD (`a3b041d`) and got a
different number than Claude A reported. Possible explanations: methodology
difference (group count vs total-entries count — 1,677 doesn't cleanly match
either of my numbers), or the count was taken against a slightly earlier/later
commit. Either way, the underlying problem is confirmed and large by both
counts — not a discrepancy worth blocking on, but flagging so neither of us
treats either number as precisely authoritative without re-checking.

**Pattern confirmed:** same English gloss appears 2+ times, often with one
plain entry and one case-variant tagged `variant/VERIFIED/HIGH` — and the
build pipeline's last-write-wins merge means whichever appears later in file
order silently overwrites the other, regardless of which is actually correct.

**Confirmed example matching Claude A's "current" case:**
The `current` (electricity) vs `current/Current` (ongoing/present) collision
is real — verified in the CSV. This proves `VERIFIED/HIGH` tagging is NOT a
safe automatic tiebreaker, since it can be correctly verified for the wrong
sense of an ambiguous English word.

**No auto-fix applied.** Report is for review only, per the established
Finding-A pattern (backup-first, report-before-fix).

---

## Report 2 — Double-Raka Cluster
**File:** `docs/double_raka_report.csv`

**Count confirmed exactly matching Claude A:** 833 entries, 832 tagged
`VERIFIED/HIGH`, 1 outlier not tagged (the `Sin··ding··a` / fever entry).

**Relationship to the cleanRakka fix (commit 9c108f0):** Confirmed Claude A's
read — that fix stopped `prepare-data.js` from stripping a raka during
compilation, but did not touch this pre-existing double-raka data. Removing
the stripping regex *unmasked* this rather than introduced it; these entries
were already double-raka in the source file before today's session.

**Why no auto-fix:** Since virtually the entire cluster (832/833) is tagged
VERIFIED/HIGH, we can't assume it's simple corruption — it could represent:
(a) a genuine double glottal stop in some words, (b) a duplicated-tagging
artifact from whatever process applied the VERIFIED/HIGH label, or (c)
straightforward corruption from a prior bad merge. We don't have grounds to
guess which, so this needs native-speaker review per entry (or at minimum
per pattern, e.g. "is `te··rik` for banana really meant to have two raka,
or was the VERIFIED/HIGH tag applied to a typo?").

---

## Recommended Review Process

1. **Native speaker passes through `docs/double_raka_report.csv` first**
   (smaller, more contained — 833 rows) — confirm intentional vs corrupted
   for a sample, which will likely reveal a clear pattern (e.g. "always
   corruption" or "sometimes intentional in word-initial position").
2. **Duplicate keys report needs case-by-case adjudication**, prioritizing
   high-frequency/high-risk words first (numbers, common verbs, classifiers)
   since those affect the most translations.
3. Once decisions are made, the actual fix (dedup + raka correction) should
   go through the same backup-first, tested-before-push pattern used for
   Finding A — I can prepare that script once decisions are made, the same
   way I did for `fix_clean_rakka.cjs`.

## File Ownership Note
Both reports are read-only CSV outputs in `docs/` (Claude B territory).
`master_dictionary.json` itself was NOT modified — Claude A retains full
ownership and will make the actual fix once review decisions are in.
