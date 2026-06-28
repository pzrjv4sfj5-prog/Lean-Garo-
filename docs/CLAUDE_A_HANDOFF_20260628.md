# HANDOFF TO CLAUDE A — Engine Side
_Session transfer — paste this at the start of a new chat to resume instantly_
_Prepared by Claude B — 2026-06-28_

---

## IDENTITY
You are **Claude A — Engine Side** on the Lean-Garo English↔Garo translation project.
You work alongside **Claude B (Platform/UI)** who has direct git push access.
Relay all verified fixes to Claude B for pushing — see docs/NOTE_FOR_CLAUDE_A_RELAY_PUSHES.md.

---

## REPO
- **URL:** https://github.com/pzrjv4sfj5-prog/Lean-Garo-
- **Live site:** https://lean-garo.onrender.com
- **HEAD:** a63938a
- **corrections.json:** ~570 entries

## GIT SETUP (run every new session)

    git config --global commit.gpgsign false
    git config --global user.email "pzrjv4sfj5@privaterelay.appleid.com"
    git config --global user.name "pzrjv4sfj5-prog"
    PAT=<paste token here>
    git remote set-url origin https://pzrjv4sfj5-prog:${PAT}@github.com/pzrjv4sfj5-prog/Lean-Garo-.git
    git pull origin main

---

## FIRST THING TO DO

Read the grammar reference — single source of truth for everything Thangseng confirmed:

    cat docs/GARO_GRAMMAR_REFERENCE.md

This supersedes all previous scattered grammar notes.

---

## FILE OWNERSHIP (strict)

**Claude A owns:** src/translationEngine.js, src/garo_classifier.js, src/number_engine.js, src/gemini.js, server.js, src/data/phrase_maps.js, src/data/corrections.json, master_dictionary.json, src/compiled_dict.json, garo_dictionary.json

**Claude B owns:** src/pages/, src/components/, src/App.jsx, vite.config.js, public/_redirects, docs/

---

## WHAT CHANGED THIS SESSION (Claude B pushed all)

Engine fixes:
- e9b01c6: saw->nikaha, ran->kataha — raka removed from IRREGULAR_VERBS
- b854236: getAllVocabulary() now applies corrections.json overrides
- a21bd74: translationEngine_FIXED_v3 + garo_classifier_FIXED_v2 applied
- f745b74: Fuzzy match skipped when input contains raka (Garo input guard)
- f51c2ea: Classifier 21+ uses raka join: mang·Kolgrik·sa not mang·Kolgrik sa

Grammar/data fixes:
- dc2fc66: FLAG 2 resolved — Na·ara = informal only, Na·a = default
- e0f09a3: All Na·ara replaced with Na·a in corrections.json (8 entries)
- bbdfebd: Ua->uko in object position
- ee61bbb: Anga·ko->angko (native-confirmed object form of me)
- ebad93f: he/she is good->Ua Nama; he/she is bad->Ua namja
- 22f9013: i/you/we am/are good/bad corrections added
- 027fde2: thief=cha·u, chi-suffix example sentences added

New vocab added: elephant=buring·o, forest=mongma, goat=dobok, ate=Cha·aha,
someone=Saoba, sounds good=knatoa, stand=Chakata, long=ro·a

---

## PRIORITY ENGINE WORK (in order)

1. STOP_WORDS — remove question words (HIGHEST IMPACT)
   when/why/who/what/where/how are in STOP_WORDS — engine strips them.
   Native forms exist in corrections.json but engine never reaches them.
   Fix: remove these from STOP_WORDS entirely.

2. STOP_WORDS — remove connectives
   and/but/or/if/so stripped — biggest sentence quality gap.
   Native forms: and=Aro, but=Indiba, or=ba, if=Ode, so=Uni gimin

3. Future tense -gen
   cha·gen = will eat, katgen = will run. Not yet in engine tense table.

4. Subjunctive chi pattern
   Ua cha·china = Let him/her eat.
   chi goes between verb root and suffix. New assembly rule needed.

5. ja vs gija placement enforcement
   namja = predicative — ONLY after noun. namgija = either position.
   namja mande = WRONG. Engine must block this.

6. Locative/agentive chi on nouns
   angchi = to me, dokanchi = to the shop (locative)
   garichi = with a car, attechi = with a dao (agentive)

7. Pronoun case switching in assembly
   Use uko (not ua) when 3rd person is object.
   Full pronoun table in docs/GARO_GRAMMAR_REFERENCE.md section 2.

8. Location-noun-dropped bug
   docs/BUG_location_noun_dropped.md

9. getCategories() returns 1 category
   Stray numeric keys in compiled_dict.json polluting aggregation.

10. server.js dead code — delete or mark clearly

---

## GRAMMAR SUMMARY (read GARO_GRAMMAR_REFERENCE.md for full detail)

- SOV word order. Questions add -ma at end, word order unchanged.
- Raka is in ROOT only — suffixes NEVER carry raka.
- Hai+verb·na = future lets; Hai+verb·naha = imminent lets (NOT interchangeable).
- Pronoun roots: ang· (1st sg), An·ching (1st pl), nang· (2nd), u (3rd formal), bi (3rd informal)
- chi on nouns: locative (angchi=to me) and agentive (garichi=with car)
- chi in verbs: subjunctive between root and suffix (cha·china=let eat)
- ja = post-noun negation only; gija = either position

---

## RELAY PROTOCOL

When you have verified fixes ready, send Claude B:

    RELAY TO CLAUDE B:
    File: src/translationEngine.js
    Change: [exact find/replace or diff]
    Build verified: yes

Claude B will apply, build, verify diff, push, and report commit hash.

---

## QUICK RESUME TEST

    node --input-type=module << TESTEOF
    import { translate } from './src/translationEngine.js';
    const tests = ['eat','good','2 dogs','did you eat food','i saw him',
      'did you see me','thief','21 dogs','long'];
    for (const t of tests) {
      const r = await translate(t);
      console.log(t + ' -> ' + r.garo + ' [' + r.method + ']');
    }
    TESTEOF

Expected outputs:
- eat -> Cha·a
- good -> Nama
- 2 dogs -> achak mang·gni
- did you eat food -> Na·a Mi Cha·aha ma?
- i saw him -> Anga uko Nikaha
- did you see me -> Na·a angko Nikaha ma?
- thief -> cha·u
- 21 dogs -> achak mang·Kolgrik·sa
- long -> ro·a

_Prepared by Claude B — 2026-06-28 — HEAD: a63938a_
