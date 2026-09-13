# Segregation Summary

Dictionary hash: `9aff8a3fb1786177ef2902a0a8148c0702029182`  
Record count: **10180**  
Generated: single full pass, 21 batches of 500.

## Working schema for this run (Claude D's own, not verbatim repo text)


**Type**: WORD (1 English word) / PHRASE (2-4 words, no terminal punctuation) / SENTENCE (5+ words or ends in `.`/`!`/`?`).

**Class**: A = needs Claude A (linguistic adjudication) · B = mechanically clean, no action · C = rule candidate (cites a RULE-xxx, verified_high) · D = duplicate/conflict, mechanical (case-only, raka-only, exact dup, missing field) · E = engineering/runtime cross-layer mention · UNRESOLVED = has a flag but doesn't cleanly fit A/B/C/D/E.

**Discrepancy codes**:
- D1: same English key, 2+ genuinely distinct (non-raka-variant) Garo forms
- D2: same Garo form, 2+ distinct English glosses
- D3: exact duplicate record (identical normalized english+garo)
- D4: notes say SUPERSEDED but `confidence` field doesn't read `superseded` (or vice versa)
- D5: case-only duplicate English key (e.g. "Boy" vs "boy")
- D6: raka/orthography-only Garo variant under the same English key
- D7: 2+ records tagged `verified_high` for the same English key (real compile-time tie)
- D8: notes explicitly flag an unresolved tension/contradiction (regex: not reconciled / flagged / tension / open question / unresolved / contradict)
- D9: missing english or garo field
- D10: notes reference a cross-layer runtime/compile artifact (compiled_dict / phrase_maps.js / corrections.json / pickPrimary / "runtime")

**Priority**: P0 = D10 + notes suggest it's currently live/shipping wrong · P1 = D7 (real compile tie) · P2 = D1/D2/D4/D8 · P3 = D3/D5/D6/D9 (cosmetic/mechanical).

## Class counts

- A: 7194
- B: 2754
- C: 41
- D: 49
- E: 25
- UNRESOLVED: 117

## Type counts

- WORD: 4307
- PHRASE: 4321
- SENTENCE: 1552

## Priority counts

- P0: 17
- P1: 162
- P2: 7157
- P3: 47

## Discrepancy code counts

- D1: 3833
- D10: 188
- D2: 5441
- D3: 307
- D4: 215
- D5: 3678
- D6: 289
- D7: 162
- D8: 996

## Scope note

This is a full-file mechanical pass — every record classified against the whole-dictionary index. It does NOT constitute linguistic adjudication of any D1/D2/D7 conflict; those are routed Class A for Claude A. Nothing in master_dictionary.json was modified.
