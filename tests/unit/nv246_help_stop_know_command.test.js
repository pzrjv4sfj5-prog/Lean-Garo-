// NV-246 (Claude B, 2026-11-01). Project Owner rulings on the two paradigm/engine command mismatches:
//  * `help!` = dakchakbo (paradigm wins; the unverified OCR `Madengma!` is retired from the engine);
//  * `stop!` = Sengbo (engine wins; the paradigm's derived `dontongbo` command is replaced).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { translate } from '../../src/translationEngine.js';
const g = async (en) => (await translate(en)).garo;
test('NV-246: Help! -> Dakchakbo!', async () => { assert.equal(await g('Help!'), 'Dakchakbo!'); assert.equal(await g('help!'), 'Dakchakbo!'); });
test('NV-246: no Madengma in help output', async () => assert.ok(!/madengma/i.test(await g('Help!'))));
test('NV-246: Stop! -> Sengbo!', async () => assert.equal(await g('Stop!'), 'Sengbo!'));
test('NV-246: help me is unchanged', async () => assert.equal(await g('help me'), 'Angko dakchakbo'));
test('NV-246: stop paradigm command is sengbo, other stop forms unchanged', () => {
  const v = JSON.parse(readFileSync(new URL('../../src/data/verb_paradigms.json', import.meta.url), 'utf8')).verbs.stop;
  assert.equal(v.forms.command, 'sengbo');
  assert.equal(v.forms.present, 'dontonga');
  assert.equal(v.forms.negative_command, 'dontongnabe');
});
// NV-246 (cont.): `know` negative = uija (engine pin wins; the paradigm's derived `hai·ja` is replaced).
test('NV-246: I do not know -> Anga uija', async () => assert.equal(await g('I do not know'), 'Anga uija'));
test('NV-246: know paradigm negative is uija; other know forms unchanged', () => {
  const v = JSON.parse(readFileSync(new URL('../../src/data/verb_paradigms.json', import.meta.url), 'utf8')).verbs.know;
  assert.equal(v.forms.negative, 'uija'); assert.equal(v.forms.present, 'hai·a'); assert.equal(v.forms.command, 'hai·bo');
});
