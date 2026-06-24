# Claude A — number_engine.js Line 36 Fix
_Claude B — 2026-06-24_

## The bug

`src/number_engine.js`, line 36:
```js
// CURRENT — WRONG:
if (n >= 11 && n <= 19) {
  return "chi" + BASE[n - 10];
}
// Produces: "chisa" (11), "chigni" (12), "chigittam" (13)...
```

```js
// FIX:
if (n >= 11 && n <= 19) {
  return "chiking·ma·" + BASE[n - 10];
}
// Produces: "chiking·ma·sa" (11), "chiking·ma·gni" (12)...
```

## Why it's not yet causing user-visible bugs

`garo_classifier.js` has its OWN correct implementation of this same logic
(line 78: `` `chiking·ma·${NUMBERS[num-10]}` ``), and classifier output
(e.g. "11 dogs") goes through that path, not `number_engine.js`.

The bug surfaces only if `toGaroNumber()` from `number_engine.js` is called
directly — which `translationEngine.js` does import it (line 25). Worth
fixing before that path gets exercised more.

## Verification

```bash
node -e "
const { toGaroNumber } = require('./src/number_engine.js');
[11,12,13,15,19].forEach(n => console.log(n, '->', toGaroNumber(n)));
"
```

Before fix: `11 -> chisa`, `12 -> chigni`
After fix: `11 -> chiking·ma·sa`, `12 -> chiking·ma·gni`

Also confirm classifier output unchanged (it has its own correct impl):
```bash
node --input-type=module -e "
import { translate } from './src/translationEngine.js';
['11 dogs','12 books','15 people'].forEach(async t => {
  const r = await translate(t); console.log(t, '->', r.garo);
});
"
```

## One-line fix, low risk
Only touches line 36 of `number_engine.js`. No data files, no
`corrections.json`, no dictionary involved.
