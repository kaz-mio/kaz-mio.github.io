# GA4 event map for ad landing page

Updated: 2026-06-09

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
| `kazmio_route_click` | A homepage route or commerce shortcut is clicked | `page_slug`, `route_intent`, `link_url`, `link_text`, `placement`, `campaign` | Which homepage route pushes users into buying guides |
| `kazmio_route_select` | A user selects a concern in `mio_route_finder.html` | `route_key`, `route_title` | Which concern users bring to the route finder |
| `kazmio_route_result_click` | A user clicks a result link from the route finder | `route_key`, `route_rank`, `link_url`, `link_text` | Route finder to guide/tool/review movement |
| `kazmio_affiliate_click` | Any affiliate link is clicked | `page_slug`, `link_url`, `link_text`, `affiliate_network`, `affiliate_offer`, `affiliate_placement`, `campaign` | Sitewide affiliate click tracking |
| `kazmio_search_preset` | A preset is selected in `family_stay_search.html` | `search_group`, `preset_label`, `preset_extra` | See whether lodging or meal-condition presets are used |
| `leany_affiliate_click` | A LEANY affiliate link is clicked | `page_slug`, `link_url`, `link_text`, `affiliate_network`, `affiliate_offer`, `affiliate_placement`, `campaign` | LEANY article/guide/diagnosis click tracking |
| `fitness_wear_diagnosis` | The fitness wear diagnosis is run | `result_type` | Which self-care/wear concern is strongest |
| `fitness_wear_result_click` | A user clicks a result link from the fitness wear diagnosis | `result_type`, `link_url`, `link_text` | Diagnosis-to-article/offer movement |
| `toy_storage_type_prefill` | Toy storage diagnosis opens with `?type=...` | `result_type` | Which toy storage concern was prefilled |
| `toy_storage_diagnosis` | A user runs the toy storage type diagnosis | `result_type` | Which toy storage/cleanup concern is strongest |
| `toy_storage_result_click` | A user clicks a result link from the toy storage diagnosis | `result_type`, `link_url`, `link_text` | Diagnosis-to-guide/tool movement |

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
| Route intent | `route_intent` | Compare homepage route shortcuts |
| Route key | `route_key` | Compare morning, outing, room, car, size, selfcare needs |
| Route rank | `route_rank` | Check whether users choose the first, second, or third suggested page |
| Affiliate network | `affiliate_network` | Separate Moshimo, A8, Amazon, Rakuten |
| Affiliate offer | `affiliate_offer` | Compare LEANY and other offers |
| Affiliate placement | `affiliate_placement` | Compare banner, bottom CTA, diagnosis result |
| Campaign | `campaign` | Group related pages and X creatives |
| Search group | `search_group` | Separate lodging and meal-condition preset use |
| Preset label | `preset_label` | Compare which lodging or meal scenario is selected |

Moshimo EasyLink cards can inherit affiliate metadata from a parent wrapper. For example, the school prep cards use `affiliate_offer=skater-cup-bag` and `affiliate_offer=sanrio-loop-towel`, with `affiliate_placement=school_prep_checklist_small_goods` and `campaign=school_prep`.

The school prep name guide stamp card uses `affiliate_offer=shachihata-onamae-stamp-ga-ca`, `affiliate_placement=school_prep_name_stamp_section`, and `campaign=school_prep_name`.

The outing checklist stroller hook card uses `affiliate_offer=litta-glitta-stroller-hook`, `affiliate_placement=outing_checklist_stroller_goods`, and `campaign=outing_checklist`.

The outing checklist food cutter card uses `affiliate_offer=green-bell-baby-food-cutter-ba-003`, `affiliate_placement=outing_checklist_meal_goods`, and `campaign=outing_checklist`.

The outing checklist feeding spoon card uses `affiliate_offer=pigeon-feeding-spoon-capacity-up-r`, `affiliate_placement=outing_checklist_meal_goods`, and `campaign=outing_checklist`.

The outing checklist baby bib card uses `affiliate_offer=babybjorn-baby-bib-powder-pink`, `affiliate_placement=outing_checklist_meal_goods`, and `campaign=outing_checklist`.

The outing checklist straw mug card uses `affiliate_offer=richell-aqulea-outing-straw-mug-r-200`, `affiliate_placement=outing_checklist_meal_goods`, and `campaign=outing_checklist`.

The outing checklist training cup card uses `affiliate_offer=munchkin-miracle-cup-fdmu10801l`, `affiliate_placement=outing_checklist_meal_goods`, and `campaign=outing_checklist`.

The outing checklist tooth wipe card uses `affiliate_offer=pigeon-nyushi-care-tooth-wipes-42`, `affiliate_placement=outing_checklist_meal_goods`, and `campaign=outing_checklist`.

The outing checklist chair belt card uses `affiliate_offer=eightex-carryfree-chair-belt-01-069`, `affiliate_placement=outing_checklist_meal_goods`, and `campaign=outing_checklist`.

The car seat diagnosis protection mat card uses `affiliate_offer=rozally-car-seat-mat`, `affiliate_placement=car_seat_fit_check_protection_mat`, and `campaign=car_seat_fit_check`.

The Digista WebAR event guide banner uses `affiliate_offer=digista-card`, `affiliate_placement=digista_event_guide_banner`, and `campaign=digista_event_card`.

The baby room safety guide gate card uses `affiliate_offer=nihonikuji-okudake-tosenbo-smart-wide`, `affiliate_placement=baby_room_safety_gate_section`, and `campaign=baby_room_safety`.

The baby room safety guide child lock card uses `affiliate_offer=joy-space-child-lock-2803-6`, `affiliate_placement=baby_room_safety_drawer_lock_section`, and `campaign=baby_room_safety`.

The baby room safety guide outlet cover card uses `affiliate_offer=richell-outlet-full-cover-r`, `affiliate_placement=baby_room_safety_outlet_cover_section`, and `campaign=baby_room_safety`.

The baby room safety guide corner guard card uses `affiliate_offer=plaisiureux-corner-guard-6m-pl01`, `affiliate_placement=baby_room_safety_corner_guard_section`, and `campaign=baby_room_safety`.

The baby room safety guide TV belt card uses `affiliate_offer=sanwa-direct-tv-tip-belt-100-pl023`, `affiliate_placement=baby_room_safety_tv_belt_section`, and `campaign=baby_room_safety`.

The toy storage guide rack card uses `affiliate_offer=iris-toy-house-rack-tkthr-39r`, `affiliate_placement=toy_storage_guide_main_card`, and `campaign=toy_storage`.

The toy storage guide book rack card uses `affiliate_offer=smart-i-suucu-picture-book-rack`, `affiliate_placement=toy_storage_guide_book_rack_section`, and `campaign=toy_storage`.

The toy storage guide drawer chest card uses `affiliate_offer=iris-wide-chest-w-543`, `affiliate_placement=toy_storage_guide_drawer_chest_section`, and `campaign=toy_storage`.

The toy storage guide flap box card uses `affiliate_offer=tenma-kabaco-l-flap-storage-box`, `affiliate_placement=toy_storage_guide_flap_box_section`, and `campaign=toy_storage`.

The toy storage guide under-box rack card uses `affiliate_offer=yamazaki-tower-storage-box-under-rack-5567`, `affiliate_placement=toy_storage_guide_under_box_rack_section`, and `campaign=toy_storage`.

The toy storage guide label writer card uses `affiliate_offer=kingjim-tepra-lite-lr30-label-writer`, `affiliate_placement=toy_storage_guide_label_section`, and `campaign=toy_storage`.

The outing checklist Meiji Hohoemi Raku Raku Milk attachment card uses `affiliate_offer=meiji-hohoemi-rakuraku-milk-attachment-240`, `affiliate_placement=outing_checklist_meal_goods`, and `campaign=outing_checklist`.

The outing checklist ChuChu paper pack nipple card uses `affiliate_offer=chuchu-paper-pack-nipple-3set`, `affiliate_placement=outing_checklist_meal_goods`, and `campaign=outing_checklist`.

The outing checklist ChuChu outing sterilization case card uses `affiliate_offer=chuchu-outing-sterilization-case`, `affiliate_placement=outing_checklist_meal_goods`, and `campaign=outing_checklist`.

## Key event candidates

Start with these as key events in GA4:

| Priority | Event | Reason |
| --- | --- | --- |
| 1 | `buy_before_diagnosis` | This is the main meaningful action before product navigation |
| 2 | `buy_before_result_click` | Shows the user moved from diagnosis to deeper checking |
| 3 | `ad_lp_cta_click` | Useful for landing-page A/B decisions |
| 4 | `kazmio_route_result_click` | Shows users moved from broad homepage intent to a deeper guide/tool/review |
| 5 | `leany_affiliate_click` | Shows LEANY offer intent from article, guide, and diagnosis |
| 6 | `fitness_wear_diagnosis` | Shows engagement with the new self-care funnel |
| 7 | `toy_storage_diagnosis` | Shows engagement with the new toy storage funnel |

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
