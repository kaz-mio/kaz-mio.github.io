export const movieChapters=[
  {point:0,short:'森',label:'森の入口'},
  {point:.165,short:'木の中',label:'木のアーチをくぐる'},
  {point:.332,short:'遊び場',label:'木の上の遊び場'},
  {point:.56,short:'帰り道',label:'緑の道を、その先へ'},
  {point:.76,short:'庭',label:'温かな家の庭へ'},
  {point:.96,short:'ただいま',label:'いつもの毎日へ'},
];
export const limit=(value,min=0,max=1)=>Math.min(max,Math.max(min,Number.isFinite(value)?value:min));
export function frameTime(progress,duration,fps=24){return limit(progress)*Math.max(0,duration-1/fps);}
export function movieChapter(progress){let result=0;movieChapters.forEach((c,i)=>{if(progress>=c.point-.006)result=i;});return result;}

// Only one seek is in flight. Fast scroll changes replace the pending target,
// instead of repeatedly interrupting the browser's decoder before it paints.
export function createVideoScrubber(video,onSettled=()=>{}){
  let wanted=video.currentTime||0,enabled=true,disposed=false;
  const flush=()=>{
    if(disposed||!enabled||video.seeking||video.readyState<2)return;
    if(Math.abs(video.currentTime-wanted)>1/48)video.currentTime=wanted;
    else onSettled(video.currentTime);
  };
  const settled=()=>{onSettled(video.currentTime);flush();};
  video.addEventListener('seeked',settled);video.addEventListener('loadeddata',flush);
  return {
    seek(progress){wanted=frameTime(progress,video.duration);flush();},
    enable(value){enabled=value;wanted=video.currentTime||0;},
    dispose(){disposed=true;video.removeEventListener('seeked',settled);video.removeEventListener('loadeddata',flush);},
  };
}
