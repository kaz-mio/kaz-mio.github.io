import {createVideoScrubber,limit,movieChapters,movieChapter} from './video-timeline.mjs';

const film=document.querySelector('#home-film'),video=document.querySelector('#home-film-video');
const poster=document.querySelector('#film-poster'),header=document.querySelector('.site-header');
const startCopy=film.querySelector('.film-copy-start'),endCopy=film.querySelector('.film-copy-end');
const playButton=document.querySelector('#film-play'),motionButton=document.querySelector('#film-motion');
const status=document.querySelector('#film-status'),progressLine=document.querySelector('#film-progress');
const chapterLabel=document.querySelector('#film-chapter-label'),time=document.querySelector('#film-time');
const chapters=[...film.querySelectorAll('[data-chapter]')],query=matchMedia('(prefers-reduced-motion: reduce)');
let progress=0,controller=null,follow=null,cursor={p:0},nativePlaying=false,raf=0,enabled=true,ready=false,failed=false;
const driver=createVideoScrubber(video,seconds=>film.dataset.videoTime=seconds.toFixed(3));
const smooth=x=>{x=limit(x);return x*x*(3-2*x);};

function draw(p){
  progress=limit(p);film.dataset.progress=progress.toFixed(3);
  const chapter=movieChapter(progress),atHome=progress>=.94;
  film.style.setProperty('--home-start',String(1-smooth((progress-.02)/.055)));
  film.style.setProperty('--home-end',String(smooth((progress-.92)/.045)));
  film.style.setProperty('--start-events',progress<.07?'auto':'none');film.style.setProperty('--end-events',atHome?'auto':'none');
  film.style.setProperty('--film-position',`${55+15*smooth((progress-.8)/.15)}%`);
  startCopy.setAttribute('aria-hidden',String(progress>=.07));startCopy.querySelector('a').tabIndex=progress<.07?0:-1;
  endCopy.setAttribute('aria-hidden',String(!atHome));endCopy.querySelector('a').tabIndex=atHome?0:-1;
  progressLine.style.transform=`scaleX(${progress})`;
  chapterLabel.textContent=movieChapters[chapter].label;time.textContent=`${Math.round(progress*24)} / 24 秒`;
  chapters.forEach((button,i)=>{if(i===chapter)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
  if(failed||query.matches)poster.src=progress>.5?'assets/film/home-poster.webp':'assets/film/forest-poster.webp';
}
function sync(p){follow?.tween.pause();cursor.p=p;}
function stop(){nativePlaying=false;cancelAnimationFrame(raf);video.pause();driver.enable(true);sync(progress);playButton.textContent='自動で見る';playButton.setAttribute('aria-pressed','false');}
function seek(p){
  stop();p=limit(p);
  if(controller){scrollTo({top:controller.start+(controller.end-controller.start)*p,behavior:'instant'});window.ScrollTrigger.update();}
  sync(p);draw(p);if(ready)driver.seek(p);
}
function setHeaderHeight(){document.body.style.setProperty('--site-header-h',`${header.getBoundingClientRect().height}px`);}
function buildMotion(){
  if(!enabled||query.matches||failed||controller)return;
  const {gsap,ScrollTrigger:ST}=window;
  if(!gsap||!ST){enabled=false;motionButton.hidden=true;status.textContent='静止表示でご覧いただけます。';return;}
  gsap.registerPlugin(ST);setHeaderHeight();
  follow=gsap.quickTo(cursor,'p',{duration:.28,ease:'power2.out',onUpdate(){draw(cursor.p);if(ready)driver.seek(cursor.p);}});
  controller=ST.create({trigger:film,start:()=>`top top+=${header.getBoundingClientRect().height}`,end:()=>`+=${Math.round(innerHeight*(innerWidth<700?4:5.2))}`,pin:true,anticipatePin:1,invalidateOnRefresh:true,
    onUpdate:self=>{if(!nativePlaying)follow(self.progress);},onRefresh:self=>{if(!nativePlaying){sync(self.progress);draw(self.progress);if(ready)driver.seek(self.progress);}}});
  ST.refresh();
}
function removeMotion(){stop();controller?.kill(true);controller=null;follow?.tween.kill();follow=null;document.body.classList.add('film-static');}
function jumpToContent(target){
  stop();if(controller)seek(1);
  const element=document.getElementById(target);if(!element)return;
  if(element.tagName==='DETAILS')element.open=true;
  window.ScrollTrigger?.refresh();element.scrollIntoView({block:'start',behavior:'instant'});
  if(target==='everyday')element.focus({preventScroll:true});
}
function applyPreference(){
  if(query.matches){removeMotion();document.body.classList.add('film-reduced');video.hidden=true;draw(1);motionButton.disabled=true;motionButton.textContent='動きを減らす設定';status.textContent='静止表示で、暮らしの道具へ。';}
  else {document.body.classList.remove('film-reduced');video.hidden=failed;motionButton.disabled=false;motionButton.textContent=enabled?'動きを止める':'動きを再開';if(!video.src)loadVideo();if(enabled){document.body.classList.remove('film-static');buildMotion();}}
}
function loadVideo(){video.muted=true;video.src=video.dataset.src;video.preload='auto';video.load();}
video.addEventListener('loadeddata',()=>{ready=true;film.classList.add('film-ready');playButton.disabled=false;driver.seek(progress);status.textContent='スクロールで進む・戻る。';});
video.addEventListener('error',()=>{failed=true;removeMotion();video.hidden=true;document.body.classList.add('film-error');draw(1);motionButton.hidden=true;status.textContent='動画を読み込めないため静止表示にしています。下の道具は使えます。';});
video.addEventListener('ended',()=>seek(1));
playButton.addEventListener('click',async()=>{
  if(nativePlaying){stop();return;}if(!ready||!controller)return;if(progress>.99)seek(0);
  sync(progress);driver.enable(false);nativePlaying=true;playButton.setAttribute('aria-pressed','true');playButton.textContent='自動再生を止める';
  try{await video.play();if(!nativePlaying){video.pause();return;}
    const tick=()=>{if(!nativePlaying)return;const p=limit(video.currentTime/video.duration);draw(p);if(controller)scrollTo({top:controller.start+(controller.end-controller.start)*p,behavior:'instant'});if(video.ended){seek(1);return;}raf=requestAnimationFrame(tick);};tick();
  }catch{stop();status.textContent='自動再生できませんでした。スクロールでご覧ください。';}
});
motionButton.addEventListener('click',()=>{
  const current=progress;enabled=!enabled;
  if(!enabled){removeMotion();film.scrollIntoView({block:'start',behavior:'instant'});motionButton.textContent='動きを再開';playButton.hidden=true;status.textContent='静止表示中。場面ボタンで移動できます。';}
  else{document.body.classList.remove('film-static');buildMotion();seek(current);motionButton.textContent='動きを止める';playButton.hidden=false;status.textContent='スクロールで進む・戻る。';}
});
chapters.forEach(button=>button.addEventListener('click',()=>{history.replaceState(null,'',location.pathname+location.search);seek(movieChapters[Number(button.dataset.chapter)].point);}));
document.addEventListener('click',event=>{
  const anchor=event.target.closest('a[href^="#"]');if(!anchor)return;
  const id=anchor.getAttribute('href').slice(1);if(!['everyday','tools','articles','all-articles','booth'].includes(id))return;
  event.preventDefault();jumpToContent(id);if(location.hash!==`#${id}`)history.pushState(null,'',`#${id}`);
});
const interrupt=()=>{if(nativePlaying)stop();};
window.addEventListener('wheel',interrupt,{passive:true});window.addEventListener('touchstart',interrupt,{passive:true});
window.addEventListener('keydown',e=>{if(['PageDown','PageUp','Home','End','ArrowDown','ArrowUp',' '].includes(e.key))interrupt();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
query.addEventListener('change',applyPreference);
new ResizeObserver(setHeaderHeight).observe(header);setHeaderHeight();applyPreference();
const restoreHash=()=>{if(location.hash)requestAnimationFrame(()=>jumpToContent(decodeURIComponent(location.hash.slice(1))));};
if(document.readyState==='complete')restoreHash();else window.addEventListener('load',restoreHash,{once:true});
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(id)jumpToContent(id);});
