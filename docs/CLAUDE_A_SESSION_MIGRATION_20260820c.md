# Claude A Session Migration — 2026-08-20 (c)

## Project identity
Lean-Garo — Garo language dictionary and English-to-Garo translation
engine. Repo: `github.com/pzrjv4sfj5-prog/Lean-Garo-`. This session
operated as **Claude A** (linguistic authority — grammar/morphology/
dictionary quality/native validation review). Did not touch engine
architecture or OCR ingestion beyond one scoped runtime bugfix (see
below).

## Repository status at close (verified against actual repo, not memory)
- HEAD: `df6f83e0b9ba187472386c933a09d8e31a558e05`
- origin/main: `df6f83e0b9ba187472386c933a09d8e31a558e05` — **matches HEAD exactly**
- `git status`: clean, no uncommitted changes
- `git fetch` run immediately before this doc was written — no unseen remote commits
- No local-only commits
- `WORKSTATE.yaml`: not modified this session (last touched by Claude B, commit `8162fdc`) — verify it's current before next session's task per Rule 10
- `SESSION_BOOTSTRAP.md`: not modified this session
- This migration doc: complete as of this commit
- Native-validation/blocker status: see "Held" section below — nothing blocking, all pending items are queued for next Thangseng relay batch

## Full gate — all green at HEAD
- `node prepare-data.js`: 8132 unique entries compiled, 0 errors
- `node test-dictionary.js`: 8132/8132 valid entries, 9/9 grammatical corrections, JSON compliance ✅
- `node --test tests/unit/*.test.js`: 218/218 pass
- `node repository-intelligence.js`: 0 new violations (Checks A–F all clean; 11 raka-locality candidates remain report-only, pre-existing, not asserted as bugs)
- `node scripts/runtime-error-sweep.mjs`: 14,532/14,532 `translate()` calls, **0 runtime errors**

## What was done this session (chronological)

### 1. NV-086 — "did you go to market" (real-time WhatsApp confirmation)
Thangseng confirmed `Na·a bajalchi re·angama?`. Master already held this
value untagged (the actual citation gap); cited VERIFIED/HIGH. Fixed a
stale `corrections.json` override that had wrong tense + missing locative.

### 2. NV-087 — Anti/week framework (4 of 5 questions closed)
`week`=`Anti`, `a week`=`Antisa`, `two weeks`=`Antigni`,
`next week`=`Mikkang anti`, `antio`=`anti`+locative confirmed as same
root. Flipped a legacy untraceable `sop·ta` "VERIFIED/HIGH" tag to
SUPERSEDED (real native evidence beat an uncited legacy tag). **"three
weeks" was NOT answered — stays open.** Also fixed "i understand"
(shipping override `Anga ma·sia` was wrong; corrected to native-
confirmed `Anga uia`).

### 3. NV-088 — "my house"
Thangseng confirmed `Angni Nok` / `ang·ni nok`. Master held a different
uncited value (`angni rang`) — SUPERSEDED, new VERIFIED/HIGH row added.

### 4. Methodology correction (Project Owner-flagged, important)
Project Owner correctly identified that "my X" possessive phrases
(my dog, my house, my father, etc.) are **productive grammar
composition** (`POSSESSIVES["my"]="Angni"` + noun-root, via the
`sov-assembly` engine method), not idioms requiring individual native
relay confirmation. Verified this is true — "my table", "my pen", etc.
already compose correctly and were never hardcoded. **New standing
rule needed**: before relaying a multi-word phrase to native, check
whether existing compositional grammar (possessives, tense markers,
imperative suffixes, classifiers) already covers it from independently-
verified pieces. Only relay what's genuinely irreducible. **This rule
has not yet been formally added to `SESSION_BOOTSTRAP.md` — do this
first in the next session** (see Next Step).

### 5. Critical runtime bug fix (corpus-internal, no native input needed)
`translationEngine.js`'s phrase-map lookup stripped apostrophes before
checking (`lookupPhrase(lower)`), but `PHRASE_MAPS` keys contain
apostrophes intact. **13 keys were silently unreachable.** Worst case:
"i don't know" shipped as `Anga uia.` ("I know" — polarity fully
reversed) instead of the correct `Anga uija`. Also affected: wrong verb
root ("i don't understand" → "i don't know"'s value, "i don't want"),
wrong construction ("don't be afraid" — statement instead of
imperative), word-salad output ("don't give up", "don't forget your
language"). Fixed: lookup now tries apostrophe-preserved forms first
(`lowerWithApos` → `cleaned` → `lower`), same pattern already used for
the corrections lookup one line above. All 13 keys verified live,
gate green.

### 6. Override-vs-master conflicts (3 fixed, corpus-internal)
- **"i don't understand"** — one of the 20 conflicts Claude B flagged
  in `CLAUDE_B_HANDOFF_20260819` section 3, previously unreachable
  (masked by bug #5), now shipping wrong value once reachable. Fixed
  to master's VERIFIED target `Anga man·ja`.
- **"what job do you do"** — `corrections.json` was missing a syllable
  vs master's VERIFIED row. Fixed.
- **"what is your name"** — shipping matched neither of master's two
  VERIFIED variants. Fixed to the matching one.
- **Deferred, not touched**: "where are you from" / "where is the
  market" — raka-dot-only differences, same low-risk ambiguity class
  as the existing Check A raka-locality candidates. Not asserted as
  bugs.

### 7. Compositional closures (4 items, no native input needed)
"my father"=`ang·ni ba·ba` (also fixed a raka-dot spelling bug),
"he has eaten"=`Ua cha·jok`, "sit down"=`Asongbo` (also fixed a stale
`phrase_maps.js`/`corrections.json` duplicate with mismatched
punctuation), "a tree"=`Bol pangsa` (already correct, cited).

## Held — pending next Thangseng relay batch (nothing resolved further this session)

**138 items remain open**, unchanged in content from before this
session (composition/citation work closed 8 of the original 141+ but
did not reduce the *native-relay-required* count below 138, since the
closures used existing corpus evidence, not new relay answers):

- **Part A**: 89 single words (backbone, basically, begin, bland,
  bored, bring, build, bye, choose, coin, coins, cold, come, coming,
  cooked*, cooking, curry, cut, daily, dance, dangerous, darkness,
  dead, deceive, doctor, down, dried, eaten, few, go, goat, gossip,
  happy, help, home, hot, how, hurry, if, knowledge, land, lead, live,
  living, log, look, luck, must, newspaper, nipple, no, only, person,
  plant, playing, pray, quick, roam, roof, run, search, self, sitting,
  smelly, smoke, someone, song, sorry, soul, stand, stay, stop,
  studying, tasteless, teach, tell, telling, thief, very, wait, walking,
  wash, well, when, which, why, wrist, yes, you)
  - *"cooked" flagged with a specific note: possible two-sense split
    (adjective `min·a` "ripe/cooked-state" vs verb `Song·aha`
    "[has been] cooked") — sharpen the relay question to ask which
    sense, not just "is this correct."
- **Part B**: ~39 phrases, with 4 flagged as **priority** (compositional
  pieces conflict or are uncited, blocking otherwise-composable
  phrases): **"give me water"** (imperative "give" stem `on-` doesn't
  match verified root `ron-`), **"stand"/"stand up"** (two competing
  uncited candidates, no verified base), **"take revenge"** (only a
  noun-form citation exists, verb-phrase form diverges), **"self"**
  (atomic root, zero corpus cross-check).
- **"three weeks"** (Anti/week Q3) — not part of the original 141-item
  batch, tracked separately, still unanswered.

No new relay batch `.md` file was generated this session — the
Project Owner said to keep items pending and pick this up in the next
chat.

## Standing rules from this session (add to `SESSION_BOOTSTRAP.md` next session — not yet written)
1. **Compositional-check-before-relay**: before adding a multi-word
   phrase to a native relay batch, check whether it's already covered
   by verified compositional grammar (possessives, tense/aspect
   markers, imperative suffixes, classifier+number). Only relay
   genuinely irreducible vocabulary or constructions where the pieces
   themselves conflict/are uncited.
2. **Phrase-map/corrections apostrophe handling**: any future
   `phrase_maps.js` or lookup-table key containing an apostrophe must
   be spot-checked via live `translate()` after any change to the
   lookup pipeline in `translationEngine.js` — this exact bug class
   (stripped-vs-preserved apostrophe mismatch) could recur if the
   pipeline is refactored again.
3. Existing rules (Rules 1–10, evidence-first methodology, Rule 8
   duplicate-sweep, citation discipline, one-task-per-session,
   mandatory resume protocol) remain in force, unchanged.

## Exact next step
1. Start new session as Claude A, paste this document.
2. Re-sync: `git fetch`, verify HEAD = `df6f83e0...` = origin/main,
   confirm gate still green (re-run the 5 checks above — don't assume).
3. First task: add the two standing rules above to
   `.ai/SESSION_BOOTSTRAP.md` (small, contained task — do this before
   anything else, since it governs how the next relay batch should be
   scoped).
4. Second task: build the next Thangseng relay batch `.md` file from
   the "Held" list above, with the 4 priority items called out
   explicitly at the top and "cooked" given the sharpened two-sense
   question. Do not include any item this session already closed.
5. Send to Tridip via existing WhatsApp relay process; await Thangseng's
   answers before further NV-089+ closures.

---
**Start a new conversation and paste this document to resume.**
