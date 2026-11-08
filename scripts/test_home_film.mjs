import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createVideoScrubber,frameTime,movieChapters,movieChapter} from '../assets/video-timeline.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
test('production metadata, analytics and current BOOTH product preserved',()=>{
  assert.doesNotMatch(html,/公開前プレビュー|noindex|127\.0\.0\.1|8822041|seal_de_name_article\.html/);
  assert.match(html,/content="index, follow, max-image-preview:large"/);
  assert.match(html,/src="assets\/analytics\.js"/);
  assert.match(html,/https:\/\/kaz-mio-life\.booth\.pm\/items\/8626925/);
  assert.match(html,/rel="canonical" href="https:\/\/kaz-mio.com\/"/);
});
test('one hero, unique IDs, local media exists',()=>{
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.doesNotMatch(html,/class="home-hero"|src="assets\/home-life-hero.webp"/);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  for(const [,ref] of html.matchAll(/(?:href|src|data-src)="([^"]+)"/g)){
    if(/^(https?:|mailto:|data:)/.test(ref))continue;
    const [file,hash]=ref.split('?')[0].split('#');
    if(file)assert.ok(fs.existsSync(path.join(root,file==='/'?'index.html':file.replace(/^\//,''))),ref);else if(hash)assert.ok(ids.includes(hash),ref);
  }
  assert.equal(fs.statSync(path.join(root,'assets/film/forest-to-home-v1.mp4')).size,21485300);
});
test('chapters and coalesced seek maintain the latest scroll position',()=>{
  movieChapters.forEach((c,i)=>assert.equal(movieChapter(c.point),i));assert.equal(frameTime(1,24),24-1/24);
  class Fake extends EventTarget{duration=24;readyState=2;seeking=false;t=0;writes=0;get currentTime(){return this.t;}set currentTime(t){this.t=t;this.seeking=true;this.writes++;}complete(){this.seeking=false;this.dispatchEvent(new Event('seeked'));}}
  const video=new Fake(),driver=createVideoScrubber(video);driver.seek(.2);driver.seek(.8);driver.seek(.1);assert.equal(video.writes,1);video.complete();assert.equal(video.t,frameTime(.1,24));video.complete();assert.equal(video.writes,2);driver.enable(false);driver.seek(.9);assert.equal(video.writes,2);driver.dispose();
});
