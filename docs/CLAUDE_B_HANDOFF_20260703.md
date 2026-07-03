# CLAUDE B HANDOFF — Lean-Garo Project
_Session transfer — paste this at the start of a new chat to resume instantly_
_Prepared: 2026-07-03_

---

## IDENTITY
Claude B — Platform/UI Side. Direct git push access.
Claude A — Engine Side. Relays fixes to Claude B for push.
User relays between sessions.

---

## REPO
- URL: https://github.com/pzrjv4sfj5-prog/Lean-Garo-
- Live: https://lean-garo.onrender.com
- HEAD: `e344ce1`
- corrections.json: **785 entries**
- master_dictionary: 7,097 entries

## GIT SETUP (every new session)
```bash
git config --global commit.gpgsign false
git config --global user.email "pzrjv4sfj5@privaterelay.appleid.com"
git config --global user.name "pzrjv4sfj5-prog"
git remote set-url origin https://pzrjv4sfj5-prog:<PAT_FROM_USER>@github.com/pzrjv4sfj5-prog/Lean-Garo-.git
git pull origin main
```

## BASH INLINE NODE — IMPORTANT
Never use `!` in bash `-e` strings. Always write to `.cjs` file and run `node file.cjs`.

---

## FILE OWNERSHIP
**Claude B owns:** `src/pages/`, `src/components/`, `src/App.jsx`, `vite.config.js`, `public/_redirects`, `docs/`
**Claude A owns:** `src/translationEngine.js`, `src/garo_classifier.js`, `src/number_engine.js`, `src/gemini.js`, `server.js`, `src/data/phrase_maps.js`, `src/data/corrections.json`, `master_dictionary.json`, `src/compiled_dict.json`, `garo_dictionary.json`

---

## WHAT'S WORKING (verified 51/51 tests passing)

### Engine features live
- SOV assembly, corrections-first priority cascade (11 steps)
- Case-insensitive, apostrophe-preserving corrections lookup
- Apostrophe-stripped shadow index: `lets`/`dont` → `let's`/`don't` auto
- Fuzzy match with tightened threshold for short words (≤4 chars = d=1 only)
- Classifier system: mang·/sak·/ge·/gong· (raka) vs king/jol/pang/dot (no raka)
- All tense suffixes: a/ha/jok/enga/gen/bo/nabe/jawa/na/naha/ja/jaha/ode/chi+na/chim/engachim
- `ha` exception: appends to FULL root (ringa+ha=ringaha, not ring+aha)
- Gemini fallback removed from both engine + server.js
- `lookupGaro()` checks corrections first
- `have/has/had` removed from STOP_WORDS
- `will` removed from STOP_WORDS (future tense detection working)
- AUXILIARY_SKIP set: will/shall/going/used/to not treated as main verb

### Grammar confirmed (24 rules in docs/THANGSENG_RULES_LOOKUP.md)
Key rules:
- Rule 1: Raka in ROOT only. `cha·`/`re·`/`song·`/`on·`/`ka·saa` ✅ | `kat`/`ring`/`tusi`/`agan`/`nam`/`dak`/`dong`/`nika` ❌
- Rule 15: Stem = remove trailing `a` (or `a` after raka). BUT Rule 24 exception: `ha` appends to FULL root.
- Rule 17: Past negation = stem+`jaha` (`cha·jaha`=did not eat)
- Rule 18: `gija` = verbal adjective, NOT negation. Needs main verb alongside.
- Rule 21: `song·` (raka)=cook vs `songna` (no raka)=plant — raka changes meaning
- Rule 22: Hai+`na`=general urge, Hai+`naha`=right now/finally done
- Rule 23: `-gen` never adds raka. Confirmed universally.
- Rule 24: `ha` = EXCEPTION — appends to FULL root form

### Classifier system
| Classifier | Raka | Category |
|---|---|---|
| mang· | ✅ | animals |
| sak· | ✅ | people |
| ge· | ✅ | pen/general |
| gong· | ✅ | money |
| king | ❌ | flat objects (books) |
| jol | ❌ | bamboo/pole/rod |
| pang | ❌ | trees |
| dot | ❌ | logs/wooden posts |

Numbers 21+: raka joins ALL parts (`mang·Kolgrik·sa`)

### Key vocab confirmed
```
yes=Am | no=Ihing | good=Nama | is/am/are=daka
and=Aro | but=Indiba | or=ba | so=Uni gimin
why=Maina | how=maidake | happy=kusi | tired=nenga
love(v)=ka·saa | beloved(n)=Ka·sara | cook=Song·a | plant=Songna
have/stay/live=donga | had=dongachim | gnang=donga synonym (written form)
thief=cha·u | bamboo=wa·a | banana=te·rik | market=anti/bajal
```

---

## OPEN ITEMS — CLAUDE A PRIORITY
1. **compiled_dict.json raka violations** — 24 dak·, 15 kat·, 3 nam·a, 13 dong· entries. Grammar-assembly pulls stale forms from here. Biggest remaining quality gap.
2. **`gija` path in engine** — currently used as negation suffix, should be verbal adjective per Rule 18. Needs rework.
3. **`jaha` past negation in grammar-assembly** — only in corrections, not in assembly path.
4. **`chim`/`engachim` detection** — suffix in applyTense but assembly doesn't detect "used to" pattern.
5. **"you drink/go/come/sleep"** — returns imperative forms. Ask Thangseng if subject-dropped imperative is valid for statements.

## OPEN ITEMS — CLAUDE B
1. Wire `ReverseTranslator.jsx` into nav once reverse dict confirmed
2. Run compiled_dict audit and push fixes (55 violations)

## PENDING — THANGSENG
- Classifiers above 10 for `jol` — `ge chi·sa`=11 pieces (needs verification)
- "you drink/go/come/sleep" — statement or imperative valid?
- `brong·` classifier — specific use case for actual sticks/rods

---

## DOCS STRUCTURE
- `docs/THANGSENG_RULES_LOOKUP.md` — 24 rules, PRE-CHANGE LOOKUP TABLE
- `docs/GARO_GRAMMAR_REFERENCE.md` — full grammar reference
- `docs/GRAMMAR_CONFIDENCE_MATRIX.md` — ✅/⚠️/🔲 confidence levels
- `docs/HANDOFF_CLAUDE_A_20260701.md` — Claude A's current handoff

---

## QUICK RESUME TEST
```bash
node --input-type=module << 'EOF'
import { translate } from './src/translationEngine.js';
const tests = ['eat','good','2 dogs','did you eat food','i saw him',
  'lets dance','LETS GO',"don't eat",'i did not eat','cook',
  '1 tree','2 bamboo','21 dogs'];
for (const t of tests) {
  const r = await translate(t);
  console.log(t + ' -> ' + r.garo + ' [' + r.method + ']');
}
EOF
```
All should return `[correction]` or `[classifier]`. Zero `[sov-assembly]` or `[UNKNOWN]` on these.

---

_Claude B — 2026-07-03 — HEAD: e344ce1_
