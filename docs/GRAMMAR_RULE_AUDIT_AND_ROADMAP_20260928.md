# Grammar Rule Audit, Entry Map and Roadmap: 2026-09-28
Claude A, audit-only (no data/engine edits). Baseline HEAD d5eb1ae. Companion to docs/CLAUDE_A_FULL_AUDIT_20260928.md.

## Method
48 rule YAMLs in docs/grammar_rules_structured/ parsed. Rule IDs are not cited in engine code (only 8 rules have any code reference), so the map is behavioural: every parseable rule example (94 Garo=English pairs) was (a) looked up in master_dictionary/corrections/phrase_maps and (b) run through translate() and compared to the rule's own form. Normalised: case, raka dots, punctuation. Columns: examples parsed | runtime matches rule | example present in an entry layer.
Caveat: string-match is strict. Some mismatches are harmless variants, and each finding below states which.

## Rule map
| Rule | Title | Claim status/conf | Tier | Code link | Ex | Runtime | In entries |
|---|---|---|---|---|---|---|---|
| RULE-001 | Raka Locality | verified/high | P0 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-002 | Past/Perfect Unification | verified/high | P0 | none cited (behavioural only) | 1 | 1/1 | 1/1 |
| RULE-003 | SOV Word Order | verified/high | P0 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-003b | Imperative Subject-Drop | verified/high | P0 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-004 | Pronoun Paradigm | unknown/n/a, verified/high | P0/deferred | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-005 | Copula `daka` | disconfirmed/n/a, needs_native_validation/low, verified/high | P0 | none cited (behavioural only) | 2 | 2/2 | 2/2 |
| RULE-006 | Adjective Placement | needs_native_validation/unspecified, verified/medium | P1 | none cited (behavioural only) | 1 | 1/1 | 1/1 |
| RULE-007 | `Hai` Construction (Hortative) | verified/high | P0 | none cited (behavioural only) | 8 | 5/8 | 7/8 |
| RULE-008 | If-Clause Suffix `-ode` | verified/high | P1 | none cited (behavioural only) | 2 | 0/2 | 2/2 |
| RULE-009 | Noun Suffix System | needs_native_validation/medium, verified/high | P0/P1 | morphologyEngine, grammarEngine | 2 | 2/2 | 2/2 |
| RULE-013 | Chim (Discontinued Past) | verified/high | P0 | none cited (behavioural only) | 2 | 0/2 | 2/2 |
| RULE-014 | `dongama` Existential "There Is" | needs_native_validation/low | P2 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-015 | Stem Formation | verified/high | P0 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-017 | Simple Negation (`-ja`) | verified/high | P0 | none cited (behavioural only) | 1 | 0/1 | 1/1 |
| RULE-018 | Verbal-Adjective `-gija` | needs_native_validation/medium, verified/high | P0/P1 | none cited (behavioural only) | 1 | 1/1 | 1/1 |
| RULE-020 | `an·tang` Reflexive/Self | verified/medium | P1 | none cited (behavioural only) | 1 | 0/1 | 1/1 |
| RULE-021 | `song·` vs. `songna` — Raka Distinguishes Meanin | verified/high | P0 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-023 | `-gen` (Future) Never Carries Raka | verified/high | P1 | raka_roots.json | 2 | 1/2 | 2/2 |
| RULE-024 | `-aha` Full-Root-Append Exception | needs_native_validation/low_medium | P1 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-025 | Cessative `-jaha` | verified/high | P0 | none cited (behavioural only) | 1 | 0/1 | 1/1 |
| RULE-026 | Completive `-manaha` | needs_native_validation/medium_high, verified/medium_high | P1 | none cited (behavioural only) | 1 | 0/1 | 1/1 |
| RULE-027 | No True Simple-Past Suffix; `-ja` Covers Past-Re | verified/high | P0 | none cited (behavioural only) | 2 | 0/2 | 0/2 |
| RULE-028 | `-aha`/`-manaha` Overlap in Spoken Garo | unknown/n/a, verified/high | P0 | none cited (behavioural only) | 2 | 1/2 | 1/2 |
| RULE-029 | Hortative/Imperative `-bo` | verified/high | P0 | none cited (behavioural only) | 2 | 0/2 | 2/2 |
| RULE-030 | `re·` vs. `re·ang` for "Go" [RESOLVED] | needs_native_validation/high, verified/high | P0 | grammarEngine | 6 | 1/6 | 2/6 |
| RULE-031 | Copula Inconsistency [PARTIALLY RESOLVED] | needs_native_validation/low, needs_native_validation/medium, verified/high | P0 | none cited (behavioural only) | 2 | 2/2 | 2/2 |
| RULE-032 | `search` = `Sandia` | verified/high, verified/medium | P0/P1 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-033 | Locative "Under," Retiring a Lexical Confusion | verified/high, verified/medium | P0/P1 | none cited (behavioural only) | 1 | 0/1 | 0/1 |
| RULE-034 | Locative/Directional Word Set (Vocabulary Expans | needs_native_validation/low, needs_native_validation/medium | P1 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-035 | "Under" vs. "Beneath" Sense Split (`mitapo`) | needs_native_validation/low, verified/high | P1 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-036 | Fixed Discourse Expressions (New Category) | needs_native_validation/low, verified/high | P0 | none cited (behavioural only) | 1 | 0/1 | 0/1 |
| RULE-037 | `a'`/`an'`/`am'` Compound Prefix (Distinct from  | needs_native_validation/medium, verified/high | P1 | none cited (behavioural only) | 2 | 1/2 | 2/2 |
| RULE-038 | Counting Construction: Noun + Classifier-Number | needs_native_validation/low, verified/high | P0 | garo_classifier.js | 19 | 14/19 | 15/19 |
| RULE-039 | Stative/Passive via Converb + Auxiliary (PROVISI | needs_native_validation/low, verified/high | P1 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-040 | "Right" Three-Way Sense Split (Direction / Match | verified/high | P0 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-041 | "Work" Part-of-Speech Split (Noun vs. Verb vs. G | needs_native_validation/unknown, verified/high | P0 | morphologyEngine, pending_lexicon | 0 | 0/0 | 0/0 |
| RULE-042 | `-de` Temporal Suffix ("at that time") | verified/high | P1 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-043 | English "Have" Splits Into Three Distinct Garo C | needs_native_validation/low, verified/medium | P2 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-044 | Movement vs. Stationary Locative Suffix Contrast | verified/high | P0 | sentenceBuilder, grammarEngine | 3 | 2/3 | 3/3 |
| RULE-045 | mina root: "ripe/cooked" (not "ready/finished")  | verified/high | P2 | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-046 | Yes/No Question Particle -ma Joins Directly to t | verified/high | P0/P1 | sentenceBuilder, grammarEngine | 3 | 2/3 | 2/3 |
| RULE-047 | Comitative Suffix -ming ("with [pronoun]") | unknown/n/a, verified/high | P1/deferred | none cited (behavioural only) | 0 | 0/0 | 0/0 |
| RULE-048 | Question-Word Questions Do Not Take the -ma Part | verified/high | P1/P3 | none cited (behavioural only) | 7 | 4/7 | 6/7 |
| RULE-049 | bi·sa — Productive Child/Young-One Marker | verified/high | - | none cited (behavioural only) | 5 | 5/5 | 5/5 |
| RULE-050 | Ability Modal 'Can' (ama / man·a) — Free Variant | derived/medium, verified/high | P1 | none cited (behavioural only) | 4 | 1/4 | 1/4 |
| RULE-G-classifier | Numeral Classifiers | verified/high | P0/P1 | grammarEngine | 8 | 4/8 | 6/8 |
| RULE-G2 | Pre-verbal Clustering (Locative Phrases) | needs_native_validation/medium, verified/high | P1 | none cited (behavioural only) | 1 | 0/1 | 0/1 |
| RULE-G7 | Existential Possession | verified/high | P0 | none cited (behavioural only) | 1 | 0/1 | 0/1 |

Totals: 94 pairs, 50 match runtime (53%), 49 in master, 50 in corrections/phrase_maps, 23 in neither layer. 0 of 48 rules have a machine-checkable test linking rule to engine (tests reference only 8).

## Findings (rule vs entries vs runtime)
### G. Rule catalogue defects (Claude A)
- G1 RULE-038 says mang/king/gong take the raka dot and its notes say "sak takes NO dot, unlike mang/king/gong". Dictionary holds mang without dot (PO directive 2026-09-13; achak mangsa). Rule YAML is stale on mang; also lists `do·a mang·chiking`, `mewa rongbri`, `manderang saksa` which conflict with live/superseded rows (D4-class).
- G2 RULE-030 (re· vs re·ang) has both verified/high and needs_native_validation/high claims; RULE-030 examples contain mixed apostrophe/raka forms (re'angjaenga) vs live `re·ang·ja`.
- G3 RULE-049 has no launch_priority/last_updated (schema-incomplete); RULE-050 mixes verified and derived claims.
- G4 18 of 48 rules carry at least one needs_native_validation claim (RULE-005, RULE-006, RULE-009, RULE-014, RULE-018, RULE-024, RULE-026, RULE-030, RULE-031, RULE-034, RULE-035, RULE-036, RULE-037, RULE-038, RULE-039, RULE-041, RULE-043, RULE-G2). Rules resting ONLY on unvalidated claims: RULE-014, RULE-024, RULE-034.
- G5 Dependency graph points to non-existent rule IDs (RULE-011 in RULE-013; no RULE-010/011/012/016/019/022 files) and 5 rules have migration_flags open.
### R. Runtime does not implement or honour the rule (Claude B, evidence from Claude A)
- R-a -ja/-jaha/-manaha family (RULE-017/025/026/027/028): "does not"->[UNKNOWN]; "has stopped eating" and "has eaten" go to sov-assembly `donga cha·enga`/`donga cha·jok` (English-shaped periphrasis, not -jaha/-manaha).
- R-b RULE-007/029 hortative/imperative: "let's eat" ships `Hai cha·ha`; "cook!" gives `Song·a`, "stop!" gives `dontonga`, not Song·bo / Sengbo; "search for him!" gives `Sandia Bichi` not `Biko sandibo`.
- R-c RULE-008/013/023: "if eat" -> `Cha·a` (drops -ode); "if you eat, you will be strong" -> `Na·a Cha·ode, Na·a bilakgen` (subject duplicated); "used to work"/"was studying" (chim) lose the aspect; "will be strong" -> `Bilaka` (RULE-023 -gen not applied).
- R-d RULE-030/044 movement locatives: "I am not going to the market" -> `Anga bajalchi` (verb dropped!); "where?" -> Bano vs rule Bao; `Bajalchi` vs rule `Antichi` (lexical variant, needs PO call).
- R-e RULE-033/G2: "under the table" -> `kokkimao`, rule `nokkimao`. Rule and corrections disagree; one is a typo.
- R-f RULE-038/G-classifier: "two chicken" -> `do·o ge·gni` (classifier ge instead of mang, contradicts native-confirmed mang=animals/birds); "ten birds" -> `do·o mangchiking` vs rule `do·a`; "four fruits" -> `bite rongbri` (rule `mewa`); "one alcohol" -> `chu rong sa` (space, rule `rongsa`); "one stalk of bamboo" -> `wa· jolsa` (dangling raka vs rule `wa·a jolsa`); "two trees" -> `Bol panggni` vs rule `a'bil panggni`. Confirms R1/R2 in the main audit.
- R-g RULE-046/048 questions: "Did you go to market?" gets `bajalchi` (locative added) vs rule; "Why did you come?" -> `maini gimin` vs rule `maina`; "How much did you eat?" -> `Maidake be·si Na·a Cha·a` (word order and tense wrong).
- R-h RULE-G7/004 pronoun: "she" runtime is Ua, rule example uses Uo (variant/typo, PO decision).
- R-i RULE-036: "Wait, let me eat" -> `Damo [UNKNOWN] Angko Cha·a` (U leak, wrong object pronoun).
### E. Entries not backing the rule (Claude A)
- E1 23 of 94 rule examples exist in neither master nor corrections/phrase_maps: they are documentation-only. Each is either promoted to a data row or documented as illustrative.
- E2 Rule examples whose form matches only a SUPERSEDED master row (mewa rongbri, do·a mang·chiking, do·o mang·gni unverified/superseded mix).
- E3 Tier P0 rules with no verified entry present: RULE-017 (cha·ja), RULE-025 (cha·jaha), RULE-026/028 (cha·manaha).
- E4 RULE-050 ama/man·a free variants: dictionary is unresolved tie (able, i can eat/go/work; see PICKPRIMARY_VERIFIED_TIES), runtime ships man·a only.

## Roadmap
Sequenced by dependency and risk; each phase ends with the full gate (prepare-data, test-dictionary, repository-intelligence, resync, unit tests, runtime sweep) and a WORKSTATE update. One task per session.

### Phase 0: Housekeeping (1 session, Claude A)
0.1 Update WORKSTATE.yaml head pointer and SESSION_BOOTSTRAP (F1). 0.2 Scrub PAT prefix in migration docs (F4). 0.3 Make rule-map script reusable: scripts/audit-rule-conformance.mjs so this table is regenerated, then add it as report-only step in repository-intelligence.

### Phase 1: Rule catalogue repair (Claude A, no relay needed)
1.1 RULE-038: correct mang (no dot) per PO 2026-09-13; unify examples with live classifier rows (G1). 1.2 RULE-049/050 schema fields (G3). 1.3 Fix dangling dependency IDs (G5). 1.4 Add explicit "ong·a=copula, never possession; possession=donga" scope note to RULE-G7/RULE-005 (open since 20260927C, §5 drift flag). 1.5 Resolve rule-example typos with evidence: nokkimao/kokkimao (R-e), Uo/Ua (R-h), a'bil vs Bol (R-f).

### Phase 2: Entry/rule alignment (Claude A)
2.1 For the 23 orphan examples: promote to master rows with rule citation, or tag illustrative (E1). 2.2 Supersession clean-up of rows contradicting VERIFIED rules (E2, D3 ties, D4 ocr_flagged primaries: start with those in P0 rule areas). 2.3 Confidence backfill for the 596 unconfidenced rows and 583 uncited verified rows (D1, D2), ordered by rule area (counting, locatives, tense, questions). 2.4 Tie triage for 61 multi-verified keys (D3).

### Phase 3: Runtime conformance (Claude B, handoff doc from Claude A)
Priority order by user-visible harm: 3.1 [UNKNOWN] leaks (R3/R4/R-i, "does not"). 3.2 Dropped verbs/aspects: R-d, R-a, R-c. 3.3 Imperative/hortative -bo (R-b). 3.4 Classifier/number formatting: R1, R2, R-f (ge vs mang for birds, sak in "two persons", teens glue). 3.5 Question forms R-g (RULE-046/048). 3.6 Casing and pronoun consistency R7/R8. Regression tests: one unit test per rule ID using the rule's own example, generated from the conformance script, so rule to engine linkage becomes enforced (currently 0).

### Phase 4: Native validation relay (Thangseng, batched)
4.1 Claims marked needs_native_validation on P0/P1 rules: 005, 006, 009, 014, 018, 024, 026, 030, 031, 034, 035, 036, 037, 038, 039, 041, 043, G2 (RULE- prefix omitted; see rule map). 4.2 Lexical variant questions surfaced here: Bao vs Bano, Antichi vs Bajalchi, mewa vs bite, a'bil vs Bol, why/because Maina. 4.3 -jaha vs -manaha overlap forms for "has stopped/has eaten". Each batch as THANGSENG_RELAY_QUESTION doc; no rule promoted without native evidence.

### Phase 5: Close-out
Rebuild map, target: runtime match >= 90% on rule examples, 0 orphan examples, 0 verified ties untracked, lint green, npm audit triaged. Set lint and rule-conformance as gates in `npm run build`.

## Owners and decisions needed from Project Owner
Claude A: Phases 0, 1, 2. Claude B: Phase 3 (needs handoff; not touched by A). Thangseng via relay: Phase 4. PO: (1) approve rule-conformance report becoming a build gate; (2) rule the variant items in 4.2 if native relay is not wanted; (3) confirm sak has no raka dot (G1).

## Repository status at close
Docs only. WORKSTATE/SESSION_BOOTSTRAP not updated (Phase 0.1). Verify HEAD vs origin/main after push.

## Update 2026-09-28 (Project Owner answers, Phase 0 executed)
- Gate: delegated to Claude A. Decision: report-only in `npm run build` now (only 53% of examples match, enforcing would block deploy); `--enforce` with a baseline (44 known mismatches) is available now and becomes the build gate at Phase 5. Provenance: Project Owner directive, chat, no transcript.
- Spelling variants (nokkimao/kokkimao, Uo/Ua, Bao/Bano, a'bil/Bol, Antichi/Bajalchi, mewa/bite): deferred by Project Owner until something major; Phase 4.2 items on hold.
- Sak raka: Owner wrote "anything with (-) (') take the raka. Sak is a classifier." Not applied. It does not say whether sak takes a dot before number suffixes (current data: no dot, 60 rows; king/gong dot; mang/pang none), and the apostrophe part conflicts with the standing normalization ruling that `'` is a distinct prefix, not raka. Awaiting one clear answer; RULE-038 sak/mang wording stays untouched until then.
- Phase 0 done: 0.2 PAT prefixes scrubbed (5 docs); 0.3 scripts/audit-rule-conformance.mjs + docs/RULE_CONFORMANCE_REPORT.md + baseline. 0.1 reduced to a next_action entry: audit finding F1 (stale WORKSTATE head) is withdrawn; per head_convention `head` deliberately lags.

## Update 2026-09-28B (Phase 1 executed: RULE-038)
- Sak: Project Owner confirmed no raka dot ("saksa not sak.sa no rakka"). Already correct in code and in RULE-038 -- no change needed; recorded as re-confirmation.
- Fixed (docs-only, no data/engine changes): RULE-038's mang examples had a stale raka dot (mang is dot:false, confirmed 2026-09-18/19); "ten birds" example cited the superseded do·a form instead of the verified_high do·o form, and its own "do·a/do·o real minimal pair" claim is now flagged as data-contradicted rather than asserted.
- NEW open finding, filed here rather than guessed: king's raka-dot status is internally contradictory. The classifier engine treats king as no-dot (direct 2026-09-19 Owner directive), but 10 existing verified_high dictionary rows for book-counting still ship with the dot. Same classifier, different output depending on whether the phrase is already in the dictionary vs freshly composed. Needs one fresh citation before any fix -- do not infer, per the documented 2-3x flip history on mang/gong/jol/se. Added to Phase 2 (data-side fix once decided) and Phase 4 (native relay question).
- Conformance baseline regenerated: 51/93 examples match (was 50/94); gate green.
