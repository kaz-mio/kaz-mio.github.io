(function(){
  var affordanceStyleUrl = '/assets/site-affordance.css?v=20260716-1';
  var affordanceScriptUrl = '/assets/site-affordance.js?v=20260716-1';
  var experienceStyleUrl = '/assets/site-experience.css?v=20260716-2';
  var experienceScriptUrl = '/assets/site-experience.js?v=20260716-2';

  var affordanceStyle = document.querySelector('link[href*="assets/site-affordance.css"]');
  if(!affordanceStyle){
    affordanceStyle = document.createElement('link');
    affordanceStyle.rel = 'stylesheet';
    affordanceStyle.dataset.kmAffordance = 'true';
    document.head.appendChild(affordanceStyle);
  }
  affordanceStyle.href = affordanceStyleUrl;

  var affordanceScript = document.querySelector('script[src*="assets/site-affordance.js"]');
  if(!affordanceScript){
    affordanceScript = document.createElement('script');
    affordanceScript.defer = true;
    affordanceScript.dataset.kmAffordance = 'true';
    document.head.appendChild(affordanceScript);
  }
  if(affordanceScript.getAttribute('src') !== affordanceScriptUrl){ affordanceScript.src = affordanceScriptUrl; }

  try{
    var experienceStyle = document.querySelector('link[href*="assets/site-experience.css"]');
    if(!experienceStyle){
      experienceStyle = document.createElement('link');
      experienceStyle.rel = 'stylesheet';
      experienceStyle.dataset.kmExperience = 'true';
      document.head.appendChild(experienceStyle);
    }
    experienceStyle.href = experienceStyleUrl;
    var experienceScript = document.querySelector('script[src*="assets/site-experience.js"]');
    if(!experienceScript){
      experienceScript = document.createElement('script');
      experienceScript.defer = true;
      experienceScript.dataset.kmExperience = 'true';
      document.head.appendChild(experienceScript);
    }
    if(experienceScript.getAttribute('src') !== experienceScriptUrl){ experienceScript.src = experienceScriptUrl; }
  }catch(error){
    // Keep analytics and page behavior working when URL construction is unavailable.
  }

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
      var metadataCarrier = link.closest('[data-affiliate-network],[data-affiliate-offer],[data-affiliate-placement],[data-campaign],[data-ga-event]');
      var inherited = metadataCarrier && metadataCarrier !== link ? metadataCarrier.dataset : {};
      var linkData = link.dataset || {};

      var params = {
        page_slug: currentSlug(),
        link_url: href,
        link_text: linkData.affiliateLabel || inherited.affiliateLabel || cleanText(link.textContent || link.getAttribute('aria-label') || link.querySelector('img')?.alt),
        affiliate_network: linkData.affiliateNetwork || inherited.affiliateNetwork || affiliateNetwork(href),
        affiliate_offer: linkData.affiliateOffer || inherited.affiliateOffer,
        affiliate_placement: linkData.affiliatePlacement || linkData.placement || inherited.affiliatePlacement || inherited.placement,
        campaign: linkData.campaign || inherited.campaign
      };

      window.kazMioTrack(linkData.gaEvent || inherited.gaEvent || 'kazmio_affiliate_click', params);
    }, true);
  }

  function setupProductTracking(){
    document.addEventListener('click', function(event){
      var link = event.target.closest('a[data-product],a[href*="kaz-mio-life.booth.pm/items/"]');
      if(!link){ return; }

      var href = link.getAttribute('href') || '';
      var itemMatch = href.match(/booth\.pm\/items\/(\d+)/);
      var metadataCarrier = link.closest('[data-product],[data-placement],[data-campaign],[data-ga-event]');
      var inherited = metadataCarrier && metadataCarrier !== link ? metadataCarrier.dataset : {};
      var linkData = link.dataset || {};

      window.kazMioTrack(linkData.gaEvent || inherited.gaEvent || 'kazmio_product_click', {
        page_slug: currentSlug(),
        product_id: linkData.productId || inherited.productId || (itemMatch ? itemMatch[1] : undefined),
        product_key: linkData.product || inherited.product,
        product_name: linkData.productName || inherited.productName || cleanText(link.textContent || link.getAttribute('aria-label') || link.querySelector('img')?.alt),
        product_platform: linkData.productPlatform || inherited.productPlatform || 'booth',
        link_url: href,
        link_text: cleanText(link.textContent || link.getAttribute('aria-label') || link.querySelector('img')?.alt),
        placement: linkData.placement || inherited.placement,
        campaign: linkData.campaign || inherited.campaign
      });
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

  function setupRouteTracking(){
    document.addEventListener('click', function(event){
      var link = event.target.closest('a[data-route-intent],a[data-commerce-intent],a[data-ad-cta]');
      if(!link){ return; }

      window.kazMioTrack('kazmio_route_click', {
        page_slug: currentSlug(),
        route_intent: link.dataset.routeIntent || link.dataset.commerceIntent || link.dataset.adCta,
        link_url: link.getAttribute('href'),
        link_text: cleanText(link.textContent),
        placement: link.dataset.placement,
        campaign: link.dataset.campaign
      });
    }, true);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      setupToolTracking();
      setupAffiliateTracking();
      setupProductTracking();
      setupRouteTracking();
    });
  }else{
    setupToolTracking();
    setupAffiliateTracking();
    setupProductTracking();
    setupRouteTracking();
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
