# YM-007 Recipe Hub Ver.1

## Scope

- Publishes `/recipes` (hub) and `/recipes/[slug]` (detail) as indexable pages.
- Populates the `RecipeRecord` collection that YM-002 introduced and left empty.
- Adds a bidirectional Product ↔ Recipe path without changing the existing purchase flow.
- Adds `/recipes` and the seven recipe detail URLs to the header, footer, current URL registry, and sitemap.
- Does **not** touch the legacy redirect manifest, robots policy, canonical host logic, or the seasonal pages.

## Design decision: B (small extension of the existing model)

YM-002 already shipped `RecipeRecord`, `RecipeIngredient`, `RecipeStep`, `MediaRole: 'recipe_step'`,
`Recipe.relatedProductIds` validation, and an empty `recipes` collection reserved for YM-007. No new
content model, CMS, or dependency was needed. The delta is:

| Change                                        | Reason                                                                     |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| `RecipeRecord.servings` required → optional   | Serving counts are not human-confirmed and must not be invented for SEO.   |
| `RecipeVariation` + `RecipeRecord.variations` | 「もうひとつの好きな食べ方」 is content that exists in Ver.1 (R2, R5, R6). |
| `RecipeColumn` + `RecipeRecord.column`        | R1's 石油ストーブ story is a lifestyle column, not a recommended method.   |
| `BaseClickPlacement: 'recipe_product'`        | Separates recipe-driven BASE clicks from article and product-card clicks.  |

`recipes` was an empty array literal in `data/content-model.ts`; it now comes from `data/recipes.ts`,
matching how `data/seasonal-products.ts` feeds the seasonal collection.

## Routes

```
/recipes            hub
/recipes/[slug]     detail (static params from published records only)
```

`status: 'draft'` records never reach the route, the hub, or the sitemap. A future static child route
such as `/recipes/ozoni-map` takes precedence over `[slug]` in Next.js, so the ご当地お雑煮マップ can
be added later without restructuring this route.

## Content rules

Every recipe is transcribed from what the family actually cooks. The following are deliberately absent:

- `servings`, `cookingTimeMinutes` — never confirmed, so never rendered and never published as schema.
- `allergens` — allergen and ingredient labelling stays on the product pages, which hold the source of truth.
- `mainImage` / `stepImages` — recipe photography does not exist yet.

Prices, BASE URLs, shipping copy, and product names are read from `data/catalog.ts` and `lib/shipping.ts`.
Nothing is duplicated into the recipe records.

## Image policy

Following YM-003B: when a recipe has no image, no image element and no placeholder container is
rendered. Adding `mainImage` later turns on the detail HERO, the card thumbnail, the page-specific OGP
image, and the Recipe structured data at once — no layout change required.

## Product ↔ Recipe

Relations are derived from `relatedProductIds` alone, so there is no second mapping table to keep in sync.

| Product        | Recipes shown on the product page             |
| -------------- | --------------------------------------------- |
| `plain`        | 山田家の磯辺焼き / お餅のおいしい焼き方       |
| `yomogi`       | 焼き草餅のぜんざい / お餅のおいしい焼き方     |
| `sansyokumame` | カリッと揚げ豆餅 / お餅のおいしい焼き方       |
| `kombu`        | 昆布餅のお雑煮風 / お餅のおいしい焼き方       |
| `tamari`       | たまり餅のバター黒胡椒 / お餅のおいしい焼き方 |
| `ebi`          | 海老餅の簡単チーズピザ / お餅のおいしい焼き方 |

`MAX_RECIPES_PER_PRODUCT = 2` caps the product page, and the section sits after 「おすすめの食べ方」 —
about 3,500px below the BASE purchase CTA on mobile — so the existing purchase flow is not interrupted.
A regression test asserts both the links and the cap.

## SEO and structured data

- Self-referencing canonical, page title, description, and OGP on the hub and every detail page.
- `BreadcrumbList` on both; `ItemList` of recipe titles on the hub.
- `Recipe` JSON-LD is emitted **only** when `mainImage` exists. Google requires `image` for recipe rich
  results, so publishing image-less `Recipe` markup would be ineligible markup rather than an asset.
- `prepTime`, `cookTime`, `totalTime`, `nutrition`, and `recipeYield` are never emitted. A test asserts
  their absence from every JSON-LD block on a recipe page.

## Legacy recipe URLs (unchanged, needs human decision)

`lib/legacy-url-inventory.ts` records 18 confirmed legacy recipe URLs — `/アレンジレシピ` plus its three
category pages, and 14 dated `/2020/…` and `/2021/…` article URLs — all with `disposition: 'defer'`.
YM-007 leaves every one of them deferred and changes no redirect. Until now there was no destination to
redirect them to; `/recipes` now exists, so the disposition can be revisited. That decision needs Search
Console data and human approval and is deliberately out of scope here.

## Future extension

- **Pillar B (SEO recipes)**: new records with the same shape; the hub already renders one titled section
  and can take a second without restructuring.
- **Pillar C (餅文化 / お雑煮マップ)**: a static route under `/recipes`, plus the existing
  `RecipeCategory` union if the content becomes recipe-shaped.
- **CMS**: `data/recipes.ts` is a plain typed array validated by `check:content-model`, so it can be
  replaced by a CMS fetch without touching the routes or components.

## Sticky purchase bar and client-side navigation

`StickyPurchaseBar` observes `[data-purchase-area]` so it hides instead of covering a purchase CTA.
Its `IntersectionObserver` used to be created once on mount (`[]` deps), so after a client-side route
transition it still watched the previous page's nodes and never saw the new page's CTA. It now
re-registers per `pathname`, resets the carried-over intersection state, disconnects on cleanup, and
accumulates intersecting targets in a `Set` (an `IntersectionObserver` callback only receives the
targets whose state changed, so `entries.some(...)` mis-read pages with more than one purchase area).

Every page must therefore keep marking its purchase areas with `data-purchase-area`; a regression test
pins both the per-page marker count and the per-route re-registration.

## Human review

- Confirm whether 揚げ豆餅 should carry an oil-splatter caution; no safety wording was invented.
- 「たまり餅自体に味がついているため無塩バターを推奨」 is **decided as not published**. R7 shows the
  「無塩バターをのせる」 step only; the reason sentence stays out. This is settled — do not restore it.
- Photograph the seven recipes so the HERO images, card thumbnails, and Recipe structured data can turn on.
- Decide the legacy `/アレンジレシピ` redirect disposition with Search Console data.

## Follow-up (not merge blockers)

- Recipe runtime validation (required fields, step ordering) beyond the current identity/relation checks.
- `ItemList.url` for Google recipe host carousels.
- A visible breadcrumb to match the existing `BreadcrumbList` markup.
- Legacy recipe redirects, recipe photography, and the 金継ぎ UI pass.
