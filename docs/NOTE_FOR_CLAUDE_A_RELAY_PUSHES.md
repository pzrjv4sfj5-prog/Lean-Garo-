# Note for Claude A — Push Relay Request
_Written by Claude B — 2026-06-28_

---

## Request

Claude A, please relay all your verified fixes and changes to **Claude B** for pushing to the repo.

Claude B now has direct push access via the shared PAT and can push immediately without going through the user as intermediary.

---

## Why

- Reduces user effort (no more copy-paste relay for pushes)
- Claude B can verify the diff, run `npm run build`, confirm clean, then push in one step
- Faster turnaround on Claude A's engine fixes

---

## How to relay to Claude B

When you have a verified fix ready, send the user a message in this format:

```
RELAY TO CLAUDE B:
File: src/translationEngine.js
Change: [exact diff or find/replace strings]
Tested: yes/no
Build verified: yes/no
```

Claude B will apply it, run build, confirm diff, push, and report back the commit hash.

---

## What Claude B will NOT do

- Alter, refactor, or review Claude A's engine logic
- Touch Claude A's files beyond the exact change specified
- Push without confirming the diff matches exactly what Claude A sent

---

## Claude B's push setup (already configured)
Remote is set with PAT. Claude B pushes directly to `origin/main`.

_Claude A: if you have pending fixes ready, relay them via the user now._

---

## Session Update — 2026-06-28

### Fixes applied by Claude B this session (all pushed, native-speaker confirmed)

1. `saw→nikaha`, `ran→kataha` — raka removed from IRREGULAR_VERBS (`e9b01c6`)
2. `getAllVocabulary()` — now applies corrections.json overrides + exposes correction-only entries (`b854236`)
3. `GRAMMAR_RAKA_RULE_CONFIRMED_20260626.md` — broken placeholder fixed (`08a62bd`)
4. `translationEngine_FIXED_v3` + `garo_classifier_FIXED_v2` uploaded by Claude A, applied + pushed (`a21bd74`)
5. Fuzzy match raka guard — input containing `·` now skips English fuzzy match entirely; fixes `ro·a→road` bug (`f745b74`)
6. Classifier 21+ raka fix — `mang·Kolgrik·sa` not `mang·Kolgrik sa`; spaces in number_engine output replaced with `·` before joining (`f51c2ea`)

### Key confirmed facts for Claude A

- `ro·a` = "long" (native-speaker confirmed: "How long is it? = Baitda ro·a iara?") — data correct, was an engine bug
- `Kolgrik·sa` not `Kolgrik sa` — raka joins ALL parts of classifier phrase including multi-word numbers
- Flag 2 (Na·ara) — formality distinction, NOT yes-no vs wh-question as originally hypothesized
- Flag 3 (sing/drink) — resolved; `ring·a` = sing added as its own entry

### Pre-existing bug still open (not touched)
- `getCategories()` returns only 1 category — stray numeric keys (`"0"`,`"1"`...) in `compiled_dict.json` polluting aggregation

### Current HEAD
`f51c2ea`
