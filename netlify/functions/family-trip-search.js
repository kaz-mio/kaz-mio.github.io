const https = require('https');

const SOURCE_DOCS = {
  rakuten: 'https://webservice.rakuten.co.jp/documentation/simple-hotel-search',
  rakutenKeyword: 'https://webservice.rakuten.co.jp/documentation/keyword-hotel-search',
  jalan: 'https://www.jalan.net/jw/jwp0100/jww0101.do',
  hotpepper: 'https://webservice.recruit.co.jp/doc/hotpepper/reference.html'
};

const FUNCTION_VERSION = '2026-06-27-rakuten-keyword-fallback';

const GEO_POINTS = [
  {tokens: ['東京ディズニー', '舞浜', '浦安'], lat: 35.6329, lng: 139.8804},
  {tokens: ['札幌', '大通', 'すすきの', '札幌駅'], lat: 43.0618, lng: 141.3545},
  {tokens: ['定山渓'], lat: 42.9661, lng: 141.1628},
  {tokens: ['小樽', '余市'], lat: 43.1907, lng: 140.9947},
  {tokens: ['函館', '湯の川'], lat: 41.7687, lng: 140.7288},
  {tokens: ['富良野'], lat: 43.3422, lng: 142.3832},
  {tokens: ['美瑛'], lat: 43.5883, lng: 142.4671},
  {tokens: ['旭川'], lat: 43.7706, lng: 142.3650},
  {tokens: ['ニセコ'], lat: 42.8047, lng: 140.6874},
  {tokens: ['洞爺湖'], lat: 42.5656, lng: 140.8171},
  {tokens: ['登別'], lat: 42.4521, lng: 141.1791},
  {tokens: ['帯広', '十勝'], lat: 42.9239, lng: 143.1961},
  {tokens: ['釧路', '阿寒'], lat: 42.9849, lng: 144.3818},
  {tokens: ['知床', '斜里', '羅臼'], lat: 44.0761, lng: 145.1245},
  {tokens: ['網走', '北見'], lat: 44.0206, lng: 144.2735},
  {tokens: ['那覇'], lat: 26.2124, lng: 127.6792},
  {tokens: ['恩納村'], lat: 26.4975, lng: 127.8532},
  {tokens: ['名護', '本部'], lat: 26.5915, lng: 127.9773},
  {tokens: ['石垣島'], lat: 24.3407, lng: 124.1556},
  {tokens: ['宮古島'], lat: 24.8056, lng: 125.2811},
  {tokens: ['東京', '銀座', '新宿', '渋谷', '品川', '上野', '浅草'], lat: 35.6812, lng: 139.7671},
  {tokens: ['横浜', 'みなとみらい'], lat: 35.4662, lng: 139.6227},
  {tokens: ['箱根'], lat: 35.2324, lng: 139.1069},
  {tokens: ['千葉', '幕張'], lat: 35.6074, lng: 140.1065},
  {tokens: ['大宮', 'さいたま'], lat: 35.9060, lng: 139.6239},
  {tokens: ['軽井沢'], lat: 36.3483, lng: 138.6355},
  {tokens: ['長野'], lat: 36.6486, lng: 138.1948},
  {tokens: ['松本'], lat: 36.2380, lng: 137.9720},
  {tokens: ['白馬'], lat: 36.6982, lng: 137.8619},
  {tokens: ['河口湖'], lat: 35.4980, lng: 138.7680},
  {tokens: ['金沢'], lat: 36.5613, lng: 136.6562},
  {tokens: ['富山'], lat: 36.6953, lng: 137.2113},
  {tokens: ['福井'], lat: 36.0641, lng: 136.2195},
  {tokens: ['名古屋'], lat: 35.1709, lng: 136.8815},
  {tokens: ['伊勢', '志摩'], lat: 34.4875, lng: 136.7093},
  {tokens: ['静岡', '浜松'], lat: 34.9756, lng: 138.3828},
  {tokens: ['熱海', '伊豆'], lat: 35.0958, lng: 139.0718},
  {tokens: ['高山', '下呂'], lat: 36.1408, lng: 137.2522},
  {tokens: ['大阪'], lat: 34.7025, lng: 135.4959},
  {tokens: ['京都'], lat: 35.0116, lng: 135.7681},
  {tokens: ['神戸'], lat: 34.6901, lng: 135.1955},
  {tokens: ['奈良'], lat: 34.6851, lng: 135.8048},
  {tokens: ['白浜'], lat: 33.6782, lng: 135.3481},
  {tokens: ['淡路島'], lat: 34.3428, lng: 134.8950},
  {tokens: ['広島', '宮島'], lat: 34.3853, lng: 132.4553},
  {tokens: ['岡山', '倉敷'], lat: 34.6618, lng: 133.9350},
  {tokens: ['松江', '出雲'], lat: 35.4644, lng: 133.0639},
  {tokens: ['高松', '小豆島'], lat: 34.3428, lng: 134.0466},
  {tokens: ['松山', '道後'], lat: 33.8392, lng: 132.7657},
  {tokens: ['高知'], lat: 33.5597, lng: 133.5311},
  {tokens: ['福岡', '博多'], lat: 33.5902, lng: 130.4207},
  {tokens: ['長崎'], lat: 32.7503, lng: 129.8779},
  {tokens: ['熊本', '阿蘇'], lat: 32.8031, lng: 130.7079},
  {tokens: ['別府', '湯布院'], lat: 33.2796, lng: 131.5004},
  {tokens: ['鹿児島'], lat: 31.5966, lng: 130.5571},
  {tokens: ['北海道'], lat: 43.0642, lng: 141.3469},
  {tokens: ['東北'], lat: 38.2600, lng: 140.8820},
  {tokens: ['関東'], lat: 35.6812, lng: 139.7671},
  {tokens: ['甲信越'], lat: 36.6486, lng: 138.1948},
  {tokens: ['北陸'], lat: 36.5613, lng: 136.6562},
  {tokens: ['東海'], lat: 35.1709, lng: 136.8815},
  {tokens: ['関西'], lat: 34.7025, lng: 135.4959},
  {tokens: ['中国地方'], lat: 34.3853, lng: 132.4553},
  {tokens: ['四国'], lat: 34.3428, lng: 134.0466},
  {tokens: ['九州'], lat: 33.5902, lng: 130.4207},
  {tokens: ['沖縄'], lat: 26.2124, lng: 127.6792}
];

const JALAN_PREF = {
  北海道: '010000', 青森: '020000', 岩手: '030000', 宮城: '040000', 秋田: '050000',
  山形: '060000', 福島: '070000', 栃木: '080000', 群馬: '090000', 茨城: '100000',
  埼玉: '110000', 千葉: '120000', 東京: '130000', 神奈川: '140000', 山梨: '150000',
  長野: '160000', 新潟: '170000', 富山: '180000', 石川: '190000', 福井: '200000',
  静岡: '210000', 岐阜: '220000', 愛知: '230000', 三重: '240000', 滋賀: '250000',
  京都: '260000', 大阪: '270000', 兵庫: '280000', 奈良: '290000', 和歌山: '300000',
  鳥取: '310000', 島根: '320000', 岡山: '330000', 広島: '340000', 山口: '350000',
  徳島: '360000', 香川: '370000', 愛媛: '380000', 高知: '390000', 福岡: '400000',
  佐賀: '410000', 長崎: '420000', 熊本: '430000', 大分: '440000', 宮崎: '450000',
  鹿児島: '460000', 沖縄: '470000'
};

const JALAN_AREA_RULES = [
  {tokens: ['札幌', '大通', 'すすきの'], params: {pref: '010000', l_area: '010200'}},
  {tokens: ['定山渓'], params: {pref: '010000', l_area: '010300'}},
  {tokens: ['小樽', '余市'], params: {pref: '010000', l_area: '010500'}},
  {tokens: ['ニセコ', 'ルスツ'], params: {pref: '010000', l_area: '010800'}},
  {tokens: ['洞爺', '登別', '苫小牧'], params: {pref: '010000', l_area: '011100'}},
  {tokens: ['函館', '湯の川'], params: {pref: '010000', l_area: '011400'}},
  {tokens: ['旭川', '層雲峡'], params: {pref: '010000', l_area: '012000'}},
  {tokens: ['富良野', '美瑛', 'トマム'], params: {pref: '010000', l_area: '012100'}},
  {tokens: ['釧路', '阿寒', '根室'], params: {pref: '010000', l_area: '012600'}},
  {tokens: ['帯広', '十勝'], params: {pref: '010000', l_area: '013200'}},
  {tokens: ['東京駅', '銀座'], params: {pref: '130000', l_area: '136200'}},
  {tokens: ['新宿'], params: {pref: '130000', l_area: '138000'}},
  {tokens: ['渋谷'], params: {pref: '130000', l_area: '138300'}},
  {tokens: ['舞浜', '浦安', '東京ディズニー'], params: {pref: '120000', l_area: '120500'}},
  {tokens: ['横浜', 'みなとみらい'], params: {pref: '140000', l_area: '140200'}},
  {tokens: ['箱根'], params: {pref: '140000', l_area: '141600'}},
  {tokens: ['河口湖'], params: {pref: '150000', l_area: '150600'}},
  {tokens: ['軽井沢'], params: {pref: '160000', l_area: '161400'}},
  {tokens: ['白馬'], params: {pref: '160000', l_area: '162000'}},
  {tokens: ['松本'], params: {pref: '160000', l_area: '162200'}},
  {tokens: ['那覇'], params: {pref: '470000'}},
  {tokens: ['沖縄', '恩納', '名護', '石垣', '宮古'], params: {pref: '470000'}}
];

const json = (statusCode, body, origin) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
    ...corsHeaders(origin)
  },
  body: JSON.stringify(body)
});

const corsHeaders = origin => {
  const extra = (process.env.FAMILY_API_ALLOWED_ORIGINS || '').split(',').map(v => v.trim()).filter(Boolean);
  const allowed = new Set([
    'https://kaz-mio.github.io',
    'https://regal-platypus-193128.netlify.app',
    'http://localhost:8888',
    'http://localhost:3000',
    ...extra
  ]);
  if (!origin) return {'Access-Control-Allow-Origin': '*', 'Vary': 'Origin'};
  try {
    const {hostname} = new URL(origin);
    if (allowed.has(origin) || hostname.endsWith('.netlify.app')) {
      return {'Access-Control-Allow-Origin': origin, 'Vary': 'Origin'};
    }
  } catch {}
  return {'Access-Control-Allow-Origin': 'https://kaz-mio.github.io', 'Vary': 'Origin'};
};

exports.handler = async event => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        ...corsHeaders(origin),
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept'
      },
      body: ''
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const type = params.type === 'food' ? 'food' : 'stay';
    const q = cleanText(params.q, 140);
    const destination = cleanText(params.destination, 80);
    const conditions = cleanText(params.conditions, 180).split(',').map(v => v.trim()).filter(Boolean).slice(0, 12);
    const context = {type, q, destination, conditions, params};
    const providers = type === 'food'
      ? [await searchHotpepper(context)]
      : await Promise.all([searchRakuten(context), searchJalan(context)]);
    const items = providers
      .flatMap(provider => provider.items || [])
      .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
      .slice(0, type === 'food' ? 8 : 10);

    return json(200, {
      ok: true,
      type,
      generatedAt: new Date().toISOString(),
      functionVersion: FUNCTION_VERSION,
      configured: providers.some(provider => provider.configured),
      providers,
      items,
      sourceDocs: SOURCE_DOCS
    }, origin);
  } catch (error) {
    return json(500, {
      ok: false,
      message: 'family-trip-search failed',
      detail: process.env.NODE_ENV === 'development' ? String(error?.stack || error) : undefined
    }, origin);
  }
};

async function searchRakuten(context) {
  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!appId || !accessKey) return providerNotice('楽天トラベル', false, 'RAKUTEN_APP_ID and RAKUTEN_ACCESS_KEY are not configured.');

  const geo = findGeo(context);
  if (!geo) return providerNotice('楽天トラベル', true, 'No supported destination coordinate was found.');

  const rakutenReferer = rakutenRequestReferer();
  const rakutenHeaders = {
    accessKey,
    Referer: rakutenReferer,
    Origin: rakutenReferer.replace(/\/$/, '')
  };
  const params = new URLSearchParams({
    applicationId: appId,
    format: 'json',
    formatVersion: '2',
    latitude: String(geo.lat),
    longitude: String(geo.lng),
    datumType: '1',
    searchRadius: '3',
    hits: '6',
    responseType: 'middle',
    hotelThumbnailSize: '2'
  });
  if (process.env.RAKUTEN_AFFILIATE_ID) params.set('affiliateId', process.env.RAKUTEN_AFFILIATE_ID);
  const squeeze = [];
  if (hasAny(context.conditions, ['禁煙'])) squeeze.push('kinen');
  if (hasAny(context.conditions, ['温泉', '貸切風呂', '家族風呂'])) squeeze.push('onsen');
  if (squeeze.length) params.set('squeezeCondition', squeeze.join(','));

  try {
    const data = await fetchJsonWithHttps(`https://openapi.rakuten.co.jp/engine/api/Travel/SimpleHotelSearch/20170426?${params.toString()}`, {
      headers: rakutenHeaders
    });
    const hotels = Array.isArray(data.hotels) ? data.hotels : [];
    let items = hotels.map(entry => normalizeRakuten(entry, context)).filter(Boolean);
    if (!items.length) {
      const keywordItems = await searchRakutenByKeyword(context, appId, rakutenHeaders);
      items = keywordItems;
    }
    return {name: '楽天トラベル', configured: true, items, source: SOURCE_DOCS.rakuten};
  } catch (error) {
    return providerNotice('楽天トラベル', true, safeError(error));
  }
}

async function searchRakutenByKeyword(context, appId, headers) {
  const params = new URLSearchParams({
    applicationId: appId,
    format: 'json',
    formatVersion: '2',
    keyword: rakutenKeyword(context),
    hits: '6',
    responseType: 'middle',
    hotelThumbnailSize: '2'
  });
  if (process.env.RAKUTEN_AFFILIATE_ID) params.set('affiliateId', process.env.RAKUTEN_AFFILIATE_ID);
  const data = await fetchJsonWithHttps(`https://openapi.rakuten.co.jp/engine/api/Travel/KeywordHotelSearch/20170426?${params.toString()}`, {
    headers
  });
  const hotels = Array.isArray(data.hotels) ? data.hotels : [];
  return hotels.map(entry => normalizeRakuten(entry, context)).filter(Boolean);
}

async function searchJalan(context) {
  const key = process.env.JALAN_API_KEY;
  if (!key) return providerNotice('じゃらん', false, 'JALAN_API_KEY is not configured.');

  const area = findJalanArea(context);
  if (!area) return providerNotice('じゃらん', true, 'No supported Jalan area code was found.');

  const params = new URLSearchParams({
    key,
    start: '1',
    count: '6',
    pict_size: '3',
    ...area
  });
  if (hasAny(context.conditions, ['駐車場'])) params.set('parking', '1');
  if (hasAny(context.conditions, ['大浴場', '洗い場付き風呂'])) params.set('pub_bath', '1');
  if (hasAny(context.conditions, ['温泉'])) params.set('onsen', '1');
  if (hasAny(context.conditions, ['貸切風呂', '家族風呂'])) params.set('prv_bath', '1');

  try {
    const xml = await fetchText(`http://jws.jalan.net/APILite/HotelSearch/V1/?${params.toString()}`);
    const items = parseJalanHotels(xml).map(item => scoreItem(item, context, 'じゃらん'));
    return {name: 'じゃらん', configured: true, items, source: SOURCE_DOCS.jalan};
  } catch (error) {
    return providerNotice('じゃらん', true, safeError(error));
  }
}

async function searchHotpepper(context) {
  const key = process.env.HOTPEPPER_API_KEY;
  if (!key) return providerNotice('ホットペッパー', false, 'HOTPEPPER_API_KEY is not configured.');

  const geo = findGeo(context);
  const base = new URLSearchParams({
    key,
    format: 'json',
    count: '8',
    order: '4',
    child: '1'
  });
  if (geo) {
    base.set('lat', String(geo.lat));
    base.set('lng', String(geo.lng));
    base.set('range', '5');
  } else {
    base.set('keyword', compact([context.destination, '子連れ']).join(' ') || context.q || '子連れ');
  }
  if (hasAny(context.conditions, ['個室'])) base.set('private_room', '1');
  if (hasAny(context.conditions, ['座敷'])) base.set('tatami', '1');
  if (hasAny(context.conditions, ['禁煙'])) base.set('non_smoking', '1');
  if (hasAny(context.conditions, ['駐車場'])) base.set('parking', '1');
  if (context.q.includes('ランチ') || context.q.includes('昼')) base.set('lunch', '1');

  try {
    const data = await hotpepperRequest(base);
    let shops = data.results?.shop || [];
    if (!shops.length) {
      const loose = new URLSearchParams({key, format: 'json', count: '8', order: '4', child: '1'});
      if (geo) {
        loose.set('lat', String(geo.lat));
        loose.set('lng', String(geo.lng));
        loose.set('range', '5');
      } else {
        loose.set('keyword', context.destination || '子連れ');
      }
      shops = (await hotpepperRequest(loose)).results?.shop || [];
    }
    const items = shops.map(shop => normalizeHotpepper(shop, context)).filter(Boolean);
    return {name: 'ホットペッパー', configured: true, items, source: SOURCE_DOCS.hotpepper};
  } catch (error) {
    return providerNotice('ホットペッパー', true, safeError(error));
  }
}

function hotpepperRequest(params) {
  return fetchJson(`http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${params.toString()}`);
}

function normalizeRakuten(entry, context) {
  const parts = Array.isArray(entry.hotel) ? entry.hotel : [entry.hotel || entry].filter(Boolean);
  const basic = findPart(parts, 'hotelBasicInfo') || entry.hotelBasicInfo || {};
  const rating = findPart(parts, 'hotelRatingInfo') || {};
  if (!basic.hotelName) return null;
  const price = Number(basic.hotelMinCharge || 0);
  return scoreItem({
    provider: '楽天トラベル',
    title: basic.hotelName,
    url: basic.hotelInformationUrl || basic.planListUrl || basic.reviewUrl,
    image: basic.hotelThumbnailUrl || basic.hotelImageUrl,
    price: price ? `${price.toLocaleString('ja-JP')}円から` : '',
    address: compact([basic.address1, basic.address2]).join(''),
    access: basic.access || '',
    tags: compact([
      basic.nearestStation ? `${basic.nearestStation}周辺` : '',
      basic.parkingInformation ? '駐車場情報あり' : '',
      rating.reviewAverage ? `評価 ${rating.reviewAverage}` : ''
    ]).slice(0, 4),
    meta: compact([
      price ? `${price.toLocaleString('ja-JP')}円から` : '',
      basic.access,
      basic.parkingInformation
    ]).join(' / ')
  }, context, '楽天トラベル');
}

function parseJalanHotels(xml) {
  return [...xml.matchAll(/<Hotel>([\s\S]*?)<\/Hotel>/g)].slice(0, 6).map(match => {
    const block = match[1];
    return {
      provider: 'じゃらん',
      title: xmlValue(block, 'HotelName'),
      url: xmlValue(block, 'HotelDetailURL'),
      image: xmlValue(block, 'PictureURL'),
      price: '',
      address: xmlValue(block, 'HotelAddress'),
      access: xmlValue(block, 'AccessInformation'),
      meta: compact([
        xmlValue(block, 'HotelType'),
        xmlValue(block, 'HotelCatchCopy'),
        xmlValue(block, 'AccessInformation')
      ]).join(' / '),
      tags: compact([
        xmlValue(block, 'HotelType'),
        xmlValue(block, 'CheckInTime') ? `IN ${xmlValue(block, 'CheckInTime')}` : '',
        xmlValue(block, 'CheckOutTime') ? `OUT ${xmlValue(block, 'CheckOutTime')}` : ''
      ]).slice(0, 4)
    };
  }).filter(item => item.title);
}

function normalizeHotpepper(shop, context) {
  return scoreItem({
    provider: 'ホットペッパー',
    title: shop.name,
    url: shop.urls?.pc,
    image: shop.photo?.pc?.m || shop.photo?.pc?.l,
    price: shop.budget?.average || shop.budget?.name || '',
    address: shop.address,
    access: shop.access,
    meta: compact([
      shop.budget?.average || shop.budget?.name,
      shop.access,
      shop.open
    ]).join(' / '),
    tags: compact([
      shop.private_room ? `個室 ${shop.private_room}` : '',
      shop.tatami ? `座敷 ${shop.tatami}` : '',
      shop.non_smoking ? `禁煙 ${shop.non_smoking}` : '',
      shop.parking ? `駐車場 ${shop.parking}` : '',
      shop.child ? shop.child : ''
    ]).slice(0, 5)
  }, context, 'ホットペッパー');
}

function scoreItem(item, context, provider) {
  const text = [
    item.title, item.meta, item.address, item.access,
    ...(item.tags || [])
  ].join(' ');
  const matches = context.conditions.filter(condition => hasToken(text, condition)).length;
  const providerBonus = provider === 'ホットペッパー' && hasToken(text, 'お子様') ? 8 : 0;
  const score = Math.min(99, 52 + matches * 8 + providerBonus + (item.image ? 5 : 0) + (item.url ? 4 : 0));
  return {
    provider,
    title: cleanText(item.title, 80),
    url: item.url || '',
    image: item.image || '',
    price: item.price || '',
    address: cleanText(item.address, 120),
    access: cleanText(item.access, 140),
    meta: cleanText(item.meta || compact([item.price, item.address, item.access]).join(' / '), 180),
    tags: (item.tags || []).map(tag => cleanText(tag, 24)).filter(Boolean).slice(0, 5),
    score,
    label: `適合 ${score}`
  };
}

function findGeo(context) {
  const text = `${context.destination} ${context.q}`;
  return GEO_POINTS.find(point => point.tokens.some(token => text.includes(token)));
}

function findJalanArea(context) {
  const text = `${context.destination} ${context.q}`;
  const rule = JALAN_AREA_RULES.find(item => item.tokens.some(token => text.includes(token)));
  if (rule) return rule.params;
  const pref = Object.keys(JALAN_PREF).find(name => text.includes(name));
  if (pref) return {pref: JALAN_PREF[pref]};
  if (text.includes('東北')) return {pref: JALAN_PREF.宮城};
  if (text.includes('関東')) return {pref: JALAN_PREF.東京};
  if (text.includes('甲信越')) return {pref: JALAN_PREF.長野};
  if (text.includes('北陸')) return {pref: JALAN_PREF.石川};
  if (text.includes('東海')) return {pref: JALAN_PREF.愛知};
  if (text.includes('関西')) return {pref: JALAN_PREF.大阪};
  if (text.includes('中国地方')) return {pref: JALAN_PREF.広島};
  if (text.includes('四国')) return {pref: JALAN_PREF.香川};
  if (text.includes('九州')) return {pref: JALAN_PREF.福岡};
  return null;
}

function rakutenRequestReferer() {
  const baseUrl = process.env.RAKUTEN_REFERER || process.env.URL || 'https://bespoke-twilight-56d54d.netlify.app';
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

function rakutenKeyword(context) {
  const text = cleanText(`${context.destination} ${context.q}`, 80);
  const regionFallbacks = [
    ['北海道', '札幌'],
    ['東北', '仙台'],
    ['関東', '東京'],
    ['甲信越', '長野'],
    ['北陸', '金沢'],
    ['東海', '名古屋'],
    ['関西', '大阪'],
    ['中国地方', '広島'],
    ['四国', '高松'],
    ['九州', '福岡'],
    ['沖縄', '那覇']
  ];
  const fallback = regionFallbacks.find(([token]) => text.includes(token));
  if (fallback) return fallback[1];
  return text.split(/\s+/).filter(Boolean).slice(0, 2).join(' ') || '東京';
}

async function fetchJson(url, options = {}) {
  const res = await fetchWithTimeout(url, options);
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 160)}`);
  return JSON.parse(text);
}

async function fetchJsonWithHttps(url, options = {}) {
  const text = await fetchTextWithHttps(url, options);
  return JSON.parse(text);
}

function fetchTextWithHttps(url, options = {}) {
  const headers = {
    'User-Agent': 'KAZ-MIO-family-trip-search/1.0',
    ...(options.headers || {})
  };
  return new Promise((resolve, reject) => {
    const req = https.get(url, {headers, timeout: 8500}, res => {
      let text = '';
      res.setEncoding('utf8');
      res.on('data', chunk => {
        text += chunk;
      });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode}: ${text.slice(0, 160)}`));
          return;
        }
        resolve(text);
      });
    });
    req.on('timeout', () => {
      req.destroy(new Error('request timeout'));
    });
    req.on('error', reject);
  });
}

async function fetchText(url) {
  const res = await fetchWithTimeout(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 160)}`);
  return text;
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8500);
  const headers = options.headers || {};
  try {
    return await fetch(url, {
      signal: controller.signal,
      referrer: options.referrer,
      headers: {
        'User-Agent': 'KAZ-MIO-family-trip-search/1.0',
        ...headers
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

function findPart(parts, key) {
  for (const part of parts) {
    if (part && part[key]) return part[key];
  }
  return null;
}

function xmlValue(block, tag) {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return decodeXml(match ? match[1] : '');
}

function decodeXml(value) {
  return String(value || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanText(value, max = 100) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function compact(values) {
  return values.map(value => cleanText(value, 160)).filter(Boolean);
}

function hasAny(values, needles) {
  const text = values.join(' ');
  return needles.some(needle => text.includes(needle));
}

function hasToken(text, token) {
  const normalized = String(text || '');
  return String(token || '').split(/\s+/).filter(Boolean).some(part => normalized.includes(part));
}

function providerNotice(name, configured, message) {
  return {name, configured, items: [], message};
}

function safeError(error) {
  return String(error?.message || error || 'request failed').slice(0, 180);
}
