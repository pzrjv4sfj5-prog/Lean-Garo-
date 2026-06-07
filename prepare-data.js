import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const normalized = {};

    if (Array.isArray(parsed)) {
      parsed.forEach(item => {
        const eng = item.english || item.English || '';
        const garo = item.garo || item.Garo || '';
        if (eng) normalized[eng.trim().toLowerCase()] = garo.trim();
      });
    } else if (typeof parsed === 'object' && parsed !== null) {
      Object.entries(parsed).forEach(([key, value]) => {
        if (typeof value === 'string') {
          normalized[key.trim().toLowerCase()] = value.trim();
          return;
        }

        if (Array.isArray(value)) {
          value.forEach(item => {
            if (item?.english && item?.garo) {
              normalized[item.english.trim().toLowerCase()] = item.garo.trim();
            }
          });
          return;
        }

        if (typeof value === 'object' && value !== null) {
          if (value.garo || value.hindi) {
            normalized[key.trim().toLowerCase()] = String(value.garo || value.hindi).trim();
            return;
          }

          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            if (typeof nestedValue === 'string') {
              normalized[nestedKey.trim().toLowerCase()] = nestedValue.trim();
            } else if (nestedValue?.english && nestedValue?.garo) {
              normalized[nestedValue.english.trim().toLowerCase()] = nestedValue.garo.trim();
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
  return str
    .replace(/\s+·/g, '·')
    .replace(/·(?=(a|enga|oenga|bo|ja|aha|gen|manjok|ama|engma)(?:\b|-))/g, '');
}

function main() {
  console.log('Compiling and sanitizing Garo dictionary records...');

  const dict1 = normalizeFile(path.join(__dirname, 'garo_dictionary.json'));
  const dict2 = normalizeFile(path.join(__dirname, 'garo_dictionary (2).json'));
  const dict3 = normalizeFile(path.join(__dirname, 'master_dictionary.json'));

  const merged = { ...dict1, ...dict2, ...dict3 };

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

  Object.keys(merged).forEach(key => {
    let value = merged[key];
    value = cleanRakka(value);
    finalized[key.trim().toLowerCase()] = value;
  });

  Object.keys(grammarOverrides).forEach(key => {
    finalized[key] = grammarOverrides[key];
  });

  const srcDir = path.join(__dirname, 'src');
  if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir);

  fs.writeFileSync(
    path.join(srcDir, 'compiled_dict.json'),
    JSON.stringify(finalized),
    'utf8'
  );

  console.log(`Success: Compiled ${Object.keys(finalized).length} unique entries into src/compiled_dict.json`);
}

main();