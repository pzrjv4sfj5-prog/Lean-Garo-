# Claude C — Analysis of Thangseng/Tridip WhatsApp Batch, 2026-08-21 (afternoon)

Read-only QA analysis, not committed by Claude C (no write access). For Claude A to
action via the normal NV pipeline. All "corrected" values below are Thangseng's own
final replies (Tridip's initial guesses shown only where they reveal a real error).

## Resolves already-open backlog items — highest priority

1. **self = an·tang** — closes Claude A's flagged "self: zero corpus cross-check" item
   (from the 4-priority-flag list, 2026-08-20c backlog).
2. **give me water = Angna chi on·bo** — matches master_dictionary.json's existing
   `Ang·na chi on·bo` exactly. Resolves the flagged "give me water: imperative
   give-stem on- conflicts with verified root ron-" item in favor of **on-**.
3. **elephant = mongma** — Thangseng's unprompted, direct answer (not a forced
   choice). Repo currently holds a 2-way VERIFIED tie (Mong / mong·ma, both
   VERIFIED/HIGH) flagged in `docs/CLAUDE_B_HANDOFF_20260819_resync_sweep_blocked.md`
   as needing Claude A's primary-pick judgment. This is native evidence for
   **mong·ma** as primary.
4. **outside = A·pal** (Thangseng: wider meaning, can mean "to defecate" when paired
   with re•a) — this is the *other* tied-candidate item from the same resync-sweep
   backlog (repo holds bai·re / ha·gat·e as VERIFIED variants, A·pal itself
   SUPERSEDED, a·palo separately CONFIRMED as a locative form). Native gave A·pal
   unprompted here, but flagged a collocation caveat (re•a + A·pal = defecate) —
   this needs Claude A's judgment, not a mechanical pick; the caveat is exactly the
   kind of nuance the resync-sweep report said couldn't be resolved mechanically.
5. **take revenge = a·jak soka** — matches the ALREADY-VERIFIED/HIGH `a·jak sok·a·ni`
   (noun) / `a·jak sok·na` (verb) pair (cited `doc7`, a print source). Reconfirms
   both, native speaking. Note: Claude A's backlog describes this item as "only a
   noun-form citation exists" — that description is now stale; the verb form has
   had a VERIFIED/HIGH doc7 citation the whole time. Worth a one-line correction to
   the backlog note, independent of this new confirmation.
6. **stand up = Chadenga / chadengbo (imperative)** — matches repo's existing
   VERIFIED `Chadenga` for "stand". Closes the "stand/stand up: two competing
   uncited candidates" flagged item — Chadenga is confirmed correct, chadengbo
   added as the imperative form.

## Real discrepancies vs. current repo — flag before treating as routine additions

- **to spread**: transcript gives **barama** (opening something physically) vs.
  **gipata** (spreading gossip/a message) — an entirely different word pair from
  what's currently live (`Badala`/`Badalata`, no citation). Sense-split not
  currently represented at all. Needs Claude A review, not a blind promote.
- **sit**: transcript's direct answer is **aonga**, but repo already has
  `a·song·a` as VERIFIED/HIGH via NV-080 (2026-08-17, same native, same relay
  channel). Possible dialectal/register variant or a transcription shorthand —
  flag for Claude A to reconcile before adding a second "sit" entry.
- **stop**: transcript gives **dontonga**, distinct from repo's uncited `dondip`.
  Tridip's own guess of "Sengbo" for stop was explicitly rejected by Thangseng —
  worth noting since Sengbo is separately confirmed elsewhere as "wait"
  (imperative); the two senses are correctly distinct in this transcript.
- **you did well**: repo holds uncited `Na·a nama daka` (no tense suffix).
  Thangseng's corrected form is `Na·a nama dakaha` (past-tense -aha suffix) —
  looks like a genuine gap in the current entry, not just an alternate.
- **what job do you do**: repo has `Na·ara mai kamko ka·a?` (subject "Na·ara"),
  transcript confirms `Na·a mai kamko ka·a?` (subject "Na·a") — pronoun-form
  mismatch, minor, worth a citation update either way.
- **to throw**: repo's `Gotata` vs. transcript's `goata` — close enough to be the
  same word differently spelled (raka/orthography drift, same class as prior
  sessions' fixes) rather than a different word; not urgent but flaggable.
- **help**: repo's sole candidate is uncited/UNVERIFIED `chak·a`. Transcript gives
  a full noun/verb split: **dakchakani** (noun) / **dakchaka** (verb) — a richer,
  directly-native answer that should likely supersede the existing candidate.
- **backbone/waist/back**: Tridip's original guess conflated backbone and waist
  (offered "kangkare" for backbone). Thangseng split them: **backbone =
  janggil bolgro**, **waist = kang·kare** (new). Repo's `backbone` entry already
  reads `jangil bolgro` — matches, but carries no citation. Worth citing this NV
  explicitly rather than leaving it uncited coincidence. `waist` itself is new
  (repo currently only has an unrelated uncited `ko·mor`). **Addition, confirmed
  by Thangseng (Project Owner input): back = kang·kare** — same Garo word as
  `waist`, so `kang·kare` likely covers both the "back" and "waist" body-region
  senses while `janggil bolgro` stays the distinct, narrower word for the spine
  specifically. Claude A should decide whether back/waist share one dictionary
  entry or get two entries citing the same form.
- **dead / dried — sense splits not yet in repo**: dead = **sigimin** (of a person)
  vs. **Manggisi** (of a body); dried = **tipjok** (of water drying up) vs.
  **ran·aha** (of things drying). Repo currently holds one bare
  UNVERIFIED/HIGH candidate for each with no sense distinction.

## Grammar note (not lexical)

Thangseng: the question particle **ma** attaches directly to the verb with no
space (`Cha·ahama?`, not `Cha·aha ma?`) — corrected across several of Tridip's
draft sentences. Worth checking whether this is already codified as a rule
(RULE catalogue) or needs its own entry; not cross-checked against
GRAMMAR_RULE_CATALOGUE.md this pass.

## Everything else in the batch

The remaining ~130 items (let's-drink/eat/play/sit/work family, my
dog/father/house/mother, the "i want to X" paradigm, the backbone→wrist block,
the greetings block, the classroom-command block, open-the-lock/door
distinction, etc.) are mostly either clean new vocabulary with no live conflict
found, or direct reconfirmations of already-VERIFIED repo values — not
individually re-verified line-by-line against master_dictionary.json in this
pass (130-term exhaustive diff not run; flagged items above were checked
directly). Recommend Claude A run them through the standard NV intake process
(new NV number, cite this transcript, promote/supersede per usual discipline),
using the flagged items above as the ones needing judgment calls rather than
mechanical promotion.

Source: WhatsApp transcript, Tridip↔Thangseng, 2026-08-21 (afternoon session,
"final one" per Tridip — a further batch was declined by Thangseng this week
due to paper deadlines).

## Addendum — closes 2 of the 4 open engineering/QA items

Project Owner separately confirmed, also via Thangseng: **king = Raja** and
**film = film** (direct loanword). These are native citations for exactly the
two open findings in `docs/CLAUDE_C_AUDIT_20260821.md` (`king` collision,
`film`/`movie` gap) — see the full table (`THANGSENG_RELAY_TABLE_20260821B.md`)
for the detailed remarks. Not fully closed by this alone: `king` still needs
Claude B's structural `pickPrimary` fix for durability, `movie` and the
silent-object-drop defect remain untouched, and the `answer` tie-break /
resync-sweep backlog are unrelated and still open.
