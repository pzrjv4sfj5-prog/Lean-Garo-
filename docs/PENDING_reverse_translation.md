# PENDING — Garo→English Reverse Translation (3-way: EN→Garo→EN)
_Status: BLOCKED — waiting on user to acquire a proper Garo dictionary source_
_Opened: 2026-06-20 by Claude B, scoped jointly with Claude A's territory_
_Do not start implementation until the user unblocks this._

---

## Goal
Make the platform bidirectional: currently English→Garo only. Add Garo→English,
so the existing translator becomes a true 2-way (eventually 3-way framing:
English↔Garo, with English as the pivot/display language) tool.

## Why this is blocked right now
User is planning to acquire a proper Garo dictionary resource before we build
this. Reason, confirmed by our own investigation below: our current data is
not reliable enough to reverse cleanly. Building reverse-lookup on top of the
current `compiled_dict.json` would bake in known ambiguity and corruption
(see Findings section). Better to wait for better source data than build
something fragile now.

---

## Findings From Initial Feasibility Check (2026-06-20)

### Reverse-ambiguity in compiled_dict.json (4,026 unique Garo forms)
**915 of 4,026 (22%) map back to more than one English phrase.** Examples:
```
"sa"      <- ["1", "one", "the one"]        (benign — numeral variants)
"gni"     <- ["2", "two", "the two"]        (benign)
"chiking" <- ["10", "ten", "the ten", "structure"]   (NOT benign — real ambiguity)
```
Some ambiguity is harmless (numeral phrasing variants that mean the same
thing), but some is genuine conflict requiring disambiguation logic or
multiple-choice output.

### Reverse-ambiguity in corrections.json (332 native-verified entries — much cleaner)
**Only 30 of 296 unique Garo outputs (10%) are ambiguous**, and these are
mostly benign synonym/singular-plural pairs:
```
"tangka" <- ["rupee", "rupees"]
"do·o"   <- ["bird", "birds"]
"mande"  <- ["people", "person"]
```
This smaller, higher-quality dataset would be a much safer starting point
than the full compiled dictionary — but is also far too small (332 entries)
to be a useful general-purpose reverse translator on its own.

### Architectural gap
`src/translationEngine.js` currently has **zero reverse-translation
infrastructure** — no `reverseTranslate()` function exists. The whole engine
(`analyzeGrammar`, `applyTense`, classifier logic) is built assuming
English-in, Garo-out. Reverse direction isn't just "flip the dictionary" —
Garo input needs its own parsing:
- Strip/recognize suffixes (`-aha` past, `-enga` progressive, `-gija`
  negation, `-bo` imperative, `-ma` question marker)
- Recognize classifier prefixes (`mang-`, `sak-`, `king-`, `gong-`)
- Handle raka (·) correctly as part of root words, not as noise

This is a meaningfully different engineering problem than what exists today,
not a quick reuse of current logic.

---

## Proposed Phased Approach (once unblocked)

### Phase 1 — Exact-match reverse lookup (corrections.json only)
Smallest, safest starting point. If Garo input exactly matches a known
correction value, return the English key. Ships fast, very low risk of
wrong output since every entry is already native-verified.
**Owner:** Claude A (engine logic) — new `reverseTranslate()` function.

### Phase 2 — Fuzzy/normalized reverse lookup (compiled_dict.json)
Extend to the larger dictionary, with:
- Normalization (case, whitespace, raka variants)
- Disambiguation strategy for the ambiguous 22% — likely: return most
  common one first, with reasonable design for showing alternates "translate as one / the one / 1" instead of guessing wrong
**Owner:** Claude A (engine), Claude B (UI for showing alternates if needed)

### Phase 3 — True morphological parsing
Detect and strip Garo suffixes/prefixes algorithmically (mirroring the
English→Garo `applyTense`/classifier logic, but reversed), so novel Garo
sentences (not just exact dictionary matches) can be parsed.
**Owner:** Claude A — significant new engine work, probably the bulk of
this whole feature.

### UI work (any phase, once engine returns something to display)
- Add a language-direction toggle/swap button to `Translator.jsx`
- Update input/output labels dynamically (English↔Garo swap)
- Possibly show "did you mean" alternates for ambiguous reverse matches
**Owner:** Claude B — `src/pages/Translator.jsx`, `src/App.jsx` if nav
needs updating.

---

## What Triggers Unblocking This
User acquires a proper Garo dictionary source. When that happens:
1. New dictionary needs the same audit treatment as our existing sources
   (dialect tagging, raka consistency, duplicate-key check) — same pattern
   established in this session's audit work (`docs/DUPLICATE_AND_RAKA_AUDIT_SUMMARY.md`,
   `docs/DOUBLE_RAKA_RESOLUTION.md`) — before being trusted as reverse-lookup
   source data.
2. Re-run the ambiguity check above against the new data to see if the 22%
   problem improves.
3. Then kick off Phase 1 with Claude A.

---

## File Ownership for This Feature (once started)
```
Claude A: src/translationEngine.js (reverseTranslate function, morphological
          parsing), new dictionary integration into compiled_dict.json
Claude B: src/pages/Translator.jsx (direction toggle UI), src/App.jsx
          (if nav changes needed)
```

---

_Claude B — Platform Side_
_Status: PENDING — revisit when user has new dictionary source ready_
