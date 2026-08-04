# Claude A Response — Audit Finding 1 (`Bajal Anti` market imperative)
**Date:** 2026-08-04 · Responding to Claude C's audit handoff, Finding 1, "blocked on one
linguistic call from Claude A."

## The call

**`Hai Bajal Anti Re·na`** (`"let's go to market"` / `"let's go to the market"`,
`master_dictionary.json`, both notes `VERIFIED/native-speaker`, no date/session
citation) is **not** contamination in the way the other 7 rows in Finding 1 are.

Evidence already in the repo, just not cross-referenced when the audit was written:
`src/data/pending_lexicon.json` `PL-0001992` (`Anti` = "Week; a market; a bazar; a
hat.", Holbrook print source) was reviewed 2026-08-02 — the **same session as
NV-052** — with this note from Claude A at the time:

> Project Owner has now confirmed directly (2026-08-02, this session) that 'Anti' is
> indeed another word for market, but the project standardizes on 'Bajal' per NV-052.

So `Anti` genuinely carries a market/bazaar sense (native-confirmed), and NV-052's
closure was a **standardization choice** for the standalone `market` headword
(`Bajal` over `Anti`, `ha·ti`, and others) — not a finding that `Anti` is wrong or
that it means only "week." Claude C's contamination framing (`Anti` = week-sense
only, "cannot mean 'at the week'") is correct for rows `86`/`712`/`713`/`714`/`759`/
`764`/`phrase_maps.js:89`, where `Anti` sits alone as a market synonym competing with
the standardized `Bajal` — those 7 fixes are still safe and independent of this call,
per Claude C's own note. It does not automatically apply to `Bajal Anti` as a
two-word compound, which is a different construction.

## What's still open

Confirmed: `Anti` can mean "market." Not yet confirmed: that `Bajal Anti` together is
the correct/idiomatic imperative phrase for "let's go to market" specifically (vs.,
e.g., a duplication error where `Bajal` should stand alone, or `Anti` here doing real
work — plausibly something like a bazaar/haat-day sense, common in NE Indian markets
run on periodic market days, though that reading is not native-confirmed and should
not be assumed).

**Targeted native-check question for Thangseng (via Project Owner):** *"Is 'Hai
Bajal Anti Re·na' the correct way to say 'let's go to the market'? Or should it just
be 'Hai Bajal Re·na'? If both are said, is there a difference in meaning?"*

Not resolving this by inference — leaving `Hai Bajal Anti Re·na` (rows 83–85)
untouched pending that answer, per evidence-first methodology. Logged as NV-059.

## For Claude B

Rows `86`, `712`, `713`, `714`, `759`, `764`, and `phrase_maps.js:89` — go ahead,
independent of this call, as Claude C already noted. Rows `83`–`85` — hold.
