# Claude A Session Migration — 2026-09-10

## Project identity
Lean-Garo — Garo language dictionary + English-to-Garo translation engine.
Repo: `github.com/pzrjv4sfj5-prog/Lean-Garo-`. Multi-Claude architecture:
Claude A = linguistic authority (this role — grammar, dictionary quality,
native validation review). Never touches engine code (Claude B), audits
(Claude C), or OCR ingestion (Claude D).

## Current commit/state at close
- Branch: `main`
- HEAD: (see "Repository status at close" below — verify at resume,
  do not assume it hasn't moved since this doc was written)
- This session's own commits: `de4ad5b` (eleven–nineteen promotion),
  `d1e642a` (full number table push 1–100000), plus this session-close
  commit (WORKSTATE/BOOTSTRAP update + bullet→raka fix in the classifier
  engine file).
- One push collision this session: a concurrent Claude B commit
  (`fix(counting): add missing tens words (30-90) to NUMBER_WORDS`,
  `src/garo_classifier.js`) — rebased clean, no file overlap, gate
  re-verified green post-rebase before push.

## What's done vs. held, and why

**Done and pushed:**
- Eleven–nineteen (`Chi·sa`…`Chi·sku`): promoted `unverified`→
  `verified_high` in `master_dictionary.json`. Values were already
  correct (already `verified_high` in `final_entries.json`, matching
  `garo_dictionary.json`) — just unpromoted in master. Confirms the
  already-established native-confirmed teens rule.
- Full number table review: read `data/garo_number_system_machine_ready.json`
  (GPT-drafted, landed by Claude B commit `2b78781`) in full, cross-checked
  every record against `master_dictionary.json`, presented the complete
  1–100 table plus 200–900/1001–1900/2000/10000/100000 to the Project
  Owner in chat for verification before touching the repo.
- After Project Owner confirmation: promoted 17 existing bases (`one`,
  `three`–`ten`, `twenty`–`ninety`, `one thousand`) `unverified`→
  `verified_high` (values unchanged); added 108 new `verified_high`
  entries (72 compounds for 21–99 = tens SPACE unit; 36 landmarks for
  100–100000 per the file's stated composition rules). Category
  `numbers` throughout. Source and Project Owner confirmation cited in
  every new/changed row's notes.
- Read `data/garo_number_classifier_engine_machine_ready.json` in full
  and explained it to the Project Owner in chat: the
  noun→category→classifier→number→surface pipeline, the category/
  classifier table (sak=human, mang=animal, king=flat/thin, ge=general/
  banana, rong=fruit-drink-egg-alcohol, pang=plant, dot=wood/mountain,
  jol=pole, se=tools, bol=transport, plus measurement/food units), the
  default surface rule (`NOUN SPACE CLASSIFIER SPACE NUMBER`) vs. the
  human-40+ fused exception (`Chattro saksotbri sa`), and the hard
  rules (Master Dictionary noun lookup always first, never invent a
  noun, classifier/number stay separate internal fields). No repo
  changes needed for the explanation itself.
- Normalized a bullet (`•`) vs. raka-dot (`·`) mismatch in
  `data/garo_number_classifier_engine_machine_ready.json` — 8 fields
  (`Me·asa`, `Bi·sarang`, `Me·chik`, `Te·rik` ×4, `A·bri` ×2, plus their
  `surface`/`counting_logic` echoes). This is a known transcription-typo
  pattern already documented in master_dictionary.json (NV-130/NV-124/
  NV-154 precedent — bullet and raka dot conflated in casual WhatsApp/
  typed source text, no meaning distinction). Confirmed via grep that
  this file is **not yet referenced by any file under `src/`** — zero
  runtime consumption today, so this was a pure data-hygiene fix with
  no live-bug risk. Gate re-verified green after.
- Gate green across all three batches this session: 8372/8372
  dictionary entries, 9/9 grammatical corrections, 0 new
  repository-intelligence violations, 379/379 unit tests. Live-verified
  a spread of the pushed numbers via `translate()` (forty two, ninety
  nine, two hundred, one thousand five hundred, ten thousand, one
  hundred thousand, twenty one — all correct).

**Held / not started:**
- Nothing was deliberately deferred this session. The number-table push
  (1–100000, per the Project Owner's spec) is complete.

## Open issues (root cause, where known)

- **BLOCKING for Claude B before consuming either GPT machine-ready
  file:** both `data/garo_number_system_machine_ready.json`
  (`composition_rules."11_19"`) and
  `data/garo_number_classifier_engine_machine_ready.json`
  (`number_engine.rules."11_19"`) state the 11–19 rule as `"Chiking
  SPACE unit"` (e.g. "Chiking Sni" for seventeen). This is wrong — the
  corrected, native-confirmed form is the fused `Chi·`-prefix
  (`Chi·sni`), already live in `master_dictionary.json` as
  `verified_high`. Neither GPT file's rule string has been edited —
  that's Claude B's file to correct (data-file ownership under the
  agent_contracts in the classifier-engine spec is shared, but the fix
  sits inside content Claude B will consume programmatically, so
  flagging rather than silently editing). Full detail in
  `.ai/WORKSTATE.yaml` under `claude_b.pending_handoff_from_claude_a_20260910`.
- **Not a bug, just unverified provenance:** the classifier engine
  file's `surface_policy.human_40_plus` fused-surface rule (`Chattro
  saksotbri`, `Chattro saksotbri sa`) is labeled "Owner-confirmed" in
  the file itself, not a direct Thangseng transcript. Treating it as a
  Project Owner directive (valid, per `.ai/PROJECT_OWNER_AUTHORITY.md`)
  rather than native-validated — no action needed unless a future
  session wants to seek direct native corroboration.
- **Runtime Handoff to Claude B: none new from my own edits this
  session** — the number-table push and the bullet-normalization fix
  are both pure data changes with no runtime code touched; gate proves
  no regressions. The only live item is the BLOCKING 11–19 rule fix
  above, which is Claude B's to make before wiring either file into
  `src/`.

## Standing rules (unchanged, restated for continuity)
- Evidence-first: resolve only on clear evidence (corpus-internal
  contradiction, already-VERIFIED rule, or direct native confirmation);
  flag and leave open otherwise.
- Thangseng is the sole authoritative native validator; Project Owner
  authority and native evidence are separate provenance categories,
  never conflated.
- Only use a PAT pasted live in the current session; never embed one in
  a file; rotate after use — **the Project Owner should rotate the PAT
  used this session now that it's done.**
- Mandatory resume sequence: `git fetch`, verify HEAD, read
  `WORKSTATE.yaml` and `SESSION_BOOTSTRAP.md` before any work.
- Always commit + push before ending a session; verify `git status`
  clean and `git fetch` + HEAD-vs-origin/main match exactly.
- Multi-Claude push collision protocol: commit → fetch → compare HEAD →
  rebase → rebuild generated artifacts → re-test → push.
- Two Claudes (A and B) are working the same GPT-file review area in
  parallel this session — Claude A owns linguistic validation/dictionary
  content, Claude B owns runtime/engine integration. Neither silently
  rewrites the other's source of truth (per the classifier-engine
  spec's own `agent_contracts` — this is now a confirmed, working
  division, not just a stated rule).

## Exact next step for the next session
1. Resume as Claude A, paste this migration document.
2. Run the mandatory resume sequence (`git fetch`, verify HEAD ==
   `origin/main`, read `WORKSTATE.yaml` + `SESSION_BOOTSTRAP.md`) —
   expect HEAD to have moved from what's recorded below if Claude B
   picked up the 11–19 fix or other work; re-sync against whatever HEAD
   actually is.
3. Check whether Claude B has fixed the 11–19 rule in both GPT
   machine-ready files (see handoff above) — if done, no further
   action needed from Claude A on it. If not done, it remains a
   standing handoff, not something for Claude A to fix directly.
4. No open number-table or classifier-file task remains from this
   session. Next work starts from whatever the Project Owner raises
   (a new relay batch, a new directive, or new categories/nouns added
   to the classifier engine file).

## Repository status at close (verify each line against actual repo, don't assert from memory)
- HEAD hash: verify via `git rev-parse HEAD` at resume.
- HEAD == `origin/main`: verify via `git fetch` + `git rev-parse
  origin/main` — exact match expected (session ended with a clean push).
- `git status`: expected clean, no local/uncommitted changes.
- `WORKSTATE.yaml`: updated this session (`claude_a.next_action`
  reflects this session's close; `claude_b.pending_handoff_from_claude_a_20260910`
  added; `repository.head` updated).
- `SESSION_BOOTSTRAP.md`: updated this session (session-close entry
  appended).
- Migration doc: this file.
- Native-validation status: no new NV items this session (all work was
  Project Owner-directed dictionary promotion/push, cross-checked
  against already-established native-confirmed rules — no new native
  relay needed or performed).
