# Claude A Session Migration — 2026-09-09
Resumed from `docs/CLAUDE_A_SESSION_MIGRATION_20260908C.md`.

## 1. Resync
- Cloned repo fresh with session PAT. HEAD == origin/main == `226b41b` on arrival, matching the prior migration doc. `git status` clean.
- Full gate reconfirmed green before starting: 8251/8251 dictionary, 9/9 grammar.

## 2. Work performed (Batch A close)
Source: `.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json` + `docs/AGENT_A_B_C_LANGUAGE_ENGINEERING_HANDOFF_20260908.json`.

- **able**: promoted `able -> man·a` (master_dictionary.json #3780) from variant/unverified to VERIFIED/HIGH, and added a new `able -> ama` VERIFIED/HIGH row, citing the handoff's `OPEN_EVIDENCE_PROMOTION` instruction (english_can/english_able both = [ama, man·a], supported by the relayed Thangseng "leave ama and man·a to be used freely" evidence already used to verify `can`). Left the separate `able -> ham·sok·a` row untouched (distinct, unresolved form). Live-verified: `translate('able')` -> `ama`.
- **bi·sa rule**: added `docs/grammar_rules_structured/RULE-049.yaml` documenting bi·sa as a productive child/young-one marker (not droppable). Added `kitten -> menggo bi·sa` VERIFIED/HIGH (master_dictionary.json new row), paralleling existing `achak bi·sa`/`matchu bi·sa`. Live-verified: `translate('kitten')` -> `mengo bi·sa`. The already-flagged Me·a-vs-me·a-bi·sa internal contradiction (docs/CLAUDE_A_SESSION_MIGRATION_20260908B.md) remains open — not re-resolved here, no new evidence for it this session.
- **male/female**: audited `man/male -> Me·asa` and `woman/female -> Me·chik` — both already VERIFIED/HIGH and correctly distinct from the bound compound form `Me·a`. No change needed.
- **ska/skenga/sikenga cluster + ·ko rule + ska· trailing-dot form**: deliberately **not** resolved. The handoff explicitly marks this `NARROW_OPEN_USAGE_QUESTION` / "Do not mass-correct." On inspection this is the right call — a genuine corpus-internal contradiction: the new handoff evidence includes `Anga bi·na sikenga`, but `sikenga` was superseded corpus-wide on 2026-08-26 as a stale regression. There's also an unresolved `ska` vs `ska·` (trailing raka dot) duplicate-VERIFIED conflict for "want to eat" (#107 vs #9903), and a thin (2-datapoint) `-ko`-retention pattern that isn't yet a rule. All three written up as numbered questions in `docs/THANGSENG_RELAY_QUESTION_20260909.md` for a dedicated native relay, per evidence-first methodology (no guessing).

## 3. Gate
8252/8252 dictionary, 9/9 grammar, JSON compliance ✅. `pickPrimary` verified-tie count went 24→25 (new able ama/man·a tie — same category as the pre-existing can ama/man·a tie, not a regression). No engine code touched.

## 4. Runtime Handoff (mandatory section)

**bi·sa productive-suffix gap (Claude B action needed).** Engine currently has no morphological rule for bi·sa — every young-animal/child compound (`achak bi·sa`, `matchu bi·sa`, `menggo bi·sa`, `me·a bi·sa`, `me·chik bi·sa`) exists only as a hardcoded dictionary row. `src/translationEngine.js`'s only compound mechanism is a generic hyphen-split fallback (`compoundWords`/`compound-split`, confidence 0.60) with no semantic awareness of bi·sa as a productive young-one marker. RULE-049 (this session) documents bi·sa as productive across categories, but the runtime doesn't act on that — any animal noun not already given an explicit `<animal> bi·sa` row will fail to produce a "baby/young <animal>" translation at all.
- Required fix: implement bi·sa as a generative suffix — when English input matches a young-animal/child pattern (e.g. "baby X", "young X", "kid" for an animal already in the dictionary), append bi·sa to that animal's verified Garo noun rather than requiring a dedicated dictionary row per animal.
- Test cases (already VERIFIED/HIGH, use as regression fixtures): puppy→achak bi·sa, calf→matchu bi·sa, kitten→menggo bi·sa, little boy→me·a bi·sa, little girl→me·chik bi·sa.
- Do not adjudicate linguistic scope (which animals bi·sa productively applies to) — that's Claude A's call if any edge case surfaces; this handoff is the engineering mechanism only.
- No engine code was touched this session (linguistic-only), so this is net-new scope, not a regression from tonight's dictionary edits.

## 5. Repository status at close (verified, not asserted)
- HEAD: `2564ddc` (verify via `git log -1`)
- origin/main: matches HEAD exactly (pushed, confirmed via `git push` output `226b41b..2564ddc main -> main`)
- `git status`: clean, no local/uncommitted changes
- `.ai/WORKSTATE.yaml`: updated (claude_a.next_action)
- `.ai/SESSION_BOOTSTRAP.md`: updated
- Migration doc: complete (this file)
- Native-validation/blocker status: ska/skenga/sikenga cluster + ·ko rule + ska· form blocked on dedicated Thangseng relay (`docs/THANGSENG_RELAY_QUESTION_20260909.md`); no other blockers

## Next Recommended Task
Send `docs/THANGSENG_RELAY_QUESTION_20260909.md` to Thangseng via Tridip. It's the only remaining open item from the original Batch A/B closure-pass list.
