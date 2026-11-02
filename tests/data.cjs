const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{}};vm.runInNewContext(fs.readFileSync('data.js','utf8'),context);
const cards=context.window.CARDS;assert(Array.isArray(cards));assert(cards.length>=95);
const seen=new Set();for(const c of cards){assert(Number.isSafeInteger(c.id)&&c.id>0,`Invalid ID: ${c.id}`);assert(!seen.has(c.id),`Duplicate ID: ${c.id}`);seen.add(c.id);for(const k of ['subject','category','question','answer'])assert(typeof c[k]==='string'&&c[k].trim(),`Card ${c.id}: missing ${k}`);}
for(let i=1;i<=95;i++){const c=cards.find(c=>c.id===i);assert(c&&c.subject==='公共',`Original public card ${i} changed or missing`);}
console.log(`PASS: ${cards.length} cards have unique IDs and required fields; public IDs preserved.`);
