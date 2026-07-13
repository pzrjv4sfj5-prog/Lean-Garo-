// Persistent benchmark corpus - 237 sentences, fixed set for before/after
// comparison across engine changes. Generated 2026-07-12 by Claude A.
// Run: node tests/benchmarks/stress_237.mjs > results.jsonl
import { translate } from '../../src/translationEngine.js';

const subjects = ['i', 'you', 'he', 'she', 'we', 'they'];
const verbsSimple = ['eat', 'go', 'drink', 'sleep', 'speak', 'work', 'study', 'run', 'watch', 'buy'];
const adjectives = ['happy', 'sad', 'tired', 'good', 'bad', 'beautiful', 'strong', 'sick', 'tall', 'clever'];
const locations = ['bed', 'market', 'school', 'house', 'table', 'room'];

const sentences = [];
for (const s of subjects) for (const v of verbsSimple.slice(0,5)) sentences.push(`${s} eat rice`.replace('eat',v));
for (const v of verbsSimple) { sentences.push(`i ${v}`,`i ${v==='go'?'went':v+'ed'}`,`i will ${v}`,`i do not ${v}`,`i did not ${v}`,`i am ${v}ing`,`i will not ${v}`); }
for (const s of subjects) for (const a of adjectives.slice(0,6)) sentences.push(`${s} ${s==='i'?'am':(s==='he'||s==='she')?'is':'are'} ${a}`);
for (const l of locations) sentences.push(`the book is on the ${l}`);
for (const l of locations) sentences.push(`i am waiting at the ${l}`);
for (const l of locations) sentences.push(`i am lying in the ${l}`);
sentences.push('i have a book', 'she has three children', 'do you have children','he has two dogs', 'we have a house', 'they have no water');
for (const v of verbsSimple.slice(0,6)) { sentences.push(`i want to ${v}`,`i need to ${v}`,`i can ${v}`,`can i ${v}`); }
for (const v of verbsSimple.slice(0,6)) { sentences.push(`let's ${v}`,`let us ${v}`,`${v}!`,`do not ${v}`); }
sentences.push('did you go to the market', 'what did you buy', 'where did you go','who is he', 'when will you eat', 'how are you', 'why are you sad', 'are you okay');
sentences.push('one book', 'two books', 'three dogs', 'five people', 'one stalk of bamboo','a pen', 'ten books', 'eleven books', 'two rupees');
sentences.push('if you eat you will be strong', 'if it rains i will not go','i work so i can eat', 'i went to the market to buy rice');
sentences.push('i watch tv', 'check my status', 'call me on the phone', 'use the internet');
sentences.push('i am standing', 'i am sitting', 'i am lying down', 'he is standing near the door');

for (const s of sentences) {
  try { const r = await translate(s); console.log(JSON.stringify({ input: s, ...r })); }
  catch (e) { console.log(JSON.stringify({ input: s, error: e.message })); }
}
