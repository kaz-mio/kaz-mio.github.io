(function(root){
  'use strict';
  function calculateStock(stockValue,dailyValue){
    if(String(stockValue).trim()==='' || String(dailyValue).trim()==='') return {error:'残り枚数と1日の使用枚数を入力してください。'};
    var stock=Number(stockValue),daily=Number(dailyValue);
    if(!Number.isInteger(stock)||stock<0||stock>9999) return {error:'残り枚数は0〜9999の整数で入力してください。',field:'stock-count'};
    if(!Number.isInteger(daily)||daily<1||daily>100) return {error:'1日の使用枚数は1〜100の整数で入力してください。',field:'stock-daily'};
    var days=stock/daily;
    return {days:days,text:stock===0?'手元のおむつは0枚です。':days<1?'目安は1日未満です。':'目安は約'+(Math.floor(days*10)/10).toLocaleString('ja-JP',{maximumFractionDigits:1})+'日分です。'};
  }
  if(typeof module==='object'&&module.exports){module.exports={calculateStock:calculateStock};return;}
  document.documentElement.classList.add('js');
  function track(name,params){if(typeof root.kazMioTrack==='function')root.kazMioTrack(name,params);}
  var form=document.getElementById('stock-form');
  var count=document.getElementById('stock-count'),daily=document.getElementById('stock-daily');
  var error=document.getElementById('stock-error'),result=document.getElementById('stock-result'),answer=document.getElementById('stock-answer');
  var started=false;
  function start(){if(!started){started=true;track('kazmio_tool_start',{tool_slug:'home_diaper_stock',placement:'home_hero'});}}
  form.addEventListener('input',function(){start();result.hidden=true;error.hidden=true;count.removeAttribute('aria-invalid');daily.removeAttribute('aria-invalid');});
  form.addEventListener('submit',function(event){
    event.preventDefault();start();
    var calculated=calculateStock(count.value,daily.value);
    count.removeAttribute('aria-invalid');daily.removeAttribute('aria-invalid');
    if(calculated.error){error.textContent=calculated.error;error.hidden=false;result.hidden=true;var field=document.getElementById(calculated.field)||(count.value===''?count:daily);field.setAttribute('aria-invalid','true');field.focus();return;}
    error.hidden=true;answer.textContent=calculated.text;result.hidden=false;
    track('kazmio_tool_complete',{tool_slug:'home_diaper_stock',placement:'home_hero'});
  });
  function openCatalog(id,focus){
    var panel=document.getElementById(id);if(!panel||panel.tagName!=='DETAILS')return;
    panel.open=true;if(focus){panel.scrollIntoView({block:'start'});var search=panel.querySelector('input');if(search)search.focus({preventScroll:true});}
  }
  function hashCatalog(){var id;try{id=decodeURIComponent(location.hash.slice(1));}catch(e){return;}openCatalog(id,false);}
  document.querySelectorAll('a[href="#tools"],a[href="#all-articles"]').forEach(function(link){link.addEventListener('click',function(event){event.preventDefault();var id=link.getAttribute('href').slice(1);if(location.hash!=='#'+id)history.pushState(null,'','#'+id);openCatalog(id,true);track('kazmio_home_catalog_open',{catalog:id});});});
  document.querySelectorAll('[data-search]').forEach(function(input){
    var list=document.getElementById(input.dataset.search),items=Array.from(list.querySelectorAll('[data-search-item]')),status=document.getElementById(list.id+'-status');
    function filter(){var words=input.value.normalize('NFKC').toLocaleLowerCase('ja-JP').trim().split(/\s+/).filter(Boolean);var count=0;items.forEach(function(item){var text=item.textContent.normalize('NFKC').toLocaleLowerCase('ja-JP');var matches=words.every(function(word){return text.includes(word);});item.hidden=!matches;if(matches)count++;});status.textContent=words.length?(count?count+'件見つかりました。':'見つかりませんでした。別の言葉でお試しください。'):'全'+items.length+'件';}
    input.addEventListener('input',filter);filter();
  });
  window.addEventListener('hashchange',hashCatalog);window.addEventListener('popstate',hashCatalog);hashCatalog();
})(typeof window==='object'?window:globalThis);
