# PENDING — Two native speakers gave different forms for same sentences

Date: 2026-06-29
Status: CLOSED, 2026-08-04 — see resolution at bottom (NV-057)

## Discrepancies found

### 1. "who gave you this?"
- **Thangseng:** `Sawa nang'na iako on'aha?`
- **Alia:** `Sawa nang'na iako on'a?`
- Difference: `on'aha` (past, "gave") vs `on'a` (present/root, "gives/give")
- Currently live: Alia's version (`on·a`)

### 2. "why did you come?" — RESOLVED ✅
- **Thangseng:** `Na'a maini gimin re'baaha?`
- **Alia:** `Na'a maini gimin re'baa?`
- **Confirmed (Thangseng, 2026-06-29): "Both can work."**
- Both `re·baaha` and `re·baa` are valid past forms — register/style variation, not an error.
- Currently live: `re·baa` (Alia's shorter form) — acceptable, no change needed.

### 3. "i have two dogs" — MATCHES, no discrepancy
- **Thangseng:** `Ango achak mang'gni donga`
- **Alia:** `Ango a.chak manggni donga`
- Same answer, minor spelling/spacing only. Confirmed correct as-is.

## Question for native speakers
Is this:
(a) A genuine register/dialect variation (both correct, different contexts)?
(b) A precision difference (one speaker simplified, other was more exact)?
(c) An actual error by one speaker?

Need explicit confirmation before treating either form as final.

## Current live state
Both "who gave you this" and "why did you come" currently show Alia's
shorter forms. Pending confirmation, these are NOT to be treated as
fully verified — flag in any future audit.

## CLOSED, 2026-08-04 (Claude A) — NV-057, direct native confirmation, 2026-06-30

Thangseng, asked again the day after (both questions together, "who
gave you this" = on'aha/on'a and "why did you come" = re'baaha/re'baa):
*"both works depending on how you use it. But it may be better to
remove 'ha'. Let's just say re'baa and on'a."*

Resolves item 1 (the only genuinely open one): `on'aha` and `on'a` are
both grammatically valid (register/style variation, not an error, same
pattern as item 2's `re'baaha`/`re'baa`), with the shorter form
recommended — matching what's already live. All three items now fully
resolved:
1. "who gave you this?" — both valid, `on'a` confirmed/preferred. VERIFIED/HIGH.
2. "why did you come?" — both valid, `re'baa` confirmed/preferred (already
   flagged resolved 2026-06-29, now doubly confirmed). VERIFIED/HIGH.
3. "i have two dogs" — no discrepancy, confirmed correct as-is.

No changes needed to `corrections.json` (already on the recommended
short forms). Added/updated two `master_dictionary.json` entries with
full citation. Doc closed.
