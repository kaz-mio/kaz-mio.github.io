'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
const retired = /シールDEネーム|4B3XBA\+1ELWQQ\+5V9K|260523622085|s00000027380|data-affiliate-offer="seal-de-name"/i;
let checked = 0;
function scan(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (['.git', '.github', 'scripts', 'node_modules'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (/\.(html|xml|js|json|css|svg)$/.test(entry.name)) {
      assert.doesNotMatch(fs.readFileSync(file, 'utf8'), retired, path.relative(root, file) + ': retired advertising');
      checked++;
    }
  }
}
scan(root);
const stub = read('seal_de_name_article.html');
assert.match(stub, /<meta name="robots" content="noindex,follow">/);
assert.match(stub, /<meta http-equiv="refresh" content="0;url=school_prep_name_guide\.html">/);
assert.match(stub, /location\.replace\("school_prep_name_guide\.html"\)/);
assert.match(stub, /<link rel="canonical" href="https:\/\/kaz-mio\.com\/school_prep_name_guide\.html">/);
assert.match(stub, /<a href="school_prep_name_guide\.html">/);
assert.doesNotMatch(stub, /px\.a8\.net|www\d*\.a8\.net|application\/ld\+json/);
for (const file of ['index.html', 'school_prep_checklist.html', 'school_prep_name_guide.html', 'sitemap.xml']) {
  assert.doesNotMatch(read(file), /seal_de_name_article\.html/, file + ': retired article route');
}
const homeLinks = [...read('index.html').matchAll(/href="school_prep_name_guide\.html"/g)];
assert.equal(homeLinks.length, 1, 'one guide entry in homepage catalog');
assert.match(read('school_prep_checklist.html'), /class="tool-link" href="school_prep_name_guide\.html"/);
assert.match(read('school_prep_checklist.html'), /href="school_prep_name_guide\.html">名前つけガイド/);
const base = process.argv.find(arg => arg.startsWith('--base='))?.slice(7);
if (base) {
  for (const file of ['index.html', 'school_prep_checklist.html', 'school_prep_name_guide.html']) {
    const previous = execFileSync('git', ['show', `${base}:${file}`], {cwd: root, encoding: 'utf8', maxBuffer: 10e6}).replace(/\r\n/g, '\n');
    const current = read(file);
    const scripts = s => [...s.matchAll(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g)].map(m => m[0]);
    const controls = s => [...s.matchAll(/<(?:input|select|textarea|button|option)\b[^>]*>/g)].map(m => m[0]);
    const external = s => [...s.matchAll(/<a\b[^>]*href="(?:https?:)?\/\/[^>]+>/g)].map(m => m[0]).filter(tag => !retired.test(tag));
    assert.deepEqual(scripts(current), scripts(previous), file + ': executable scripts preserved');
    assert.deepEqual(controls(current), controls(previous), file + ': input controls preserved');
    assert.deepEqual(external(current), external(previous), file + ': unrelated external links preserved');
    const images = s => [...s.matchAll(/<img\b[^>]*>/g)].map(m => m[0]).filter(tag => !retired.test(tag));
    assert.deepEqual(images(current), images(previous), file + ': unrelated images preserved');
  }
}
assert.equal(read('CNAME').trim(), 'kaz-mio.com');
console.log(`PASS: ${checked} site source files contain no retired advertising; old URL redirects safely; internal links and sitemap cleaned${base ? '; scripts, controls and unrelated links/images preserved' : ''}.`);
