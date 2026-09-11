'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {calculateStock}=require('../assets/home.js');
assert.equal(calculateStock('60','6').days,10);
assert.equal(calculateStock('61','6').text,'目安は約10.1日分です。');
assert.equal(calculateStock('0','6').text,'手元のおむつは0枚です。');
assert.equal(calculateStock('3','6').text,'目安は1日未満です。');
for(const [stock,daily] of [['','6'],['60',''],['-1','6'],['0.5','6'],['60','0'],['60','-1'],['60','2.5'],['NaN','6'],['10000','6'],['60','101'],['Infinity','1']]) assert.ok(calculateStock(stock,daily).error,`${stock}/${daily} should be invalid`);
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.equal((html.match(/<h1\b/g)||[]).length,1);
assert.ok(!html.includes('hero-slideshow'));
assert.ok(!html.includes('kaz-mio-encyclopedia'));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate IDs');
let checked=0;
for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 const url=match[1];if(/^(https?:|mailto:|data:)/.test(url))continue;
 const [file,hash]=url.split('?')[0].split('#');
 if(file){const full=path.join(root,file==='/'?'index.html':file.replace(/^\//,''));assert.ok(fs.existsSync(full),`Missing ${url}`);}
 else if(hash)assert.ok(ids.includes(hash),`Missing anchor ${url}`);
 checked++;
}
assert.equal(fs.readFileSync(path.join(root,'CNAME'),'utf8').trim(),'kaz-mio.com');
console.log(`Homepage checks passed: 15 calculator cases, one h1, unique IDs, ${checked} local references.`);
