# GA4 event map for ad landing page

Updated: 2026-06-06

## Purpose

This map keeps the ad landing page, GA4 events, and Google Ads UTM values aligned.

Main flow:

1. Search ad click
2. `buy_before_diagnosis_lp.html`
3. CTA click to `buy_before_check.html`
4. Diagnosis result
5. Result link click to a deeper tool or guide

## Event names

| Event name | Fires when | Main parameters | Use |
| --- | --- | --- | --- |
| `ad_lp_view` | The ad LP loads | `lp_slug`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid` | LP traffic quality by campaign and keyword |
| `ad_lp_cta_click` | A user clicks a CTA on the ad LP | `lp_slug`, `cta_id`, `target_url`, `link_text`, `result_type`, UTM values | Which CTA or concern moves people into diagnosis |
| `buy_before_type_prefill` | Diagnosis opens with `?type=...` | `result_type` | Which ad concern prefilled the diagnosis |
| `buy_before_diagnosis` | A user runs the 5-question diagnosis | `result_type` | Primary diagnosis completion event |
| `buy_before_result_click` | A user clicks a result link after diagnosis | `result_type`, `link_url`, `link_text` | Result-to-tool movement |
| `kazmio_tool_start` | Any tool/check page receives first input/click | `tool_slug`, `tool_label` | Tool engagement |
| `kazmio_tool_action` | Any tool/check page button or link is clicked | `tool_slug`, `tool_label`, `action_type`, `action_label`, `action_id`, `link_url` | Tool action detail |
| `kazmio_affiliate_click` | Any affiliate link is clicked | `page_slug`, `link_url`, `link_text`, `affiliate_network`, `affiliate_offer`, `affiliate_placement`, `campaign` | Sitewide affiliate click tracking |
| `leany_affiliate_click` | A LEANY affiliate link is clicked | `page_slug`, `link_url`, `link_text`, `affiliate_network`, `affiliate_offer`, `affiliate_placement`, `campaign` | LEANY article/guide/diagnosis click tracking |
| `fitness_wear_diagnosis` | The fitness wear diagnosis is run | `result_type` | Which self-care/wear concern is strongest |
| `fitness_wear_result_click` | A user clicks a result link from the fitness wear diagnosis | `result_type`, `link_url`, `link_text` | Diagnosis-to-article/offer movement |

## Recommended GA4 custom dimensions

Create these as event-scoped custom dimensions after the GA4 tag is active and events arrive.

| Dimension name | Event parameter | Why |
| --- | --- | --- |
| LP slug | `lp_slug` | Separate ad LP behavior from organic pages |
| CTA ID | `cta_id` | Compare hero, type, route, and bottom CTAs |
| Result type | `result_type` | See which concern is strongest: entrance, car, room, stock, season |
| Tool slug | `tool_slug` | See which tools get real engagement |
| Action label | `action_label` | Check which tool buttons are used |
| Link URL | `link_url` | See which next page users choose |
| Affiliate network | `affiliate_network` | Separate Moshimo, A8, Amazon, Rakuten |
| Affiliate offer | `affiliate_offer` | Compare LEANY and other offers |
| Affiliate placement | `affiliate_placement` | Compare banner, bottom CTA, diagnosis result |
| Campaign | `campaign` | Group related pages and X creatives |

## Key event candidates

Start with these as key events in GA4:

| Priority | Event | Reason |
| --- | --- | --- |
| 1 | `buy_before_diagnosis` | This is the main meaningful action before product navigation |
| 2 | `buy_before_result_click` | Shows the user moved from diagnosis to deeper checking |
| 3 | `ad_lp_cta_click` | Useful for landing-page A/B decisions |
| 4 | `leany_affiliate_click` | Shows LEANY offer intent from article, guide, and diagnosis |
| 5 | `fitness_wear_diagnosis` | Shows engagement with the new self-care funnel |

## Google Ads UTM template

Use the LP as the ad final URL:

```text
https://kaz-mio.github.io/buy_before_diagnosis_lp.html
```

Use this tracking template or final URL suffix:

```text
utm_source=google&utm_medium=cpc&utm_campaign=buy_before_diagnosis&utm_term={keyword}&utm_content={creative}_{matchtype}
```

Ad group content labels:

| Ad group | Suggested `utm_content` base | Landing angle |
| --- | --- | --- |
| Stroller entrance | `stroller_entrance` | ベビーカーが玄関や車に入るか |
| Car seat stress | `carseat_stress` | 毎日の乗せ降ろしが大変 |
| Baby circle room | `baby_circle_room` | リビングが狭くなる不安 |
| Diaper stock | `diaper_stock` | おむつ買い置きの失敗 |
| Kids size season | `kids_size_season` | 子ども服と靴のサイズアウト |

## Reading rule

Do not judge ads by clicks alone.

Good early signs:

- `ad_lp_cta_click / ad_lp_view` is high
- `buy_before_diagnosis / ad_lp_view` is high
- `buy_before_result_click / buy_before_diagnosis` is high

Weak signs:

- LP clicks happen, but diagnosis does not run
- One ad group gets clicks, but only shallow pageviews
- Result type is concentrated in one concern, but ads are spread across all concerns

When budget is small, move money toward the concern with the clearest `buy_before_diagnosis` and `buy_before_result_click` path.
