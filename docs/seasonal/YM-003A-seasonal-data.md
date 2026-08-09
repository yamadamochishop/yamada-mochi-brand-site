# YM-003A Seasonal Data Foundation

Updated: 2026-08-09 (Asia/Tokyo)

## Scope and publication boundary

YM-003A structures the human-confirmed annual product calendar. It adds no route, component,
navigation, metadata, sitemap entry, image, or public content. All ten records are `draft`; data
presence does not mean page publication. YM-003B must perform a separate human review before any
record is rendered.

## Human-confirmed dataset

| ID / slug            | Product                  | Category | Period       | Availability | Commerce    |
| -------------------- | ------------------------ | -------- | ------------ | ------------ | ----------- |
| `umezuke`            | 梅漬け                   | pickles  | 通年         | available    | unavailable |
| `akakabu-maruzuke`   | 赤かぶの漬物 丸漬け      | pickles  | 通年         | available    | unavailable |
| `takuan`             | たくあん                 | pickles  | 1月〜3月     | unknown      | unavailable |
| `akakabu-nagazuke`   | 赤かぶの漬物 長漬け      | pickles  | 4月〜11月    | available    | unavailable |
| `konasu-pickles`     | 小茄子の漬物             | pickles  | 7月〜10月    | available    | unavailable |
| `hida-apple-pie`     | 飛騨リンゴのアップルパイ | pie      | 9月〜5月     | unknown      | preparing   |
| `hida-peach-pie`     | 飛騨桃パイ               | pie      | 8月          | available    | unavailable |
| `strawberry-daifuku` | 苺大福                   | wagashi  | 2月〜4月     | unknown      | unavailable |
| `shin-yomogi-mochi`  | 新草餅                   | mochi    | 5月〜6月     | unknown      | available   |
| `ao-hoba-mochi`      | 青朴葉餅                 | mochi    | 7月〜8月中旬 | available    | unavailable |

All ten products reference the physical `jinya-morning-market` location. Exact address data is not
invented. Notes preserve the confirmed inventory-dependent end conditions and the current
`まもなく終了` status for 青朴葉餅.

## Explicit exclusions

- 飛騨牛ミートパイ and つぶあんパイ are planned and are not records in YM-003A.
- Other fruit daifuku, including シャインマスカット大福, are not confirmed and are excluded.
- `その他の餅` is not a product. It means the six existing catalog records: `plain`, `yomogi`,
  `sansyokumame`, `kombu`, `tamari`, and `ebi`.
- No recipe records are added.

## Classification and seasonality

Records use semantic product categories (`mochi`, `pie`, `wagashi`, `pickles`) rather than treating
everything on the annual page as a SeasonalProduct category. `seasonality` independently identifies
`year_round` and `seasonal` records. Year-round records must not carry start/end month boundaries.
The `/seasonal` view can therefore aggregate existing Product and new SeasonalProduct data without
turning the seasonal collection into a duplicate product database.

## Physical locations and online channels

`SalesLocation` is a separate registry from `SalesChannel`. Seasonal records reference the physical
陣屋前朝市 via `salesLocationIds`; online offers reference `base`, `tabechoku`, or `pokemaru` via
commerce `channelId`. This does not expand the old YM-002 SalesChannel/fulfillment mixture and gives
future work a clean boundary to migrate toward.

## Commerce and CTA rules

Overall seasonal commerce status is one of `available`, `unavailable`, `preparing`, or `undecided`.
Channel offers have their own `confirmed`, `preparing`, or `undecided` status.

- `available` requires at least one confirmed offer, but a confirmed offer does not require a URL.
- A purchase CTA can be generated only for a confirmed offer with an explicit HTTPS URL.
- `unavailable` cannot contain offers.
- Non-confirmed offers cannot carry CTA URLs.
- 飛騨リンゴのアップルパイ is commerce `preparing` with no channel or fabricated URL.
- 新草餅 has confirmed BASE (individual product), 食べチョク (4袋セット), and ポケマル
  (4袋セット) offers. No per-product URL was provided, so all three intentionally have no URL and
  generate no CTA.

## Availability semantics

`salesPeriod` describes the expected calendar window. `availabilityStatus` is a human-managed fact;
the calendar never changes it based on the current month. Human-confirmed `available` records are
梅漬け、赤かぶの漬物 丸漬け、赤かぶの漬物 長漬け、小茄子の漬物、飛騨桃パイ、青朴葉餅,
plus the six existing product calendar references. たくあん、飛騨リンゴのアップルパイ、苺大福、
新草餅 remain `unknown`.

## Calendar aggregation

`getSeasonalProductsForMonth(month)` returns separate `yearRound` and `seasonal` groups for months
1–12. It supports cross-year ranges; the apple pie appears from September through May. Invalid
months throw. Display-only or incomplete historical periods remain valid data but are not included
in month aggregation until both month boundaries are confirmed.

The year-round group combines two new year-round pickle records with references to the existing six
products. No existing catalog product is copied, renamed, or mutated.

## New grass mochi replacement

`shin-yomogi-mochi` (新草餅) and the existing `yomogi` (草餅) are different products. An explicit,
validated view rule suppresses the existing `yomogi` reference in May and June while the new record
appears in the seasonal group. In July and all other non-replacement months, `yomogi` returns and
新草餅 is absent. The rule affects only calendar presentation and never alters either source record.

## Slug and publication policy

The ten reviewed candidate slugs are stored as stable draft IDs/slugs. They are not connected to
`generateStaticParams`, routing, canonical metadata, or sitemap generation. Human approval is still
required before the public URL contract is created.

## Image policy

Every record intentionally has `images: []`. No placeholder, legacy product image, generated image,
or unconfirmed URL is used. Future assets must use `MediaAsset` and record role, alt text,
`sourceType`, optional focal point, and credit after provenance and rights are confirmed.

## Validation rules

Runtime validation rejects duplicate seasonal IDs/slugs, invalid product categories or seasonality,
invalid month/day boundaries, month boundaries on year-round records, unknown or duplicate physical
location references, unknown/duplicate online offer channels, invalid commerce/offer states,
non-HTTPS CTA URLs, invalid CTA/status combinations, broken calendar product references, broken
replacement references, and invalid/duplicate replacement months. Empty images, prices, and food
detail fields remain valid because those facts are not yet human-confirmed.

## Missing human data

The following are unknown for all ten products unless noted otherwise: price, ingredients,
allergens, shelf life, storage, shipping, story, commitment, gift eligibility, photos and image
rights, SEO copy, and publication dates.

Product-specific missing decisions:

- 梅漬け / 赤かぶ丸漬け: the common missing food, price, content, and image fields above.
- たくあん: current availability plus all common missing fields.
- 赤かぶ長漬け / 小茄子: exact sell-out date plus all common missing fields.
- 飛騨リンゴのアップルパイ: current availability, exact seasonal dates, target online channel,
  launch date, product URL, and all common missing fields.
- 飛騨桃パイ: exact August end date plus all common missing fields.
- 苺大福: current availability, exact strawberry-dependent end date, and all common missing fields.
- 新草餅: current availability, three product URLs, exact BASE package description beyond
  `個別商品`, and all common missing fields.
- 青朴葉餅: human update from `available` to `ended` when sales finish, exact end date, and all common
  missing fields.

## Backward compatibility

The six existing Product records, three GiftSet records, prices, BASE URLs, compatibility
projections, Product JSON-LD, pages, sitemap, redirects, and robots behavior are unchanged. The
legacy catalog remains the current source of truth for existing UI. Seasonal records are draft data
only, and recipes remain empty.

## Next step

Run an independent review of YM-003A data truth, model boundaries, validation, mutation coverage,
and backward compatibility. Do not begin YM-003B until the dataset, slugs, labels, availability,
and missing-data inventory receive human approval.
