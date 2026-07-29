import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

    const addValue = function(key, value, isVariant = false) {
      const k = key.trim().toLowerCase();
      const v = String(value).trim();
      const rawKey = key.trim();
      if (!k || !v) return;
      if (!normalized[k]) normalized[k] = [];
      if (!normalized[k].some(entry => entry.v === v)) normalized[k].push({ v, isVariant, rawKey });
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
        if (eng) addValue(eng, garo, isVariant);
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

function pickPrimary(entries) {
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
  if (isRealCaseCollision) {
    return neutral[0].v;
  }
  return entries[entries.length - 1].v;
}

function main() {
  console.log('Compiling and sanitizing Garo dictionary records...');

  const dict1 = normalizeFile(path.join(__dirname, 'garo_dictionary.json'));
  const dict2 = normalizeFile(path.join(__dirname, 'garo_dictionary (2).json'));
  const dict3 = normalizeFile(path.join(__dirname, 'master_dictionary.json'));

  const mergedValues = {};
  [dict1, dict2, dict3].forEach(dict => {
    Object.entries(dict).forEach(([key, entries]) => {
      if (!mergedValues[key]) mergedValues[key] = [];
      entries.forEach(entry => {
        if (!mergedValues[key].some(e => e.v === entry.v)) mergedValues[key].push(entry);
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
    'right (correct)': 'Kakket'
  };

  const finalized = {};
  const alternates = {};

  Object.keys(mergedValues).forEach(key => {
    const cleanedEntries = mergedValues[key]
      .map(e => ({ v: cleanRakka(e.v), isVariant: e.isVariant, rawKey: e.rawKey }))
      .filter(e => Boolean(e.v));
    if (!cleanedEntries.length) return;
    const primary = pickPrimary(cleanedEntries);
    finalized[key] = primary;
    if (cleanedEntries.length > 1) {
      alternates[key] = mergedValues[key].map(e => e.v);
    }
  });

  Object.keys(grammarOverrides).forEach(key => {
    finalized[key] = grammarOverrides[key];
    delete alternates[key];
  });

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

main();