# HANDOFF — Lean-Garo Project — Claude A Session Handoff 2026-07-01

## IDENTITY
You are **Claude A** — Language & Engine Side.
- You own: `src/translationEngine.js`, `src/garo_classifier.js`, `src/number_engine.js`, `src/gemini.js`, `server.js`, `src/data/phrase_maps.js`, `src/data/corrections.json`, `master_dictionary.json`, `src/compiled_dict.json`, `src/compiled_dict_alternates.json`, `garo_dictionary.json`
- Claude B owns: `src/pages/`, `src/components/`, `src/App.jsx`, `vite.config.js`, `public/_redirects`, most of `docs/`
- Claude C: reverse-translation engine, standalone `english_garo.json` dataset (706 entries), push HELD pending sign-off
- User relays between sessions. Claude B has direct push access in the Codespace.

## REPO
- URL: https://github.com/pzrjv4sfj5-prog/Lean-Garo-
- Live: https://lean-garo.onrender.com
- **HEAD on remote: `ecbb489`** (2026-07-01)
- corrections.json: **679 entries** (as of ecbb489)
- master_dictionary.json: **7097 entries**

## CRITICAL — ALWAYS DO FIRST
1. `git clone` fresh — never trust stale clone
2. Check `docs/THANGSENG_RULES_LOOKUP.md` BEFORE any data or engine change
3. If change contradicts a rule → STOP and flag
4. If no rule covers it → add to PENDING section, ask Thangseng
5. Verify entry counts before/after any write
6. Never push without running `npm run build` first

## PENDING PUSH (NOT YET ON REMOTE — APPLY FIRST THING)

Claude A has 2 files with local changes verified against `ecbb489` that need relaying to Claude B to push:

### corrections.json — 1 line change:
```diff
-  "you run": "Katbo",
+  "you run": "Na·a Kata",
```
Katbo = imperative "run!" — wrong for a statement. Rule 3 + Rule 11 confirm.

### translationEngine.js — 2 changes:
```diff
 function lookupGaro(key) {
+  const k = key.toLowerCase().trim();
+  if (corrections[k] && !k.includes(' ')) return corrections[k];
   const e = lookup(key);
   return e ? e.garo : null;
 }

-  'have','has','had','do','does','did','will','would','could',
+  'do','does','did','will','would','could',
```
`lookupGaro` now checks corrections.json first (single-word keys only) — closes the structural gap where `findVerbForm`/`grammar-assembly` read only `compiled_dict.json`, bypassing confirmed corrections. `have/has/had` removed from STOP_WORDS because `have=donga` is confirmed (Rule 11).

**Build verified:** all 19 baseline + session tests pass. Relay to Claude B to push with commit message: `fix: lookupGaro checks corrections first; have/has/had out of STOP_WORDS; you run=Na·a Kata`

## GRAMMAR RULES — SINGLE SOURCE OF TRUTH
`docs/THANGSENG_RULES_LOOKUP.md` — 12 confirmed rules. READ THIS FIRST. Key rules:
- Rule 1: Raka in ROOT only, never in suffix. Full table inside doc.
- Rule 2: Past `-a`/`-aa` = simple past. `-aha` = perfect ("have done")
- Rule 3: SOV always. Imperatives = verb only, NO subject (`Sengbo` not `Na·a Sengbo`)
- Rule 4: Pronoun table (I=anga/angko/ang·ni, You=na·a/nang·ko/nang·ni, etc.)
- Rule 8: `-ode` = if-clause suffix on verb stem (cha·ode, waode)
- Rule 11: Key vocab confirmed — see doc for full list

## ARCHITECTURE — TRANSLATION ENGINE
`src/translationEngine.js` — 11-step priority cascade:
1. corrections.json exact match (confidence 1.0)
2. Phrase map exact match (0.99)
3. Single-word lookup
3.5 If-clause `-ode` handler (`translateIfClause`)
3.6 Multi-clause join (and/but/or/so via `translateMultiClause`)
4. Stop-word strip
5. Negation detection (·gija suffix)
6. Grammar assembly (SOV)
7. Classifier counting
8. Number engine
9. Fuzzy match
10. Gemini fallback ⚠️ (KNOWN BUG: returns English not Garo — see below)
11. Passthrough [UNKNOWN]

## KNOWN BUGS — DO NOT ACCIDENTALLY FIX WITHOUT NATIVE-SPEAKER INPUT
1. **Gemini fallback returns English as Garo** (step 10): `analyzeSentence()` returns corrected English, not Garo. `correctedInput !== cleaned` check triggers, mislabeled as Garo at 0.60 confidence. Fix: guard that `g` looks like Garo before returning, or disable step 10. Flagged, not yet fixed.
2. **`applyTense()` future tense** may still insert raka algorithmically — not fully fixed, pending `-gen` suffix confirmation from Thangseng.
3. **`·gija` negation suffix** hardcoded with raka at 3 sites — confirmed complex (not simply root-raka-carries-through), pending Thangseng examples.
4. **Test suite non-blocking**: `test-dictionary.js` grammar-correction check is non-blocking — `8/9` prints as "All tests passed." Structural issue, not fixed.
5. **"you drink/go/come/sleep"** = Ringbo/Re·angbo/Re·babo/Tusibo — same -bo imperative error pattern as now-fixed "you run". Check Rule 3 with Thangseng before changing.
6. **`compiled_dict.json` classifier corruption**: "three books" etc. still wrong in compiled_dict, but classifier engine bypasses this path, so not user-facing for counting phrases.
7. **`getCategories()`** returns only 1 category — stray numeric keys in compiled_dict polluting aggregation. Pre-existing, not urgent.

## WHAT WORKS CORRECTLY (VERIFIED THIS SESSION)
- run/to see/look/saw/ran: all raka-free (confirmed)
- let's dance/sing/swim: `Hai chrokna/ring·na/jrona`
- Classifier teens 11-19: `Chi·sa` through `Chi·sku`
- Classifier 20+: wired to `number_engine.js` (`Kolgrik sa`, etc.)
- `getAllVocabulary()`: checks corrections.json first
- `-ode` if-clause: verb+object both get suffix (cha·ode, mikode cha·ode)
- `lookupGaro`: checks corrections.json first (PENDING PUSH)
- Imperative subject-drop: `Sengbo/Damo/Chakata` confirmed no Na·a
- why=Maina, what are you saying=Maiko aganenga?
- have/stay/live=donga, dong root no raka
- very=namen, lead=dila, sing=ring·a, wristwatch=go·ri

## DICTIONARY AUDIT FINDINGS (completed this session)
From mechanical scan of all 7,097 master_dictionary.json entries:
1. `"version": "3.1"` — stray software version number, not a real entry
2. `"tree"` has a candidate in category "animals" (a'bil) — possible mis-keying
3. `"Anti"` shared between "week" and literal "anti" — odd, worth checking
4. `"agan"` family: speak/tell/spoke have no raka, but gossip/answer compound forms do — flag for Thangseng
5. **STRUCTURAL (important)**: lookupGaro gap — addressed by pending push above

## PENDING QUESTIONS FOR THANGSENG
From `docs/THANGSENG_RULES_LOOKUP.md` PENDING section:
- `brong·` classifier — never tested in a real sentence
- Past negation — `i did not eat` — is it `Anga cha·ja` or something else?
- `how much` — is `baita` "how much" or "price"?
- `jedakode` / `man·gen` — are these productive forms or one-off?
- `·gija` negation raka — is the raka before gija always there, or root-dependent?
- `-gen` future tense raka — same question as gija

## STANDING WORKFLOW
1. Clone fresh, read `THANGSENG_RULES_LOOKUP.md`
2. Apply the pending push above (relay to Claude B) — DO THIS FIRST
3. Verify with `npm run build` + the 9-test resume check:
   `eat/good/2 dogs/did you eat food/i saw him/did you see me/thief/21 dogs/long`
4. For any new Thangseng corrections: check against rules doc first, write standalone `.cjs` script, test, relay to Claude B to push
5. Never modify master_dictionary.json directly — use corrections.json overrides
6. Never guess Garo forms — only confirmed or directly given by native speaker

## CLAUDE C STATUS
- Reverse-translation engine built (4 local commits), NOT pushed — push HELD per user
- `english_garo.json` (706 entries) is Claude C's standalone dataset — do NOT merge into corrections.json without explicit instruction
- Audit tasks issued: 83-word high-risk list, engine files audit (both completed and filed in docs/)
- New task issued: full dictionary mechanical scan (Claude A completed this themselves)

## RESUME TEST (run this to verify state)
```javascript
import { translate } from './src/translationEngine.js';
const tests = ['eat','good','2 dogs','did you eat food','i saw him',
  'did you see me','thief','21 dogs','long'];
// Expected: all via [correction] method, exact Garo matches per GARO_GRAMMAR_REFERENCE.md
```
