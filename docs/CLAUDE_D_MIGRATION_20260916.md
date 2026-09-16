# Claude D — Migration Document (2026-09-16, end of session)

**Read this whole document before doing anything.** This conversation ran long
enough that the Project Owner asked for a clean handoff rather than continuing
in a degraded context. Everything below is accurate as of the sync performed
immediately before writing this doc. Re-verify the "current state" numbers
yourself before trusting them — that's not optional, it's happened to matter
multiple times in this very session (see "Things that bit me" below).

---

## 1. Who you are and what governs you

**You are Claude D — forensic segregation and discrepancy audit for this
repo's Garo-English dictionary system.**

Default mandate, always: **observe, classify, flag.** Never adjudicate which
Garo form is linguistically correct (Claude A's call). Never make
engineering/runtime decisions (Claude B's call). Never touch
`master_dictionary.json`, `garo_dictionary.json`, or any runtime/compiled
file **on your own initiative.**

**The one exception**, exercised repeatedly and correctly this session: a
live, in-chat instruction from the Project Owner overrides the standing
"never delete" default **for that session**, but only when:
1. The full candidate list is shown to the Owner first, in enough detail to
   actually evaluate (not just a count).
2. The Owner explicitly confirms.
3. Every target row is exact-matched (idx, english, garo, confidence)
   immediately before the write, via a script that **asserts** the match and
   the resulting record count, aborting rather than deleting on any mismatch.
4. The full repo is re-synced (`git fetch && git reset --hard origin/main`)
   immediately beforehand, and again immediately before every push, checking
   for concurrent commits from A/B/the Owner. This is not paranoia — it
   happened multiple times per hour in this session.

Read `.ai/PROJECT_OWNER_DIRECTIVE_PROTOCOL.json`, `.ai/WORKSTATE.yaml`
(search for `claude_d:`), and `.ai/CLAUDE_D_HANDOUT.md` for the fuller
governance context if anything here is ambiguous — this doc is a summary of
this session, not a replacement for those.

---

## 2. What this project is

Lean-Garo: an English↔Garo translation platform (Garo is a Tibeto-Burman
language of Meghalaya, India) built by a multi-agent pipeline — Claude A
(linguistic authority), Claude B (engineering/runtime), Claude C (earlier
independent audits, less active now), Claude D (you). Two human collaborators
(`t-barman`, `pittingsonsangma49-cpu`) built the original pre-agent version.
Coordination happens entirely through the git repo — commit messages, `.ai/`
docs, and `docs/` handoff files — not shared chat memory, because sessions
don't persist. **This migration doc is that mechanism, for you specifically.**

Repo: `github.com/pzrjv4sfj5-prog/Lean-Garo-`. Two parallel dictionary data
sources exist and this distinction matters enormously (see §5):
- `master_dictionary.json` — the governed, confidence-tagged (`verified_high`
  / `unverified` / `superseded` / `ocr_flagged` / etc.) dictionary. This is
  what you audit.
- `garo_dictionary.json` — a separate, **untagged legacy source file**
  (4,343 records, no confidence field at all). Not part of your original
  audit scope, but you cannot safely ignore it — see §5.

Compile pipeline (`prepare-data.js`, Claude B's territory) merges both into
`src/compiled_dict.json` (what actually ships). Key mechanism: a
`superseded`-tagged row in `master_dictionary.json` can **suppress** a
matching garbled value in `garo_dictionary.json` from ever reaching compiled
output — even though the `superseded` row itself is never served either. This
is confirmed from reading `prepare-data.js` source directly (not inferred).

---

## 3. What happened this session, in order

### Phase 1 — Audit tooling, rebuilt from scratch
Prior sessions' segregation-audit tooling and output had never been pushed to
`origin/main` (confirmed absent before starting — this is a recurring failure
mode this project has hit more than once, including by me, see §7). Rebuilt
`audit/segregation/build_segregation.py`, ran a full pass across all 10,180
records as of session start.

### Phase 2 — Full forensic analysis (Project Owner's 16-section directive)
Two passes (`build_full_forensic.py`, `build_refresh.py`) covering repo state,
generated-counting detection, malformed-key detection, duplicate/shared-Garo
separation, confidence/provenance forensics, orthography audits, P0–P6
priority ranking. Delivered as evidence packages for Claude A — **no
verdicts, `MULTIPLE CANDIDATES` framing throughout.**

### Phase 3 — Classifier ground-truth reference
`audit/segregation/CLASSIFIER_GROUND_TRUTH_REFERENCE.md` — cross-checked
`data/garo_number_classifier_engine_machine_ready.json`'s 16-entry classifier
table (`sak, mang, king, ge, se, pang, dot, jol, rong, dam, roa, kg, litre,
plate, bol, akka`) against every counted-noun record in the corpus. This
became the basis for justifying every deletion batch that followed.

### Phase 4 — Deletion batches (Owner-confirmed, one at a time)

| Batch | What | Rows | Commit |
|---|---|---|---|
| 1 | Cross-noun placeholder (`chet mang·gni` etc., dog/cat/bird/fish/apple + malformed plurals) | 12 | `913ffd1` |
| 2 | Same pattern, Family 1 (animal) + Family 2 (misc: river/student/water) | 200 | `bec4fae` |
| interim | `student`=`Porai·gipa`, stale base-word duplicate (not a counting issue) | 1 | `47d03d7` |
| 3 | Same pattern, Family 3 (object: book/car/house/tree) | 75 | `756ec59` |
| 4 | Same pattern, Family 4 (food/rice) | 40 | `896cc6d` |
| 5 | Wrong classifier: `apple` using `se` (Tools) instead of `rong` (Fruit), all counts 1–20 | 19 | `cabca84` |
| 6 | **Missing classifier** (noun+numeral fused, no classifier token at all) — person/teacher/book/car/banana/road/mountain/village | 193 | `61a4e1a` |
| 7 | Same shape as Batch 6 — two car/road/mountain/village (held back pending B's confirmation, then released) | 4 | `f68fd6e` |

**Total: 544 rows deleted this session** (12+200+1+75+40+19+193+4).

### Phase 5 — The regression, and what it taught

Batch 6 broke 3 live keys in production (`two cars`, `twenty students`,
`six dogs`) — deleting their `superseded` master row removed the thing
suppressing a byte-identical garbled duplicate in `garo_dictionary.json`,
which then shipped live. **Claude A caught it, diagnosed it, re-added the 3
rows as explicit suppressors.** A 4th case (`eight dogs`, from all the way
back in **Batch 1**) was found broken by Claude B in the same way, just
today (commit `6359fed`) — **it had been silently broken since Batch 1 and
nobody caught it until now.** This is why re-verification matters more than
confidence in a methodology that worked N times before.

I asked Claude B to confirm the exact mechanism before doing anything more:
`prepare-data.js`'s `supersededByKey` only triggers suppression on
`confidence==='superseded'` (or a notes field starting `SUPERSEDED`) —
**`unverified` rows never trigger it.** This is why Batch 7 (all `unverified`)
was confirmed safe by Claude B reading source directly, not by my inference.

---

## 4. Current repository state (re-verify before trusting)

As of the sync performed writing this doc:

| Field | Value |
|---|---|
| HEAD | `6359fed9327b0ec31b1103e4e5a942893d25db9d` |
| `master_dictionary.json` hash | `ebedc90f6871a299ba902235624e35f5e1daacda` |
| Record count | **9,637** |

Command to re-verify: `git fetch origin && git reset --hard origin/main &&
git hash-object master_dictionary.json`. **Do this before acting on anything
in this document** — the repo moved multiple times per hour all session,
from both Owner-directed and autonomous A/B work.

---

## 5. Standing rules established this session — do not relitigate these

1. **Every deletion needs three things true simultaneously**: `confidence`
   isn't the only signal that matters (see #2), a correct alternative exists
   *under the exact same English key string* (not just the same normalized
   root — see the Batch 6 postmortem), and the Owner has seen and confirmed
   the specific candidate list.

2. **Before proposing ANY future deletion, cross-check `garo_dictionary.json`
   for an exact-value match at that key.** If one exists, the
   `master_dictionary.json` row may be a suppressor, not debris — deleting it
   can ship the garbled duplicate live even if a "correct" `verified_high`
   form exists elsewhere in `master_dictionary.json` under a *different*
   phrasing of the same key. This is the single most important lesson from
   this session; it caused two regressions before it was fully internalized.

3. **`confidence=unverified` does NOT trigger suppression; only
   `confidence=superseded` (or a notes field starting literally `SUPERSEDED`)
   does.** Confirmed from `prepare-data.js` source by Claude B, commit
   `bf94f87`. Don't re-derive this by inference — it's a fact about the
   engine, not the data.

4. **These specific rows are permanent suppressors — never delete them,
   even though they match every "safe to delete" pattern this session used**:
   `two cars`=`rang·gni`, `twenty students`=`chi chi chik·gni`,
   `six dogs`=`dokka mang·gni`, `eight dogs`=`chet manggni` — all
   `confidence=superseded`, all with explicit notes saying exactly why they
   were re-added. **The authoritative, machine-generated list is
   `docs/SUPERSEDED_ONLY_KEYS.md`** (regenerated on every build — read it
   fresh, don't trust this doc's copy of it) — as of this session it lists
   53 held-back keys total, including a large family of `how/what/when/
   where/which/who/why + bird/cat/dog/fish?` question forms all sharing
   generic placeholder answers (`mang?`, `kama mang?`, etc.) that I have
   **not** investigated — this looks structurally similar to everything
   this session hunted through, but for interrogative sentences instead of
   counting forms. Worth a look, not yet started.

5. **I misdiagnosed something earlier this session and want the record
   corrected**: I flagged "`sak` missing from `RAKA_CLASSIFIERS`" as an open
   bug multiple times, treating it as equivalent to the `king`/`mang` fixes
   in progress at the time. On closer reading of `src/garo_classifier.js`,
   `sak` was **never supposed to be in that set** — it's correctly a
   no-raka/fused classifier throughout (`Chattro saksa`, `Skigipa sakgni`),
   confirmed by every correct example in the corpus. There was no `sak` bug.
   Don't chase it.

6. **The `mang` classifier's raka-dot convention was reversed** (Owner
   directive 2026-09-13, direct Thangseng citation: "mang genuinely has no
   raka dot, full stop"). This was a big data-correction pass — I initially
   thought it was still open when I saw a commit message mention "~151 rows,
   110 verified_high" needing correction, but checking the actual current
   data showed only 24 rows contain the string `mang·`, and all 24 are
   unrelated words that happen to contain that substring (`mang·rak·a` =
   healthy/strong, etc.), not the counting classifier — **the bulk
   correction (commits `22b3e6d`, `c234957`, `5628bd2`) already happened.**
   Don't re-open this either. (I'm documenting my own double-check here so
   the next session doesn't have to redo it.)

---

## 6. What's genuinely open — pick from here, don't invent new scope

1. **`garo_dictionary.json` itself has never been cleaned up.** Every
   suppressor-row regression this session traces back to the same root
   cause: that file still contains the original garbled/generated values,
   untagged, with no confidence system. Claude B's `eight dogs` fix commit
   (`6359fed`) says explicitly: *"Root fix is removing the stale row from
   garo_dictionary.json itself — Claude D's lane."* This is the most
   concrete, explicitly-assigned next task. Scope it carefully — you now
   know from this session's mistakes that a naive "delete anything that
   looks like debris" pass on a second file is exactly how the last two
   regressions happened. Cross-check compiled output impact before touching
   anything there, and get Owner confirmation the same way as every batch
   this session.

2. **The interrogative-form family in `docs/SUPERSEDED_ONLY_KEYS.md`** (see
   §5.4) — 44 of the 53 held keys are `how/what/when/where/which/who/why +
   bird/cat/dog/fish?`, all sharing suspiciously generic placeholder answers.
   Not investigated this session. Possibly the same class of generated
   contamination as everything else, possibly something else entirely.

3. **The large adjudication backlog already handed to Claude A**, not yours
   to act on but worth knowing about: 68 `verified_high` ties (P0), 1,914
   shared-Garo clusters, 1,585 same-English/different-Garo clusters, the
   `apple`/`Apple`/`te·spu` base-word tie. Full detail in
   `audit/segregation/CLAUDE_A_EVIDENCE_PACKAGE_REFRESH.md` (confirmed
   genuinely on `origin/main`, not just locally — see §7 for why that
   confirmation matters).

4. **Small unresolved leftovers, low priority**: the `coin`/`tangka gong·X`
   family (a native-correction root-completeness question, not generation
   debris — don't treat it like the other batches), and a bare number-word
   variant (`two`=`gini`, idx varies, re-locate by content not index).

5. **`river` has no `verified_high` base word at all** (three competing
   `superseded` candidates: `Chibima`, `gang`, `no·di`, plus one oddly-
   capitalized `verified_high` `chi·bi·ma`). **`water`'s only base-word
   entry is `unverified`.** Both are linguistic gaps for Claude A, flagged
   but not resolved.

---

## 7. Things that bit me this session — don't repeat them

- **I built 16 files under `audit/segregation/` and shared them with the
  Owner via chat download links, but never `git add`ed the directory.** It
  showed as `?? audit/` (untracked) in literally every `git status` I ran
  this entire session and I never acted on it, until the Owner (relaying for
  Claude A) told me Claude A couldn't find the files at all. Lesson: a
  chat-visible download link is not the same thing as "in the repo." Verify
  with `git show origin/main:<path>` — not just "git push succeeded" — before
  telling anyone a file is available.
- **A `git diff --stat` showing more churn than expected (63 insertions
  instead of the usual 1 bracket-shift line) is worth stopping for.** I did,
  once, and it turned out to be harmless (git's line-alignment shifting
  around a large deletion block) — verified by a full semantic diff
  (`old records minus exactly these N indices == new records`, checked as
  parsed JSON, not text). Do this check every time the diff looks bigger
  than the record count would predict; don't assume it's fine.
- **A methodology that worked correctly 5 times in a row (Batches 1–5) still
  had a real gap** (the `garo_dictionary.json` cross-check) that only
  surfaced on Batch 6, and even then, one earlier casualty (`eight dogs`,
  Batch 1) sat broken in production for the entire rest of the session
  before anyone noticed. Confidence built from repetition is not the same
  as confidence built from having checked the actual failure mode.

---

## 8. Exact next step

Start by re-syncing and re-verifying §4's numbers. Then either:
- **(a)** Take on `garo_dictionary.json` cleanup (§6.1) if the Owner
  confirms that's the priority — scope it as its own careful, batch-wise,
  Owner-confirmed process exactly like this session's `master_dictionary.json`
  batches, not a single sweep.
- **(b)** Investigate the interrogative-form family (§6.2) as a
  lower-stakes starting point — it doesn't touch `garo_dictionary.json` or
  live suppressors directly, so it's a safer place to (re-)build confidence
  in the methodology before touching the higher-risk file.

Either way: show the Owner the candidate list before touching anything,
exact-match verify immediately before any write, semantic-diff verify after,
re-sync before every push, and report to Claude A/B when done. Same
discipline as every batch this session — it worked, when followed exactly.
