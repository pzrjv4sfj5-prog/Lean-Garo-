# Claude A session migration, 2026-10-27 (paste into a new conversation)

## Project identity
Lean-Garo (github.com/pzrjv4sfj5-prog/Lean-Garo-): Garo dictionary and English-to-Garo engine. I am Claude A (linguistic authority; no engine code except explicit Owner-directed exceptions). Owner: T. Native validator: Thangseng (relayed). Resumed from CLAUDE_A_SESSION_MIGRATION_20261026B.md.

## Current state
Session start HEAD 6a66985 == origin/main (clean). Pushed 371ccb0 (NV-219 + tense rule), 8773e6e (NV-220), plus this close commit on top (see "Repository status at close"). Gate: dictionary PASSED, repository-intelligence PASSED, unit 952/952, runtime sweep 0 errors, rule conformance 78/112 with 0 unbaselined (enforce passes). Next free NV: 221.

## Done this session (A's own work only)
- NV-219: Owner ruled `Re.rama` = `Re·rama` (period = raka typo) is a SECOND OPTION for walk. Added verified_high variant rows for `walk` and `to walk` (master only). Re·mama stays primary, Re·a stays valid. Test tests/unit/nv219_rerama.test.js. Closes the Re.rama spelling item.
- Standing rule from Thangseng (relayed): when sending full sentences for checking, state the intended tense for each sentence. Logged in docs/CLAUDE_A_NV213_CLOSURE_20261026.md.
- Rebased over Claude D's 4 commits (Minoka headword fix, WORKSTATE rule Me·mang standard / Mi·mang regional, master duplicate re-audit); regenerated compiled data; no content conflicts.
- NV-220: mang raka residue closed after NV-217. CONFIRMED_COMPOUND_CLASSIFIERS.mang set dot:false (20-99 compounds now `achak mangkolgrik`, `mangkolgriksa`, `mangsotbrisa`); `animals`=`mang` (master + final_entries); 2 stale tests re-expected; garo_classifier.js comments and RULE-038 / RULE-G-classifier examples updated. Lexical words containing "mang" (mang·kal·a, mi·mang·sa, Me·mang, mang·wa·a) are different morphemes, untouched.
- Owner confirmed Me·mang = ghost: already live (`ghost` => me·mang, verified_high); no change.

## Runtime Handoff (Claude B)
- Review two one-token A edits in src/garo_classifier.js: RAKA_CLASSIFIERS lost mang (NV-217) and CONFIRMED_COMPOUND_CLASSIFIERS.mang dot:false (NV-220).
- Live-verified: one dog=achak mangsa, two dogs=achak manggni, ten birds=do·o mangchiking, twenty dogs=achak mangkolgrik, twenty one dogs=achak mangkolgriksa, forty one dogs=achak mangsotbrisa, one hundred dogs=Achak mangritchasa, animals=mang, ghost=me·mang, walk/to walk=Re·mama (Re·rama is a variant row only, not surfaced).
- Observed, not changed: teens ship `achak mangchi·sa` (lowercase; D proposed `mangChi·sa`); decide capitalisation in engine.
- Full `npm run build` passed (incl. vite). Re·rama appears nowhere at runtime by design (variant).

## Rework-prevention checklist (Governance §12)
- Already resolved before? mang dot: yes, flipped again; the Owner directive of 2026-10-26 is the current ruling. Re.rama was an open WORKSTATE item.
- Other representation with old value? mang checked in master, final_entries, garo_dictionary (0), engine tables, tests, rule YAMLs, comments. phrase_maps/corrections hold none.
- Runtime vs linguistic? Both; handoff above.
- Generalizes? mang no-dot is a productive classifier rule.
- Asked native to confirm something established? No. Over-derived? No; Re·mama/Re·rama paradigms not invented.

## Open items
Re·mama and Re·rama paradigm forms; whether Re·a should ever lead; D's held OCR rows (page images) and Matri/Matkalsi/Me·mana·song review flags; `Shall I sit?`; per-class raka confirmations; unverified base verbs (die, hit, break, make); Thangseng negative-ability questions; seven jom·a illness rows; greedy primary; NV-158 vs NV-182 bare -a; bare "not". Next Thangseng batch must label tense per sentence.

## Standing rules (unchanged; do not re-litigate)
Anga always; apostrophes/periods in Garo words are raka typos; provenance labels (Thangseng quote vs Owner directive vs Owner-delegated logic); apply only what is ruled; never store a PAT (one-shot header, scrub .git/config, rotate); fetch + compare before push; collision protocol commit, fetch, rebase, rebuild, retest, push; do not delete the clone until local == origin/main; .ai/CLAUDE_D_HANDOUT.md is the only channel to Claude D; mang has NO raka at any n; Me·mang is the standard ghost spelling (Mi·mang regional); state intended tense when sending sentences to Thangseng.

## Repository status at close (verified against the repo)
See the closing message for the final hashes, verified after the push: HEAD == origin/main; git status clean; WORKSTATE.yaml updated (pointer next_action_claude_a_20261027); SESSION_BOOTSTRAP.md pointer updated; this doc complete; no local-only commits; no uncommitted changes; native-validation/blocker status: no Thangseng relay pending from this session (all rulings were Owner directives; one new Thangseng process rule recorded).

## Exact next step
New conversation: paste this file, clone with a fresh PAT (scrub it from .git/config), git fetch, verify HEAD, read .ai/WORKSTATE.yaml and .ai/SESSION_BOOTSTRAP.md, run the gate, then take Owner decisions on the open items (first: Re·mama / Re·rama paradigm).
