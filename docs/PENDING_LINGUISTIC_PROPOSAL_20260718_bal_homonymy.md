# Pending Linguistic Proposal — `Bal` homonymy risk (flower/air/big-basket senses), surfaced by NV-019
_Logged: 2026-07-18 by Claude A_

## What happened
NV-019 asked whether `Bal` alone can mean "wind." Thangseng's answer:

> Wind is 'balwa'. The bal has a totally different meaning. It means
> load or burden.

This cleanly resolves NV-019 — `Bal` ≠ "wind," only `Balwa` is
correct. Logged in `src/data/pending_lexicon.json` (`PL-0000035`,
`review_status: rejected`), never promoted to `master_dictionary.json`.

## The bigger question this raises
The printed source's `Bal` headword listed six senses together: "A
flower, wind, air, a bundle, a load, a big basket." Three of these
(`a bundle`, `a load`, presumably the "burden" sense) are now directly
confirmed correct by Thangseng's answer. But three others — **flower,
air, and a big basket** — were never asked about, and Thangseng's own
phrasing ("a **totally different** meaning," not "also means") reads
like he's describing `Bal` as having one real meaning (load/burden),
not six. That's the same shape as the `Grika` precedent already in
this project's history: a printed dictionary headword compressing
multiple unrelated homonyms into one entry, where at least one listed
sense turns out to be simply wrong for that word, not a legitimate
extended meaning.

**These three senses are already live in `master_dictionary.json`**
(promoted in the page 18 batch, before NV-019's answer came back):
`"A flower" → "Bal"`, `"air" → "Bal"`, `"a big basket." → "Bal"`. I'm
not pulling them out unilaterally — Thangseng wasn't asked about them
directly, and it's possible `Bal` genuinely is that polysemous (short
roots covering several senses isn't unheard of in this language). But
the confidence level on these three should now be treated as lower
than it was yesterday, and they shouldn't be relied on for translation
output without a follow-up check.

## Recommended relay question (NV-020)
"Does `Bal` on its own ever mean 'a flower,' 'air,' or 'a big
basket' — or is `load`/`burden` really its only meaning, like you
said for the wind question?" Cheap, single question, resolves all
three at once.

## Disposition
- `Bal` = "load"/"bundle"/"burden": confirmed, stays in production.
- `Bal` = "wind": confirmed wrong, rejected, never promoted.
- `Bal` = "flower"/"air"/"big basket": **unconfirmed, live in
  production, flagged for follow-up.** Not reverted pending NV-020,
  but do not treat as settled.
