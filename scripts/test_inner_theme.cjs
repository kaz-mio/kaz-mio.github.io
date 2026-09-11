/* Run from the repository root. Optional --base=REV verifies a visual-only migration. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const files = [...fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html'), ...fs.readdirSync('en').filter(f => f.endsWith('.html')).map(f => 'en/' + f)];
const base = process.argv.find(a => a.startsWith('--base='))?.slice(7);
const matches = (s,re) => [...s.matchAll(re)].map(m=>m[0]);
const scripts = s => matches(s.replace(/\r\n/g,'\n'), /<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g).filter(x=>!x.includes('/assets/site-dates.js'));
const controls = s => matches(s, /<(?:input|select|textarea|button|option)\b[^>]*>/g);
const externalLinks = s => matches(s, /<a\b[^>]*href="(?:https?:)?\/\/[^>]+>/g);
let count=0, controlCount=0;
for(const f of files){
  const s=fs.readFileSync(f,'utf8');if(!/<header\b/.test(s))continue;
  assert.match(s,/<body[^>]*class="[^"]*life-lightly/ ,f+' theme class');
  assert.equal((s.match(/life-lightly\.css\?v=/g)||[]).length,1,f+' one theme stylesheet');
  assert.equal((s.match(/<header class="ll-header">/g)||[]).length,1,f+' one header');
  assert.match(s,/<nav class="ll-nav" aria-label=/,f+' accessible navigation');
  assert.match(s,/<a class="ll-skip" href="#/,f+' skip link');
  assert.match(s,/<link rel="canonical" href="https:\/\/kaz-mio\.com\//,f+' canonical');
  assert.doesNotMatch(s,/<img[^>]*kaz-mio-(?:adventure|encyclopedia)/,f+' old decorative hero');
  for(const m of s.matchAll(/(?:src|href)="(\/?assets\/life-lightly\.css[^" ]*|\/assets\/home-[^" ]+)"/g)) assert.ok(fs.existsSync(m[1].split('?')[0].replace(/^\//,'')),f+' asset '+m[1]);
  for(const ld of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(ld[1]);
  if(base){
    const previous=execFileSync('git',['show',base+':'+f],{encoding:'utf8',maxBuffer:5e6});
    assert.deepEqual(scripts(s),scripts(previous),f+' executable scripts must be unchanged');
    assert.deepEqual(controls(s),controls(previous),f+' form controls must be unchanged');
    assert.deepEqual(externalLinks(s),externalLinks(previous),f+' external/affiliate links must be unchanged');
    const oldIds=matches(previous, /\bid="[^"]+"/g); const newIds=new Set(matches(s,/\bid="[^"]+"/g));
    for(const id of oldIds) assert.ok(newIds.has(id),f+' retained '+id);
  }
  controlCount+=controls(s).length;count++;
}
assert.equal(fs.readFileSync('CNAME','utf8').trim(),'kaz-mio.com');
assert.ok(fs.readFileSync('profile.html','utf8').includes('data-child-birthday="2023-07-13"'),'automatic profile age');
assert.ok(!fs.readFileSync('profile.html','utf8').includes('1歳の子どもを育てながら'),'no stale profile age');
assert.doesNotMatch(fs.readFileSync('index.html','utf8'),/assets\/life-lightly\.css/,'homepage stays independent');
console.log(`PASS: ${count} inner pages; ${controlCount} control tags; theme, navigation, metadata, assets${base?', executable scripts, form controls, IDs and external links preserved':''}.`);
