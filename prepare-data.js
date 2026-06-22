import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeFile(filePath) {
  // Returns { [key]: string[] } — ALL values seen for each key, in file
  // order, not just the last one. Previously this silently overwrote
  // earlier values on key collision, the root mechanism behind every
  // duplicate-key bug found this session (eat/Eat, current/Current,
  // good/Good, etc.).
  if (!fs.existsSync(filePath)) return {};
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const normalized = {};

    function addValue(key, value) {
      const k = key.trim().toLowerCase();
      const v = String(value).trim();
      if (!k || !v) return;
      if (!normalized[k]) normalized[k] = [];
      if (!normalized[k].includes(v)) normalized[k].push(v);
    }

    if (Array.isArray(parsed)) {
      parsed.forEach(item => {
        const eng = item.english || item.English || '';
        const garo = item.garo || item.Garo || '';
        if (eng) addValue(eng, garo);
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

function pickPrimary(values) {
  // IMPORTANT: this must match the OLD behavior exactly (last value wins,
  // by file/array processing order), not a "smart" heuristic. A previous
  // version sorted by length-then-alphabetical, which picked "i·a" as the
  // primary for BOTH "go" and "come" — a corrupted 3-character fragment
  // that happened to be shortest, silently replacing the correct
  // "Re·ang·a"/"Re·ba·a" that was live and working before. Shorter is not
  // safer; it's just shorter. VERIFIED/HIGH is also not a reliable signal
  // (this exact "i·a" entry was tagged VERIFIED/HIGH for both Go and Come).
  // Defaulting to "no behavior change" is the only safe automatic rule;
  // alternates are still preserved in full for human review separately.
  return values[values.length - 1];
}

function main() {
  console.log('Compiling and sanitizing Garo dictionary records...');

  const dict1 = normalizeFile(path.join(__dirname, 'garo_dictionary.json'));
  const dict2 = normalizeFile(path.join(__dirname, 'garo_dictionary (2).json'));
  const dict3 = normalizeFile(path.join(__dirname, 'master_dictionary.json'));

  const mergedValues = {};
  [dict1, dict2, dict3].forEach(dict => {
    Object.entries(dict).forEach(([key, values]) => {
      if (!mergedValues[key]) mergedValues[key] = [];
      values.forEach(v => {
        if (!mergedValues[key].includes(v)) mergedValues[key].push(v);
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
    "i don't care": 'Anga Dal·e Ra·ja'
  };

  const finalized = {};
  const alternates = {};

  Object.keys(mergedValues).forEach(key => {
    const cleanedValues = mergedValues[key].map(v => cleanRakka(v)).filter(Boolean);
    if (!cleanedValues.length) return;
    const primary = pickPrimary(cleanedValues);
    finalized[key] = primary;
    if (cleanedValues.length > 1) {
      alternates[key] = mergedValues[key];
    }
  });

  Object.keys(grammarOverrides).forEach(key => {
    finalized[key] = grammarOverrides[key];
    delete alternates[key];
  });

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