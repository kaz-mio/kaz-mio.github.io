(function(){
  function init(){
    var body = document.body;
    var path = location.pathname.toLowerCase();
    if(!body || body.classList.contains('story-mode') || body.classList.contains('dashboard-mode') || path.indexOf('/en/') === 0 || /(^|\/)index\.html$/.test(path) || path === '/'){
      return;
    }

    var main = document.querySelector('main');
    if(!main){ return; }
    var headings = Array.prototype.slice.call(main.querySelectorAll('h2')).filter(function(heading){
      return !heading.closest('.modal,[role="dialog"],.result-card,.results');
    }).slice(0,10);
    var longEnough = String(main.textContent || '').replace(/\s+/g,'').length > 900;
    if(!longEnough || headings.length < 2){ return; }

    body.classList.add('km-experience');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var progress = document.createElement('div');
    progress.className = 'km-reading-progress';
    progress.setAttribute('aria-hidden','true');
    progress.innerHTML = '<span></span>';
    body.appendChild(progress);
    var progressBar = progress.querySelector('span');

    var revealTargets = [];
    headings.forEach(function(heading,index){
      if(!heading.id){ heading.id = 'km-chapter-' + (index + 1); }
      var section = heading.closest('section') || heading.parentElement;
      if(section && !section.classList.contains('km-reveal')){
        section.classList.add('km-reveal');
        revealTargets.push(section);
      }
      if(!heading.previousElementSibling || !heading.previousElementSibling.classList.contains('km-section-label')){
        var label = document.createElement('span');
        label.className = 'km-section-label';
        label.textContent = 'Chapter ' + String(index + 1).padStart(2,'0');
        heading.parentNode.insertBefore(label,heading);
      }
    });

    Array.prototype.slice.call(main.querySelectorAll('img')).filter(function(image){
      var width = Number(image.getAttribute('width') || 0);
      var height = Number(image.getAttribute('height') || 0);
      return !(width > 0 && width <= 2) && !(height > 0 && height <= 2) && !image.closest('.moshimo-banner-box,.affiliate-banner');
    }).slice(0,14).forEach(function(image){
      image.classList.add('km-image-focus');
      if(image.parentElement){ image.parentElement.classList.add('km-media-focus'); }
    });

    if(reduced || !('IntersectionObserver' in window)){
      revealTargets.forEach(function(target){ target.classList.add('km-visible'); });
    }else{
      body.classList.add('km-motion-ready');
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(!entry.isIntersecting){ return; }
          entry.target.classList.add('km-visible');
          observer.unobserve(entry.target);
        });
      },{rootMargin:'0px 0px -10% 0px',threshold:.1});
      revealTargets.forEach(function(target){ observer.observe(target); });
    }

    var trigger = null;
    var panel = null;
    if(headings.length >= 3){
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'km-chapter-trigger';
      trigger.textContent = '要点だけ見る';
      trigger.setAttribute('aria-expanded','false');
      trigger.setAttribute('aria-controls','km-chapter-panel');

      panel = document.createElement('aside');
      panel.id = 'km-chapter-panel';
      panel.className = 'km-chapter-panel';
      panel.setAttribute('aria-label','このページの要点');
      var head = document.createElement('div');
      head.className = 'km-chapter-panel-head';
      var title = document.createElement('strong');
      title.textContent = 'このページの要点';
      var close = document.createElement('button');
      close.type = 'button';
      close.textContent = '閉じる';
      head.appendChild(title);
      head.appendChild(close);
      panel.appendChild(head);

      var list = document.createElement('nav');
      list.className = 'km-chapter-list';
      headings.forEach(function(heading,index){
        var link = document.createElement('a');
        link.href = '#' + heading.id;
        var number = document.createElement('small');
        number.textContent = String(index + 1).padStart(2,'0');
        var text = document.createElement('span');
        text.textContent = String(heading.textContent || '').replace(/\s+/g,' ').trim();
        link.appendChild(number);
        link.appendChild(text);
        list.appendChild(link);
      });
      panel.appendChild(list);
      body.appendChild(panel);
      body.appendChild(trigger);

      function setOpen(open){
        panel.classList.toggle('is-open',open);
        trigger.setAttribute('aria-expanded',open ? 'true' : 'false');
        if(open){ close.focus(); }
      }
      trigger.addEventListener('click',function(){ setOpen(!panel.classList.contains('is-open')); });
      close.addEventListener('click',function(){ setOpen(false); trigger.focus(); });
      list.addEventListener('click',function(event){ if(event.target.closest('a')){ setOpen(false); } });
      document.addEventListener('keydown',function(event){ if(event.key === 'Escape' && panel.classList.contains('is-open')){ setOpen(false); trigger.focus(); } });
    }

    var ticking = false;
    function updateProgress(){
      ticking = false;
      var travel = Math.max(1,document.documentElement.scrollHeight - window.innerHeight);
      progressBar.style.width = (Math.max(0,Math.min(1,window.scrollY / travel)) * 100).toFixed(2) + '%';
    }
    function requestProgress(){
      if(ticking){ return; }
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }
    window.addEventListener('scroll',requestProgress,{passive:true});
    window.addEventListener('resize',requestProgress);
    updateProgress();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();
