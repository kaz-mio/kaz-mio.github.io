# Cloudflare Worker: family-trip-search

This Worker is the Cloudflare entry point for the existing `netlify/functions/family-trip-search.js` search backend.

Production URL:

- `https://kaz-mio-family-trip-search.oqdsfy.workers.dev`

## Required secrets

Set these in Cloudflare Workers before deploying:

- `RAKUTEN_APP_ID`
- `RAKUTEN_ACCESS_KEY`
- `RAKUTEN_AFFILIATE_ID`

Optional provider secrets:

- `JALAN_API_KEY`
- `HOTPEPPER_API_KEY`
- `GOOGLE_PLACES_API_KEY`

## Deploy notes

Use `workers.dev`. Do not move `kaz-mio.com` DNS or GitHub Pages hosting for this migration.

`family_stay_search.html` should call the Worker URL first and keep the Netlify endpoint as fallback until the migration is stable.
