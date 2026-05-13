import fs from 'fs';

try {
  const dictionary = JSON.parse(fs.readFileSync('garo_dictionary.json', 'utf8'));
  const compiled = {};

  dictionary.forEach(entry => {
    if (entry.english && entry.garo) {
      const key = entry.english.toLowerCase().trim();
      const value = entry.garo.trim();
      compiled[key] = value;
    }
  });

  fs.writeFileSync('src/compiled_dict.json', JSON.stringify(compiled));
  console.log(`Compiled ${Object.keys(compiled).length} dictionary entries`);
} catch (error) {
  console.error('Dictionary compilation failed:', error.message);
  process.exit(1);
}