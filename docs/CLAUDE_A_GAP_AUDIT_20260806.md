# Repository-Wide Gap Audit — 2026-08-06 (Claude A)

Full sweep of `docs/THANGSENG_NATIVE_VALIDATION.md`'s open-items list, every
`docs/PENDING_*` proposal, `.ai/WORKSTATE.yaml`, and the allowlisted-issue
counts in `repository-intelligence.js` (Checks A–F), cross-checked against
current repo state (not assumed from memory/prior summaries).

## Closed by this audit (no native input needed — doc hygiene / stale refs)

- **`mina`/`minaha` "ready/finished"** — a prior session summary carried
  this forward as still-open (single form, insufficient for paradigm).
  Repo check shows it was fully resolved 2026-08-02 (NV-050): `mina` is
  not a "ready/finished" root at all, it's "ripe"/"cooked," with a full
  4-form paradigm now VERIFIED/HIGH (RULE-045). Nothing to do — the
  earlier flag was itself stale.
- **`docs/PENDING_VOCABULARY.md`** — still listed `nina`/`nisona` as
  "Needs Thangseng Validation," but NV-011 and NV-012 (2026-07-25)
  closed both questions. Added an audit note at the top of that file
  pointing to the closure so future sessions don't re-surface it.

## Genuinely open — require native speaker input (not guessable, per evidence-first discipline)

| Item | What's needed | Ref |
|---|---|---|
| `bi·ka so·a` / `hel·hel` ("angry" cluster) | Existence + register confirmation | NV-027 |
| `jegrika` ("quarrel") | Exact raka placement (native gave no marks) | NV-028 |
| `Kajia` ("quarrel"/"dispute") | Wrong / synonym / different register vs. `jegrika`, unasked | NV-028 |
| `Bal` = flower / air / big basket | Native only confirmed "load/burden," these 3 senses live in production unconfirmed | NV-020 |
| "adolescent" | `dil·ding bal·jak` REJECTED 2026-08-06 (NV-064), no replacement on record | NV-064 |
| `Boka Boka` polysemy ("to demand unduly") | Native gave no comment on this sense at all (silence ≠ resolution) | `PL-0001540` |
| `dabia` ("to demand unduly") | Native offered this hedged ("I think..."), not firm — tentative_candidate only | `PL-0001540` |
| "under" pseudo-verb (`Kokkimaoja`) | Whether Garo has a distinct stative "to-be-under" verb, or this is a bug mimicking one | `RC-CANDIDATE-017` follow-up |
| `-ma` interrogative, present/past/object-present forms | Only future-tense forms confirmed so far | NV-031 |

## Genuinely open — engineering/Project Owner scope (not Claude A's to implement)

- **"right" (3-way headword split, RULE-040) and "work" (noun/verb split,
  RULE-041)** — linguistic determination already made; needs Claude B to
  design the actual compiled-dictionary key-split. Still unclaimed as of
  this audit.
- **115 placeholder entries** (`src/data/known_placeholder_entries.json`,
  Check E) — dual-candidate values (e.g. `"Pa / Apa"`) never resolved to
  one. Per-entry linguistic calls, most need native confirmation; too
  large to guess through. Recommend a batched relay-question pass if the
  Project Owner wants this backlog worked down.
- **Reverse translation (Garo→English)** — `docs/PENDING_reverse_translation.md`,
  explicitly BLOCKED waiting on the Project Owner to acquire a proper
  Garo dictionary source. No repo-side action possible.
- **328 unconverted hyphens in `master_dictionary.json`** — flagged
  earlier this session (raka-ruleset review): post-conversion imports
  the 2026-06-18 global hyphen→raka script never touched. Claude B/D
  scope.
- **"who gave you this" — keep/drop trailing `?`** — JSON key-naming
  question between `corrections.json`/`compiled_dict.json`, not
  linguistic. Claude B's/Project Owner's call.

## Confirmed NOT gaps (checked, working as intended)

- All `repository-intelligence.js` Checks C–F allowlisted counts (1187 /
  115 / 232 / 7) are known-and-accepted by design — the gate exists to
  catch *new* violations, not to force the historical backlog to zero.
  Re-ran clean this session, 0 new on all checks.
- Check A's 10 raka-locality candidates are report-only by design
  (lexical-split risk means auto-flagging isn't the same as a bug) —
  see `docs/REPOSITORY_INTELLIGENCE.md`.

## Bottom line

Nothing is silently broken and nothing was fixable-and-left-unfixed —
every remaining item above is blocked on either a native-speaker answer
Claude A cannot fabricate, or engineering/Project Owner work outside
Claude A's territory. If useful, Claude A can draft a single consolidated
relay-question batch (NV-020, NV-027 remainder, NV-028, NV-031, adolescent,
Boka Boka) for the Project Owner to take to Thangseng in one pass.
