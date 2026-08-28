import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2026-08-16 (Claude B): module-level collector for pickPrimary's new
// verified-tie branch (see pickPrimary below) — populated during
// finalizeDictionary, written to docs/PICKPRIMARY_VERIFIED_TIES.md at
// the end of main(), same pattern as heldSupersededOnly/
// SUPERSEDED_ONLY_KEYS.md. Not a defect list: every key here already
// ships a genuinely VERIFIED/HIGH value (no OCR/UNVERIFIED garbage,
// which is what the fix corrected) — it's an honest record of which
// keys had that choice made by last-write-wins among equally-verified
// candidates rather than a linguistic decision, so Claude A can
// disambiguate on their own schedule without re-discovering the list.
const pickPrimaryVerifiedTies = [];

// 2026-08-22 (Claude B): module-level collector for AI-001 subclass (b)
// ("no-verified-candidate" — a SUPERSEDED/OCR-flagged/mistagged row
// outranks the actual correct value because nothing structurally
// enforces the tag, per docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md §1).
// Unlike pickPrimaryVerifiedTies above (2+ candidates all genuinely
// VERIFIED/HIGH, just tied), this records the opposite risk shape:
// ZERO candidates for the key carry any VERIFIED signal at all
// (neither isVerified nor isVariantVerified), so whatever shipped came
// from a pure fallback heuristic (master-preference, case-collision,
// or plain last-write-wins) with no confidence backing whatsoever.
// Populated during finalizeDictionary, written to docs/
// PICKPRIMARY_NO_VERIFIED_CANDIDATE.md at the end of main(), same
// pattern as pickPrimaryVerifiedTies/heldSupersededOnly. This is an
// enumeration for triage, not a defect list on its own — most keys
// here are simply words that haven't reached native validation yet,
// same as the vast majority of the corpus; a minority (the confirmed
// work/boil/build/close/empty/leg/outside/strong shape, docs/
// CLAUDE_C_AUDIT_20260816.md §2) are cases where a SUPERSEDED/OCR row
// is actively winning over a better untagged candidate. This report
// doesn't distinguish the two — that judgment is Claude A/C's, this
// only makes the full candidate set visible instead of leaving it
// buried in per-audit narrative docs.
const pickPrimaryNoVerifiedCandidate = [];

function normalizeFile(filePath) {
  // Returns { normalized, superseded }.
  // normalized: { [key]: {v: string, isVariant: boolean}[] } — ALL values
  // seen for each key, in file order, not just the last one, tagged with
  // whether the source entry's `notes` field was explicitly marked as a
  // register/loanword "variant" (master_dictionary.json only — other
  // sources have no notes field, so isVariant is always false for them).
  // Previously this silently overwrote earlier values on key collision,
  // the root mechanism behind every duplicate-key bug found this session
  // (eat/Eat, current/Current, good/Good, etc.).
  // superseded: { [key]: Set<string> } — garo VALUES (not entries) that
  // this file explicitly marked SUPERSEDED for that key, kept around
  // (2026-08-14, Claude B, per Claude C's audit §3/finalized in
  // COUNTING_PHRASE_AUDIT follow-up) so finalizeDictionary can recognize
  // the SAME wrong value resurfacing untagged from a source file that has
  // no `notes` field at all (garo_dictionary.json et al can never carry a
  // SUPERSEDED tag themselves — see the "twenty students" case: master
  // marks "chi chi chik·gni" SUPERSEDED for that key, but
  // garo_dictionary.json independently duplicates the literal same wrong
  // string, untagged, and previously shipped anyway once master's own
  // (only) candidate was filtered out). Only master_dictionary.json has a
  // `notes` field so only it ever populates this, but the return shape is
  // generic in case another source gains notes later.
  if (!fs.existsSync(filePath)) return { normalized: {}, superseded: {} };
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const normalized = {};
    const superseded = {};

    const addSuperseded = function(key, value) {
      const k = key.trim().toLowerCase();
      const v = String(value).trim();
      if (!k || !v) return;
      if (!superseded[k]) superseded[k] = new Set();
      superseded[k].add(v);
    };

    const addValue = function(key, value, isVariant = false, isVerified = false, isVariantVerified = false, isWeak = false) {
      const k = key.trim().toLowerCase();
      const v = String(value).trim();
      const rawKey = key.trim();
      if (!k || !v) return;
      if (!normalized[k]) normalized[k] = [];
      if (!normalized[k].some(entry => entry.v === v)) normalized[k].push({ v, isVariant, isVerified, isVariantVerified, isWeak, rawKey });
    }

    if (Array.isArray(parsed)) {
      parsed.forEach(item => {
        const eng = item.english || item.English || '';
        const garo = item.garo || item.Garo || '';
        // RC-CANDIDATE-027: matches the exact tag shape confirmed for
        // RC-016/RC-019 ("book"/"teacher") — notes starting with the
        // literal word "variant" (e.g. "variant/VERIFIED/HIGH") mark an
        // already-verified register/loanword alternate, not the neutral
        // default. Anything else (VERIFIED, UNVERIFIED, AMBIGUOUS, typo
        // notes, OCR flags, no notes at all, etc.) is left untagged, so
        // this only fires for the exact confirmed pattern.
        const isVariant = /^variant\b/i.test(item.notes || '');
        // RC-CANDIDATE-036 follow-up (2026-08-01): master's own internal
        // duplicate-key conflicts (e.g. "answer"/"to answer"/"one person"
        // each holding several master_dictionary.json rows) aren't solved
        // by preferring master over non-master — pickPrimary still had to
        // fall back to last-write-wins AMONG master's own candidates,
        // which is array order, not confidence. Tag any non-variant entry
        // whose notes explicitly say "VERIFIED/HIGH" (and NOT
        // "UNVERIFIED/HIGH" — substring match would otherwise misfire) so
        // pickPrimary can prefer a single unambiguous VERIFIED candidate
        // over untagged or explicitly-UNVERIFIED siblings sharing its key.
        const notes = item.notes || '';
        // WIDENED (2026-08-28, Claude B, per docs/CLAUDE_B_SESSION_MIGRATION_
        // 20260827.md §5 item 1): the confidence-schema migration
        // (scripts/migrate-confidence-schema.js) left 327 rows with no
        // `confidence` value because their notes use real verification
        // language the original regex — anchored strictly to "verified/high"
        // — never recognized. 27 of those 327 rows use one of five prefixes
        // confirmed this session to mean the same thing as VERIFIED/HIGH:
        // RECONFIRMED (e.g. "book"), CONFIRMED (e.g. "housefly", "chicken"),
        // VERIFIED/native-speaker (e.g. "ant", "anti"), fix/verified (e.g.
        // "explain"), Native-confirmed (e.g. "duty", "incite"). Adding these
        // as recognized isVerified prefixes is a pure classification-gap
        // fix, not a new judgment call — each was independently confirmed
        // via a direct native relay per its own citation. See that doc for
        // the full 327-row breakdown; the remaining ~300 rows (Typo/Root/
        // Split/Hyphenation/AMBIGUOUS/INCORRECT/etc. prefixes, plus
        // "Native correction"-prefixed rows whose content debates which
        // SENSE is primary) are deliberately left unclassified here — that
        // is Claude A's call (open sense/POS judgment), not an engineering
        // classification gap.
        // CUTOVER (2026-08-28, Claude B, per docs/CLAUDE_B_SESSION_
        // MIGRATION_20260827.md §5 item 2): reads the `confidence` field
        // directly instead of re-deriving from `notes`. Performed only
        // after a read-only impact analysis (see that doc) found and fixed
        // the one real blocker first: a merge-order bug (this file, master-
        // upgrade path above) that silently dropped a master row's
        // isVariant tag when the same Garo text also appeared untagged in
        // an earlier non-master source. With that fixed, this cutover
        // produces ZERO compiled_dict.json changes against the pre-cutover
        // build (verified byte-for-byte) — confirmed via an isolated
        // scratch-directory simulation before touching this file. isVariant
        // stays notes-derived below: the confidence schema has no variant/
        // non-variant dimension of its own (verified_high covers both), so
        // that distinction has no field to cut over to.
        const isVerified = item.confidence === 'verified_high';
        // 2026-08-15 (Claude B, per Claude A's 9-key handoff + Claude C
        // audit 20260815B §1.3/§2.2): isVerified above is anchored to the
        // START of notes, so a variant-tagged entry ("variant/VERIFIED/
        // HIGH") never matches it — this new flag catches that shape
        // specifically. See pickPrimary for how it's used.
        const isVariantVerified = /^variant\/verified\/high\b/i.test(notes);
        // Same handoff: entries with no independent evidence at all (no
        // notes, an OCR-import flag, or an explicit UNVERIFIED tag) are
        // exactly the shape that was wrongly winning over VERIFIED/HIGH
        // variant siblings via last-write-wins. Used only to gate the new
        // pickPrimary branch — never widens which candidates are shown as
        // verified, only which are recognized as having NO evidence.
        const notesLower = notes.toLowerCase();
        // CUTOVER (2026-08-28, see isVerified comment above for full
        // rationale): weak-evidence now reads confidence directly.
        const isWeak = item.confidence === 'unverified' || item.confidence === 'ocr_flagged' || !item.confidence;
        // CRITICAL FIX (2026-08-07, Claude B, per Claude A's handoff
        // docs/CLAUDE_B_HANDOFF_20260806_supersede_precedence_bug.md):
        // a `SUPERSEDED —` notes entry means Claude A already determined
        // this value is wrong and is retained only for citation history —
        // it must never enter pickPrimary's candidate pool at all. Without
        // this, isRealCaseCollision (a real, narrow, correct heuristic for
        // the book/teacher register-variant pattern) can't tell "this is
        // the neutral default" from "this was explicitly flagged wrong",
        // and 334 confirmed-wrong values were shipping to compiled_dict.json
        // as a result. Filtering here — the same place isVariant/isVerified
        // are already parsed from notes — means every downstream branch
        // (isRealCaseCollision, VERIFIED-neutral, last-write-wins) simply
        // never sees a SUPERSEDED candidate, with no new special-case
        // logic needed in pickPrimary itself.
        // CUTOVER (2026-08-28, see isVerified comment above for full
        // rationale): superseded status now reads confidence directly.
        const isSuperseded = item.confidence === 'superseded';
        if (isSuperseded) {
          if (eng) addSuperseded(eng, garo);
          return;
        }
        if (eng) addValue(eng, garo, isVariant, isVerified, isVariantVerified, isWeak);
      });
    } else if (typeof parsed === 'object' && parsed !== null) {
      Object.entries(parsed).forEach(([key, value]) => {
        if (typeof value === 'string') {
          addValue(key, value);
          return;
        }

        if (Array.isArray(value)) {
          value.forEach(item => {
            if (item?.english && item?.garo) {
              addValue(item.english, item.garo);
            }
          });
          return;
        }

        if (typeof value === 'object' && value !== null) {
          if (value.garo || value.hindi) {
            addValue(key, value.garo || value.hindi);
            return;
          }

          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            if (typeof nestedValue === 'string') {
              addValue(nestedKey, nestedValue);
            } else if (nestedValue?.english && nestedValue?.garo) {
              addValue(nestedValue.english, nestedValue.garo);
            }
          });
        }
      });
    }
    return { normalized, superseded };
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
    return { normalized: {}, superseded: {} };
  }
}

function cleanRakka(str) {
  if (typeof str !== 'string') return str;
  // Only fix spacing errors (space before raka).
  // The previous regex that stripped raka before verb suffixes was REMOVED —
  // it was corrupting 2,418 entries by deleting the glottal stop from verb
  // roots like cha·a → chaa, nik·aha → nikaha, on·bo → onbo etc.
  // (Audit Finding A, 2026-06-17)
  return str.replace(/\s+·/g, '·');
}

function pickPrimary(entries, key) {
  // IMPORTANT: base case must match the OLD behavior exactly (last value
  // wins, by file/array processing order), not a "smart" heuristic. A
  // previous version sorted by length-then-alphabetical, which picked
  // "i·a" as the primary for BOTH "go" and "come" — a corrupted
  // 3-character fragment that happened to be shortest, silently replacing
  // the correct "Re·ang·a"/"Re·ba·a" that was live and working before.
  // Shorter is not safer; it's just shorter. VERIFIED/HIGH is also not a
  // reliable signal (this exact "i·a" entry was tagged VERIFIED/HIGH for
  // both Go and Come). Defaulting to "no behavior change" is the only
  // safe automatic rule; alternates are still preserved in full for
  // human review separately.
  //
  // RC-CANDIDATE-027 (docs/PENDING_REGRESSION_CASES.md): same shape as
  // RULE-040 in that last-write-wins is order-dependent and can silently
  // clobber a correct default — but here 465 pairs share ONE exact
  // confirmed fix (RC-016/RC-019: "book"/"teacher"), not 465 individual
  // linguistic judgment calls. When exactly one candidate carries no
  // "variant" tag while the rest do, that one is the neutral/default
  // term and the variant-tagged entries are already-verified
  // register/loanword alternates — same conclusion Claude A reached for
  // book and teacher, applied uniformly. Any other shape (zero
  // non-variant entries, more than one, or no variant tags at all) falls
  // through unchanged to the original last-write-wins default.
  // RC-CANDIDATE-027 (docs/PENDING_REGRESSION_CASES.md): same shape as
  // RULE-040 in that last-write-wins is order-dependent and can silently
  // clobber a correct default — but here 465 pairs share ONE exact
  // confirmed fix (RC-016/RC-019: "book"/"teacher"), not 465 individual
  // linguistic judgment calls. When exactly one candidate carries no
  // "variant" tag while the rest do, AND that candidate's original key
  // casing genuinely differs from the variant-tagged ones' (a real
  // "book"/"Book"-style collision, not same-case duplicate rows), that
  // one is the neutral/default term and the variant-tagged entries are
  // already-verified register/loanword alternates — same conclusion
  // Claude A reached for book and teacher, applied uniformly. Requiring
  // an actual case difference matters: "watch" and "call" each have
  // 4 same-case entries (no case variation at all) where the "neutral"
  // one's own garo value doesn't even match the alternates listed in its
  // own notes — a data anomaly, not this confirmed pattern. Any other
  // shape (zero non-variant entries, more than one, no variant tags, or
  // no case difference) falls through unchanged to last-write-wins.
  const neutral = entries.filter(e => !e.isVariant);
  const variants = entries.filter(e => e.isVariant);
  const isRealCaseCollision = neutral.length === 1 && variants.length > 0 &&
    variants.some(v => v.rawKey !== neutral[0].rawKey);

  // RC-CANDIDATE-036 follow-up (2026-08-01, traced from the "answer"/
  // "to answer"/"one person" investigation): master's own internal
  // duplicate-key conflicts survive the master-preference fix below intact,
  // because among master's own candidates it's still plain last-write-wins
  // by array order — which is how "to answer" shipped the untagged
  // "Aganchaka" over the VERIFIED/HIGH/doc7 "a·gan·chak·na" one row above
  // it, and "one person" shipped the untagged "sa mande·sa" over the
  // VERIFIED/HIGH "mande sak·sa". Deliberately narrow signal only: when
  // exactly one non-variant candidate is explicitly tagged VERIFIED/HIGH
  // (and no other non-variant candidate also is — a genuine tie is left to
  // the existing fallback rather than guessed at), that candidate wins
  // regardless of array position. Untagged and explicitly-UNVERIFIED
  // siblings don't get a vote either way, matching how "answer" (3
  // non-variant candidates, exactly 1 VERIFIED/HIGH) should resolve too.
  // EXCLUDED: "to X" keys. Confirmed live via "he answered": master's
  // VERIFIED/HIGH candidate for "to answer" is "a·gan·chak·na" — but that
  // -na ending IS the Garo infinitive/purpose suffix already baked into
  // the citation form, not a bare stem. morphologyEngine.js's tense
  // pipeline treats whatever "to X" resolves to as a bare root and
  // suffixes tense directly onto it (findVerbForm -> applyTense), so this
  // produced a malformed double-suffixed "a·gan·chak·naha" instead of the
  // correct "Aganchakaha". This is exactly the failure mode
  // irregular_verbs.json's 2026-07-05 comment already warned about
  // (verbs using "purpose-clause -na endings...instead of actual
  // past-tense forms" were deliberately left to this same pipeline).
  // VERIFIED confidence attests the word is a correct translation, not
  // that its stored shape is a bare stem safe for suffixing — so for "to
  // X" keys specifically, this rule doesn't apply; last-write-wins /
  // master-preference below (unchanged prior behavior) still governs.
  const isInfinitiveKey = typeof key === 'string' && key.startsWith('to ');
  const verifiedNeutral = neutral.filter(e => e.isVerified);
  if (!isInfinitiveKey && verifiedNeutral.length === 1) {
    // This is the ONLY branch backed by an explicit, unambiguous
    // VERIFIED/HIGH signal (isVerified, computed once in normalizeFile —
    // not re-parsed or re-interpreted here). Every other branch below is
    // a fallback heuristic (case-collision, master-preference, plain
    // last-write-wins), not a verified confirmation, so only this branch
    // reports verifiedSelection: true. Callers (see grammarOverrides
    // application below) use this to avoid silently discarding an
    // explicit native-validation result — see
    // docs/RUNTIME_ENGINEERING_AUDIT_20260803.md, "grammarOverrides can
    // silently beat a VERIFIED candidate".
    return { value: verifiedNeutral[0].v, verifiedSelection: true };
  }

  // 2026-08-16, addendum (Claude B — surfaced by rebasing onto Claude A's
  // cb53f1c, which tagged 'answer'/'a·gan·chak·a' SUPERSEDED per NV-077 and
  // explicitly handed off what it found: with that UNVERIFIED row removed,
  // 'answer' now has TWO non-variant candidates both independently tagged
  // VERIFIED/HIGH — 'answer'/Aganchaka (verb sense) and 'Answer'/Aganchakani
  // (noun sense, distinct POS, NV-077) — so verifiedNeutral.length is 2, not
  // 1, and the branch above declines exactly as designed. Without this
  // branch, control fell all the way to masterEntries' flat last-write-wins
  // over ALL master-sourced candidates (verified or not), which picked
  // 'ku·chak·a' — a variant/VERIFIED/HIGH candidate, correctly verified, but
  // strictly lower-confidence than having TWO independently-verified neutral
  // senses simply lose a coin-flip to it by array position. Same shape and
  // same restraint as the single-verified-variant branch below: this
  // doesn't try to pick Aganchaka vs. Aganchakani (a genuine POS tie, not
  // this function's call to make) — it only ensures a tied pair of
  // full-VERIFIED neutral candidates can't be beaten by a lesser-confidence
  // candidate through pure last-write-wins. Falls back to last-write-wins
  // among the tied VERIFIED neutral candidates only, and logs it into the
  // same PICKPRIMARY_VERIFIED_TIES.md report as the branch below.
  if (!isInfinitiveKey && verifiedNeutral.length > 1) {
    const chosen = verifiedNeutral[verifiedNeutral.length - 1].v;
    console.log(`pickPrimary: '${key}' has ${verifiedNeutral.length} tied VERIFIED/HIGH non-variant candidates (${verifiedNeutral.map(e => e.v).join(', ')}) — excluding lower-confidence candidates, falling back to last-write-wins among the verified candidates only. Needs Claude A disambiguation — not resolved here.`);
    pickPrimaryVerifiedTies.push({ key, candidates: verifiedNeutral.map(e => e.v), chosen });
    return { value: chosen, verifiedSelection: false };
  }

  // NEW (2026-08-15, Claude B — Claude A's 9-key handoff in
  // .ai/WORKSTATE.yaml claude_a.next_action + Claude C's follow-up audit,
  // docs/CLAUDE_C_AUDIT_20260815B.md §1.3/§2.2): variant-tagged
  // VERIFIED/HIGH candidates (e.g. "Work"/"ga·a", notes
  // "variant/VERIFIED/HIGH") are invisible to the branch above (isVerified
  // is anchored to the START of notes, which a "variant/..." prefix never
  // matches) AND to the masterEntries branch below (flat last-write-wins
  // over every master-sourced candidate, no confidence tag consulted at
  // all). Confirmed live: 'work' shipped the OCR-flagged 'Kam' over two
  // variant/VERIFIED/HIGH candidates (ga·a/ka·a) purely because Kam
  // happens to sit last in master_dictionary.json's array order for that
  // key — same shape for boil/close/empty/leg/strong.
  //
  // Scoped narrowly, same restraint as the branch above: only fires when
  // EVERY non-variant candidate has no independent evidence of its own
  // (no notes at all, an OCR-import flag, or an explicit UNVERIFIED tag)
  // — it never overrides a neutral candidate carrying its own citation
  // (e.g. "outside"/a'palo, tagged CONFIRMED — a real sense-distinction
  // question, not this bug; deliberately left untouched here, flagged
  // separately to Claude A rather than guessed at).
  //
  // When exactly one variant candidate is VERIFIED/HIGH it wins outright
  // (verifiedSelection: true, same confidence tier as the branch above).
  // When two or more are tied (work: ga·a/ka·a; boil/close/empty/leg/
  // strong all have 2-3-way ties), this deliberately does NOT guess which
  // is "more correct" — same restraint already used for the neutral-tie
  // case (see "answer", Claude C audit §3, verifiedNeutral.length !== 1
  // falls through rather than picking). It only refuses to let the
  // weak-evidence neutral value win, then falls back to last-write-wins
  // among the verified variants only — the same fallback mechanism this
  // function already trusts elsewhere, not a new judgment call — and logs
  // the remaining tie so it's visible rather than silently shipped as if
  // settled.
  // verifiedSelection is deliberately FALSE for both cases below, unlike
  // the verifiedNeutral branch above — found live via 'smile': its sole
  // variant/VERIFIED/HIGH candidate ('ka·ding·sim·ik·a') carries a
  // self-contradicting note ("...its status...is unconfirmed -- possible
  // synonym or possible stale candidate. Not guessing..."), i.e. the tag
  // header and the note body disagree (same failure shape as the
  // NV-031/NV-038 header-vs-body mismatches found 2026-07-29). The
  // existing grammarOverrides entry for 'smile' exists specifically to
  // override pickPrimary here — marking this branch's picks as
  // verifiedSelection:true silently defeated that override (confirmed by
  // a first pass of this fix, caught via `pickPrimary already selected a
  // VERIFIED/HIGH candidate` log output before shipping, reverted here).
  // Unlike verifiedNeutral's regex (anchored, single, hand-reviewed
  // pattern), this branch's signal is a heuristic over the whole corpus
  // and shouldn't get the same trust level or block an explicit override.
  const neutralHasNoEvidence = neutral.length === 0 || neutral.every(e => e.isWeak);
  if (!isInfinitiveKey && neutralHasNoEvidence) {
    const verifiedVariants = variants.filter(e => e.isVariantVerified);
    if (verifiedVariants.length === 1) {
      return { value: verifiedVariants[0].v, verifiedSelection: false };
    }
    if (verifiedVariants.length > 1) {
      const chosen = verifiedVariants[verifiedVariants.length - 1].v;
      console.log(`pickPrimary: '${key}' has ${verifiedVariants.length} tied VERIFIED/HIGH variant candidates (${verifiedVariants.map(e => e.v).join(', ')}) and only weak-evidence non-variant candidates. Excluding the weak value; falling back to last-write-wins among the verified candidates only. Needs Claude A disambiguation — not resolved here.`);
      pickPrimaryVerifiedTies.push({ key, candidates: verifiedVariants.map(e => e.v), chosen });
      return { value: chosen, verifiedSelection: false };
    }
  }

  // RC-CANDIDATE-036 (external audit, 2026-07-31; confirmed live via
  // "one dog" -> shipped "sa mang·sa" vs master's "achak mang·sa"):
  // master_dictionary.json is the project's declared canonical source and
  // WAS included in the merge above, but plain last-write-wins by raw
  // array order meant its value only "won" if it happened to be textually
  // distinct from anything already deduped in. If master's value
  // coincidentally matched an earlier duplicate in a legacy file, master's
  // re-confirmation was invisible to the resolver, and a LATER, wrong
  // duplicate within that same legacy file (garo_dictionary.json had 159
  // such internally-conflicting keys) won instead. Fix: when any candidate
  // is master-sourced, prefer master — using the same last-write-wins rule
  // among ONLY the master candidates, so a tie between multiple master
  // entries for one key still resolves exactly as it did before (no new
  // behavior introduced beyond "master beats non-master").
  //
  // PROMOTED ABOVE isRealCaseCollision (2026-08-07, Claude B — found while
  // verifying the SUPERSEDED-filter fix against the full 337-key handoff
  // list in docs/CLAUDE_B_HANDOFF_20260806_supersede_precedence_bug.md:
  // only 43/337 kesy actually resolved by the SUPERSEDED filter alone).
  // Root cause: garo_dictionary.json (source 0) independently duplicates
  // many of the same wrong values master's SUPERSEDED rows flag — that
  // source has no notes field at all, so it can never be tagged
  // SUPERSEDED, and its untagged duplicate kept triggering
  // isRealCaseCollision and winning even after master's own SUPERSEDED
  // candidate was correctly filtered out (confirmed live: "pineapple",
  // "book", "banana", "teacher", ~290 others). Master-preference now runs
  // before isRealCaseCollision gets a turn, so any post-SUPERSEDED-filter
  // master answer wins outright — matching this exact comment's own
  // stated premise that master is canonical. This does not change
  // behavior for keys where master has no entry at all (masterEntries
  // stays empty, falls through to isRealCaseCollision/last-write-wins
  // exactly as before) — including the original book/teacher pattern,
  // which is itself now master-sourced post-SUPERSEDED-filter and so
  // resolves via this same branch, not via isRealCaseCollision, but to
  // the identical value as before (verified live).
  const masterEntries = entries.filter(e => e.source === 2);
  if (masterEntries.length) {
    return { value: masterEntries[masterEntries.length - 1].v, verifiedSelection: false };
  }

  if (isRealCaseCollision) {
    return { value: neutral[0].v, verifiedSelection: false };
  }

  return { value: entries[entries.length - 1].v, verifiedSelection: false };
}

// Merge -> pickPrimary -> grammarOverrides, isolated as a pure function so
// it can be unit-tested with synthetic entries, independent of any real
// dictionary file. Behavior is identical to what main() ran inline before
// this refactor — no logic changed here beyond what's documented at the
// grammarOverrides-skip site below.
function finalizeDictionary(mergedValues, grammarOverrides, supersededByKey = {}) {
  const finalized = {};
  const alternates = {};
  const verifiedKeys = new Set();
  // Keys where every surviving candidate turned out to be a SUPERSEDED
  // value re-appearing untagged from a non-master source (see
  // normalizeFile's `superseded` return above). Reported, not shipped.
  const heldSupersededOnly = {};

  Object.keys(mergedValues).forEach(key => {
    const supersededValues = supersededByKey[key];
    const cleanedEntries = mergedValues[key]
      .map(e => ({ v: cleanRakka(e.v), isVariant: e.isVariant, isVerified: e.isVerified, isVariantVerified: e.isVariantVerified, isWeak: e.isWeak, rawKey: e.rawKey, source: e.source }))
      .filter(e => Boolean(e.v))
      // 2026-08-14, Claude B (per Claude C's audit §3 / the "twenty
      // students" case): a candidate whose value is byte-identical to a
      // value master_dictionary.json explicitly marked SUPERSEDED for
      // this SAME key is the same known-wrong content resurfacing from a
      // source file that has no `notes` field to tag it with (e.g.
      // garo_dictionary.json). Master already made the call that this
      // exact string is wrong for this key; a different file agreeing by
      // coincidence isn't a second opinion, it's the same stale value.
      // Filtering it here, after cleanRakka normalization (so trivial
      // whitespace/raka-spacing differences don't defeat the match),
      // means pickPrimary and isRealCaseCollision downstream never see a
      // superseded-tainted candidate, without needing new special-case
      // logic in either of them.
      //
      // Scoped to source !== 2 (not master) only — see "two dogs":
      // master_dictionary.json can legitimately hold a stale SUPERSEDED
      // row and a separate, still-live VERIFIED/HIGH row that happen to
      // share the exact same garo value (the SUPERSEDED note there flags
      // a *different* prior contradiction already resolved, not this
      // value itself). The merge step above (main()) already collapses
      // same-value duplicates into one entry and upgrades its `source` to
      // 2 whenever master re-lists that value non-superseded, so an
      // entry that survives here with source === 2 is master's own
      // current, live word on the matter and must not be second-guessed
      // by its own stale sibling row's note.
      .filter(e => !(supersededValues && supersededValues.has(e.v) && e.source !== 2));
    if (!cleanedEntries.length) {
      if (supersededValues && supersededValues.size) {
        // Every candidate for this key was either absent or itself a
        // SUPERSEDED value — nothing safe to ship. Record for the
        // held-keys report instead of silently dropping (a plain
        // `return` here would look identical to "this key was never
        // populated at all", losing the distinction that matters for
        // follow-up native review).
        heldSupersededOnly[key] = [...supersededValues];
      }
      return;
    }
    const { value: primary, verifiedSelection } = pickPrimary(cleanedEntries, key);
    finalized[key] = primary;
    if (verifiedSelection) verifiedKeys.add(key);
    if (cleanedEntries.length > 1) {
      alternates[key] = mergedValues[key].map(e => e.v);
    }
    // AI-001 subclass (b) enumeration (see pickPrimaryNoVerifiedCandidate
    // above): record any key whose ENTIRE candidate set — not just the
    // one that shipped — carries zero VERIFIED signal (isVerified and
    // isVariantVerified both false on every candidate). verifiedSelection
    // is redundant with this check in practice (pickPrimary can't set it
    // true with no verified candidate) but kept as an explicit guard so
    // this stays correct even if pickPrimary's branches change.
    if (!verifiedSelection && cleanedEntries.every(e => !e.isVerified && !e.isVariantVerified)) {
      pickPrimaryNoVerifiedCandidate.push({
        key,
        candidates: cleanedEntries.map(e => ({ v: e.v, isWeak: e.isWeak, source: e.source })),
        chosen: primary,
      });
    }
  });

  Object.keys(grammarOverrides).forEach(key => {
    // ENGINEERING DESIGN DEFECT (docs/RUNTIME_ENGINEERING_AUDIT_20260803.md):
    // grammarOverrides previously applied unconditionally, with no check
    // against pickPrimary's own result — so it could silently beat an
    // explicit VERIFIED/HIGH native-validation confirmation. This is the
    // narrowest fix available without touching note-parsing: skip the
    // override only when pickPrimary's verifiedNeutral branch (the sole
    // branch backed by an unambiguous, already-computed signal) produced
    // this key's value. All other keys/branches are unaffected — this
    // does not change behavior for any key that doesn't hit that exact
    // branch, and does not attempt to guess verification status from any
    // other signal.
    if (verifiedKeys.has(key)) {
      console.log(`grammarOverrides: skipped '${key}' — pickPrimary already selected a VERIFIED/HIGH candidate ('${finalized[key]}')`);
      return;
    }
    finalized[key] = grammarOverrides[key];
    delete alternates[key];
  });

  return { finalized, alternates, heldSupersededOnly };
}

function main() {
  console.log('Compiling and sanitizing Garo dictionary records...');

  const { normalized: dict1, superseded: superseded1 } = normalizeFile(path.join(__dirname, 'garo_dictionary.json'));
  const { normalized: dict2, superseded: superseded2 } = normalizeFile(path.join(__dirname, 'garo_dictionary (2).json'));
  const { normalized: dict3, superseded: superseded3 } = normalizeFile(path.join(__dirname, 'master_dictionary.json'));

  // Merge superseded-value sets across all three sources (in practice only
  // master_dictionary.json ever populates this, since it's the only file
  // with a `notes` field — see normalizeFile).
  const supersededByKey = {};
  [superseded1, superseded2, superseded3].forEach(supersededMap => {
    Object.entries(supersededMap).forEach(([key, values]) => {
      if (!supersededByKey[key]) supersededByKey[key] = new Set();
      values.forEach(v => supersededByKey[key].add(v));
    });
  });

  // RC-CANDIDATE-036: tag each entry with its source dict index (2 =
  // master_dictionary.json) so pickPrimary can give master's declared
  // canonical authority actual effect. See pickPrimary for why this was
  // needed — master being *included* in the merge was not the same as
  // master's value actually winning.
  function tagSource(dict, source) {
    const tagged = {};
    Object.entries(dict).forEach(([key, entries]) => {
      tagged[key] = entries.map(e => ({ ...e, source }));
    });
    return tagged;
  }

  const mergedValues = {};
  [tagSource(dict1, 0), tagSource(dict2, 1), tagSource(dict3, 2)].forEach(dict => {
    Object.entries(dict).forEach(([key, entries]) => {
      if (!mergedValues[key]) mergedValues[key] = [];
      entries.forEach(entry => {
        const existing = mergedValues[key].find(e => e.v === entry.v);
        if (!existing) {
          mergedValues[key].push(entry);
        } else if (entry.source === 2) {
          // Same text already present from an earlier (non-master) source —
          // upgrade its source tag rather than dropping the master-tagged
          // duplicate, so pickPrimary can still see "master confirms this".
          existing.source = 2;
          // FIX (2026-08-28, Claude B, read-only impact-analysis follow-up
          // per docs/CLAUDE_B_SESSION_MIGRATION_20260827.md §5 item 2):
          // this upgrade path copied isVerified/isVariantVerified/isWeak
          // from the incoming master entry but never isVariant, so when a
          // master row's exact Garo text ALSO appears untagged in an
          // earlier non-master source (garo_dictionary.json etc.), the
          // earlier non-master entry's default isVariant=false silently
          // survives the "upgrade" and permanently overwrites master's own
          // variant tag for that value. Confirmed live via 'lie': master's
          // "Tol·napani" is variant/VERIFIED/HIGH, but garo_dictionary.json
          // also has an untagged "Tol·napani" row processed first, so the
          // merged entry stayed isVariant:false — invisible to
          // PICKPRIMARY_VERIFIED_TIES.md's variant-tie branch even though
          // it's a real, otherwise-correctly-detected tie (verified live:
          // this fix adds exactly one entry, 'lie', to that report). Master
          // is this pipeline's declared canonical source (see
          // RC-CANDIDATE-036 above), so its own tag should always win on
          // upgrade — direct assignment, not OR, matching how source itself
          // is handled on the line above. Verified zero compiled_dict.json
          // change from this fix alone (checked byte-for-byte against pre-
          // fix output): every previously-shipped winner is unaffected:
          // this only makes an already-real tie visible in the report
          // where it was previously silently hidden by the bug, and closes
          // an interaction risk for a future confidence-field cutover
          // (see that migration doc's impact-analysis findings).
          existing.isVariant = entry.isVariant;
          if (entry.isVerified) existing.isVerified = true;
          if (entry.isVariantVerified) existing.isVariantVerified = true;
          if (!entry.isWeak) existing.isWeak = false;
        }
      });
    });
  });

  const grammarOverrides = {
    'tasty': 'Toa',
    'delicious': 'Toa',
    'not tasty': 'Touja',
    'wait': 'Damo/Sengbo',
    'salt': 'Kari',
    'no more': 'Dongja',
    'it exists': 'Donga',
    // NV-095 (2026-08-23 final reconciliation relay): "quick" and "hurry"
    // are distinct headwords with distinct imperative forms — Ta·rakbo!
    // vs Tarkbo! respectively — not synonyms sharing one override.
    'quick': 'Ta·rakbo!',
    'hurry': 'Tarkbo!',
    "i don't care": 'Anga Dal·e Ra·ja',
    // RULE-040 (docs/GRAMMAR_RULE_CATALOGUE.md): "right" collapses three
    // distinct, native-confirmed Garo headwords via pickPrimary's
    // last-write-wins. Bare "right" is deliberately NOT set here — see
    // the explicit deletion below — because there is no correct single
    // default; every prior compiled value was wrong for at least two of
    // the three senses.
    'right (direction)': 'Jak·ra',
    'right (matching)': 'kra·a',
    'right (correct)': 'Kakket',
    // NV-067 follow-up (flagged in docs/CLAUDE_A_SESSION_MIGRATION_20260808.md
    // as an open P1 engine bug, root-caused there to pickPrimary's
    // master-preference branch): master_dictionary.json's remaining
    // (non-SUPERSEDED) "smile"/"Smile" candidate is itself notes-tagged
    // "variant/VERIFIED/HIGH -- ...status relative to Ka·dingsmita is
    // unconfirmed", i.e. explicitly NOT the confirmed default — yet
    // pickPrimary's isVariant/isVerified fields can't distinguish that
    // free-text caveat from genuinely-confirmed variant rows like
    // "table"'s (identical "variant/VERIFIED/HIGH" tag shape, but
    // silently confirmed), so a blanket variant-aware change to
    // pickPrimary itself regressed the table/buy/door SUPERSEDED-
    // precedence pattern (RC-CANDIDATE-027) when tried. A dedicated
    // override — same mechanism already used for "right"'s 3-way split
    // above — is the narrow, non-guessing fix: master_dictionary.json's
    // "To smile" row (separate key, notes "VERIFIED/HIGH. Confirmed
    // 2026-08-06...") is the actual native-confirmed value; this only
    // sets bare "smile" to match what corrections.json already patches
    // at the translate()/lookupGaro() layer, so the compiled artifact
    // itself (compiled_dict.json, used directly by lookup()/near-
    // duplicate tooling, which don't go through corrections.json) is
    // correct too, not just runtime translation.
    'smile': 'Ka·dingsmita',
    // NV-095 (2026-08-23 final reconciliation relay): "cooked" now has two
    // tied VERIFIED/HIGH candidates — min·a (NV-050, ripe/done-state sense,
    // shared with "ripe") and Song·aha (NV-095, cooked-food verb-paradigm
    // sense, alongside "cooking"=Song·enga). Thangseng's final relay
    // explicitly supplied Song·aha for this exact word-list entry, so it
    // is the default for bare "cooked"; min·a remains valid and reachable
    // under its own citation, not superseded, for the ripe/done sense.
    'cooked': 'Song·aha'
  };

  const { finalized, alternates, heldSupersededOnly } = finalizeDictionary(mergedValues, grammarOverrides, supersededByKey);

  // RULE-040: bare "right" is a genuine 3-way homonymy split (direction /
  // matching / correct), not a single headword with a best default — every
  // pickPrimary-selected value was wrong for two of the three senses. Drop
  // it rather than keep guessing; callers should use the sense-tagged keys
  // above ("right (direction)" / "right (matching)" / "right (correct)").
  // "rightly" is a separate, unrelated entry and is untouched.
  delete finalized['right'];
  delete alternates['right'];

  // Alias bare-infinitive form for "to X" headwords. Some dictionary
  // sources (e.g. the page-112 OCR import: "To bind", "To console") only
  // ever store the "to X" headword. Sentence assembly looks up verbs by
  // bare form, so those entries were unreachable in real sentences and,
  // worse, fell through to unrelated fuzzy matches (bare "bind" matched
  // "wind", edit distance 1). This only fills gaps — it never overwrites
  // an existing bare-form entry, so keys that already have their own
  // independently-chosen bare-form value (e.g. "hang") are untouched,
  // and pickPrimary's chosen value for the "to X" key itself doesn't
  // change either.
  let bareAliasCount = 0;
  Object.keys(finalized).forEach(key => {
    if (key.startsWith('to ')) {
      const bare = key.slice(3).trim();
      if (bare && !finalized[bare]) {
        finalized[bare] = finalized[key];
        bareAliasCount++;
      }
    }
  });
  if (bareAliasCount) {
    console.log(`Bare-infinitive aliases added: ${bareAliasCount} ("to X" -> "X" where "X" had no entry)`);
  }

  // 2026-08-09: a build-time "counting-phrase self-correction" pass was
  // attempted and reverted here after merging with Claude A's concurrent
  // NV-071 follow-up session. Same finding (413 "<number> <noun>"
  // entries mismatched against garo_classifier.js's classifier system,
  // not just the "three dogs" case), but Claude A/Thangseng's fix for
  // the dog case (see docs/THANGSENG_NATIVE_VALIDATION.md NV-071 #2)
  // deliberately, explicitly left the structurally-identical "three
  // cat"/"two cat" entries untouched pending their own native
  // confirmation — "not guessed at" is this project's standing
  // discipline for every linguistic value, including ones an engineer
  // can mechanically derive from an already-confirmed compositional
  // system. A blanket build-time pass applying that derivation to
  // every CLASSIFIER_MAP-mapped noun would silently overwrite that
  // restraint on every future build. The mechanism itself may still be
  // worth reviving later, gated behind an explicit per-noun allowlist
  // Claude A maintains (so "confirmed to follow the regular pattern"
  // is itself a tracked, native-reviewed fact) rather than an implicit
  // "has a CLASSIFIER_MAP entry" trigger — see the migration doc from
  // this date for the full 413-entry findings list, handed to Claude A
  // as a review candidate rather than shipped as an engineering fix.

  const srcDir = path.join(__dirname, 'src');
  if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir);

  fs.writeFileSync(
    path.join(srcDir, 'compiled_dict.json'),
    JSON.stringify(finalized),
    'utf8'
  );

  fs.writeFileSync(
    path.join(srcDir, 'compiled_dict_alternates.json'),
    JSON.stringify(alternates),
    'utf8'
  );

  console.log(`Success: Compiled ${Object.keys(finalized).length} unique entries into src/compiled_dict.json`);
  console.log(`Alternates: ${Object.keys(alternates).length} entries have 2+ known Garo variants -> src/compiled_dict_alternates.json`);

  const heldKeys = Object.keys(heldSupersededOnly);
  if (heldKeys.length) {
    console.log(`Held (not shipped — SUPERSEDED-only candidates): ${heldKeys.length} key(s), see docs/SUPERSEDED_ONLY_KEYS.md`);
    const reportLines = [
      '# Superseded-only keys — held from compiled_dict.json',
      '',
      `Auto-generated by prepare-data.js. Regenerated on every build; do not`,
      `hand-edit. ${heldKeys.length} key(s) currently held.`,
      '',
      'Every candidate value collected for each key below was either explicitly',
      'marked `SUPERSEDED` in master_dictionary.json, or byte-identical to a',
      'value marked `SUPERSEDED` for that same key (i.e. the same known-wrong',
      'string resurfacing untagged from a source file with no `notes` field,',
      'such as garo_dictionary.json). No candidate was safe to ship, so the key',
      'is absent from compiled_dict.json / compiled_dict_alternates.json rather',
      'than shipping a known-wrong value. Needs a native-confirmed replacement',
      '(master_dictionary.json entry, non-SUPERSEDED) before it will compile.',
      '',
      ...heldKeys.sort().map(key => `- \`${key}\`: superseded value(s) — ${heldSupersededOnly[key].map(v => `\`${v}\``).join(', ')}`),
      '',
    ];
    fs.writeFileSync(path.join(__dirname, 'docs', 'SUPERSEDED_ONLY_KEYS.md'), reportLines.join('\n'), 'utf8');
  } else {
    const staleReportPath = path.join(__dirname, 'docs', 'SUPERSEDED_ONLY_KEYS.md');
    if (fs.existsSync(staleReportPath)) fs.unlinkSync(staleReportPath);
  }

  if (pickPrimaryVerifiedTies.length) {
    console.log(`pickPrimary verified-tie report: ${pickPrimaryVerifiedTies.length} key(s), see docs/PICKPRIMARY_VERIFIED_TIES.md`);
    const tieLines = [
      '# pickPrimary verified-tie report',
      '',
      'Auto-generated by prepare-data.js. Regenerated on every build; do not',
      `hand-edit. ${pickPrimaryVerifiedTies.length} key(s) currently listed.`,
      '',
      'Not a defect list — every key below already ships a genuinely',
      '`VERIFIED/HIGH` value (2026-08-16 fix: pickPrimary no longer lets an',
      'OCR-flagged/untagged/`UNVERIFIED` non-variant candidate win over a',
      '`variant/VERIFIED/HIGH` one, see docs/CLAUDE_B_SESSION_MIGRATION_20260816.md).',
      'What\'s recorded here is which key had 2+ candidates that were',
      '*equally* VERIFIED/HIGH, with no signal to prefer one over the',
      'others — the shipped value was picked by last-write-wins (array',
      'order), not a linguistic decision. Low priority (nothing here is',
      'wrong), but each is a real open disambiguation question for',
      'Claude A whenever there\'s time — same shape as the `answer`',
      '(Aganchaka/Aganchakani) case already tracked separately.',
      '',
      ...pickPrimaryVerifiedTies
        .slice()
        .sort((a, b) => a.key.localeCompare(b.key))
        .map(({ key, candidates, chosen }) => `- \`${key}\`: candidates — ${candidates.map(v => `\`${v}\``).join(', ')} — shipped: \`${chosen}\``),
      '',
    ];
    fs.writeFileSync(path.join(__dirname, 'docs', 'PICKPRIMARY_VERIFIED_TIES.md'), tieLines.join('\n'), 'utf8');
  } else {
    const staleTiesPath = path.join(__dirname, 'docs', 'PICKPRIMARY_VERIFIED_TIES.md');
    if (fs.existsSync(staleTiesPath)) fs.unlinkSync(staleTiesPath);
  }

  if (pickPrimaryNoVerifiedCandidate.length) {
    console.log(`pickPrimary no-verified-candidate report: ${pickPrimaryNoVerifiedCandidate.length} key(s), see docs/PICKPRIMARY_NO_VERIFIED_CANDIDATE.md`);
    const weakCount = pickPrimaryNoVerifiedCandidate.filter(({ candidates }) => candidates.some(c => c.isWeak)).length;
    const noVerifiedLines = [
      '# pickPrimary no-verified-candidate report (AI-001 subclass b)',
      '',
      'Auto-generated by prepare-data.js. Regenerated on every build; do not',
      `hand-edit. ${pickPrimaryNoVerifiedCandidate.length} key(s) currently listed`,
      `(${weakCount} with at least one explicitly OCR/weak-flagged candidate —`,
      'see docs/CLAUDE_B_ENGINEERING_GOVERNANCE.md §1 subclass (b)).',
      '',
      'Every key below shipped a value with ZERO verified backing anywhere in',
      'its candidate set — no candidate is tagged `VERIFIED/HIGH` or',
      '`variant/VERIFIED/HIGH`. This is NOT automatically a defect list: the',
      'large majority of these are simply words that have not yet reached',
      'native validation, same as most of the corpus. A minority are the',
      'confirmed failure shape from docs/CLAUDE_C_AUDIT_20260816.md §2',
      '(`work`/`boil`/`build`/`close`/`empty`/`leg`/`outside`/`strong`) where a',
      'SUPERSEDED/OCR-flagged row is actively winning over a better untagged',
      'candidate — this report does not distinguish the two cases, that call',
      'is Claude A/C\'s. Structural fix (AI-001, still OPEN): a `confidence`/',
      '`confidence_source` schema on master_dictionary.json rows, designed',
      '2026-08-04, not yet implemented — see docs/',
      'CLAUDE_B_ENGINEERING_GOVERNANCE.md §4.',
      '',
      ...pickPrimaryNoVerifiedCandidate
        .slice()
        .sort((a, b) => a.key.localeCompare(b.key))
        .map(({ key, candidates, chosen }) => `- \`${key}\`: candidates — ${candidates.map(c => `\`${c.v}\`${c.isWeak ? ' (weak/OCR)' : ''}`).join(', ')} — shipped: \`${chosen}\``),
      '',
    ];
    fs.writeFileSync(path.join(__dirname, 'docs', 'PICKPRIMARY_NO_VERIFIED_CANDIDATE.md'), noVerifiedLines.join('\n'), 'utf8');
  } else {
    const staleNoVerifiedPath = path.join(__dirname, 'docs', 'PICKPRIMARY_NO_VERIFIED_CANDIDATE.md');
    if (fs.existsSync(staleNoVerifiedPath)) fs.unlinkSync(staleNoVerifiedPath);
  }

  const masterPath = path.join(__dirname, 'master_dictionary.json');
  if (fs.existsSync(masterPath)) {
    const masterRaw = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    const catIndex = {};
    masterRaw.forEach(item => {
      const eng = (item.english||'').trim().toLowerCase();
      const cat = item.category || 'uncategorized';
      if (eng && cat && cat !== 'uncategorized') catIndex[eng] = cat;
    });
    const dataDir = path.join(__dirname, 'src', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, 'category_index.json'), JSON.stringify(catIndex, null, 2));
    console.log(`Category index: ${Object.keys(catIndex).length} categorized entries`);
  }
}

// Guard so this module can be imported (e.g. by tests, to unit-test
// pickPrimary/finalizeDictionary directly with synthetic data) without
// triggering the file-writing build side effect. `node prepare-data.js`
// (the real build) still runs main() exactly as before.
const isRunDirectly = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isRunDirectly) {
  main();
}

export { pickPrimary, finalizeDictionary, pickPrimaryNoVerifiedCandidate };