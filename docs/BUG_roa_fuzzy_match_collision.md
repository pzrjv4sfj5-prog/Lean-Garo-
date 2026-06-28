# BUG — `ro·a` as English input fuzzy-matches to "road"

**Reported:** 2026-06-28
**Filed by:** Claude B
**Owner:** Claude A (engine)

## Symptom
User typing `ro·a` as input → engine returns `so·rok` [fuzzy(road,d=2)]

## Root cause
`ro·a` is a valid **Garo** word (meaning "long") — it should never be
treated as English input. The fuzzy matcher has no language-detection
gate, so Garo words typed into the English field get matched against
English dictionary entries by edit distance.

## Confirmed correct data (do NOT change)
- `long` → `ro·a` ✅ (native-speaker confirmed: "How long is it? = Baitda ro·a iara?")
- `dance` → `Chroka` ✅
- `ro·a` is NOT a synonym for dance — that was a misread. It means "long."

## Expected behaviour
If input contains raka (`·`), it is likely Garo, not English — skip
fuzzy matching entirely or return a "this looks like Garo input" message.

## Workaround
None currently. Users who type Garo words into the English field get
wrong results silently.

## Suggested fix (Claude A)
Add a pre-check: if input contains `·`, bail out of English lookup
pipeline early. Optionally route to reverse translator once that feature
is built.
