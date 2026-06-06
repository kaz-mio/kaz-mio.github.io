(function(){
  // Replace this with the GA4 measurement ID, e.g. G-XXXXXXXXXX.
  var GOOGLE_TAG_ID = 'G-ZKQ4EDMKBW';
  var hasTagId = /^(G|GT|AW|DC)-[A-Z0-9]+$/.test(GOOGLE_TAG_ID) && GOOGLE_TAG_ID !== 'G-XXXXXXXXXX';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

  function cleanParams(params){
    var cleaned = {};
    Object.keys(params || {}).forEach(function(key){
      var value = params[key];
      if(value !== undefined && value !== null && value !== ''){
        cleaned[key] = value;
      }
    });
    return cleaned;
  }

  window.kazMioTrack = function(eventName, params){
    if(!eventName){ return; }
    var payload = cleanParams(params);
    payload.page_title = document.title;
    payload.page_location = location.href;

    if(hasTagId){
      window.gtag('event', eventName, payload);
      return;
    }

    window.kazMioAnalyticsQueue = window.kazMioAnalyticsQueue || [];
    window.kazMioAnalyticsQueue.push({
      event: eventName,
      params: payload,
      timestamp: new Date().toISOString()
    });
  };

  window.kazMioAnalytics = {
    enabled: hasTagId,
    measurementId: hasTagId ? GOOGLE_TAG_ID : null,
    track: window.kazMioTrack
  };

  function currentSlug(){
    var path = location.pathname.split('/').pop() || 'index.html';
    return path.replace(/\.html$/,'');
  }

  function cleanText(text){
    return String(text || '').replace(/\s+/g,' ').trim().slice(0,80);
  }

  function toolLabel(){
    var heading = document.querySelector('h1');
    return cleanText(heading ? heading.textContent : document.title);
  }

  function controlParams(control){
    var params = {
      tool_slug: currentSlug(),
      tool_label: toolLabel(),
      action_type: control.tagName ? control.tagName.toLowerCase() : 'control',
      action_label: cleanText(control.textContent)
    };

    if(control.id){ params.action_id = control.id; }
    if(control.name){ params.action_name = control.name; }
    if(control.getAttribute && control.getAttribute('href')){ params.link_url = control.getAttribute('href'); }

    Object.keys(control.dataset || {}).slice(0,4).forEach(function(key){
      params['data_' + key] = cleanText(control.dataset[key]);
    });

    return params;
  }

  function affiliateNetwork(url){
    if(/af\.moshimo\.com/.test(url)){ return 'moshimo'; }
    if(/px\.a8\.net/.test(url)){ return 'a8'; }
    if(/amazon\./.test(url)){ return 'amazon'; }
    if(/rakuten\./.test(url)){ return 'rakuten'; }
    return 'other';
  }

  function setupAffiliateTracking(){
    document.addEventListener('click', function(event){
      var link = event.target.closest('a[href]');
      if(!link){ return; }
      var href = link.getAttribute('href') || '';
      var isAffiliate = /af\.moshimo\.com|px\.a8\.net|amazon\.|rakuten\./.test(href);
      if(!isAffiliate && !link.dataset.affiliateOffer){ return; }

      var params = {
        page_slug: currentSlug(),
        link_url: href,
        link_text: cleanText(link.textContent || link.getAttribute('aria-label') || link.querySelector('img')?.alt),
        affiliate_network: link.dataset.affiliateNetwork || affiliateNetwork(href),
        affiliate_offer: link.dataset.affiliateOffer,
        affiliate_placement: link.dataset.affiliatePlacement || link.dataset.placement,
        campaign: link.dataset.campaign
      };

      window.kazMioTrack(link.dataset.gaEvent || 'kazmio_affiliate_click', params);
    }, true);
  }

  function setupToolTracking(){
    var shell = document.querySelector('.app-shell,.quiz-shell');
    if(!shell){ return; }

    var started = false;
    function trackStart(){
      if(started){ return; }
      started = true;
      window.kazMioTrack('kazmio_tool_start', {
        tool_slug: currentSlug(),
        tool_label: toolLabel()
      });
    }

    shell.addEventListener('click', function(event){
      var control = event.target.closest('button,a');
      if(!control || !shell.contains(control)){ return; }
      trackStart();
      window.kazMioTrack('kazmio_tool_action', controlParams(control));
    });

    shell.addEventListener('change', function(event){
      if(event.target && event.target.matches('input,select,textarea')){
        trackStart();
      }
    });

    shell.addEventListener('input', function(event){
      if(event.target && event.target.matches('input,select,textarea')){
        trackStart();
      }
    }, {once:true});
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      setupToolTracking();
      setupAffiliateTracking();
    });
  }else{
    setupToolTracking();
    setupAffiliateTracking();
  }

  if(!hasTagId){
    return;
  }

  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GOOGLE_TAG_ID);
  document.head.appendChild(tag);

  window.gtag('js', new Date());
  window.gtag('config', GOOGLE_TAG_ID);
})();
