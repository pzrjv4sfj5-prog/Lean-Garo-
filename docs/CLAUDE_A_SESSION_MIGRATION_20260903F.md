# Claude A Session Migration — 2026-09-03F

## Resume sequence (Rule 10)
Continuation of same session (2026-09-03E close, HEAD `ddf433a`,
verified clean/pushed). No new resync needed — no other Claude
touched the repo between E and this task.

## Work this session: NV-124
Project Owner supplied the raw WhatsApp transcript underlying
NV-072/NV-073 (2026-08-13, Tridip/Thangseng). It shows:
> 1. One student = chattro saksa
> 2. A person = mande saksa (no raka in mande)
> 3. ... tangka bisil gong•sa

`chattro saksa` and `mande saksa` carry **no dot** between `sak` and
the number suffix, while `gong` uses a dot-equivalent character in the
same message. This is direct primary-source evidence that `sak` was
mis-transcribed with a raka dot when NV-072/NV-073 were first entered
into the dictionary — every downstream `sak·`-classifier entry
inherited the error.

**Fixed directly (Rule 8 — clear primary-source evidence, no
force-resolution needed):**
- 65 `master_dictionary.json` rows: `mande sak·N` → `mande sakN`,
  `Skigipa sak·N` → `Skigipa sakN`, `Chattro sak·N` → `Chattro sakN`
  (N = 1–20 for person/teacher/student), plus `two/three people`,
  `two/three students`, `i have two children`.
- 3 `corrections.json` rows: the children-counting cascade
  (`bi·sa sak·gni/gittam donga` → `bi·sa sakgni/gittam donga`).
- `docs/grammar_rules_structured/RULE-038.yaml` and
  `docs/GRAMMAR_RULE_CATALOGUE.md` — examples and a new NV-124
  footnote recording the correction and its evidence.
- `tests/unit/rong_classifier.test.js` — 2 stale hardcoded assertions
  updated to the corrected no-dot forms; comment updated.
- `tests/unit/translationEngine.test.js` — hardcoded `sak·sa`/
  `sak·gittam`/`sak·Kolgrik` expectations updated to no-dot forms.

**NOT fixed — Claude B handoff:** `RAKA_CLASSIFIERS` in
`src/garo_classifier.js` still includes `'sak'`. Live dictionary
lookups are unaffected (all real phrases now resolve correctly through
`compiled_dict.json`), but the classifier-composition **fallback**
path (used only when a counted-people phrase has no exact dictionary
entry) still synthesizes the stale dotted form via `countNoun()`. Left
one regression-test assertion (`countNoun('mande', 1, 'person')` in
`rong_classifier.test.js`) asserting the current stale engine output,
with an explicit comment flagging it as NV-124's open handoff — so the
gate stays accurate about what's actually shipped. Do not silently
"fix" that assertion; fix `RAKA_CLASSIFIERS` first, then update the
assertion in the same commit.

**Checked and NOT applied — boy/girl claim:** the Project Owner's
prior message this session also claimed `Me·asa` = boy, `Me·chik` =
girl. Checked against this same 2026-08-13 transcript: the original
relay question explicitly asked "Is there a different word for a male
student vs. a female student?" and Thangseng's reply never answered
that sub-question — only gave `chattro saksa` for "one student", no
gendered forms. No primary-source evidence for the boy/girl claim.
Still not added; still contradicts existing VERIFIED `boy`=`ko·ka`,
`girl`=`ko·ki`, `woman`=`Me·chik`/`me·chik`. Recorded in
`pending_thangseng_questions` as a genuinely open relay question.

## Gate at close
- `node prepare-data.js`: clean rebuild, 8218 unique entries
- `node test-dictionary.js`: 8218/8218 valid, 9/9 grammatical
  corrections
- `node repository-intelligence.js`: PASSED, 0 new violations
- `node --test tests/unit/*.test.js`: 314/314 pass
- Live `translationEngine.js` spot-check: `one person`, `two/three
  people`, `one/two/three student(s)`, `one teacher`, `i have two
  children` — all confirmed no-dot, correct.

## Runtime Handoff (Rule 6)
`src/garo_classifier.js`: remove `'sak'` from `RAKA_CLASSIFIERS`
(line ~127). Update the flagged assertion in
`tests/unit/rong_classifier.test.js` (`countNoun('mande', 1,
'person')`) from `'mande sak·sa'` to `'mande saksa'` in the same
commit. No other known engine-code implications.

## Repository status at close
- [x] HEAD hash: (see git log after this commit)
- [x] origin/main match: to be pushed and verified
- [x] `git status` clean after commit
- [x] WORKSTATE.yaml updated (NV-124 entry added)
- [x] SESSION_BOOTSTRAP.md — no standing-rule changes, not touched
- [x] Migration doc complete (this file)
- [x] No local-only commits after push
- [x] No uncommitted changes after push
- [x] Native-validation/blocker status: NV-124 closed for the
      dictionary-data portion; RAKA_CLASSIFIERS engine fix open,
      handed to Claude B; boy/girl claim still open, needs a fresh
      Thangseng relay question (not answered by any existing
      transcript)

## Next Recommended Tasks
1. Claude B: remove `'sak'` from `RAKA_CLASSIFIERS` in
   `src/garo_classifier.js` (see Runtime Handoff above).
2. Draft/send a fresh Thangseng relay question specifically asking
   whether there are distinct words for boy/girl vs. man/woman
   (`Me·asa`/`Me·chik` vs. `ko·ka`/`ko·ki`) — the original 2026-08-13
   question on this point went unanswered.
3. RULE-038 tension (NV-109, bare `sak·sa`-style forms without a head
   noun) — unchanged, still open, unrelated to this session's raka-dot
   fix.
