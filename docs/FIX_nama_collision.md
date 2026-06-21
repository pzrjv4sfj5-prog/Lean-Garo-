# "Nama" (good) — Duplicate-Key Collision Fixed
_Found via user correction — 2026-06-20_

## What happened

User flagged: `Nama` (good) was showing up with raka in some outputs —
specifically `"this is good"` → `"nam·a"` (wrong).

## Root cause — same pattern as the "current" bug fixed in 5157256

`master_dictionary.json` has the exact same case-variant duplicate-key
collision pattern Claude A already found and fixed once:

```
"good" -> "Nama"          (no raka, correct)
"Good" -> "nam·a"         (has raka, WRONG — tagged variant/VERIFIED/HIGH)
```

Case-insensitive last-write-wins merge means the corrupted `Good`→`nam·a`
entry silently overwrote the correct one in `compiled_dict.json`. This is
now the **second confirmed instance** of "VERIFIED/HIGH tag attached to a
wrong form" — first was `current`, now `good`. Strengthens the case that the
1,055-group duplicate-key report (`docs/duplicate_keys_report.csv`) likely
contains more of these, not just isolated incidents.

## Native speaker confirmation

Asked directly rather than assumed (initially guessed the `cha·a`/`re·a`
pattern might apply — it doesn't):
- `Nama` (standalone "good") = **no raka**, stays exactly `Nama`
- `It is good` = `Ia nama` (also no raka)
- The raka in our existing `nama·gija` ("not good") entries is correctly
  placed — it belongs to the `·gija` negation suffix boundary, not to
  `nama` itself. That existing entry was already right.

## Fix applied
Via `docs/fix_nama_collision.cjs`, added to corrections.json (tested,
verified, then reverted before commit since this is Claude A's file):
```
"good"          -> "Nama"
"it is good"    -> "Nama ong·a"
"this is good"  -> "Ia nama"
```

## How to apply
```bash
node docs/fix_nama_collision.cjs
npm run build
git add src/data/corrections.json
git commit --no-gpg-sign -m "fix: good/nama duplicate-key collision (same pattern as current fix)"
git push origin main
```
Tested: Added 3, skipped 0.

## Broader implication
This is now a clear pattern: **`VERIFIED/HIGH` tag does not guarantee
correctness** — it can be confidently wrong, attached to the corrupted
case-variant rather than the clean original. Worth keeping this specific
risk in mind when eventually working through the full duplicate-keys
report — don't auto-prefer `VERIFIED/HIGH` as a tiebreaker without
spot-checking, exactly as flagged in the original audit summary.
