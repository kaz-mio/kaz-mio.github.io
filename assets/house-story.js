(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var progress = document.querySelector('.story-reading-progress span');
  var heroImage = document.querySelector('.story-hero-media img');
  var chapters = Array.prototype.slice.call(document.querySelectorAll('.story-chapter'));
  var railLinks = Array.prototype.slice.call(document.querySelectorAll('.story-rail a'));
  var ticking = false;

  function updateScrollEffects(){
    ticking = false;
    var doc = document.documentElement;
    var travel = Math.max(1, doc.scrollHeight - window.innerHeight);
    var ratio = Math.max(0, Math.min(1, window.scrollY / travel));
    if(progress){ progress.style.width = (ratio * 100).toFixed(2) + '%'; }
    if(heroImage && !reduceMotion && window.innerWidth > 900){
      var rect = heroImage.getBoundingClientRect();
      var offset = Math.max(-18, Math.min(18, rect.top * -.035));
      heroImage.style.setProperty('--story-parallax', offset.toFixed(1) + 'px');
    }
  }

  function requestUpdate(){
    if(ticking){ return; }
    ticking = true;
    window.requestAnimationFrame(updateScrollEffects);
  }

  var revealTargets = Array.prototype.slice.call(document.querySelectorAll('.story-reveal'));
  if(reduceMotion || !('IntersectionObserver' in window)){
    revealTargets.forEach(function(target){ target.classList.add('is-visible'); });
  }else{
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting){ return; }
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },{rootMargin:'0px 0px -10% 0px',threshold:.12});
    revealTargets.forEach(function(target){ revealObserver.observe(target); });
  }

  if(chapters.length && 'IntersectionObserver' in window){
    var chapterObserver = new IntersectionObserver(function(entries){
      var visible = entries.filter(function(entry){ return entry.isIntersecting; }).sort(function(a,b){ return b.intersectionRatio - a.intersectionRatio; })[0];
      if(!visible){ return; }
      railLinks.forEach(function(link){ link.setAttribute('aria-current',link.getAttribute('href') === '#' + visible.target.id ? 'true' : 'false'); });
    },{rootMargin:'-28% 0px -52% 0px',threshold:[.05,.25,.5]});
    chapters.forEach(function(chapter){ chapterObserver.observe(chapter); });
  }

  window.addEventListener('scroll',requestUpdate,{passive:true});
  window.addEventListener('resize',requestUpdate);
  updateScrollEffects();
})();
