# Claude B session migration, 2026-11-02 (close-out)

Author role: Claude B (engine lane). Reports only B's work this session. NV: this session = NV-250 (A took 247-249). Next free: 251. Cite by commit hash.

## Project identity
Lean-Garo- (English -> Garo/A·chik translator). Read first: this file, `.ai/WORKSTATE.yaml` `claude_b.next_action_20261102`, then docs/CLAUDE_A_SESSION_MIGRATION_20261031.md and docs/CLAUDE_B_NV250_THANGSENG_RELAY_20261102.md. Previous B close: docs/CLAUDE_B_SESSION_MIGRATION_20261101.md.

## First item for the next session (Rule 10)
`git fetch`; `git log --oneline <close commit>..origin/main`; resync, do not assume nothing changed. This session started at 95a5770 and rebased onto Claude A 65a65ea (NV-247..249). Push status: see the final line of the WORKSTATE entry (no token stored; B 20261101 commits 8c9b322/95a5770 were already on origin).

## State at close
Gate on the final tree: build exit 0; unit 1151/1151; 0 NEW conflicts/placeholders/mismatches/collisions; conformance 79/112 (0 not in baseline); runtime sweep 15,743 calls / 0 errors; audit-mechanical 1,329 probes: invariance 0, irregular-past UNKNOWN 0, hygiene 0, mid-sentence capitals 0, paradigm mismatches 0. NOT run: strict no-drop, stress_237, browser/UI.

## Done (personally performed)
- NV-250 Thangseng relay (commands, requests, tenses): corrections pins `write a letter` = Chitti sebo, `please read the book` = Ka·sapae ki·taprangko poraibo; confirmation tests for the rest (detail in the relay doc).
- Engine: imperative-object-ko drops -ko for rice/water in every command form and no longer prints `Ka·sapae.` with a full stop (closes A's handoff 20261101 ask 1).
- Removed my duplicate corrections rows for eat rice / drink water (A's master rows hold them, Rule 8).
- Updated tests/unit/imperative_object_ko.test.js (two superseded derived assertions).

## Native vs derived
Native (Thangseng 2026-11-02): all rows in the relay doc. Derived: rice/water bare-object generalisation to all command surface forms (grammar logic from native exact examples); `he is running away` only for `he` (she/I/they not generated; `running away` still leaks `[UNKNOWN]ko` for non-pinned subjects, e.g. `She is running away.`).

## Done, second Thangseng message (same day)
Run fast = Ta·rake katbo (pinned); he/she is running away = Ua katangenga (pinned + particle-verb aspect rule); know negative spelling `u·ija` everywhere, derived u·ia stem for all know negatives; `Run away!` = Katangbo! (derived). See the relay doc, last section.

## Open / handoffs
1. (closed) Run fast. (closed) `[UNKNOWN]ko` leak for run away. Closed later: `Sit down!` = Asongbo, `Come in!`/`Wake up!` ship dictionary rows (unverified/weak). Still open: `He is waking up.` / `He woke up.` (no verified wake-up stem; ask Thangseng with tense labels), (resolved by Owner: final baseline spelling is `u·ija`, applied to every know negative and the `i do not understand` pin; the VERIFIED master row `i don't understand` = `Anga man·ja` is kept, so the two understand rows still differ: Owner/Claude A to decide if `i do not understand` should follow man·ja.)
3. Is bare habitual object a general rule (bread, milk, tea)? Owner/Thangseng; keep rice/water only.
4. Claude A: master `i don't know` row still `Anga uija.` (now `u·ija`; B's phrase_maps row wins at runtime), `i do not understand` spelling, master `help!` row and `stop!` = Sengbo row; drop corrections:help! baseline row.
5. Thangseng sent/answered this round; still unconfirmed from older lists: `like!` = namnikbo, `walk!` = re·mambo.
6. Not run: browser/UI, strict no-drop, stress_237. Acceptable variants not pinned: Chitti kingsa sebo, Anga uko u·iaha, Ua achakrang nang·nima?.

## Standing rules
1. State the tense whenever a sentence goes to Thangseng. 2. Never invent Garo. 3. PAT: pasted in chat again; used one-shot, remote reset to the plain URL; revoke it and never store it. 4. Rebase onto origin before pushing; generated files take upstream. 5. Owner rulings carried: no extra raka dot in come/go/bring; mid-sentence capitals neutralised; delete replaced rows.

## Exact next step
Revoke the PAT, issue a new one; fetch, rebase, rerun the gate, push; take Owner rulings on Open 1 and 3 and the Run fast question; scope the `run away` particle rule with Claude A.

## Addendum (8pm Thangseng answers)
Wake up! = Mikrakbo, He is waking up. = Ua mikrakbaengaha, He woke up. = Ua mikrakaha, Come in! = Ning·chi re·babo (confirmed), Get up! = Chakatbo (confirmed): pinned, tests added, gate unit 1156/1156, sweep 15743/0. Claude A: replace master `wake up` = Chakatboha with Mikrakbo and drop baseline `corrections:wake up`. Ask Thangseng next: I woke up. (past), He wakes up. (present), He will wake up. (future), He did not wake up. (past negative), and whether the continuous suffix is verb-specific (katangenga vs mikrakengaha).
