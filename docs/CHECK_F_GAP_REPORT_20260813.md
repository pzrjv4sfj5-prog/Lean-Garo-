# Check F Allowlist — Gap Resolution Ledger (Claude B)

## Purpose and process

`repository-intelligence.js` Check F allowlists 305 pre-existing mismatches
between `corrections.json`/`phrase_maps.js` (runtime-cascade steps 1/1.5, which
win) and `compiled_dict.json` (step 2). Nothing previously tracked whether each
one is a legitimate variant or a silent shadowing bug. **Per Project Owner
directive (2026-08-13): resolve every engineering-only item directly; only
escalate genuine linguistic decisions to Claude A.**

**Mandatory process for every item, learned from a caught near-miss (see
below):** check `tests/unit/*.test.js`, `docs/*.md` (esp. `VERB_INVENTORY.md`,
`GRAMMAR_RULE_CATALOGUE.md`, `THANGSENG_NATIVE_VALIDATION.md`), and the raw
source dictionaries (`master_dictionary.json`/`garo_dictionary.json`) for prior
history on the key BEFORE treating either side of a mismatch as correct.
A surface data mismatch alone is not bug evidence.

**Tooling:** `scripts/analyze-check-f-gaps.mjs` regenerates this dataset fresh
(byte-identical matching logic to Check F itself — verified). Run it, don't
hand-copy old output; `compiled_dict.json` changes with every session.

## Methodology near-miss (read before resuming this ledger)

Two real analysis bugs were caught and fixed this session before any wrong
conclusion shipped:

1. **`"wait"` linguistic near-miss.** Looked like a clear shadowing bug from
   data alone (`corrections`=`"Damo"` vs `compiled_dict`=`"Damo/Sengbo"`).
   Project Owner confirmed `"Damo/Sengbo"`; editing `corrections.json` broke 2
   regression tests, surfacing **RC-CANDIDATE-015** (2026-07-25): `"Damo /
   Sengbo"` was itself a literal unresolved OCR placeholder, already superseded
   by native-confirmed values. `corrections.json` was right all along.
2. **Tooling bug, caught independently.** The first version of this report used a
   `normalize()` that stripped trailing punctuation, causing silent key
   collisions (`"eat"` absorbed `"eat!"`'s `compiled_dict` value). Caught by a
   direct spot-check against `src/compiled_dict.json` before the (already-pushed)
   report doc was trusted further. `scripts/analyze-check-f-gaps.mjs` now
   replicates `repository-intelligence.js`'s exact join logic — verified
   byte-identical counts (305) against the live Check F run.

## Resolved — continuation session (2026-08-13, cont'd)

| Key | Classification | Resolution |
|---|---|---|
| `apple` | **Stale artifact, fixed directly** | `corrections.json` still had `apal` (pre-2026-08-01 placeholder), while `master_dictionary.json` (`VERIFIED/HIGH`, NV-049, direct Thangseng confirmation "Apple = apple") and `compiled_dict.json` both already correctly have `Apple`. This is the same stale-artifact pattern as `wait`/`dance` above, but `corrections.json` is an engineering file (not `master_dictionary.json`), so per the Project Owner directive this was fixed directly rather than escalated: `corrections.json["apple"]` changed from `apal` → `Apple`. Full build gate re-verified green (203/203 tests, 0 lint errors, 0 new Check F violations); Check F allowlist count correctly dropped 305→304 as a result. No `master_dictionary.json` edit needed — it was already right. |

## Resolved this session (5 keys + 1 twelve-item batch, 17 of 305)

| Key | Classification | Resolution |
|---|---|---|
| `eat` | **Not a gap** | Analysis-tool artifact only (see near-miss #2). `corrections`/`compiled_dict` already agree (`cha·a` case-insensitive). No repo change. |
| `wait` | **Stale artifact, escalated** | `corrections.json`'s `Damo` is correct (RC-CANDIDATE-015, RULE-036). `grammarOverrides['wait']` in `prepare-data.js` (~line 350) is the stale leftover — one-line delete, Claude A sign-off requested since it touches native-confirmed-rule territory. Not deleted here. |
| `dance` | **Stale artifact, escalated** | `corrections.json`'s `Chroka` (general dance) is directly native-confirmed (`VERB_INVENTORY.md`, Thangseng, 2026-07-14 — `Grika` is explicitly a *different*, narrower ceremonial-dance term, not a synonym). `master_dictionary.json`'s 4 `"dance"` candidates (`grik·a`/`han·seng·a`/`kiir·ton`/`ro·a`) are all still `UNVERIFIED` and **none is even `Chroka`** — the confirmed value was simply never added to the source file. Flagged to Claude A: add `Chroka` as `VERIFIED` (citation already exists, no new investigation needed); left the 4 existing UNVERIFIED candidates untouched (whether to supersede them is a judgment call, not mine). Not `master_dictionary.json`'s file — outside B's role line. |
| `no` | **Not a bug, already verified** | Three-way historical disagreement (`corrections`=`Ihing`, `phrase_maps`=`Ong·ja`, `compiled_dict`=`Gri`) — but `corrections.json` winning was explicitly tested and confirmed correct in `RUNTIME_ENGINEERING_AUDIT_20260803.md`. `compiled_dict.json`'s divergence is inert at runtime (corrections always wins for single-word lookup). No action needed. |
| 12 punctuation-only items (listed below) | **Intentional/cosmetic** | Trailing `.`/`!`/`?`/spacing/case only, same word both sides. No functional difference in runtime output. No native input needed — this is a data-hygiene item, not a translation-correctness one. |

**Punctuation-only batch:**

| Key | Source | Value A | Value B |
|---|---|---|---|
| come here | corrections | Ianona re·babo | Ianona re·babo! |
| come here | phrase_maps | Ianona re·babo. | Ianona re·babo! |
| go away | phrase_maps | Re·angbo. | Re·angbo |
| how are you | corrections | Na·a namenga ma? | Na·a namengama? |
| how much | phrase_maps | Baita? | baita |
| hurry | phrase_maps | Tarkbo! | Tarkbo |
| i don't know | phrase_maps | Anga uija | Anga uija. |
| quick | phrase_maps | Tarkbo! | Tarkbo |
| sit down | corrections | Asongbo | Asongbo. |
| stand up | phrase_maps | Chadenga. | Chadenga |
| thank you very much | phrase_maps | Mittela dakpile. | Mittela dakpile |
| wait | phrase_maps | Damo / Sengbo | Damo/Sengbo |

## NOT yet investigated (288 of 305)

Full current dataset always available via `node scripts/analyze-check-f-gaps.mjs`.
Rough shape as of this session (will shift slightly as `compiled_dict.json`
changes): ~162 no-shared-root, ~131 shared-root/differing-form. 114 of the 305
have at least one hit in `tests/unit/*.test.js` or `docs/*.md` — check those
first, same as `wait`/`dance`/`no` above; they're the fastest to resolve with
real evidence rather than guessing. The remaining ~191 have no found evidence —
that doesn't mean they're wrong, it means the archaeology hasn't been done yet.

**Recommended continuation pattern per item:**
1. `grep` `tests/unit/*.test.js` and `docs/*.md` for the key.
2. Check `master_dictionary.json`/`garo_dictionary.json` raw entries for the
   english key — is the `compiled_dict.json` value coming from a `VERIFIED`
   source, an `UNVERIFIED` one, or a `SUPERSEDED` one that shouldn't be winning?
3. Classify: **stale artifact** (like `wait`/`dance` — a confirmed value exists
   somewhere and just didn't propagate — fix directly if it's an engineering file,
   flag to Claude A if it's `master_dictionary.json`), **not a bug** (like `no`/
   `eat` — already resolved or a tooling artifact), **intentional exception**
   (like the punctuation batch, or genuine register splits per Check B2's own
   documented rationale), or **genuine linguistic decision** (no existing
   evidence resolves it either way — this is the only category that goes to
   Claude A without a proposed answer already attached).
4. Update this ledger's resolved table before moving to the next key.

## Resolved — VERIFIED-match triage, corrected (2026-08-13, cont'd)

**Method correction:** an earlier pass in this session classified matches using `'VERIFIED' in notes` (substring), which false-positived on `UNVERIFIED` and on `SUPERSEDED ... has VERIFIED` notes describing *other* entries. Caught before anything was committed. Corrected to `notes.startswith('VERIFIED')`. Re-running dropped false "resolved" count from 94 to the real number below.

**11 keys fixed in `corrections.json`** (stale value → matching VERIFIED master_dictionary form): `i want to sleep/eat/drink/go/come/work/study/pray` (old `ska` suffix → verified `sikenga`), `orange` (`Narang`→`a·mnk`), `monkey` (`Makrew`→`a·mak`), `chameleon` (`gara`→`a·ga·tek`).

**1 key fixed in `phrase_maps.js`**: `monkey` (`Makre`→`a·mak`).

**1 key checked and reverted — real homonym, not a bug:** `cooked`. Matched VERIFIED `min·a` by English-key string, but `min·a` is the *ripe/cooked adjective* sense (NV-050); `corrections.json["cooked"]` is the *verb past-tense* sense feeding `"he cooked"` (`Ua Song·aha`) through the tense-suffix pipeline — confirmed by regression test `translationEngine.test.js:184`. Reverted to original `Song·aha`. **Lesson for future passes: English-key string match alone is not sufficient when a key has multiple POS/senses; check regression tests before applying a VERIFIED-match edit.**

**1 key confirmed correct, no edit:** `where` (`phrase_maps`) — `Bano` already matches VERIFIED.

Full build gate green after fix + after revert: 203/203 tests, 0 lint errors, 0 new Check F violations.

**287 of the remaining keys have no VERIFIED master_dictionary entry at all** — genuine open linguistic gaps, not mechanically resolvable. These need the full per-item process (grep tests/docs → check raw dictionaries → classify → escalate to Claude A if genuinely undecided).

## Resolved — per-item investigation (2026-08-13, cont'd)

| Key | Finding |
|---|---|
| `beautiful` | **Not a bug.** `corrections.json["beautiful"]="Sila"` is confirmed by 4 grammar docs (`GARO_GRAMMAR_REFERENCE.md`, `GRAMMAR_NOTES_20260622.md`, `GRAMMAR_RULE_CATALOGUE.md`, `GRAMMAR_CONFIDENCE_MATRIX.md`) via `Gari sila` = "the car is beautiful", predicative. `compiled_dict`'s `Ka·danga` traces to a **case-duplicate key** in `master_dictionary.json`: capitalized `Beautiful` → `Ka·danga`, separate from lowercase `beautiful` → `Sila`/`nitoa`, neither notes-tagged. Compile pipeline picked the capitalized dup. Flagging for Claude A: possible case-folding gap in the english-key dedup/pickPrimary step — not fixed here, out of Claude B's file scope. |
| `angry` | **Not a bug (Check F/engineering scope) — but raka placement flagged separately.** `corrections.json["angry"]="ka·o·nang·a"` and `compiled_dict`'s source value `"bika ding'a"` are BOTH separately native-confirmed: `master_dictionary.json` marks `ka·o·nang·a` VERIFIED/HIGH (NV-054, 2026-08-03, "most common") and `bika ding'a` VERIFIED/HIGH (NV-054 follow-up, 2026-08-05, "metaphorical" register, explicitly "not merged" with the unrelated unreconciled `bi·ka so·a` cluster). Not a shadowing bug for Check F's purposes — two real synonyms, corrections.json wins at runtime (regression test `translationEngine.test.js:569` locks this in). **Update, same day:** Project Owner flagged in-session that `ka·o·nang·a`'s raka (glottal-stop) placement itself may be wrong ("angry = ka.onanga, mind the raka"). That's a linguistic-content question about `master_dictionary.json`, outside Check F/engineering scope — not resolved here, see `docs/CLAUDE_B_HANDOFF_20260814_angry_raka_placement.md` for the flag to Claude A. Check F's corrections-vs-compiled_dict agreement finding above stands regardless of the outcome of that question. |
| `always` | **CLOSED — NV-077 (Claude A commit `d28882b`, 2026-08-14).** Applied through the proper channel: Claude A's own commit, citing `docs/CLAUDE_B_HANDOFF_20260814_angry_raka_placement.md`'s evidence package directly, not the earlier reverted chat-relay attempt logged below for history. `master_dictionary.json` now carries `always=Pangnan` (reverses the 2026-08-01 audit's uncited SUPERSEDED tag) tagged `VERIFIED/HIGH — NV-077, Project Owner direct native relay in-session`, cited in `docs/THANGSENG_NATIVE_VALIDATION.md`. `phrase_maps.js["always"]="Pangnan"` already matched, unaffected. Confirmed via direct field read, Claude B session 2026-08-14 (session C). *History, kept for record:* an earlier revision of this row said "CLOSED (Owner direct resolution)" after Claude B edited `master_dictionary.json` directly on the strength of an in-chat claim — a role-boundary violation, since Claude B has no channel to apply linguistic content that way; that edit was reverted the same session (see `docs/CLAUDE_B_HANDOFF_20260814_angry_raka_placement.md` for full detail on the correction and the evidence handoff that followed). |
| `answer` | **CLOSED (POS split only) — NV-077 (Claude A commit `d28882b`, 2026-08-14).** `Aganchakani`=noun, `Aganchaka`=verb, both now `VERIFIED/HIGH — NV-077` in `master_dictionary.json`. `corrections.json`/`phrase_maps.js["answer"]="Aganchaka"` already matched the verb value, unaffected. **Still open:** the remaining `UNVERIFIED/HIGH` variant family (`a·gan·chak·a`, `in·chak·a`, `ku·chak·a`) — NV-077 resolved the noun/verb split but did not touch these; not this ledger row's original question but flagged here so it isn't lost. *History:* prior "Not closed" text described a reverted chat-relay attempt at direct Claude B edit; see `docs/CLAUDE_B_HANDOFF_20260814_angry_raka_placement.md` for that history. |
| `a dog bit me` | **CLOSED — NV-077 (Claude A commit `d28882b`, 2026-08-14).** `a dog bit me=Angko achak chikaha`, superseding the untagged legacy entry (`An·tangko achik chanjok`), now `VERIFIED/HIGH — NV-077` in `master_dictionary.json`. **Propagation gap found and fixed same day (Claude B, session C):** NV-077's `corrections.json` edit only updated the `"a dog bit me"` key; the duplicate-meaning keys `"dog bit me"`/`"the dog bit me"` were left on the old value (`Achak Angko chikaha`, word order reversed). Synced both to `Angko achak chikaha` — propagation of an already-verified value to duplicate representations, not a new linguistic call. Verified via targeted diff and full gate re-run. *History:* prior "Not closed" text described the pre-NV-077 state, when two chat-relayed forms (`Angko achak chika`, then `angko achak chikaha`) were still unapplied evidence; see `docs/CLAUDE_B_HANDOFF_20260814_angry_raka_placement.md` for that history.
| `are you sleeping` | **CLOSED — NV-077 (Claude A commit `d28882b`, 2026-08-14).** `are you sleeping=Na·a tusiengama?`, superseding the dropped-"si" entry (`Na·a tuengama?`), now `VERIFIED/HIGH — NV-077` in `master_dictionary.json`. `corrections.json["are you sleeping"]="Na·a tusiengama?"` already matches, confirmed by direct read this session (Claude B) — no propagation gap here, unlike the `a dog bit me` sibling-key case above. *History:* prior "Not closed" text described the pre-NV-077 state; see `docs/CLAUDE_B_HANDOFF_20260814_angry_raka_placement.md` for that history. |
