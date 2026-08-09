# YM-002 Content Model Foundation

Updated: 2026-08-09 (Asia/Tokyo)

## Scope

YM-002 adds a typed, validated content foundation for products, gift sets, seasonal products,
recipes, sales channels, media, availability, and SEO. It does not publish seasonal or recipe
routes and does not change the current page design.

## Existing data audit

The current display contract lives in `data/catalog.ts`:

- `products`: six product records (`plain`, `yomogi`, `sansyokumame`, `kombu`, `tamari`, `ebi`).
- `catalogSets`: three gift records (`six-flavor-gift`, `choice-six-set`, `twelve-set`).
- `app/products/page.tsx`, `app/products/[slug]/page.tsx`, `components/ProductCard.tsx`, and
  `app/gift/page.tsx` read display strings and BASE URLs directly.
- `app/page.tsx`, FAQ/news data, and purchase CTA components use `sixFlavorGift`.
- `lib/seo.ts` converts the legacy price display string back to a number for Product/Offer JSON-LD.
- `scripts/check-catalog.mjs` protects nine catalog entries, BASE URLs, and the official six-flavor
  gift specification.

The six products already contain names, slugs, rich descriptions, ingredients, allergen display
text, shelf life, storage, shipping, images, related slugs, prices, and BASE URLs. The three gifts
contain names, contents, packaging, allergen display text, shelf life, storage, shipping, prices,
images, and BASE URLs.

## Problems found

- Price, currency, and tax status are combined in strings such as `440円（税込）`.
- Commerce availability, live inventory, and content publication are not separated.
- Sales periods and manually controlled availability do not exist.
- Sales locations/channels are embedded in links rather than referenced by stable IDs.
- Image role, focal point, credit, and source type are not modeled.
- Product SEO exists, but OG image and canonical path are not part of a reusable content type.
- Gift composition is prose rather than product references.
- Timestamps and food-label details cannot be safely inferred from the current source.

## Model files

- `types/content-model.ts`: shared domain types.
- `data/content-model.ts`: lossless migration and compatibility projections for six products and
  three gift sets; empty unpublished collections for seasonal products and recipes.
- `data/sales-channels.ts`: shared channel registry.
- `lib/content-model/validate.ts`: dependency-free runtime validation.
- `scripts/check-content-model.mjs`: catalog gate integration.

## Required and optional policy

Current published products and gifts require their confirmed display and commerce fields. Unknown
future or operational facts remain optional or use `unknown`; they must not be filled from an
assumption.

Examples that remain unknown in YM-002:

- real-time stock and current availability;
- original `publishedAt` and `updatedAt` timestamps;
- normalized allergen item lists beyond the existing display text;
- image credit, rights, and source type;
- seasonal product price, exact dates, locations, shipping, and commerce eligibility;
- recipe content and authorship.

## ID and slug rules

- IDs and slugs must be non-empty and unique within their collection.
- Existing product and gift IDs equal their stable existing slugs to preserve relationships.
- Relations use IDs, never names or array positions.
- New public slugs must be lowercase URL-safe identifiers and require human approval before
  publication.
- A title or display name change must not silently change an existing ID or slug.

## Product model

`ProductRecord` separates reusable domain data from the legacy UI projection:

- identity: `id`, `slug`, `name`, `shortName`, `category`;
- content: `description`, `story`, content amount, ingredients, allergens, shelf life, storage,
  shipping;
- commerce: numeric `price`, commerce record, channel IDs, gift eligibility, availability;
- relationships: `relatedProductIds`;
- assets and discovery: `images`, `seo`;
- lifecycle: publication status and optional timestamps;
- `compatibility`: current card/detail presentation fields required for a lossless UI projection.

All six existing products are migrated. Availability is intentionally `unknown`: a working BASE
link proves a commerce destination, not live inventory.

## GiftSet model

Gift sets use a separate `GiftSetRecord` because composition and packaging differ from a single
product. Each set references all six existing product IDs:

- six-flavor gift: quantity 1 for each product;
- choice-six set: eligible products are referenced, but quantity per product is unspecified because
  the customer chooses the combination;
- twelve set: quantity 2 for each product, as stated by existing content.

This preserves the current three gift display records while making composition resolvable.

## SeasonalProduct model

`SeasonalProductRecord` supports the planned product names without publishing records in YM-002.
It separates:

- `salesPeriod`: human-readable display plus optional month/day boundaries;
- `availabilityStatus`: `unknown`, `upcoming`, `available`, `sold_out`, or `ended`;
- content, food information, sales channels, commerce, gifts, media, SEO, and publication status.

Dates never switch availability automatically. Staff or a future controlled workflow must update
availability explicitly. The six named candidates are not entered yet because their slugs, prices,
food information, locations, commerce eligibility, and images require human review.

## Recipe model

`RecipeRecord` is ready for YM-007 and future Recipe JSON-LD conversion. It includes structured
ingredients and ordered steps, serving and time fields, product ID relations, media, author and
dates, notes, allergens, storage notes, SEO, and publication status. `recipes` remains empty, so no
route or sitemap entry is published.

## SalesChannel model

Products reference channel IDs. The registry includes:

- `jinya-morning-market`
- `base`
- `furusato-tax`
- `retail-store`
- `chilled-shipping`
- `frozen-shipping`
- `other`

Only BASE has a confirmed URL and `active: true`. Omitted `active` means unverified, not inactive.
Existing products and gifts reference only BASE because other per-item availability is not proven by
the current catalog.

## MediaAsset model

Every asset has `src`, `alt`, and `role`. Focal point, credit, and source type are optional until
verified. `sourceType` supports `original_photo`, `generated`, `edited`, and `provided`; YM-002 does
not classify existing images without evidence.

## SEO model

The common model provides title, description, optional OG image, and optional canonical path.
Existing page metadata generation remains unchanged. Product records receive their existing title
and description plus the current canonical path, making a later metadata adapter possible without a
YM-002 page rewrite.

## Price model

Legacy display text is parsed losslessly into:

```ts
{
  amount: 440,
  currency: 'JPY',
  taxIncluded: true,
  display: '440円（税込）'
}
```

During the YM-002 migration, the legacy catalog remains the current source of truth. `price.amount`
is derived by parsing the reviewed `price.display` value. The original `display` value remains the
UI contract, while `amount`, `currency`, and `taxIncluded` support validation and structured data.
YM-002 does not reformat visible prices.

When the normalized Content Model becomes the source of truth, `price.amount` should become the
machine-readable price source and `display` should normally be generated from it. That source-of-
truth switch and visible-price generation are intentionally not implemented in YM-002.

## Migration and backward compatibility

`migrateLegacyProduct` and `migrateLegacyGiftSet` create normalized records from the reviewed
catalog. `toLegacyProduct` and `toLegacyGiftSet` project those normalized records back to the exact
current UI shape. Automated deep equality checks guard the projection.

This staged approach avoids a high-risk page rewrite. The migration path is:

1. **Stage 1 — YM-002 Foundation:** keep `data/catalog.ts` as the source of truth and validate the
   normalized projection and reverse adapters.
2. **Stage 2 — New content:** start reviewed SeasonalProduct and other new content directly in the
   normalized model without migrating existing UI consumers.
3. **Stage 3 — Product consumers:** migrate existing product consumers one at a time to normalized
   records or compatibility projections, with render regression checks at each step.
4. **Stage 4 — SEO:** move Product JSON-LD and metadata price usage to `Money.amount` after consumer
   compatibility is proven.
5. **Stage 5 — Adapter reduction:** reduce legacy adapter dependencies only after every consumer and
   protected output has been independently verified.

Protected behavior:

- product list and six detail routes;
- gift page and three gift records;
- TOP/FAQ/news references to the official gift;
- names, prices, content amounts, descriptions, images, and BASE URLs;
- Product/Offer JSON-LD numeric prices.

## Validation rules

The validator rejects:

- duplicate or missing IDs and slugs;
- missing product/gift names;
- negative price amounts and non-JPY currency;
- invalid or non-HTTPS commerce/channel URLs;
- unknown or duplicate sales channel references;
- unknown or duplicate related product IDs;
- gift items that reference unknown products or invalid quantities;
- invalid availability statuses.
- month boundaries outside 1–12 and day boundaries outside 1–31 in sales periods;
- missing sales channel names.

Sales period boundaries are optional. Display-only and partial periods are valid, and cross-year
periods such as November through February are deliberately accepted. Sales periods never compute
or mutate availability automatically.

No validation framework dependency was added.

## Known limitations

1. `Recipe.relatedProductIds` currently resolves only `ProductRecord` IDs. If recipes need to
   reference `SeasonalProductRecord`, extend the relation deliberately in YM-007.
2. `SalesChannel` currently combines sales locations/channels with some fulfillment or shipping
   concepts. This is acceptable for the current dataset; a future model may separate
   `SalesChannel` from `FulfillmentMethod` or `ShippingMethod`.
3. `choice-six-set` is customer-selected rather than a fixed composition, so quantities are not
   inferred. Before using gift composition for structured data, consider explicit `fixed` and
   `choice` composition semantics.

## Connections to later batches

- YM-003 can add reviewed seasonal records and pages without changing the model.
- YM-007 can populate recipes, map related product IDs, and generate Recipe JSON-LD.
- Future AI/staff workflows can validate data before proposing a commit.
- Real-time BASE inventory, CMS integration, automatic date-driven availability, and Search Console
  operations are explicitly outside YM-002.
