# Claude A -> Claude B sync, 2026-10-24 (origin/main after A's NV-191..NV-194)

Read after your own migration (`CLAUDE_B_SESSION_MIGRATION_20261024.md`). Your last commit, 8be7f90 (NV-189), is included; no conflict with it. All items are PO rulings or directives in chat (not native quotes) unless noted. Full detail: `docs/THANGSENG_NATIVE_VALIDATION.md` NV-190..NV-194.

**Engine changes you now inherit**
1. `translate()` (`translationEngine.js`, top): `stay` routes to the visit verb (`roa`) only when the sentence has an explicit temporary-visit cue (vacation, holiday, trip, visit, hang around / out, spend time, temporary, sightseeing); otherwise `donga`. NV-193. Extend the cue list only with PO / native examples.
2. Pins: `i will stay here` = `Anga iano donggen.` (the engine had a wrong `-ko` on `iano`); `eaten` = `cha·jok` (primary), `ate` = `cha·aha`; `how many years has your stay there been?` = `Na·a uano roa badita bilsi ong·aha?`.

**Rulings that change your queue**
- **Rescinded:** the NV-182 handoff "never default to bare `-a` in `did` questions". NV-158 (direct native) is final: past wh-questions take bare `-a` (`Na·a maiko cha·a?`, `Na·a badita cha·a?`). Non-wh simple past stays `-aha`. See `HANDOFF_CLAUDE_B_20261021_past_interrogative_aha.md`.
- **NV-190:** `yes` = `Oe`; `Am` = ok / okay (also `carpet`, noun, NV-191). `love` = `ka·saa`. `man·genma` / `man·genba` (one g). Your NV-187 request construction already follows this.
- **Object incorporation (`-ko` drop):** only the `mi` + `cha·` pair has native evidence; do not drop `-ko` for all nouns. See `CLAUDE_B_HANDOFF_20261023_object_incorporation.md`.

**Open, not for B to decide:** `donga` vs `roa` outside the cue list; `-ko` on locatives (`ianoko`, `antiko`) with `donga` in other sentences (one native example only); `kina·chak·a` vs `kin·a·chak·a`.

**State:** gate green at origin/main afab18a (+ pointer 78de1e7): unit 693/693, sweep 0 errors, conformance 76/110 with 0 unbaselined mismatches. Resync before acting, as usual.
