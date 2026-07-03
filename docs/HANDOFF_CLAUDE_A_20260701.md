# HANDOFF — Claude A Session — 2026-07-03

## IDENTITY
Claude A — Language & Engine Side.
Own: `src/translationEngine.js`, `src/garo_classifier.js`, `src/number_engine.js`, `src/gemini.js`, `server.js`, `src/data/phrase_maps.js`, `src/data/corrections.json`, `master_dictionary.json`, `src/compiled_dict.json`, `garo_dictionary.json`
Claude B owns: `src/pages/`, `src/components/`, `src/App.jsx`, `vite.config.js`, `public/_redirects`, `docs/`

## REPO
- URL: https://github.com/pzrjv4sfj5-prog/Lean-Garo-
- Live: https://lean-garo.onrender.com
- HEAD: `5d25476`
- corrections.json: **791 entries**
- master_dictionary.json: 7097 entries

## CRITICAL — DO FIRST EVERY SESSION
1. `git pull origin main` — never trust stale clone
2. Read `docs/THANGSENG_RULES_LOOKUP.md` before ANY data/engine change
3. Contradiction with a rule → STOP and flag
4. No rule covers it → add to PENDING, ask Thangseng
5. Always `npm run build` before push

## GRAMMAR RULES — SOURCE OF TRUTH
`docs/THANGSENG_RULES_LOOKUP.md` — 23 confirmed rules. Key ones:

**Rule 1 (CRITICAL):** Raka in ROOT only. Never in suffix. Full root table in doc.
- `cha·` ✅ | `re·` ✅ | `song·` ✅ | `on·` ✅ | `ka·saa` ✅
- `kat` ❌ | `ring` ❌ | `tusi` ❌ | `agan` ❌ | `nam` ❌ | `dak` ❌ | `dong` ❌ | `nika` ❌

**Rule 2:** `-a`/`-aa` = simple past. `-aha` = perfect ("have done"). BOTH map to Garo `-aha` (same suffix, context determines English translation).

**Rule 3:** SOV. Imperatives = verb only, NO subject pronoun.

**Rule 15 (PDF):** Stem formation — remove trailing `a` (or `a` after raka). Suffixes attach to stem.

**Rule 17:** Past negation = stem+`jaha` (not just `ja`). `cha·jaha` = did not eat.

**Rule 18:** `gija` = VERBAL ADJECTIVE (not negation). `dakgija` = without doing (adjectival). Main verb still needed. `Ua kamko dakgija dongaha` = she stayed without doing her work.

**Rule 21:** `song·` (raka) = cook. `songna` (no raka) = plant/erect. DIFFERENT WORDS.

**Rule 22:** Hai `-na` = general urge. `-naha` = right now OR finally getting done. Both correct, context determines.

**Rule 23:** `-gen` never adds raka. Raka from root only. Confirmed universally for ALL suffixes.

## SUFFIX TABLE (confirmed)
| Suffix | Meaning | cha· | dak |
|---|---|---|---|
| +a | present | cha·a | Daka |
| +ha | past (EXCEPTION: appends to FULL root, no stem stripping) | cha·a+ha=cha·aha | Daka+ha=dakaha |
| +jok | perfect state | cha·jok | dakjok |
| +enga | progressive | cha·enga | dakenga |
| +gen | future | cha·gen | dakgen |
| +bo | imperative | cha·bo | dakbo |
| +nabe | neg imperative | cha·nabe | daknabe |
| +jawa | neg future | cha·jawa | dakjawa |
| +na | infinitive/let's | cha·na | dakna |
| +naha | imminent let's | cha·naha | daknaha |
| +ja | neg present | cha·ja | dakja |
| +jaha | neg past | cha·jaha | dakjaha |
| +ode | if-clause | cha·ode | dakode |
| +chi+na | subjunctive | cha·china | — |
| +chim | discontinued past | cha·chim | dakchim |
| +engachim | past continuous | cha·engachim | dakengachim |

## WHAT CHANGED SINCE LAST HANDOFF (ecbb489 → ede2b1e)

### Engine changes (Claude B applied)
- `applyTense()`: strips trailing vowel before suffix (Tusigen not Tusiagen)
- `AUXILIARY_SKIP` set added: will/shall/going/used/to not treated as main verb
- Negation raka fix: no-raka roots don't get raka before gija
- `working` = `dakenga` (was `dak·enga`, dak confirmed no raka)
- `jaha` suffix added to applyTense
- `seen` = `nikaha` (raka removed, nika confirmed no raka)
- `jol` classifier added for bamboo; `ge·` for pen/pencil/pole/rod/tree
- Pronoun object forms: `me`→`angko`, `us`→`An·ching·ko`, `them`→`Uamang·ko`
- `will` removed from STOP_WORDS (was killing future tense detection)

### Data changes (corrections.json — major)
- `dak` root: ALL dak· entries fixed to dak (no raka) — `Daka/dakaha/dakenga/dakgen`
- `song·` root confirmed: `Song·a/Song·aha/Song·enga/Song·gen/Song·bo/Song·nabe`
- `songna` (no raka) = plant/erect — different word
- `cook`/`cooking`/`cooked` all fixed
- `let's eat food/sit/play/work` — bare `-ha` fixed to `-na`
- Past negation family: `cha·jaha`, `dakjaha`, `katjaha`, `ringjaha` etc.
- `gija` = verbal adjective confirmed; `dakgija dongaha` sentence added
- `an·tangni` = his/her own (reflexive, from `an·tang` = self)
- `nikaha`/`seen` = no raka confirmed
- `gnang` = synonym of `donga` (have) — older/written form
- `jaha` = past of `dongachim`; `chim` = discontinued past suffix
- `ka·saa` tense family: `ka·saaha/ka·saenga/ka·saagen`
- 21 more confirmed sentences added

### Classifier changes
- `bamboo`/`wa·a` → `jol` classifier
- `pen`/`kolom`/`pencil`/`pole`/`rod`/`tree` → `ge·` classifier
- `king` classifier confirmed NO raka (kinggittam not king·gittam)

## KNOWN BUGS (still open)
1. **Gemini fallback** returns English not Garo — step 10 in cascade. Disable or guard.
2. **`·gija` negation** — Claude B fixed engine-side (no raka on no-raka roots) but Thangseng confirmed `gija` = verbal adjective, not simple negation. Engine still uses it as negation suffix in `isNegative` path — needs rework per Rule 18.
3. **"you drink/go/come/sleep"** = Ringbo/Re·angbo/Re·babo/Tusibo — imperative forms used for present statements. Per Rule 3, subject-dropped imperatives ARE valid in Garo. Ask Thangseng: "you drink" — is `Ringa` or `Ringbo` or both correct?
4. **compiled_dict.json** — 24 `dak·`, 15 `kat·`, 3 `nam·a`, 13 `dong·` raka violations. Grammar-assembly pulls from here. Claude B started audit but hasn't pushed fixes — do this.
5. **`getCategories()`** — returns 1 category, stray numeric keys in compiled_dict.
6. **Test suite** — 8/9 non-blocking.

## ENGINE PRIORITY LIST
1. Fix compiled_dict raka violations (55 entries) — grammar-assembly quality
2. Fix `gija` path — currently used as negation suffix, should be verbal adjective per Rule 18
3. Disable/guard Gemini fallback (returning English)
4. `jaha` past negation in grammar-assembly (currently only in corrections)
5. `chim` / `engachim` in applyTense (suffix added, but assembly doesn't detect "used to" pattern yet)

## PENDING QUESTIONS FOR THANGSENG
- `brong·` classifier — Thangseng said `jol` for bamboo, `ge·` for pen — what about actual long sticks/rods specifically?
- Classifiers above 10 for `jol` — Thangseng said "ge chi·sa" for 11 (needs verification)
- "you drink/go/come/sleep" — `Ringa`/`Re·angbo` etc. — statement or imperative?

## RESUME TEST
```bash
node --input-type=module << 'TESTEOF'
import { translate } from './src/translationEngine.js';
const tests = ['eat','good','2 dogs','did you eat food','i saw him',
  'did you see me','thief','21 dogs','long','cook','i did not eat',
  "let's sit","she bought three books"];
for (const t of tests) {
  const r = await translate(t);
  console.log(t + ' -> ' + r.garo + ' [' + r.method + ']');
}
TESTEOF
```
Expected: all `[correction]` except `2 dogs`/`21 dogs` `[classifier]`.

## GIT PUSH
Claude B pushes. Relay format:
```
RELAY TO CLAUDE B:
File: src/translationEngine.js
Change: [exact find/replace]
Build verified: yes
```
