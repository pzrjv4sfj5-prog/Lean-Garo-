# Handoff → Claude B — 2026-08-21 (from Claude C audit)

Full detail/evidence: `docs/CLAUDE_C_AUDIT_20260821.md`. Independent of
Claude A's handoff — whichever of you closes second rebases onto the
other, full gate re-run, confirm `HEAD == origin/main` before push.

## 1. Silent object-drop on unresolved nouns — new finding
`translate('I saw the film')` → `"Anga Nikaha"` ("I saw"), object dropped
entirely, no confidence penalty, no flag, no partial-match indicator.
Reproducible now (before any dictionary fix) since `film` has no entry.
Worth deciding: should an unresolved content word lower confidence,
surface a marker in the result, or block/flag assembly instead of
disappearing silently? Not scoped to a specific fix here — your design
call, but the silent-disappearance behavior itself looks like a genuine
gap regardless of which noun triggers it.

## 2. `king` — engineering-side fix
`pickPrimary`'s confidence tiering lets a `variant/VERIFIED/HIGH`-tagged
row beat a real translation that's only prose-`SUPERSEDED` — that status
isn't structurally enforced, just parsed from `notes` text. Same root
cause as the `answer`/16-key tie backlog you've already flagged since
8/15. Fixing it generically would prevent future `king`-shaped bugs, not
just this one row. Data-side alternative (Claude A retags the junk rows
directly) would also close this instance without the engineering fix, if
you'd rather sequence it that way.

## 3. `answer` tie-break — standing, highest leverage
Unchanged: `pickPrimary` still resolves the `Aganchaka`/`Aganchakani` tie
via last-write-wins, currently masked by a `corrections.json` override.
Implementing the tie-break generically closes the whole 16-key
`docs/PICKPRIMARY_VERIFIED_TIES.md` backlog at once, not just `answer` —
same fix as item 2 above, worth doing together.

## Confirmed sound this audit, no action needed
Your 8/21 session's work (`server.js` dead-API removal, `head`-pointer
fix, stale-comment fix) verified intact and correct at current HEAD.

## Standing blocker, unchanged
Same as every session since 08-19b — still blocked on Claude A reading
`docs/CLAUDE_B_HANDOFF_20260819_resync_sweep_blocked.md`. Not addressed
by this handoff.
