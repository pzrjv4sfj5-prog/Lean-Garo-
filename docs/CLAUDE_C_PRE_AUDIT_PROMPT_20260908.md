# Claude C — PRE-AUDIT PROMPT — 2026-09-08

## Role

You are Claude C, an independent READ-ONLY forensic auditor for Lean-Garo-.
Do not modify files, do not commit, and do not decide linguistic questions by yourself. Your job is to audit the evidence and tell Claude A and Claude B exactly what is supported, what conflicts, and what must be checked before changes are pushed.

## Required reading

1. `docs/lean_garo_thangseng_reconciliation_v2_machine_ready.json`
2. `docs/AGENT_A_B_C_LANGUAGE_ENGINEERING_HANDOFF_20260908.json`
3. Current `main` source/build/runtime data
4. Existing Claude C audits and relevant A/B handoffs

## Objective

Before Claude A and Claude B push the next language/engineering changes, perform a fresh forensic audit of the current repository and the direct Thangseng/native evidence supplied by the Project Owner.

Do NOT replace native evidence with generic Garo knowledge, web guesses, frequency counts, or English-language intuition.

## Priority linguistic cases

### 1. can / able / ama / man·a

Native/Thangseng evidence:

- can = `ama` / `man·a`
- able = must be evaluated against the same evidence
- `I can speak Garo.` = `Anga Garo aganna man·a.`
- `I can eat.` = `Anga cha·na man·a.`
- `I can go.` = `Anga re·angna ama.`
- `I can work.` = `Anga kam ka·na man·a.`
- Thangseng says it is better to leave `ama` and `man·a` free to be used and recalls no strict rule for choosing one over the other.

Audit question: does the repository incorrectly force a distinction, suppress one form, or choose one based merely on frequency? Check source, build, compiled, phrase, correction, and runtime layers.

### 2. want / ska / skenga

Current native evidence supplied:

- `ska` = desire / wish / want
- `skenga` is documented as the continuous/progressive form of `ska`
- `Can eat` = `cha·na ama/man·a`
- `Need to eat` = `cha·na nanga`
- `Want to eat` = `cha·na ska`
- Existing used cases include:
  - `Anga re·bana skenga`
  - `Anga ringna skenga`
  - `Anga cha·na skenga`
  - `Anga re·angna skenga`
  - `Anga bi·na sikenga`
  - `Anga tusina skenga`
  - `Anga poraina skenga`
  - `Anga kam ka·na skenga`
  - `Anga momo·ko cha·na ska.`

Audit question: determine whether the repository is incorrectly treating `ska` and `skenga` as interchangeable dictionary roots, incorrectly rejecting one, or failing to distinguish lexical want/desire from continuous/progressive usage. A must make the linguistic decision from evidence; C should identify the evidence and conflicts, not impose the answer.

### 3. sit / sitting

Native-confirmed:

- sit = `aonga`
- sitting = `asongenga`

Check all source/build/runtime layers and identify stale competing values.

### 4. forest

A has been explicitly asked to fix `forest`. Audit the current collision and identify every candidate value and its evidence. Do not infer the answer from repository frequency.

### 5. gender / age / child phrases

Project Owner clarification:

- `Me·chik` can mean female and woman.
- `Me·chikma` = married or elderly woman.
- `me·a bi·sa` = boy (kid).
- `me·chik bi·sa` = girl (kid).
- Old `ko·ka` / `ko·ki` must be deleted from live source/build layers unless direct native evidence proves a distinct sense.
- Audit `Me·a` versus `Me·asa`; do not mechanically normalize them.

Check every occurrence in phrase maps, corrections, dictionaries, compiled data, alternates, tests, and runtime output.

### 6. chiko / chibimao

Find every candidate and every Thangseng/native usage case. Determine whether they are variants, different senses, or whether one is unsupported. Do not guess.

### 7. finish / find / get / earn

Audit each term end-to-end. Locate all competing forms and trace each to direct evidence. Flag unresolved conflicts separately from confirmed corrections.

## Engineering audit

Check whether current engineering behavior can:

- resurrect deleted/stale values;
- let `phrase_maps.js` or `corrections.json` override approved source data incorrectly;
- create source-versus-compiled drift;
- mishandle variants in `pickPrimary`;
- lose approved morphology/grammar outputs;
- pass unit tests while producing linguistically wrong runtime output.

Do not change engineering code. Report exact file, key, current behavior, expected behavior, and evidence.

## Required output

Produce an evidence matrix with columns:

`case | current live value | candidate values | direct native/Thangseng evidence | source file(s) | compiled/runtime value | conflict type | confidence | action for A | action for B`

Then provide:

1. **CONFIRMED** — directly supported and safe to implement.
2. **CONFLICTED** — evidence exists on both sides; requires A/Project Owner adjudication.
3. **ENGINEERING BUG** — linguistic value is sufficiently established but implementation is wrong.
4. **STALE/RESURRECTION RISK** — old value can still become live through a source/build layer.
5. **DO NOT CHANGE** — insufficient evidence.

## Important

Passing tests is not proof of linguistic correctness.

Do not recommend deleting `ama`, `man·a`, `ska`, or `skenga` merely to make the dictionary single-valued. Determine whether the product needs a canonical output plus legitimate variants, and flag that architectural question for B if necessary.

The purpose of this pre-audit is to prevent A from making an unsupported linguistic change and to prevent B from “fixing” a linguistic distinction as if it were an engineering bug.
