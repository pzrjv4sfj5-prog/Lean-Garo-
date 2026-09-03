# Claude B Handoff — 2026-09-03 — modal-drop + `-ma` question gap confirmed via novel sentences

**From:** Claude A (linguistic authority — no engine code touched, findings only)
**Trigger:** Project Owner asked for live `translate()` output on sentences using
the NV-107–NV-117 closed vocabulary/constructions that have **no direct
`corrections.json`/exact-phrase match** — i.e. paraphrases/pronoun variants of
the already-native-cited sentences, forcing the general grammar-assembly/
sov-assembly path instead of a table lookup. All outputs below are live,
run against HEAD `3fe31e0` (current `origin/main` at time of writing), not
hand-computed.

None of these are new linguistic questions — every underlying word/
construction is already VERIFIED/HIGH and native-cited (NV-107 through
NV-117). This is purely the general grammar engine failing to reproduce
already-confirmed patterns for inputs one step away from an exact-match
citation. Engineering-scope only.

## Finding 1 — Modal "can" (`ama`/`man·a`) still silently dropped outside exact-phrase (RE-CONFIRMED, not new)

This is the same "modal-drop" gap flagged as the highest-confidence open
Claude B handoff since at least 2026-08-31 (see `claude_a.pending_thangseng_questions`
history in `.ai/WORKSTATE.yaml`) — still unimplemented as of this session.
Live re-confirmation with 3 new subject/verb combinations that have no
exact-phrase citation:

| Input | Live output | Expected (per NV-008/NV-117 paradigm) |
|---|---|---|
| "she can eat" | `Ua Cha·a` | `Ua cha·na ama` / `Ua cha·na man·a` |
| "he can work" | `Ua Dak·a` | `Ua kam ka·na ama` / `Ua kam ka·na man·a` |
| "they can speak garo" | `Uamang rong·ko Agana` | `Uamang Garo aganna ama` / `...man·a` (word order per NV-108) |

Confidence 0.82, method `grammar-assembly` in all 3 — the modal is not
merely mis-suffixed, it is **absent entirely** from the output, same
failure shape as the original "i can eat"→"Anga cha·a" bug this handoff
class describes. Confirms the bug is not scoped to first person or to any
one verb — it's general.

## Finding 2 — `-ma` polar-question suffix (RULE-047, NV-113) has zero engine implementation, confirmed to break on paraphrase

NV-113's own text already noted "no live code path to fix or regress"
since all `-ma` output currently comes from `corrections.json` lookups.
This session confirms that's now a live gap, not just a theoretical one —
a natural paraphrase of an already-cited polar question produces
malformed output:

| Input | Live output | Method | Note |
|---|---|---|---|
| "did you have lunch?" (exact citation) | `Na·a mi cha·jokma?` | correction (1.0) | correct, exact-match |
| "have you eaten your lunch?" (paraphrase) | `donga cha·jok Nang·ni Mipring Na·a` | sov-assembly (0.75) | word-salad: wrong order, no `-ma`, `donga` (a different verb, "to exist/have") wrongly injected |
| "did she have lunch?" (pronoun swap) | `Ua donga Mipring` | sov-assembly (0.75) | verb (`cha·jok`, "ate") missing entirely, no `-ma`, `donga` again wrongly substituted |

Root cause not diagnosed (Claude B territory) — flagging the reproduction,
not the fix. Suspect the "lunch" phrase-map/correction entry is being
matched loosely by `donga` (a generic verb) rather than falling through
cleanly to a `-ma`-aware polar-question builder that doesn't yet exist.

## Finding 3 — question-word questions (no `-ma`) look correct on a paraphrase, for contrast

Not a bug — included as a positive control. "why does he laugh" (pronoun
swap from the NV-113 citation "why do you laugh") produces
`Maina Ua Ka·dinga` (sov-assembly, 0.75) — correctly omits `-ma`, matching
RULE-047. So the question-word half of RULE-047 degrades gracefully on
paraphrase; only the polar/`-ma` half (Finding 2) breaks.

## Finding 4 — "only X" construction scope unclear for non-first-person subjects

"he is the only student" (pronoun swap from the NV-112 citation "I am the
only student") does **not** route through `tryOnlyIdentityConstruction`
at all — it produces `Ua chattro·ko mangmang` (grammar-assembly, 0.82),
a structurally different sentence using `mangmang` ("only", VERIFIED/HIGH
as a standalone word per `master_dictionary.json`) rather than the
`saksa kamkam` construction NV-112 established. Not necessarily wrong
(`mangmang` is a legitimately confirmed word for "only"), but it means
the NV-112 construction is scoped to first-person subjects only in the
current implementation — flagging so this isn't mistaken for full
coverage of "only X is Y" sentences. No native evidence either way on
whether third-person should use the same `saksa kamkam` shape — not a
linguistic call to make blind, just noting the engine-scope boundary.

## Not touched, not fixed

No engine code, dictionary, or grammar-catalogue file was edited to
produce or in response to this handoff — findings only, per Claude A's
role boundary.
