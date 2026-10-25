// Report-only verb paradigm probe (Claude A, 2026-10-25). Usage: node scripts/audit-verb-paradigms.mjs eat drink ... > out.json
// Flags to look for downstream: [UNKNOWN], method passthrough, fuzzy(...) mismatches, stray trailing periods.
import { translate } from '../src/translationEngine.js';
const V=process.argv.slice(2);
const forms={
 base:v=>v, to:v=>`to ${v}`,
 ing:v=>({eat:'eating',drink:'drinking',go:'going',come:'coming',sit:'sitting',stand:'standing',sleep:'sleeping',see:'seeing',look:'looking',give:'giving',take:'taking',say:'saying',speak:'speaking',know:'knowing',want:'wanting',love:'loving',work:'working',play:'playing',sing:'singing',dance:'dancing',walk:'walking',run:'running',cook:'cooking',buy:'buying',sell:'selling',read:'reading',write:'writing',learn:'learning',teach:'teaching',laugh:'laughing',cry:'crying',die:'dying',live:'living',bring:'bringing',carry:'carrying',wash:'washing',make:'making',break:'breaking',open:'opening',close:'closing',wait:'waiting',call:'calling',stay:'staying',ask:'asking',answer:'answering',hear:'hearing',listen:'listening',think:'thinking',forget:'forgetting',remember:'remembering',help:'helping',fight:'fighting',hit:'hitting',cut:'cutting',swim:'swimming',sleep2:''}[v]),
 pastpart:v=>({eat:'eaten',drink:'drunk',go:'gone',come:'come',sit:'sat',stand:'stood',sleep:'slept',see:'seen',give:'given',take:'taken',say:'said',speak:'spoken',know:'known',write:'written',break:'broken',buy:'bought',sell:'sold',bring:'brought',teach:'taught',hear:'heard',think:'thought',forget:'forgotten',fight:'fought',hit:'hit',cut:'cut',run:'run',swim:'swum',sing:'sung',read:'read',make:'made',find:'found'}[v]||(v.endsWith('e')?v+'d':v+'ed')),
 pres1:v=>`i ${v}`, prog1:v=>`i am ${forms.ing(v)}`, past1:v=>`i ${pastS(v)}`,
 fut1:v=>`i will ${v}`, neg1:v=>`i do not ${v}`, negpast1:v=>`i did not ${v}`, negfut1:v=>`i will not ${v}`, cant1:v=>`i cannot ${v}`,
 perf1:v=>`i have ${forms.pastpart(v)}`, imp:v=>`${v}!`, negimp:v=>`do not ${v}`, hort:v=>`let us ${v}`,
 q_pres:v=>`do you ${v}?`, q_past:v=>`did you ${v}?`, q_fut:v=>`will you ${v}?`, q_can:v=>`can you ${v}?`, q_prog:v=>`are you ${forms.ing(v)}?`,
 he3:v=>`he ${v}s`, they_prog:v=>`they are ${forms.ing(v)}`,
};
const irr={eat:'ate',drink:'drank',go:'went',come:'came',sit:'sat',stand:'stood',sleep:'slept',see:'saw',give:'gave',take:'took',say:'said',speak:'spoke',know:'knew',write:'wrote',break:'broke',buy:'bought',sell:'sold',bring:'brought',teach:'taught',hear:'heard',think:'thought',forget:'forgot',fight:'fought',hit:'hit',cut:'cut',run:'ran',swim:'swam',sing:'sang',read:'read',make:'made'};
function pastS(v){return irr[v]||(v.endsWith('e')?v+'d':v+'ed')}
const out={};
for(const v of V){out[v]={};for(const [k,f] of Object.entries(forms)){const en=f(v);if(!en){out[v][k]=null;continue}
 try{const r=await translate(en);out[v][k]={en,g:r.garo,m:r.method}}catch(e){out[v][k]={en,g:'ERR '+e.message,m:'error'}}}}
console.log(JSON.stringify(out));
