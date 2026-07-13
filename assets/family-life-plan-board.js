(() => {
  const KEYS = {
    land: 'kazmio_land_candidate_compare_v1',
    house: 'kazmio_house_plan_board_v1',
    houseLegacy: 'house-perspective-studio-v1',
    budget: 'kazmio_house_total_budget_v3',
    scenarios: 'kazmio_family_life_plan_scenarios_v1'
  };
  const $ = id => document.getElementById(id);
  const num = value => Number(value || 0);
  const one = value => (Math.round(num(value) * 10) / 10).toLocaleString('ja-JP');
  const man = value => `${Math.round(num(value)).toLocaleString('ja-JP')}万円`;
  const yen = value => `${Math.round(num(value)).toLocaleString('ja-JP')}円`;
  const pct = value => `${one(value)}%`;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const read = (key, fallback = null) => { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } };
  const hasLand = item => item && (item.name || num(item.area) || num(item.width) || num(item.depth) || num(item.price) || item.memo || ['parking','snow','sun','road','school','station','shop','hazard'].some(k => item[k]));
  function landScore(data) {
    let total = 0, possible = 0;
    const area = num(data.area), width = num(data.width), depth = num(data.depth);
    if (area) { possible += 18; total += area >= 60 ? 18 : area >= 50 ? 15 : area >= 40 ? 11 : 7; }
    if (width) { possible += 16; total += width >= 13 ? 16 : width >= 10 ? 12 : width >= 8 ? 8 : 4; }
    if (depth) { possible += 12; total += depth >= 15 ? 12 : depth >= 12 ? 9 : depth >= 9 ? 6 : 3; }
    ['parking','snow','sun','road','school','station','shop','hazard'].forEach(k => { const weight = k === 'hazard' ? 10 : 8; possible += weight; if (data[k]) total += weight; });
    if (data.region === 'hokkaido' || data.region === 'snow') { possible += 10; total += data.snow ? 10 : 2; }
    if (data.region === 'urban') { possible += 8; total += data.parking ? 5 : 2; }
    return possible ? Math.round(total / possible * 100) : 0;
  }
  function budgetCalc(d) {
    if (!d) return null;
    const building = num(d.buildingBase) || num(d.buildingTsubo) * num(d.unitPrice);
    const ancillary = building * num(d.ancillaryRate) / 100;
    const miscBase = num(d.landPrice) + building + ancillary + num(d.exterior) + num(d.designFee);
    const misc = miscBase * num(d.miscRate) / 100;
    const beforeReserve = miscBase + misc + num(d.furniture) + num(d.moving);
    const reserve = beforeReserve * num(d.reserveRate) / 100;
    const total = beforeReserve + reserve;
    const availableCash = num(d.ownCash) + num(d.support);
    const cashForProject = Math.max(0, availableCash - num(d.keepCash));
    const loan = Math.max(0, total - cashForProject);
    const years = Math.max(1, num(d.years));
    const rate = Math.max(0, num(d.rate)) / 100 / 12;
    const months = years * 12;
    const monthly = rate ? loan * 10000 * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1) : loan * 10000 / months;
    const income = num(d.incomeMain) + num(d.incomePartner) || num(d.income);
    const burden = income ? monthly * 12 / (income * 10000) * 100 : 0;
    return { total, building, ancillary, reserve, loan, monthly, income, burden, land: num(d.landPrice), exterior: num(d.exterior), buildingTsubo: num(d.buildingTsubo), keepCash: num(d.keepCash), rate: num(d.rate), years };
  }
  function legacyHouse() {
    const d = read(KEYS.houseLegacy);
    if (!d?.land || !d?.brief) return null;
    const landArea = num(d.land.width) * num(d.land.depth);
    return { updatedAt: null, land: d.land, brief: d.brief, assessment: { overall: null, grade: '保存済み', landArea, landTsubo: landArea / 3.305785, footprint: null, totalFloorArea: null, coverage: null, checks: [] } };
  }
  function getData() {
    const lands = (read(KEYS.land, []) || []).filter(hasLand).map((item, index) => ({...item, score: landScore(item), index})).sort((a,b) => b.score - a.score);
    const house = read(KEYS.house) || legacyHouse();
    const rawBudget = read(KEYS.budget);
    return { lands, land: lands[0] || null, house, rawBudget, budget: budgetCalc(rawBudget) };
  }
  function makeChecks(data) {
    const checks = [];
    const {land, house, budget} = data;
    if (!land) checks.push({state:'neutral', title:'土地候補がまだ連携されていません', text:'土地候補比較メモで、候補を1件以上保存してください。', tag:'土地'});
    if (!house) checks.push({state:'neutral', title:'住まいの配置がまだ連携されていません', text:'住宅計画シミュレーターで「提案プランを作る」と自動で反映されます。', tag:'住まい'});
    if (!budget) checks.push({state:'neutral', title:'総予算がまだ連携されていません', text:'総予算シミュレーターに入力すると自動で反映されます。', tag:'お金'});
    if (land && house) {
      const candidateArea = num(land.area) || num(land.width) * num(land.depth) / 3.305785;
      const houseArea = num(house.assessment?.landTsubo) || num(house.land?.width) * num(house.land?.depth) / 3.305785;
      const diff = candidateArea && houseArea ? Math.abs(candidateArea - houseArea) / candidateArea * 100 : 0;
      checks.push(diff <= 10 ? {state:'good',title:'土地の広さがそろっています',text:`候補 ${one(candidateArea)}坪と住宅計画 ${one(houseArea)}坪の差は${one(diff)}%です。`,tag:'整合'} : {state:'warn',title:'土地面積に差があります',text:`候補 ${one(candidateArea)}坪に対し、住宅計画は${one(houseArea)}坪です。敷地寸法を確認してください。`,tag:'要確認'});
      const snowRegion = ['hokkaido','snow','snowy'].includes(land.region) || ['hokkaido','snow','snowy'].includes(house.land?.region);
      if (snowRegion) checks.push(land.snow ? {state:'good',title:'雪置き場を確認済みです',text:'配置図では落雪方向と除雪後の雪の量も現地条件に合わせます。',tag:'雪対策'} : {state:'bad',title:'雪置き場の現地確認が残っています',text:'駐車、玄関動線、屋根からの落雪と重ならない位置を確認してください。',tag:'優先'});
    }
    if (land && budget) {
      const price = num(land.price), diff = price && budget.land ? Math.abs(price - budget.land) / price * 100 : 0;
      if (price && budget.land) checks.push(diff <= 5 ? {state:'good',title:'土地価格が予算に反映されています',text:`候補 ${man(price)}と予算入力 ${man(budget.land)}がほぼ一致しています。`,tag:'整合'} : {state:'warn',title:'土地価格が予算と一致していません',text:`候補 ${man(price)}に対し、予算入力は${man(budget.land)}です。諸条件込みの価格か確認してください。`,tag:'要確認'});
    }
    if (house && budget) {
      const houseTsubo = num(house.assessment?.totalFloorArea) / 3.305785;
      if (houseTsubo && budget.buildingTsubo) {
        const diff = Math.abs(houseTsubo - budget.buildingTsubo) / houseTsubo * 100;
        checks.push(diff <= 12 ? {state:'good',title:'建物の広さと建築予算がそろっています',text:`配置計画 約${one(houseTsubo)}坪、予算入力 ${one(budget.buildingTsubo)}坪です。`,tag:'整合'} : {state:'warn',title:'建物面積に差があります',text:`配置計画 約${one(houseTsubo)}坪に対し、予算入力は${one(budget.buildingTsubo)}坪です。`,tag:'要確認'});
      }
    }
    if (budget) {
      checks.push(budget.burden < 25 ? {state:'good',title:'返済負担率は比較しやすい範囲です',text:`目安は${pct(budget.burden)}。教育費・車・修繕費を含む家計全体でも確認します。`,tag:'資金'} : budget.burden < 30 ? {state:'warn',title:'返済負担率を慎重に見たい水準です',text:`目安は${pct(budget.burden)}。金利上昇と収入減のケースも保存して比べます。`,tag:'要確認'} : {state:'bad',title:'借入額の見直しを優先します',text:`返済負担率は${pct(budget.burden)}。土地・面積・自己資金の組み合わせを再検討します。`,tag:'優先'});
      if (budget.keepCash < 150) checks.push({state:'warn',title:'手元に残す現金が少なめです',text:'入居後の家電、追加外構、車検、医療費のための現金を別に確保できるか確認します。',tag:'生活防衛'});
      if (budget.exterior < 150) checks.push({state:'warn',title:'外構費に含める範囲を確認します',text:'駐車、フェンス、アプローチ、物置、雪対策を含むか見積書で確認してください。',tag:'外構'});
    }
    return checks;
  }
  function overall(data, checks) {
    const parts = [];
    if (data.land) parts.push(data.land.score);
    if (data.house) parts.push(num(data.house.assessment?.overall) || 70);
    if (data.budget) parts.push(Math.max(35, Math.min(96, Math.round(100 - Math.max(0, data.budget.burden - 18) * 3))));
    if (!parts.length) return 0;
    const base = parts.reduce((a,b)=>a+b,0)/parts.length;
    const penalty = checks.filter(c=>c.state==='bad').length*8 + checks.filter(c=>c.state==='warn').length*3 + (3-parts.length)*8;
    return Math.max(15,Math.min(98,Math.round(base-penalty)));
  }
  function tasks(data, checks) {
    const list = [];
    checks.filter(c=>c.state==='bad').forEach(c=>list.push({when:'今すぐ',text:c.title}));
    checks.filter(c=>c.state==='warn').slice(0,3).forEach(c=>list.push({when:'次の比較',text:c.title}));
    if (data.land && !data.land.hazard) list.push({when:'契約前',text:'ハザード・道路・上下水道・地盤資料を確認する'});
    if (data.house) list.push({when:'専門家へ',text:'配置図を建築会社へ見せ、法規・構造・設備動線を確認する'});
    if (data.budget) list.push({when:'金融機関へ',text:'金利上昇・収入減を含む返済案を相談する'});
    if (!list.length) list.push({when:'はじめに',text:'土地・住まい・予算のうち、気になるツールから入力する'});
    return list.slice(0,6);
  }
  function memo(data, checks, score) {
    const lines = ['わが家の暮らし計画 相談メモ', `作成日: ${new Date().toLocaleDateString('ja-JP')}`, `計画のまとまり度: ${score}/100`, ''];
    if (data.land) lines.push('【土地】', `${data.land.name || '候補'} / ${one(data.land.area)}坪 / 間口${one(data.land.width)}m × 奥行き${one(data.land.depth)}m / ${man(data.land.price)} / 比較スコア${data.land.score}`, '');
    else lines.push('【土地】未入力', '');
    if (data.house) { const a=data.house.assessment||{}, b=data.house.brief||{}, l=data.house.land||{}; lines.push('【住まい】', `${b.residents||'-'}人 / ${b.floors===1?'平屋':b.floors===2?'2階建て':'階数未定'} / 個室${b.bedrooms||'-'}室 / 駐車${b.parking||'-'}台`, `敷地 ${one(a.landTsubo || num(l.width)*num(l.depth)/3.305785)}坪 / 延床 約${one(num(a.totalFloorArea)/3.305785)}坪 / 評価 ${a.overall || '-'}点 ${a.grade || ''}`, ''); }
    else lines.push('【住まい】未入力', '');
    if (data.budget) lines.push('【お金】', `総予算 ${man(data.budget.total)} / 借入目安 ${man(data.budget.loan)} / 毎月返済 ${yen(data.budget.monthly)}`, `返済負担率 ${pct(data.budget.burden)} / 金利 年${one(data.budget.rate)}% / ${data.budget.years}年`, '');
    else lines.push('【お金】未入力', '');
    lines.push('【横断チェック】', ...checks.map(c=>`・${c.title}: ${c.text}`), '', '【次に確認すること】', ...tasks(data,checks).map(t=>`・${t.when}: ${t.text}`), '', '※初期比較用の概算です。法規、構造、地盤、設備、見積り、融資条件は専門家へ確認してください。', 'KAZ & MIO | LIFE, LIGHTLY');
    return lines.join('\n');
  }
  function render() {
    const data = getData(), checks = makeChecks(data), score = overall(data, checks);
    $('scoreRing').style.setProperty('--score', score); $('scoreValue').textContent = score;
    $('scoreText').textContent = score >= 82 ? '3つの条件がよくそろっています。次は専門家との確認へ。' : score >= 60 ? '計画の骨組みができています。黄色の項目を順に整えましょう。' : score ? '入力は始まっています。未連携のツールを埋めると判断しやすくなります。' : '土地・住まい・お金の結果がここに集まります。';
    const status = [
      data.land ? {id:'landStatus',metric:`${data.land.score}点`,text:`${esc(data.land.name||'候補')}・${one(data.land.area)}坪・${man(data.land.price)}`,done:true} : {id:'landStatus',metric:'未入力',text:'候補の広さ・価格・現地条件を比べます。'},
      data.house ? {id:'houseStatus',metric:data.house.assessment?.overall?`${data.house.assessment.overall}点`:'保存済み',text:`${data.house.brief?.floors===1?'平屋':'2階建て'}・${data.house.brief?.residents||'-'}人・延床約${one(num(data.house.assessment?.totalFloorArea)/3.305785)}坪`,done:true} : {id:'houseStatus',metric:'未入力',text:'敷地に家・駐車・外構を置いて確かめます。'},
      data.budget ? {id:'budgetStatus',metric:man(data.budget.total),text:`毎月${yen(data.budget.monthly)}・負担率${pct(data.budget.burden)}`,done:true} : {id:'budgetStatus',metric:'未入力',text:'総額・手元資金・毎月返済をまとめます。'}
    ];
    status.forEach(s=>{const el=$(s.id); el.querySelector('.pill').textContent=s.done?'連携済み':'これから'; el.querySelector('.pill').classList.toggle('done',!!s.done); el.querySelector('.metric').textContent=s.metric; el.querySelector('p').innerHTML=s.text;});
    $('checkList').innerHTML = checks.map(c=>`<article class="check-item ${c.state}"><span class="check-mark">${c.state==='good'?'✓':c.state==='bad'?'!':c.state==='warn'?'△':'＋'}</span><div><strong>${esc(c.title)}</strong><p>${esc(c.text)}</p></div><span class="check-tag">${esc(c.tag)}</span></article>`).join('');
    $('taskList').innerHTML = tasks(data,checks).map(t=>`<div class="task"><small>${esc(t.when)}</small><strong>${esc(t.text)}</strong></div>`).join('');
    $('memo').value = memo(data,checks,score);
    window.currentPlanSnapshot = {savedAt:new Date().toISOString(),score,land:data.land?{name:data.land.name||'候補',score:data.land.score,area:num(data.land.area),price:num(data.land.price)}:null,house:data.house?{overall:num(data.house.assessment?.overall),floors:num(data.house.brief?.floors),residents:num(data.house.brief?.residents),totalFloorTsubo:num(data.house.assessment?.totalFloorArea)/3.305785}:null,budget:data.budget?{total:data.budget.total,monthly:data.budget.monthly,burden:data.budget.burden}:null,warnings:checks.filter(c=>c.state==='warn'||c.state==='bad').length};
    renderScenarios();
  }
  function renderScenarios() {
    const scenarios = read(KEYS.scenarios,[]) || [];
    $('scenarioGrid').innerHTML = scenarios.length ? scenarios.map((s,i)=>`<article class="scenario"><div class="scenario-head"><div><small>${new Date(s.savedAt).toLocaleDateString('ja-JP')}</small><h3>${esc(s.name)}</h3></div><button type="button" data-delete="${i}" aria-label="${esc(s.name)}を削除">×</button></div><div class="scenario-score">${s.score}<small>/100</small></div><dl><dt>土地</dt><dd>${s.land?`${esc(s.land.name)} ${man(s.land.price)}`:'未入力'}</dd><dt>住まい</dt><dd>${s.house?`${s.house.floors===1?'平屋':'2階'} 約${one(s.house.totalFloorTsubo)}坪`:'未入力'}</dd><dt>総予算</dt><dd>${s.budget?man(s.budget.total):'未入力'}</dd><dt>毎月返済</dt><dd>${s.budget?yen(s.budget.monthly):'未入力'}</dd><dt>要確認</dt><dd>${s.warnings}件</dd></dl></article>`).join('') : '<div class="empty">現在の組み合わせを保存すると、土地や予算を変えた案を最大3つまで横に比べられます。</div>';
    $('scenarioGrid').querySelectorAll('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>{const next=read(KEYS.scenarios,[])||[];next.splice(Number(btn.dataset.delete),1);localStorage.setItem(KEYS.scenarios,JSON.stringify(next));renderScenarios();}));
  }
  $('reloadBtn').addEventListener('click',render);
  $('saveScenarioBtn').addEventListener('click',()=>{const name=$('scenarioName').value.trim()||`比較案 ${(read(KEYS.scenarios,[])||[]).length+1}`;const list=read(KEYS.scenarios,[])||[];list.unshift({...window.currentPlanSnapshot,name});localStorage.setItem(KEYS.scenarios,JSON.stringify(list.slice(0,3)));$('scenarioName').value='';renderScenarios();});
  $('copyBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('memo').value);$('copyBtn').textContent='コピーしました';setTimeout(()=>$('copyBtn').textContent='相談メモをコピー',1400);}catch{$('memo').select();document.execCommand('copy');}});
  $('printBtn').addEventListener('click',()=>window.print());
  window.addEventListener('storage',render);
  render();
})();
