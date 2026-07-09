import netlifyFunction from '../netlify/functions/family-trip-search.js';

const handler = netlifyFunction.handler;
const ENV_KEYS = [
  'FAMILY_API_ALLOWED_ORIGINS',
  'GOOGLE_PLACES_API_KEY',
  'HOTPEPPER_API_KEY',
  'JALAN_API_KEY',
  'NODE_ENV',
  'RAKUTEN_ACCESS_KEY',
  'RAKUTEN_AFFILIATE_ID',
  'RAKUTEN_APP_ID',
  'RAKUTEN_REFERER',
  'URL'
];

export default {
  async fetch(request, env) {
    syncProcessEnv(env);

    const url = new URL(request.url);
    const result = await handler({
      httpMethod: request.method,
      headers: plainHeaders(request.headers),
      queryStringParameters: Object.fromEntries(url.searchParams.entries())
    });

    return new Response(result.body || '', {
      status: result.statusCode || 200,
      headers: result.headers || {}
    });
  }
};

function plainHeaders(headers) {
  const output = {};
  for (const [key, value] of headers.entries()) {
    output[key] = value;
  }
  return output;
}

function syncProcessEnv(env) {
  if (typeof process === 'undefined' || !process.env || !env) return;
  for (const key of ENV_KEYS) {
    if (env[key] !== undefined) {
      process.env[key] = String(env[key]);
    }
  }
  process.env.URL ||= 'https://kaz-mio.com';
  process.env.RAKUTEN_REFERER ||= 'https://kaz-mio.com';
}
