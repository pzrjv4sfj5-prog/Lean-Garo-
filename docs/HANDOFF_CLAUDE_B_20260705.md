# CLAUDE B HANDOFF — 2026-07-05 — HEAD 038617f

## IDENTITY / ACCESS
Claude B: full read/write/push on https://github.com/pzrjv4sfj5-prog/Lean-Garo-
Live: https://lean-garo.onrender.com
Claude A: no push access, no persistent storage — ephemeral session clone only,
relays via user paste. Checked all 4 other remote branches (2026-07-05): all
stale (May/June), nothing recent from Claude A.

## SETUP (unchanged from prior handoffs)
```bash
git clone https://github.com/pzrjv4sfj5-prog/Lean-Garo- lean-garo && cd lean-garo
git config --global commit.gpgsign false
git config --global user.email "pzrjv4sfj5@privaterelay.appleid.com"
git config --global user.name "pzrjv4sfj5-prog"
PAT=<see prior session notes / ask user for current PAT — do not commit it>
git remote set-url origin https://pzrjv4sfj5-prog:${PAT}@github.com/pzrjv4sfj5-prog/Lean-Garo-.git
npm install
```

## VERIFY STATE (replaces manual resume-test scripts — always use this)
```bash
npm run build   # runs prepare-data + dict tests + regression suite (30 tests) + vite build
```
All future sessions: run this before AND after any change. It fails loudly
on regression — no more hand-written /tmp scripts.

## COMMITS THIS SESSION (f6edcf8 -> 038617f)
1. **4628ef8** — 261 raka violations fixed at source (dak/kat/dong/nam roots
   never carry raka, Rule 1) across master_dictionary.json, garo_dictionary.json,
   doc7_entries.json, final_entries.json, sentences200.json. compiled_dict.json
   is a build artifact — never edit it directly, edits get overwritten by
   `npm run build`'s prepare-data.js step.
2. **108918c** — CRITICAL grammar correction from new Thangseng notes
   (docs/GRAMMAR_NOTES_JAHA_MANAHA_20260703.md): `-jaha` is NOT past negation,
   it's discontinuation ("stopped X-ing"). New suffix `-manaha` = completed
   action. Relabeled 12 corrections.json entries, rewrote Rule 17, added
   Rule 25 in docs/THANGSENG_RULES_LOOKUP.md.
3. **a38749b** — Wired jaha/manaha into free-form grammar-assembly (not just
   corrections.json exact match). Replaced `gija`-as-negation with `ja`
   (Rule 1) at all 3 negation call sites — Rule 18 says gija is a verbal
   adjective, not a negation marker. Added chim/pastcont pattern detection
   ("used to VERB", "was/were VERBing").
4. **4f39052** — Doc consistency audit: fixed a stale Rule 18 table row Claude
   A's original fix missed, added superseded-notice headers to 2 historical
   handoff docs so they don't mislead future readers.
5. **e80a6a6** — Engine verification fixes: `chim` full-root-append exception
   (was stripping like a normal suffix, now correct `Cha·achim`), `pastcont`
   changed from fused `engachim` to correct two-word `[progressive] chim`
   form (also fixed a silent-drop bug on pre-inflected irregulars), fixed
   `eaten` raka inconsistency, implemented `tryWithoutGijaConstruction()`
   (Rule 18's actual positive construction — "without VERB-ing" → stem+gija
   + main verb — had never been implemented generally, only one confirmed
   sentence worked via corrections.json).
6. **038617f** — Consolidated all regression checks into
   `tests/unit/translationEngine.test.js` (30 tests), wired `npm test` into
   `npm run build`.

## CURRENT GRAMMAR BASELINE (see docs/THANGSENG_RULES_LOOKUP.md for full 26 rules)
- `-ja` = present negation (confirmed, safe default negation fallback)
- `-jaha` = discontinuation ("stopped X-ing") — NOT past negation
- `-manaha` = completed action ("has eaten"/"finished") — relationship to
  `-aha` (Rule 2, also past/perfect) UNRESOLVED, do not consolidate
- `-jawa` = future negative
- `gija` = verbal adjective ("without doing"), needs a governing main verb —
  NOT a negation marker (was misused as one until a38749b)
- `chim` = discontinued past, full-root-append exception like `ha`
- `pastcont`/`engachim` = realized as two words: `[progressive] chim`
- **No confirmed suffix exists for true simple past negation** ("did not
  eat", never happened) — `i did not eat` currently resolves to `Anga Cha·ja`
  (present-negative fallback) rather than confidently-wrong output. This is
  intentional, not a bug.

## OPEN ITEMS (unchanged, still need Thangseng)
1. Does `-manaha` replace `-aha` for past/perfect, or are both valid in
   different contexts? (Rule 25 outstanding item 2)
2. Is `Angade cha·manaha` ("I have already eaten") correct? Thangseng himself
   flagged tentative — not added as a confirmed correction.
3. Is there a suffix for true simple past negation? None confirmed yet.
4. "You drink/go/come/sleep" bare 2nd-person statement — valid, or different
   construction needed? Engine currently returns imperative forms.
5. Classifiers above 10 for `jol` (bamboo) — unverified ("ge chi·sa"=11?).

## STILL BLOCKED
- ReverseTranslator.jsx (Garo→English): no reverse dictionary source
  acquired yet. See docs/PENDING_reverse_translation.md. No code exists for
  this yet — nothing to wire.

## FILE OWNERSHIP (unchanged, though Claude B has crossed into Claude A's
files repeatedly this session out of necessity — Claude A had no push
access and ran out of tokens partway through). Going forward, prefer letting
Claude A propose engine/data diffs when available; implement directly only
when Claude A is unavailable/out of tokens, as has been the pattern.
- Claude A: src/translationEngine.js, src/garo_classifier.js,
  src/number_engine.js, src/gemini.js, server.js, src/data/phrase_maps.js,
  src/data/corrections.json, master_dictionary.json, src/compiled_dict.json
  (generated, don't edit directly), garo_dictionary.json
- Claude B: src/pages/, src/components/, src/App.jsx, vite.config.js,
  public/_redirects, docs/, tests/

## NEXT RECOMMENDED STEPS
1. Get Thangseng answers to the 5 open items above, apply via corrections.json
   relabeling / new Rule additions (same pattern as 108918c/4f39052).
2. If/when a reverse dictionary source is acquired, unblock ReverseTranslator.
3. Keep extending tests/unit/translationEngine.test.js with every new
   confirmed sentence — it's now the enforced source of truth.
