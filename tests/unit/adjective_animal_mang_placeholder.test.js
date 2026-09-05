import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';

const compiled = JSON.parse(fs.readFileSync(new URL('../../src/compiled_dict.json', import.meta.url)));

// Full-Scale Translation Integrity Audit, finding #3 (2026-09-05):
// master_dictionary.json contained a bulk-generation defect across 15
// modifiers (my/your/his-her/our/their/big/small/good/bad/hot/cold/new/
// old/beautiful/ugly) x 4 animals (dog/cat/bird/fish) = 60 rows, where the
// noun half of every entry was the generic animal-classifier placeholder
// "mang" instead of the species-specific root — so e.g. "big dog", "big
// cat", "big bird", "big fish" all shipped the *identical* Garo string
// ("gonga mang"), silently wrong for every animal at once.
//
// The same batch-generation defect turned out to also hit non-animal
// nouns under the identical 15 modifiers: "house"/"tree" both collapsed
// to a shared "rang", "water"/"student"/"river" all collapsed to "chik",
// and "food"/"rice" both collapsed to "chak" — same root cause (a
// generic-looking word left over from a different noun's row, not
// actually that noun's own root), just not species-specific at all.
//
// Fixed 2026-09-05 (Claude B, remediation session) for every noun in this
// batch with an unambiguous canonical root already agreed by the working
// sov-assembly composition path: dog -> Achak, bird -> do·o, fish ->
// na·tok, house -> Nok, tree -> Bol, water -> Chi, student -> Chattro,
// river -> chi·bi·ma, food -> al·a, rice -> mi.
//
// "cat" rows in this same batch are deliberately left untouched/unfixed:
// cat's own canonical root is a genuine unresolved conflict between two
// verified_high sources (menggo vs meng·gong) per
// docs/CLAUDE_B_SESSION_MIGRATION_20260905C.md, and this task's own
// standing rule is "do not make independent linguistic decisions where
// Claude A owns the canonical data." Fixing every other noun in the batch
// without inventing a cat answer is exactly the boundary of this fix.

const MODIFIERS = [
  'my', 'your', 'his/her', 'our', 'their',
  'big', 'small', 'good', 'bad', 'hot', 'cold', 'new', 'old', 'beautiful', 'ugly',
];

test('adjective+animal: dog/bird/fish no longer collide on the "mang" placeholder', () => {
  for (const mod of MODIFIERS) {
    const dog = compiled[`${mod} dog`];
    const bird = compiled[`${mod} bird`];
    const fish = compiled[`${mod} fish`];
    assert.ok(dog, `expected a compiled entry for "${mod} dog"`);
    assert.ok(bird, `expected a compiled entry for "${mod} bird"`);
    assert.ok(fish, `expected a compiled entry for "${mod} fish"`);

    assert.ok(!/\bmang$/i.test(dog), `"${mod} dog" still ends in the generic placeholder "mang": ${dog}`);
    assert.ok(!/\bmang$/i.test(bird), `"${mod} bird" still ends in the generic placeholder "mang": ${bird}`);
    assert.ok(!/\bmang$/i.test(fish), `"${mod} fish" still ends in the generic placeholder "mang": ${fish}`);

    // The three must now be mutually distinct (no residual cross-animal collision).
    assert.notEqual(dog, bird, `"${mod} dog" and "${mod} bird" still collide: ${dog}`);
    assert.notEqual(dog, fish, `"${mod} dog" and "${mod} fish" still collide: ${dog}`);
    assert.notEqual(bird, fish, `"${mod} bird" and "${mod} fish" still collide: ${bird}`);

    // Each must end with the same species root the working sentence-assembly
    // path already uses, so phrase-table and sentence composition agree.
    assert.match(dog, /achak$/i, `"${mod} dog" does not end with the canonical dog root: ${dog}`);
    assert.match(bird, /do·o$/i, `"${mod} bird" does not end with the canonical bird root: ${bird}`);
    assert.match(fish, /na·tok$/i, `"${mod} fish" does not end with the canonical fish root: ${fish}`);
  }
});

test('adjective+noun (non-animal): house/tree, water/student/river, food/rice no longer collide', () => {
  const CANON = {
    house: /nok$/i, tree: /bol$/i, water: /chi$/i, student: /chattro$/i,
    river: /chi·bi·ma$/i, food: /al·a$/i, rice: /mi$/i,
  };
  // "river" and "food" only exist under the 5 possessive modifiers in
  // master_dictionary.json (no "big river"/"big food" rows at all); the
  // other 5 nouns exist under all 15. Check only combinations that are
  // actually present rather than assuming a full 15x7 grid.
  const POSSESSIVES = ['my', 'your', 'his/her', 'our', 'their'];
  for (const mod of MODIFIERS) {
    const nounsForThisMod = POSSESSIVES.includes(mod)
      ? Object.keys(CANON)
      : Object.keys(CANON).filter((n) => n !== 'river' && n !== 'food');
    for (const noun of nounsForThisMod) {
      const v = compiled[`${mod} ${noun}`];
      assert.ok(v, `expected a compiled entry for "${mod} ${noun}"`);
      assert.match(v, CANON[noun], `"${mod} ${noun}" does not end with its own canonical root: ${v}`);
    }
    // Cross-check the two nouns that used to collide are now distinct.
    assert.notEqual(compiled[`${mod} house`], compiled[`${mod} tree`]);
    assert.notEqual(compiled[`${mod} water`], compiled[`${mod} student`]);
    assert.notEqual(compiled[`${mod} rice`], compiled[`${mod} water`]);
    if (POSSESSIVES.includes(mod)) {
      assert.notEqual(compiled[`${mod} water`], compiled[`${mod} river`]);
      assert.notEqual(compiled[`${mod} student`], compiled[`${mod} river`]);
      assert.notEqual(compiled[`${mod} food`], compiled[`${mod} rice`]);
    }
  }
});

test('adjective+animal: "cat" rows remain the known, tracked, un-fixed placeholder (not silently changed)', () => {
  // This is a deliberate "still broken, and we know it" guard, not a pass/fail
  // on correctness — it exists so nobody's future edit quietly picks a cat
  // root here without also updating the audit/migration trail.
  for (const mod of MODIFIERS) {
    const cat = compiled[`${mod} cat`];
    assert.ok(cat, `expected a compiled entry for "${mod} cat"`);
    assert.match(cat, /\bmang$/i, `"${mod} cat" was changed — if cat's root has been resolved, update this test and the migration doc together: ${cat}`);
  }
});
