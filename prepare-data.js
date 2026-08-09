import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { NUMBER_WORDS, CLASSIFIER_MAP, countNoun, parseCountingPhrase } from './src/garo_classifier.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeFile(filePath) {
  // Returns { [key]: {v: string, isVariant: boolean}[] } — ALL values seen
  // for each key, in file order, not just the last one, tagged with
  // whether the source entry's `notes` field was explicitly marked as a
  // register/loanword "variant" (master_dictionary.json only — other
  // sources have no notes field, so isVariant is always false for them).
  // Previously this silently overwrote earlier values on key collision,
  // the root mechanism behind every duplicate-key bug found this session
  // (eat/Eat, current/Current, good/Good, etc.).
  if (!fs.existsSync(filePath)) return {};
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const normalized = {};

    const addValue = function(key, value, isVariant = false, isVerified = false) {
      const k = key.trim().toLowerCase();
      const v = String(value).trim();
      const rawKey = key.trim();
      if (!k || !v) return;
      if (!normalized[k]) normalized[k] = [];
      if (!normalized[k].some(entry => entry.v === v)) normalized[k].push({ v, isVariant, isVerified, rawKey });
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
        const isVerified = /^verified\/high\b/i.test(notes);
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
        const isSuperseded = /^superseded\b/i.test(notes);
        if (isSuperseded) return;
        if (eng) addValue(eng, garo, isVariant, isVerified);
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
    return normalized;
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
    return {};
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
function finalizeDictionary(mergedValues, grammarOverrides) {
  const finalized = {};
  const alternates = {};
  const verifiedKeys = new Set();

  Object.keys(mergedValues).forEach(key => {
    const cleanedEntries = mergedValues[key]
      .map(e => ({ v: cleanRakka(e.v), isVariant: e.isVariant, isVerified: e.isVerified, rawKey: e.rawKey, source: e.source }))
      .filter(e => Boolean(e.v));
    if (!cleanedEntries.length) return;
    const { value: primary, verifiedSelection } = pickPrimary(cleanedEntries, key);
    finalized[key] = primary;
    if (verifiedSelection) verifiedKeys.add(key);
    if (cleanedEntries.length > 1) {
      alternates[key] = mergedValues[key].map(e => e.v);
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

  return { finalized, alternates };
}

function main() {
  console.log('Compiling and sanitizing Garo dictionary records...');

  const dict1 = normalizeFile(path.join(__dirname, 'garo_dictionary.json'));
  const dict2 = normalizeFile(path.join(__dirname, 'garo_dictionary (2).json'));
  const dict3 = normalizeFile(path.join(__dirname, 'master_dictionary.json'));

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
          if (entry.isVerified) existing.isVerified = true;
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
    'quick': 'Tarkbo',
    'hurry': 'Tarkbo',
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
    'smile': 'Ka·dingsmita'
  };

  const { finalized, alternates } = finalizeDictionary(mergedValues, grammarOverrides);

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

  // Counting-phrase self-correction (2026-08-09, per explicit native-
  // speaker-confirmed reference examples: "two dogs"=achak mang·gni,
  // "three dogs"=achak mang·gittam, "four dogs"=achak mang·bri — flagged
  // as a systemic, cross-category problem, not a one-off "three dogs"
  // typo). Root cause: hundreds of "<number> <noun>" entries across
  // master_dictionary.json/garo_dictionary.json were hand-authored
  // literal phrases (OCR imports, early manual entries, etc.), stored
  // and merged the same as any other headword — completely independent
  // of garo_classifier.js's classifier-composition system (mang/sak/
  // king/gong/jol/ge/rong/pang/dot + number suffix), even though that
  // system is itself already native-speaker-confirmed (see
  // garo_classifier.js file header) and can DERIVE the correct value
  // for any of these entries from two already-verified facts: the bare
  // noun's own dictionary entry, and the classifier category it
  // belongs to. A one-time hand-patch of the ~400 currently-mismatched
  // entries would fix today's data but not stop tomorrow's OCR import
  // from reintroducing the same class of error — so instead, every
  // build now derives these phrases fresh from the classifier engine
  // and overwrites whatever literal value the source files had,
  // permanently closing this category of drift rather than patching
  // today's snapshot of it.
  //
  // Deliberately conservative about WHEN this fires, to add zero new
  // guessed linguistic data:
  //   - only when the noun has an EXPLICIT entry in CLASSIFIER_MAP
  //     (never the 'ge' catch-all default for an unmapped noun — that
  //     default is confirmed correct only for its own listed nouns,
  //     not as a blind guess for arbitrary countable objects)
  //   - only when the bare singular noun itself already has its own
  //     finalized (post pickPrimary-resolution) dictionary entry — the
  //     SAME canonical spelling every other lookup in this app uses,
  //     not a raw, pre-merge, possibly-superseded source-file spelling
  //   - never invents a new key: only overwrites keys that already
  //     existed as "<number> <noun>" phrases in the source data
  let countingPhraseCorrections = 0;
  Object.keys(finalized).forEach(key => {
    const words = key.split(' ');
    if (words.length < 2 || NUMBER_WORDS[words[0]] === undefined) return;
    const countPhrase = parseCountingPhrase(key);
    if (!countPhrase) return;
    if (!Object.prototype.hasOwnProperty.call(CLASSIFIER_MAP, countPhrase.englishNoun)) return;
    const nounGaro = finalized[countPhrase.englishNoun] || finalized[countPhrase.originalNoun];
    if (!nounGaro) return;
    const expected = countNoun(nounGaro, countPhrase.count, countPhrase.englishNoun);
    if (expected && finalized[key] !== expected) {
      finalized[key] = expected;
      delete alternates[key];
      countingPhraseCorrections++;
    }
  });
  if (countingPhraseCorrections) {
    console.log(`Counting-phrase entries corrected via classifier engine: ${countingPhraseCorrections} ("<number> <noun>" phrases re-derived from the noun's own dictionary entry + its confirmed classifier, overwriting stale literal values)`);
  }

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

export { pickPrimary, finalizeDictionary };