# Triage: `PICKPRIMARY_NO_VERIFIED_CANDIDATE.md` (5,909 keys)
_Claude B, 2026-08-22, second session task. Triaged the full subclass
(b) enumeration against the confirmed 9-key failure shape
(`work`×2/`boil`/`build`/`close`/`empty`/`leg`/`outside`/`strong`,
`docs/CLAUDE_C_AUDIT_20260816.md` §2). Analysis only — no
`master_dictionary.json` content changed; that call belongs to
Claude A per `docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md`._

## 1. The named 9-key shape is already resolved
Checked all nine directly against `master_dictionary.json`: `work`,
`boil`, `close`, `outside`, `strong` (lowercase forms) now carry
`VERIFIED/HIGH`-tagged rows from the 2026-08-17 Thangseng relay and no
longer appear in this report at all. `empty` and `leg` are present but
in the **sibling** report (`PICKPRIMARY_VERIFIED_TIES.md`, subclass a
— tied verified candidates, a different problem). Only `build` still
appears in subclass (b), and all three of its candidates are equally
weak/OCR — no better alternative to prefer, this is the same shape as
item 2 below, not a distinct case. **The specific 9 keys audited on
2026-08-16 are closed as originally described; the report's ongoing
value is in what's shipped since.**

## 2. Structural breakdown of the 5,909 keys
| Segment | Count | Meaning |
|---|---|---|
| Single-candidate keys | 5,103 | Nothing to pick between — matches the report's own header framing: unvalidated vocabulary, not a defect. |
| Multi-candidate, all weak/OCR-tagged (tied) | 758 | `build`-shape: last-write-wins among equally-unverified candidates. Real ambiguity, but no candidate is preferable to another on current data — needs native validation, not a `pickPrimary` change. |
| Multi-candidate, mixed weak + untagged | 48 | The shape worth inspecting individually — see below. |

Of the 48 mixed-candidate keys, 45 already shipped the untagged
(non-weak) candidate correctly. **3 shipped the weak one despite an
untagged alternative:** `adolescent`, `hot`, `mature`. Investigating
these found the real story is a classifier gap, not a bad pick — see
§3.

## 3. Two root-cause gaps found (not 3 isolated bad picks)

**Gap A — `isWeak()` doesn't recognize `REJECTED` notes.**
`isWeak` only checks for empty notes, `unverified`, or `ocr-flagged`
substrings. A note starting `REJECTED —` (native speaker explicitly
rejected the candidate) matches none of those, so it's classified
**non-weak** — outranking genuinely-still-live UNVERIFIED candidates
it should never compete with. Confirmed this is what happened to
`adolescent` and `hot`: in both, the "better untagged alternative" my
first pass flagged was actually the REJECTED row (`dil·ding bal·jak`,
`gek·gek`), not a real improvement. `hot` is the clearer case —
`gek·gek`'s own notes point to `ding·a` as the real confirmed word for
heat/temperature, but `ding·a` and the shipped `jroa` are both tagged
weak, so neither the REJECTED entry's misclassification nor the
correct answer's weak tag get resolved by current logic. Corpus-wide:
**5 rows** carry a `REJECTED`-prefixed note that isn't also
independently weak-tagged (`adolescent`, `hot`, `mature`, `To hang`,
`A flower`) — small in absolute count, but each one sits in exactly
the position to wrongly outrank a real candidate.

**Gap B — `isVerified`/`isVariantVerified` anchor to the start of
`notes`, missing verification stated mid-note.**
The regex requires notes to *begin* `verified/high` or
`variant/verified/high`. Several genuinely native-confirmed rows —
mostly the 2026-08-03/04 NV-056 batch — describe the confirmation
without leading with that exact tag (e.g. `"NV-056, Thangseng direct
native validation via Tridip WhatsApp... New VERIFIED/HIGH entry"`),
so `isVerified` never fires. Corpus-wide, **15 rows across 10 keys**
match: `mature` (`dal·gimin`, `brigimin`), `adult`, `where did you
come from?`, `where is this man from?`, `where should i take this book
to?`, `where should i go to?`, `mother (address form)`, `bear`,
`Salt`, `Always`(×2), `where are you going?`. Of these, **9 keys
currently appear in this subclass-(b) report despite having
genuinely-verified backing on file** — they're false positives in the
enumeration itself, not just mispicks: `bear`, `adult`, `mother
(address form)`, `salt`, `where is this man from?`, `where should i
take this book to?`, `where should i go to?`, `where are you going?`,
`mature`.

`mature` is the clean illustration of both gaps stacking: `dal·gimin`/
`brigimin` are genuinely VERIFIED/HIGH (NV-056) but invisible to
`isVerified` (Gap B), while the REJECTED `dil·ding bal·jak` is
invisible to `isWeak` (Gap A) — so the key surfaces in the
no-verified-candidate report at all, when it shouldn't, for two
independent reasons.

## 4. Why this isn't a `prepare-data.js` patch
Both gaps are exactly the failure mode AI-001 already names as its
root cause, and exactly what
`docs/PROPOSAL_CONFIDENCE_SCHEMA_20260822.md` (this session's first
task) is designed to close structurally: regex pattern-matching
free-text notes is fragile to how a note happens to be worded. Adding
a `REJECTED` check to `isWeak` or loosening the `isVerified` anchor
would fix these specific instances but only add a third and fourth
regex pattern to a mechanism already proven to miss cases — not a
durable fix. Filed as evidence for that proposal rather than a
separate patch.

## 5. Handoff
- **Content correction** (`hot`'s `ding·a` vs `jroa` distinction,
  confirming `mature`'s intended VERIFIED candidate,
  `adolescent`'s open status): Claude A.
- **The 9 false-enumeration keys** (§3, Gap B): once the confidence
  schema migration (Proposal, step 2) runs, these resolve
  automatically as a side effect — flagging here so they're not
  mistaken for new defects if someone re-audits this report before
  the schema lands.
- **`docs/CLAUDE_C_AUDIT_20260816.md` §2** should note the named 9
  keys are closed (§1 above) so the next reader doesn't re-triage them.

## Verification
All counts in this document were computed directly against
`master_dictionary.json` (9,791 rows) and
`docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md` (5,909-entry, 2026-08-22
build) this session, not carried over from a prior doc's figures.
