(function(){
  if(window.__kazMioAffordanceLoaded){ return; }
  window.__kazMioAffordanceLoaded = true;

  var cardSelector = [
    '.hero-links a','.memo-card','.band-card','a.article',
    'a[class*="-card"]','a[class*="card-"]','a.status-card','a.tool-step'
  ].join(',');
  var actionSelector = [
    '.actions a','.hero-actions a','.button-row a','.related-card a','.product-card a',
    '.tool-link','.hero-featured a','.cta-button','.cta-link','.affiliate-button','.shop-button','.btn',
    'a[role="button"]','a[data-ad-cta]','a[data-commerce-intent]'
  ].join(',');

  function addOpenLabel(link){
    if(link.matches('a.article,.km-row-link') || link.querySelector('.km-open-label')){ return; }
    var label = document.createElement('span');
    label.className = 'km-open-label';
    label.setAttribute('aria-hidden','true');
    label.textContent = String(document.documentElement.lang || '').toLowerCase().indexOf('en') === 0 ? 'Open' : '開く';
    link.appendChild(label);
  }

  function classifyLink(link){
    if(!link || link.dataset.kmAffordance === 'done'){ return; }
    link.dataset.kmAffordance = 'done';
    if(link.closest('header,footer,.hd,.ft') || link.classList.contains('brand')){ return; }
    if(link.matches('a.article')){
      link.classList.add('km-row-link');
      return;
    }
    if(link.matches(cardSelector)){
      link.classList.add('km-clickable-card');
      addOpenLabel(link);
      return;
    }
    if(link.matches(actionSelector)){
      link.classList.add('km-action-control');
      return;
    }
    if(link.closest('.toc,[class*="toc"],[class*="index-nav"],.contents')){
      link.classList.add('km-toc-link');
      return;
    }
    if(link.closest('p,li,dd,figcaption')){
      link.classList.add('km-inline-link');
      return;
    }
    var style = window.getComputedStyle(link);
    var rect = link.getBoundingClientRect();
    if(style.display !== 'inline' && rect.width >= 220 && rect.height >= 88){
      link.classList.add('km-clickable-card');
      addOpenLabel(link);
    }
  }

  function enhance(root){
    var scope = root && root.querySelectorAll ? root : document;
    if(scope.matches && scope.matches('a[href]')){ classifyLink(scope); }
    Array.prototype.forEach.call(scope.querySelectorAll('a[href]'), classifyLink);
    Array.prototype.forEach.call(scope.querySelectorAll('button,[role="button"]'), function(control){
      if(!control.closest('header,.hd') && !control.classList.contains('nav-trigger')){
        control.classList.add('km-button-control');
      }
    });
    document.documentElement.classList.add('km-affordance-ready');
  }

  function init(){
    enhance(document);
    var queued = false;
    var observer = new MutationObserver(function(records){
      if(queued){ return; }
      queued = true;
      window.requestAnimationFrame(function(){
        queued = false;
        records.forEach(function(record){
          Array.prototype.forEach.call(record.addedNodes || [], function(node){
            if(node.nodeType === 1){ enhance(node); }
          });
        });
      });
    });
    if(document.body){ observer.observe(document.body,{childList:true,subtree:true}); }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();
