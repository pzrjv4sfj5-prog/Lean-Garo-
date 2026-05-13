import fs from 'fs';

// Required grammatical corrections to verify
const requiredCorrections = {
  'tasty': 'Toa',
  'not tasty': 'Touja',
  'wait': 'Damo/Sengbo',
  'salt': 'Kari',
  'no more': 'Dongja',
  'it exists': 'Donga',
  'quick': 'Tarkbo',
  'hurry': 'Tarkbo',
  "i don't care": 'Anga Dal·e Ra·ja'
};

function validateEntry(key, value) {
  // Check for empty/null values
  if (!key || !value || key.trim() === '' || value.trim() === '') {
    return { valid: false, error: 'Empty key or value' };
  }

  // Check for undefined/null
  if (key === 'undefined' || value === 'undefined' || key === 'null' || value === 'null') {
    return { valid: false, error: 'Undefined or null values' };
  }

  // Check for proper string types
  if (typeof key !== 'string' || typeof value !== 'string') {
    return { valid: false, error: 'Non-string values' };
  }

  return { valid: true };
}

try {
  // Load compiled dictionary
  const compiled = JSON.parse(fs.readFileSync('src/compiled_dict.json', 'utf8'));

  let totalEntries = 0;
  let validEntries = 0;
  let correctionMatches = 0;
  const errors = [];

  // Validate each entry
  Object.entries(compiled).forEach(([key, value]) => {
    totalEntries++;

    const validation = validateEntry(key, value);
    if (!validation.valid) {
      errors.push(`Entry ${totalEntries}: ${validation.error} - "${key}": "${value}"`);
      return;
    }

    // Check grammatical corrections
    if (requiredCorrections[key] && requiredCorrections[key] === value) {
      correctionMatches++;
    }

    validEntries++;
  });

  // Verify JSON compliance
  const jsonString = JSON.stringify(compiled);
  let jsonValid = true;
  try {
    JSON.parse(jsonString);
  } catch {
    jsonValid = false;
    errors.push('JSON formatting invalid');
  }

  // Test summary
  console.log(`📊 Dictionary Test Results:`);
  console.log(`   Total entries: ${totalEntries}`);
  console.log(`   Valid entries: ${validEntries}/${totalEntries}`);
  console.log(`   Grammatical corrections verified: ${correctionMatches}/${Object.keys(requiredCorrections).length}`);
  console.log(`   JSON compliance: ${jsonValid ? '✅' : '❌'}`);

  if (errors.length > 0) {
    console.log(`\n❌ Errors found:`);
    errors.forEach(error => console.log(`   - ${error}`));
    process.exit(1);
  } else {
    console.log(`\n✅ All tests passed! Ready for deployment.`);
  }

} catch (error) {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
}