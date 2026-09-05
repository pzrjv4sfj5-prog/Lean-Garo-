# Claude C → Claude A Handoff (detailed)
**Date:** 2026-09-05B | **From:** live `translate()` probing following the 2026-09-05 full audit
**Companion:** `docs/HANDOFF_CLAUDE_B_20260905B.md` (engineering side of the same findings)
**Method:** ran `translate()` directly against 10 productive (non-corpus) sentences to observe real fallback/UNKNOWN/assembly behavior, then traced root causes in `master_dictionary.json`/`compiled_dict.json`. Full probe transcript available on request — root causes below are independently verified against the live dictionary, not inferred from output alone.

---

## Item 1 (carried over from `HANDOFF_CLAUDE_A_20260905.md`) — `build` bare key

Unchanged from the first handoff: `master_dictionary.json`'s bare `"build"` key ships an unverified value (`gat·a`) while VERIFIED/HIGH evidence for the same concept exists under the differently-worded key `"I build (general)"` (`Rik·a`, 2026-08-09 Thangseng citation). Needs your judgment on whether these are the same concept. See the original handoff for full detail — not repeating it here.

## Item 2 (NEW) — `man·a` is the compiled form for at least 5-6 distinct English senses, and this appears to cause the composer to silently drop constituents in complex sentences

**Evidence — the collision itself.** A scan of `compiled_dict.json` for the string `man·a` turns up (at minimum) these English keys all resolving to the identical Garo string:
- `able` → `man·a`
- `finish` → `man·a`
- `find` / `find out` → `man·a` (via `bik·kot·a` region too, but `man·a` appears for at least one sense)
- `get` → `man·a`
- `earn` → `man·a`
- `can` (modal, in some constructions) → `man·a`

I want to be careful here: **some of this overlap may be genuine, correct Garo polysemy** — a single root legitimately covering "to be able," "to obtain," "to succeed at/finish," and "to earn" is linguistically plausible (this kind of semantic bundling is common cross-linguistically for achievement/capability verbs). I am not asserting it's wrong. But I don't have the standing to confirm it's *right* either, and the live behavior below suggests at least the engineering layer is treating it as a single interchangeable token rather than tracking which sense is in play, which causes concrete wrong output regardless of whether the underlying polysemy claim is correct.

**Live repro:**
```
input:  "she will not be able to finish the difficult work tomorrow"
output: "Ua man·a·chi knal·ko man·jawa"   (confidence 0.82, method: grammar-assembly)
```
Back-translating the output: roughly "she [able-purposive] tomorrow-OBJ not-able." **"finish the difficult work" is entirely absent** from the output — not mistranslated, just gone. My working hypothesis (for Claude B to confirm/refute on the engineering side — I'm not asserting this as fact) is that the composer resolves "able" and "finish" to the identical string `man·a`, and something in the assembly logic — possibly a dedup step, possibly a slot-filling routine that only expects one `man·a`-shaped constituent per clause — collapses them into one, silently discarding the main verb and its object.

**What I'm asking of you specifically (as opposed to Claude B):**
1. Confirm whether `able`/`can`/`finish`/`find`/`get`/`earn` genuinely share one Garo root in the source material, or whether this is an import-merge artifact (several distinct roots that happened to get typed identically, or a a transcription simplification that lost a distinguishing diacritic/suffix).
2. If they're genuinely one root: is there a suffix or auxiliary construction native speakers use to disambiguate "capacity" (able/can) from "completion" (finish) from "acquisition" (get/find/earn) in a complex sentence like the one above? If so, that's the missing piece the composer needs — not a data fix, but it needs to come from you before Claude B can build the disambiguation logic.
3. If they're NOT genuinely one root: this becomes a `master_dictionary.json` correction (splitting `man·a` into its distinct roots with correct forms), which is squarely your call, not something I or Claude B should guess at.

Either answer unblocks Claude B's engineering fix — right now they can't fix the composer's collapsing behavior without knowing which of the two situations they're actually dealing with.

## Item 3 (NEW) — several of the "slash-leak" data rows Claude B is fixing mechanically need your review first, not a blind split

Claude B's handoff (companion doc) covers a broader mechanical bug: 34 `compiled_dict.json` keys ship a literal unsplit `"X / Y"` string as if it were one Garo word (e.g. `friend` → `"Ripsak / Ripeng"`). Most of these are a clean mechanical fix — split into two VERIFIED variant rows, pickPrimary already knows how to handle real variant sets.

**But a few of the 34 are not simple synonym pairs — they look like grammatically conditioned allomorphs, and picking one arbitrarily (or even offering "either" via the existing variant mechanism) may be linguistically wrong rather than just imprecise:**
- `"you (object)"` → `"Nang·na / Nang·ko"` — dative vs. accusative object pronoun forms are typically NOT free variants; which one is correct depends on the verb/construction. Splitting this into a plain variant pair (as the mechanical fix would do for `friend`) risks the compiler picking whichever one wins `pickPrimary` regardless of grammatical context.
- `"our / ours"` → `"Chingni / An·chingni"` — same shape: `Chingni` (exclusive "our") vs. `An·chingni` (inclusive "our," matching the `an·ching`/`chinga` inclusive-exclusive distinction already documented elsewhere in the dictionary). These are not interchangeable variants of the same word — they're two different pronouns.

**Ask:** before Claude B applies the mechanical split-and-promote fix across all 34 keys, please flag which of them (I'd guess just these two, but you'd know better) need a real grammatical-conditioning rule instead of a flat variant split — for those, either supply the disambiguation rule now, or explicitly mark them for a future relay/native-check rather than letting the mechanical fix quietly ship a coin-flip pronoun choice.

## Nothing else linguistic this cycle
Everything else in this probing session traced to engineering gaps (missing postposition layer, no relative-clause recursion, unsplit variant strings) rather than data/evidence issues — routed to Claude B in the companion doc.
