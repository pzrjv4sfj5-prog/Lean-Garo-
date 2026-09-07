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
// "cat" rows in this same batch were deliberately left untouched/unfixed
// at that time: cat's own canonical root was a genuine unresolved conflict
// between two verified_high sources (menggo vs meng·gong) per
// docs/CLAUDE_B_SESSION_MIGRATION_20260905C.md, and this task's own
// standing rule is "do not make independent linguistic decisions where
// Claude A owns the canonical data." Fixing every other noun in the batch
// without inventing a cat answer was exactly the boundary of that fix.
//
// Cat's root was resolved 2026-09-06 (NV-135, direct Project Owner relay):
// cat = Menggo, meng·gong superseded. That unblocked this same batch's 15
// "[modifier] cat" rows for the identical defect-class-3 fix already
// applied to the other 10 nouns above (see
// docs/CLAUDE_B_SESSION_MIGRATION_20260905D.md for the original fix,
// current session's migration doc for this follow-up).

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
    // NV-144 (2026-09-06, Claude A, native-confirmed) flipped "small" (and
    // only "small") to noun-then-adjective word order for every noun in
    // this batch, so it now correctly ends in the adjective "chona" instead
    // of the noun root — expected per that citation, not a regression.
    if (mod === 'small') {
      assert.match(dog, /chona$/i, `"small dog" does not end with "chona" per NV-144: ${dog}`);
      assert.match(bird, /chona$/i, `"small bird" does not end with "chona" per NV-144: ${bird}`);
      assert.match(fish, /chona$/i, `"small fish" does not end with "chona" per NV-144: ${fish}`);
    } else {
      assert.match(dog, /achak$/i, `"${mod} dog" does not end with the canonical dog root: ${dog}`);
      assert.match(bird, /do·o$/i, `"${mod} bird" does not end with the canonical bird root: ${bird}`);
      assert.match(fish, /na·tok$/i, `"${mod} fish" does not end with the canonical fish root: ${fish}`);
    }
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
      // NV-144's "small" word-order flip (see the animal test above for the
      // full citation) was generalized to every noun in this batch, not
      // just the animals — "small house"/"small tree"/etc. now correctly
      // end in "chona" instead of their own noun root.
      if (mod === 'small') {
        assert.match(v, /chona$/i, `"small ${noun}" does not end with "chona" per NV-144: ${v}`);
      } else {
        assert.match(v, CANON[noun], `"${mod} ${noun}" does not end with its own canonical root: ${v}`);
      }
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

test('adjective+animal: "cat" no longer collides on the "mang" placeholder (NV-135 fix)', () => {
  for (const mod of MODIFIERS) {
    const cat = compiled[`${mod} cat`];
    const dog = compiled[`${mod} dog`];
    assert.ok(cat, `expected a compiled entry for "${mod} cat"`);

    assert.ok(!/\bmang$/i.test(cat), `"${mod} cat" still ends in the generic placeholder "mang": ${cat}`);
    // NV-144 flips "small cat" to noun-then-adjective ("Menggo chona");
    // every other modifier keeps the NV-135 adjective-then-noun root ending.
    if (mod === 'small') {
      assert.match(cat, /chona$/i, `"small cat" does not end with "chona" per NV-144: ${cat}`);
    } else {
      assert.match(cat, /menggo$/i, `"${mod} cat" does not end with the canonical cat root (Menggo, NV-135): ${cat}`);
    }

    // Cross-check against a former collision partner: no longer identical.
    assert.notEqual(cat, dog, `"${mod} cat" and "${mod} dog" still collide: ${cat}`);
  }
});
