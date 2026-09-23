# Claude A Session Migration — 2026-09-23B

Continuation of the same 2026-09-23 session (see
`docs/CLAUDE_A_SESSION_MIGRATION_20260923.md` for the first half:
resync, page-96 `Jak..` worked-example split). This doc covers the
second half: the "cook" engine-layer bug, the page-92/94 vocabulary
batch, a parallel fix by Claude B, and two Project Owner typo
corrections — through to this session's actual close.

---

## "cook" bug — full account

**Report (Project Owner, direct chat):** `cook` was resolving to
`Song·timgipa` in the translator; should be `Song·a` (to cook, v.).

**Root cause, two layers:**
1. **Content layer** (`master_dictionary.json`, and the same
   contamination in the legacy `garo_dictionary.json`): the bare
   `Cook`/`cook` English key collided two distinct senses — the
   agent-noun "a cook" (person who cooks, `Song·timgipa`) and the
   verb "to cook" (`song·a`/`Song·a`) — under one ambiguous headword,
   with two tied VERIFIED/HIGH candidates. `pickPrimary` was
   arbitrarily tie-breaking to the noun sense.
2. **Runtime-override layer** (`src/data/corrections.json` and
   `src/data/phrase_maps.js`): both files hardcoded `"cook":
   "Song·timgipa"`, which would have kept shipping the wrong sense
   even after the content-layer fix, since correction-table lookups
   supersede dictionary lookups entirely.

**Fix:**
- Split the master-dictionary entries: `a cook (person who cooks)` =
  `Song·timgipa` (agent-noun sense, kept), `to cook` = `song·a`
  (verb sense, merged with the pre-existing `to cook` entry, which
  was promoted from unverified to VERIFIED/HIGH — corroborated by the
  extensive already-verified `song-` root paradigm: `Song·bo`,
  `Song·ahama?`, `Song·engama?`, `Song·ama?`, `Song·gen`, `Song·aha`,
  `Song·enga`). Same split applied to `garo_dictionary.json`.
  Bare `cook` now resolves via the bare-infinitive alias generator
  (`prepare-data.js`) rather than a direct tied entry.
- Updated `corrections.json` and `phrase_maps.js`'s `cook` overrides.

**Parallel fix, merged:** Claude B independently fixed the same
runtime-layer bug this session (same Project Owner directive,
delivered to both agents), patching only `corrections.json` →
`Song·a` (capitalized), citing `.ai/PROJECT_OWNER_AUTHORITY.md`, and
allowlisting the divergence from `compiled_dict.json`'s own pick in
`known_cross_source_conflicts.json` (Check F, `corrections:cook`).
Merge conflict in `corrections.json` (my lowercase `song·a` vs.
Claude B's capitalized `Song·a`) resolved to **`Song·a`**
(capitalized) — matches the Project Owner's literal wording, Claude
B's citation, and the dominant capitalized `Song·` paradigm.
`phrase_maps.js` synced to the same casing (Claude B's commit hadn't
touched that file). Claude B's Check F allowlist entry kept as-is:
the divergence between `corrections.json` (`Song·a`) and
`compiled_dict.json`'s own `cook` key (`song·a`, lowercase, via the
bare-infinitive alias) is now case-only rather than a different word,
but still technically present, so the entry's rationale still holds.

**Live-verified post-fix:** `cook` → `Song·a` (correction layer,
confidence 1), `to cook` → `song·a` (dictionary layer, VERIFIED/HIGH),
`a cook (person who cooks)` → `Song·timgipa` (unchanged, correct noun
sense), `do you know how to cook` (unrelated sentence-level
correction) unaffected.

**No runtime/engine files touched.** Confirmed via diff: this
session's changes are entirely within `master_dictionary.json`,
`garo_dictionary.json`, `src/data/corrections.json`,
`src/data/phrase_maps.js`, `src/data/known_dictionary_conflicts.json`,
`src/data/known_cross_source_conflicts.json`, and the
`prepare-data.js`-generated compiled outputs. `translationEngine.js`,
`lookupEngine.js`, `morphologyEngine.js`, `grammarEngine.js` — no
diff.

---

## New vocabulary — pages 92/94 (18 words total this session)

Project Owner direct submission, print dictionary pages 92 and 94.
16 added in the first batch, 2 more added after typo corrections:

**Added (18):**
- short of hearing (adj.) → Nagok
- betelnut → Gue (coexisting variant of existing Gua, not merged)
- to play hide and seek (v.) → Guguka
- rogue, notorious person (n.) → Gunda (coexisting variant of
  existing 'rogue'=mat·te, not merged)
- a mare (n.) → Gure bima
- a mule (n.) → Gure kotchol
- a colt (n.) → Gure bi·sa — **typo-corrected**: originally submitted
  as "Gure Bi.sa = A cold"; flagged in this session as a likely
  mismatch (compositional evidence: `bi·sa` = "young of X" is an
  extremely well-established pattern elsewhere — achak bi·sa=puppy,
  matchu bi·sa=calf, dobok bi·sa=kid-goat); Project Owner confirmed
  it's "a colt", not "a cold". Added once confirmed.
- perhaps, probably, may be — an expression of doubt (adv.) → Haida
  [Project Owner flagged for careful use by the translator/Claude
  B — a discourse/modal particle; not wired into any grammar-assembly
  default or phrase_maps/corrections override this session]
- this side, this way (adj.) → Iachioak (coexisting variant of
  existing VERIFIED/HIGH 'here (towards/this side)'=Iachi)
- here it is (excl.) → Iake
- this and that, also (pr.) → Iaba uaba (coexisting variant of
  existing 'this and that'=nang·a·nang·ja, not merged)
- the same, no change → Ian bae bae (coexisting variant of existing
  'Same, no change'=Bae bae, not merged)
- this time (adj.) → Ianpako
- account (n.) → Hisab (coexisting variant of existing 'account'=
  Chanani, not merged)
- diamond (n.) → Hira
- Hilsa fish (n.) → Hilsa Na·tok
- snoring (n.) → Hirgok

**Not added, already fully covered on file (checked, not
duplicated):**
- 'Horse'=Gure (already idx 85/2132; VERIFIED/HIGH primary go·ra
  ships unchanged)
- 'Turmeric'=Holdi (already idx 500; VERIFIED/HIGH primary hol·di
  ships unchanged)
- 'garbage, rubbish'=Jabol (already idx 8296, same value/overlapping
  gloss)
- 'mirror'=Janera (already idx 292, exact spelling match once Project
  Owner corrected an in-session transcription of "janara" → "Janera";
  VERIFIED/HIGH primary ai·na ships unchanged) — added a
  corroborating note to the existing entry only, no new row, no
  status change.

**2 new Check C self-consistency conflicts**, both allowlisted in
`known_dictionary_conflicts.json` citing this session: `account`
(Chanani/Hisab) and `to cook` (Song·a/song·a, case-only, see above).
**1 new Check C conflict** from the earlier page-96 half of this
session (`arm`: jak/Jakpong) was already allowlisted in that first
migration doc.

---

## Gate at close

- Dictionary: 8899/8899 (this half of the session started at 8881,
  after the page-96 split from the first migration doc; +18 unique
  keys this half — 16 from the pages-92/94 batch, +1 for 'a colt'
  once confirmed, +1 from the cook split's promoted/merged 'to cook'
  interacting with the bare-infinitive alias; 'mirror'/Janera was not
  a new key, already on file)
- Grammatical corrections: 9/9
- Unit tests: 458/458
- Repository-intelligence: 0 new violations (4 total new
  allowlisted-conflict entries this session: arm, account, to cook,
  plus Claude B's corrections:cook Check F entry)
- Live-verified via `translate()`: every new/changed key this
  session, listed inline above and in the prior migration doc

---

## Runtime Handoff to Claude B

None outstanding. The one runtime-layer fix this session (cook
overrides) was resolved jointly via merge, both agents' changes
reconciled, gate green.

---

## Repository status at close

- HEAD: `2346d5e`
- `origin/main`: verified match via `git fetch` + `git rev-parse`
  (clean fast-forward at every push this session, one merge with
  Claude B's parallel commit resolved cleanly)
- `git status`: clean, no uncommitted changes
- No engine/runtime code touched this session (verified via diff
  against session start, see above)
- Native-validation status: no blockers surfaced this session

## Next Recommended Tasks (carried forward, unchanged)

1. Unsent Thangseng relay drafts, still pending Project Owner/Tridip
   relay: `docs/THANGSENG_RELAY_QUESTION_20260920.md`,
   `docs/THANGSENG_RELAY_QUESTION_20260920B.md`,
   `docs/THANGSENG_RELAY_QUESTION_20260920C.md`.
2. POS collision-set backfill (flagged 2026-09-21B, not started).
3. ~15 remaining `pickPrimary` verified-ties with no session-history
   evidence — see `docs/PICKPRIMARY_VERIFIED_TIES.md`. None urgent —
   every listed key already ships a genuinely VERIFIED/HIGH value.
4. `us`-accusative clusivity distinction remains unconfirmed pending
   the relay drafts above.
