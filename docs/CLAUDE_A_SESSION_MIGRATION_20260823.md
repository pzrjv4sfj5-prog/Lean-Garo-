# Claude A Session Migration Document — 2026-08-23

## Resume instructions for the next Claude A

1. Resume per `.ai/SESSION_BOOTSTRAP.md` **Rule 10**: fetch, verify HEAD,
   fast-forward if needed, confirm clean tree, read `.ai/WORKSTATE.yaml`
   and this doc before starting any work.
2. Read `.ai/CLAUDE_A_OPERATING_GOVERNANCE.md` if it has changed since
   its last-read date (unchanged as of this session — established
   2026-08-22, commit 86ffb26, still current).
3. Final HEAD this session: **9ef4603**. `origin/main` matches at
   session close — verified via `git fetch` + `git rev-parse` equality
   check, not assumed.

## Completed work this session

- **Resync correction (not a new finding, a bookkeeping fix):**
  `.ai/WORKSTATE.yaml`'s `repository.head` was stale (`13d951c`) at the
  start of this session. The actual git parent of the prior
  session-close commit (`7467063`) was `5c5b633` — Claude B's
  confidence-schema steps 1–2 had already merged into `origin/main`
  before that commit was authored. Corrected the pointer; no repo
  content changed.

- **NV-092** — processed a 41-item Project Owner chat-relay batch.
  - Closed 2 previously-flagged priority items: **stand up** (imperative
    `chadengbo`, alongside already-VERIFIED `stand`=`Chadenga`) and
    **take revenge** (simple form `a·jak soka`, compositional from the
    already-VERIFIED `a'jak sok-` root — previously only a noun-form
    citation existed).
  - Closed 2 items left OPEN at NV-089 close, **though runtime still
    needs reconciliation on both** (see Open Items): **they are
    working** (`Uamang kam ka·enga`) and **it is not good** (`(iade)
    namja`).
  - Extended the flagged Anga/Ango possessive-existential pattern with
    2 more data points: **i don't have**=`Ango dongja`, **i have a
    pen**=`Ango pen donga` (also a new "pen" loanword, replacing
    "kolom").
  - 4 new coexisting alt-forms (not superseding existing VERIFIED
    primaries): what-is-your-name, why-did-you-come, let's-work,
    my-father.
  - **my mother** added to `master_dictionary.json` (`ang·ni a·ai`) —
    closed a duplicate-representation gap; `corrections.json` already
    shipped this value, master's own row was still the old unverified
    `angni mama`.
  - **to spread** (`barama`) added as VERIFIED, backing an
    already-shipping `corrections.json` value with a citation.
  - Fixed 2 clean Rule-8 stale overrides (`what job do you do`,
    `i don't have`) — both mirrored the OLD superseded master row with
    no independent evidence of their own.
  - Full detail: `docs/THANGSENG_NATIVE_VALIDATION.md` NV-092.

- **NV-093** — processed a 48-item Project Owner chat-relay batch.
  - Most items were exact reconfirmations of already-VERIFIED data
    (waist, beautiful, child, coins, cold, curry, cut, daily, few,
    goat, gossip, deceive, home, hot, hurry, land, lead, log, choose,
    and the already-resolved dead/dried person-body / water-things
    splits) — no action needed.
  - Promoted 10 previously-unverified rows to VERIFIED/HIGH on
    exact/near match: backbone, basically, coin, come, dangerous,
    darkness, doctor, down, if, look.
  - Added 14 new coexisting forms/senses (none superseding an existing
    row): begin (infinitive), bland (alt), bring (imperative), bye
    (clarified), coming (progressive), cooked (past-tense-verb sense,
    distinct from the existing adjectival `min·a` sense), dance (5th
    candidate), eaten (alt, `-jok`), happy (predicate form), help
    (noun/verb), how (alt), knowledge (fuller compound), live (alt,
    `donga` root), living (alt).
  - **Bug fix, unrelated to native-data judgment:** `corrections.json`'s
    `"backbone": "kangkare"` was shipping the *waist* translation under
    the backbone key — a straight data-entry error, not a
    stale-override case. Fixed to the now-VERIFIED `jangil bolgro`.
  - Caught and removed 2 duplicate rows I nearly introduced (`help
    (noun)`/`help (verb)` already existed, VERIFIED, from a prior
    session — missed on first check since I'd only grepped the bare
    `help` key). Confirmed via `git show` against `d89d5da` that the
    other 10 exact-duplicate rows in the corpus predate this session
    and are already tracked as a separate backlog item (noted at the
    NV-089 close) — not touched here, out of scope.
  - Full detail: `docs/THANGSENG_NATIVE_VALIDATION.md` NV-093.

- **YAML integrity fixes on `.ai/WORKSTATE.yaml`** (syntax-only, no
  content change beyond what NV-092/093 added):
  - Fixed a duplicate `next_action` key I introduced under `claude_a`
    (renamed the older one to `next_action_prior_20260822c_yes`).
  - Fixed 2 unclosed YAML quotes I introduced (`current_task` and
    `next_action` fields).
  - Fixed 1 pre-existing unclosed YAML quote in Claude B's own commit
    `548cc61` (`claude_b.next_action`), found while validating the
    merge — not my edit, but broke the file for anyone parsing it.
  - Verified with `yaml.safe_load` after each fix; final state parses
    cleanly, 57 keys under `claude_a`, no other duplicates found.

- **Merged concurrent Claude B session** (`548cc61` — corrections.json
  stale-override sync for song/telling/studying, audit-only close, no
  key overlap with my own edits). Clean auto-merge, verified no file
  needed manual conflict resolution beyond the YAML quote fix above.

## Verification, every commit this session

- `npm run build`: 220/220 unit tests, `repository-intelligence.js`
  Check A/B/C/D/G all clean (0 new violations each time; 6 new Check C
  conflicts from NV-092 correctly allowlisted in
  `src/data/known_dictionary_conflicts.json`, citing NV-092).
- Every touched/added key spot-checked live via `translate()`, not
  just `compiled_dict.json` inspection.
- Git identity was unset at the start of this session
  (`root@vm.(none)`) — set to `Claude A <claude-a@lean-garo.local>`
  before the first commit.

## Open items carried forward (priority order)

1. **`yes` = Oe/Am/Hoe three-way** — still top, unchanged this session.
   Correction to how it's been characterized: `Oe` is actually
   **UNVERIFIED** per its own `confidence` field, not VERIFIED as
   earlier docs claimed — the real disagreement is between two
   independently native-confirmed forms, `Am` and `Hoe`. Still needs an
   explicit Thangseng question between those two; `corrections.json`
   currently ships `Am`.
2. **they-are-working / it-is-not-good** (new this session) —
   `corrections.json` ships a **third** form for each, distinct from
   both the old superseded master row and this session's new VERIFIED
   row. Not force-fixed — needs reconciliation, not a guess.
3. **i understand** (`uia` vs `ma·sia`, now 2 data points on the
   `ma·sia` side since NV-087), **let's drink/eat** (`-ha` VERIFIED
   forms vs this relay's `-na` forms — note the `-na` shape fits the
   let's-play/sit/work paradigm better), **skenga/sikenga** "want to X"
   paradigm (more data, still not clean — "pray" breaks the pattern),
   **i-want-to-work root choice** (`kam-ka·a` vs `daka`) — all flagged
   in NV-092, none resolved.
4. **Claude B's confidence-schema step 3**: a 336-row manual triage is
   queued for Claude A (see
   `docs/PROPOSAL_CONFIDENCE_SCHEMA_20260822.md` and
   `docs/CLAUDE_B_SESSION_MIGRATION_20260822C.md`) — not started, large
   task, needs its own dedicated session.
5. **sit** = `aonga` vs `a·song·a` (NV-080), **stay** = `donga` vs
   `dongchak·a`/`dongdang·a` — still open, unchanged. Note: `donga` is
   now also independently in use as the new VERIFIED **live** (NV-093,
   this session) — worth keeping in mind if/when `stay` is
   reconciled, since a `donga`-for-stay resolution would make `donga`
   cover exist/have/live/stay senses simultaneously; not necessarily a
   problem (common cross-linguistically) but worth flagging explicitly
   to Thangseng rather than assuming.
6. **10 pre-existing exact-duplicate rows** in `master_dictionary.json`
   (confirmed via `git show` against `d89d5da` to predate this
   session) — already flagged as a separate backlog item at the NV-089
   close; still not actioned, still out of scope for a native-data
   processing session.

## Standing rules referenced this session (all pre-existing, unchanged)

- Rule 8 (fix stale `phrase_maps.js`/`corrections.json` overrides
  directly when they clearly mirror old/superseded data; never
  allowlist; flag instead of force-fixing when the override is an
  independent third form, not a copy of stale data).
- Rule 9a (pre-flight: `git status` clean, `git fetch` + `git pull
  --ff-only`, push everything before closing).
- Rule 10 (resume sequence: fetch, verify HEAD, rebase/fast-forward,
  clean tree, read WORKSTATE + latest migration doc before starting
  work) — this is the rule the Project Owner asked to have confirmed
  by number this session.
- Citation discipline (superseded rows are retained with a note, never
  deleted).
- Evidence-first / no silent picks when native data disagrees with
  itself or with a shipping override.

Session closed clean. `git status` empty, `HEAD == origin/main ==
9ef4603` verified by direct comparison, not assumed.
