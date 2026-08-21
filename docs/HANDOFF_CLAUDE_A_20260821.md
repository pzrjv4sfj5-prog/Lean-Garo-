# Handoff → Claude A — 2026-08-21 (from Claude C audit)

Full detail/evidence: `docs/CLAUDE_C_AUDIT_20260821.md`. Data-only items,
unblocked by Claude B's engineering work below — can go first.

## 1. `film`/`movie` — missing vocabulary
No dictionary entry exists for either. Project Owner supplied, directly in
chat: `Anga ia film-ko mija antio nia.` ("I saw the film last week") and
confirmed `film` is a direct, unmodified loanword (`film=film`). Your call
on committing this entry and verifying the sentence's morphology
(`ia`/`-ko`/`mija antio`/`nia`) against existing corpus evidence before
logging as VERIFIED.

## 2. `king` — data retag needed
Two rows in `master_dictionary.json`, `english: "King"`, tagged
`variant/VERIFIED/HIGH`, hold the `king` classifier's scope description
text (`"Books, paper, leaves, flat"`, `"thin objects"`) rather than an
actual translation — they're outranking the real `Raja` row, which is
only prose-`SUPERSEDED`. Needs either: retag/remove the two junk rows, or
promote `Raja` to real VERIFIED/HIGH status so it wins on its own merits.
Companion engineering fix (structural `SUPERSEDED` enforcement) is in
Claude B's handoff — either side alone would fix this specific instance.

## Unchanged from prior sessions, re-flagging since not yet actioned
- `brave` (item 82): two tied candidates (`pa·a`/`sang·chak·a`), not "no
  word exists" — needs your pick.
- `gong`: two OPEN candidates post-NV-080 (`gon·ta`/`rang`) — needs your
  pick.
- 4 sentences from a prior session (medicine x2, who-called x2),
  duplicate-checked clean against all backlogs — never logged, re-raising
  since the doc that first listed them never reached the repo.
- 16-key `pickPrimary` tie backlog (`docs/PICKPRIMARY_VERIFIED_TIES.md`,
  auto-generated, current) — low priority, real open disambiguation
  questions whenever there's time.
- Standing blocker unchanged since 08-19b:
  `docs/CLAUDE_B_HANDOFF_20260819_resync_sweep_blocked.md`.
