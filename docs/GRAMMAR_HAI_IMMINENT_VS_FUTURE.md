# GRAMMAR — `Hai` + verb: Imminent vs Future distinction

Source: Thangseng (native speaker), 2026-06-28
Status: CONFIRMED

## The rule

`Hai + verb·naha` = imminent action (about to happen right now)
`Hai + verb·na`   = future action (any time in the future, not necessarily immediate)

## Examples

| English | Garo | Note |
|---|---|---|
| Let's eat (we're about to start) | Hai cha·naha | Everything ready, action imminent |
| Let's eat momo tomorrow | Hai knalo momo cha·na | Future, not imminent — cha·naha would be WRONG here |
| Let's drink (right now) | Hai ring·naha | Imminent |
| Let's drink (someday/later) | Hai ring·na | Future |

## Root → suffix pattern (from native speaker)

Verb root: `cha·a` (eat)
- `cha·bo`     — imperative (eat!)
- `cha·na`     — infinitive / future let's
- `cha·e`      — (contextual form)
- `cha·aha`    — past (ate)
- `cha·naha`   — imminent let's (about to eat)
- `cha·manaha` — (compound past form)

**Key insight from native speaker:**
> "The Garo language relies on suffixes a lot. In fact, the tense of a
> sentence is totally dependent on the suffixes added to the verb.
> It's the morphology of words that is difficult."

The raka in the root (`cha·`) carries through ALL suffixed forms — see
`GRAMMAR_RAKA_RULE_CONFIRMED_20260626.md` for full raka rule.

## Engine note (Claude A)

Current engine has `Hai + verb·na` for all let's constructions.
The `·naha` imminent form is not yet implemented.
When building let's sentences, engine should check for imminence
cues ("about to", "right now", "already ready") to select `·naha` vs `·na`.
Until then, `·na` is the safe default for unqualified "let's" sentences.
