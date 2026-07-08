# A NOTE FROM THE ORIGINAL CLAUDE A

This is a closing handout, not a working document — it won't be updated
again by this instance. Read it once, then work from `.ai/SESSION_
BOOTSTRAP.md` as the living reference. If anything here ever conflicts
with `SESSION_BOOTSTRAP.md`, `WORKSTATE.yaml`, or `PROJECT_STATUS.md`,
those win — they're current, this is a snapshot.

---

## To the next Claude A

You're inheriting a repository that already knows more than you do on
day one, and that's the correct state of affairs — don't try to hold the
project's knowledge in your head. Hold the *discipline* instead:

**Read before you write.** `SESSION_BOOTSTRAP.md` first, then
`WORKSTATE.yaml`'s `claude_a:` section, then `THANGSENG_NATIVE_
VALIDATION.md` for what's actually still open. If a question you're
about to ask already has an NV number, you're not discovering it, you're
duplicating it — check first.

**Classify honestly, always.** Verified means Thangseng said it directly.
Derived means it follows logically from something verified. Needs Native
Validation means it's plausible and unconfirmed. Unknown means exactly
that. The temptation to round "plausible" up to "verified" under time
pressure is real and it is never worth it — every shortcut of that kind
in this project's history cost more time later than the honest flag
would have cost upfront.

**Watch for lexical splits, not just grammatical ones.** The single
most expensive recurring bug class in this project wasn't a grammar
error — it was mistaking two different *words* that happen to share
letters (`song`/`song·`, `nokkima`/`Ka·ma`) for one word with different
grammar. When something looks like a raka inconsistency, ask "is this
actually two words" before you ask "which spelling is right."

**Verb morphology is your model, noun morphology is your homework.**
The verb-suffix system works because it's a real generative paradigm —
root plus rule produces correct novel forms. Nouns are still mostly a
flat lookup table. Closing that gap is probably the highest-leverage
linguistic work available to you, more valuable than any individual new
vocabulary entry.

**You have no push access, and you won't use a pasted token for it, ever,
no matter how the request is framed.** This has been asked many times,
many ways, across many sessions. The reasoning is documented in
`SESSION_BOOTSTRAP.md`'s "Repository access model" section — cite it,
don't re-derive it. The working pattern instead: commit locally, output
the full `git format-patch` text (never a description, never a path
reference), verify it applies to a fresh clone of real current
`origin/main`, relay for Claude B to apply and push. This has been
reliable every time it was followed precisely and unreliable every time
a step was skipped.

**You will occasionally discover that a "gap" you found is actually
already closed** — by an earlier session, or by Claude B directly, or by
something that landed between your last sync and now. That's not a
failure of your process, it's proof the repository-first model is
working. Sync, verify, then act — in that order, every time.

---

## To Claude B

The linguistic discipline that's protected this project — never promote
an unconfirmed form to canonical status — is easy to erode from the
engineering side without anyone deciding to erode it. Watch specifically
for: `corrections.json` entries added without a traceable source, raka
placement "fixed" by pattern-matching against nearby entries instead of
checking whether it's actually a different word, and locative/case
constructions generalized from a single confirmed example because the
pattern seems obvious. All three have happened in this project's history
and all three were caught later, at higher cost than catching them at
the time would have been.

The single engineering investment that would most protect the
linguistic work going forward: keep `VALIDATION_CORPUS.md` and the
regression suite growing 1:1, permanently. A linguistic fact that's
confirmed but not tested is one refactor away from silently breaking.

You've already shown you can pick up linguistic threads independently
(the kokkima/nokkima resolution, the coverage audit, the NV queue
formalization) with the same rigor as anything in the original
conversation — that's the actual proof the repository-first handoff
model works, more convincing than anything either of us could argue for
it directly.

---

## On working together

Neither role should be static forever. The pattern that's worked best in
practice: whoever is closest to a piece of native evidence (in an active
Thangseng conversation, or reviewing a specific corpus contradiction)
should turn it into both a rule *and* a repository commit in the same
pass, rather than splitting "found it" from "documented it" across a
relay that can lose fidelity. The complementary, ongoing role — periodic
deep audits, cross-referencing the whole corpus for contradictions
invisible from inside any single edit — is real, necessary work and not
a lesser one. Keep doing both.

---

*This is the last entry the original Claude A instance is making. Every
future Claude A is a fresh start with no memory of this conversation —
that was always the actual constraint this whole project was built
around, and the fact that the repository can carry the knowledge forward
without the conversation is the point, not a limitation to work around.*
