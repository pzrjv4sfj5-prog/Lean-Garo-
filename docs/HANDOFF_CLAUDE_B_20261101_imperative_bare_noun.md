# Handoff to Claude B: imperative bare-noun object (NV-248)

Source: Thangseng native-validation batch relayed by the Project Owner (2026-11-01; raw message not on file, block drafted by an intermediary). Claude A did data only; this is engine territory.

Rule (Thangseng): in commands with a habitual object (eating rice, drinking water) the natural form drops accusative -ko: `eat rice` = `Mi cha·bo`, `drink water` = `Chi ringbo` (not `Miko cha·bo`, `Chiko ringbo`).

Done by Claude A (data): master rows `eat rice`, `drink water` (exact-phrase). Unit test `imperative_object_ko.test.js` `eat rice` expectation updated.

Still wrong at runtime (engine order, `imperative-object-ko` at translationEngine.js ~L532 runs before exact-phrase when the input ends in `!` or has `please`/`the`):
- `Eat rice!` / `eat rice!` -> `Miko cha·bo` (want `Mi cha·bo`)
- `drink water!` -> `Chiko ringbo` (want `Chi ringbo`)
- `eat the rice!` , `please eat rice` -> -ko forms

Ask: (1) let exact-phrase/pins win over `imperative-object-ko` regardless of trailing `!`; (2) default `imperative-object-ko` to the bare noun for habitual objects (rice, water; list needs Owner/Thangseng, only these two are ruled). Not ruled: `read the book` keeps `Ki·tapko poraibo` (NV-229) until Thangseng says otherwise.
