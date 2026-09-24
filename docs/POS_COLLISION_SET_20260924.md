# POS collision-set — priority queue

Compiled 2026-09-24 (Claude A), per Next Recommended Task #2 from
`docs/CLAUDE_A_SESSION_MIGRATION_20260923C.md`: generate the list of
English keys with multiple senses across different parts of speech —
the "cook shape" (noun + verb on the same root, colliding under one
ambiguous headword) — as a priority queue for future disambiguation
work, since these are where `sentenceBuilder.js`'s POS signal (dead
per the `e?.pos === 'verb'` vs data's `'v.'` bug, flagged 2026-09-21B,
still open) would matter most if fixed.

**Method:** grouped `master_dictionary.json` by lowercased English
key; for non-superseded rows, collapsed `pos` to a broad category
(verb/noun/adj/adv/interj) and kept only keys where 2+ broad
categories are attested **with genuinely different Garo values**
(not just inconsistent POS labels on the same value — that's a
separate, lower-stakes tagging-hygiene issue, not a sense collision).

## Priority: noun/verb sense splits (the actual "cook shape")

| English key | verb sense | noun sense |
|---|---|---|
| demand | dabia | dabiani |
| hire | bara ra·a | bara |
| hope | ka·donga | ka·dongani |
| to blaze | ba·a | baka |

Live-checked via `translate()` (2026-09-24): all 4 currently resolve
the bare key to the **verb** sense at exact-phrase confidence
(demand/hope 0.98, hire/blaze 0.75 — the lower pair worth a second
look). None currently mis-resolve to the wrong sense the way "cook"
did — this is a documentation/priority-ordering pass, not an active
bug list. Recommend as the next disambiguation batch if/when
`sentenceBuilder.js`'s POS check is fixed (Claude B) and needs real
data to route against.

## Lower priority: adj/adv pairs (register variants, not sense splits)

| English key | adj form | adv form |
|---|---|---|
| at once / just / rightly | kakket | kakket makket |
| half. | brongrik | adha |

These are adjective/adverb pairs of the same underlying concept, not
distinct meanings — much lower collision risk than the noun/verb set
above. Not actioned.

## Excluded: label-only inconsistency, not a real collision

`a wearing apparel.` (n./-n.), `alas` (interj./int.), `bursting of a
dam` (vi./vt.), `last weeding of a jhum` (v./n., same Garo value
`Bamil rata` both times), `one who says yes to everything` (adj./n.),
`second` (v./n.), `thought` (n./-n.), `to cry`/`to endure`/`to
imagine`/`to lament`/`to last`/`to hurry up`/`to deride` (vi./v. or
v./v.&n. — same sense, inconsistent abbreviation only). These need a
POS-label cleanup pass eventually but carry no engine-routing risk;
not part of this priority queue.

No `master_dictionary.json` changes made compiling this list — report
only, per this session's scope.
