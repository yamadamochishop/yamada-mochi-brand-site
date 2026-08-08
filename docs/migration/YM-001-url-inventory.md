# YM-001 URL inventory and redirect register

Inventory date: 2026-08-08 (Asia/Tokyo)

The current inventory is calculated from App Router page files, `data/catalog.ts`,
and the sitemap implementation. Every current page is intended to be indexable
on the production host when `NEXT_PUBLIC_SITE_INDEXABLE=true` is set.

## Current URL inventory

| Current URL              | Route source                             | Indexable?              | Canonical | Sitemap? | Primary purpose                               |
| ------------------------ | ---------------------------------------- | ----------------------- | --------- | -------- | --------------------------------------------- |
| `/`                      | `app/page.tsx`                           | Yes (production opt-in) | Self      | Yes      | Brand and purchase entry point                |
| `/products`              | `app/products/page.tsx`                  | Yes (production opt-in) | Self      | Yes      | Current product index                         |
| `/products/plain`        | `app/products/[slug]/page.tsx` + catalog | Yes (production opt-in) | Self      | Yes      | Plain mochi detail and purchase               |
| `/products/yomogi`       | `app/products/[slug]/page.tsx` + catalog | Yes (production opt-in) | Self      | Yes      | Yomogi mochi detail and purchase              |
| `/products/sansyokumame` | `app/products/[slug]/page.tsx` + catalog | Yes (production opt-in) | Self      | Yes      | Sanshoku-mame mochi detail and purchase       |
| `/products/kombu`        | `app/products/[slug]/page.tsx` + catalog | Yes (production opt-in) | Self      | Yes      | Kombu mochi detail and purchase               |
| `/products/tamari`       | `app/products/[slug]/page.tsx` + catalog | Yes (production opt-in) | Self      | Yes      | Tamari mochi detail and purchase              |
| `/products/ebi`          | `app/products/[slug]/page.tsx` + catalog | Yes (production opt-in) | Self      | Yes      | Black-sesame shrimp mochi detail and purchase |
| `/gift`                  | `app/gift/page.tsx`                      | Yes (production opt-in) | Self      | Yes      | Gift selection and purchase                   |
| `/brand-story`           | `app/brand-story/page.tsx`               | Yes (production opt-in) | Self      | Yes      | Brand story                                   |
| `/craft`                 | `app/craft/page.tsx`                     | Yes (production opt-in) | Self      | Yes      | Materials and production approach             |
| `/third-generation`      | `app/third-generation/page.tsx`          | Yes (production opt-in) | Self      | Yes      | Third-generation owner story                  |
| `/market`                | `app/market/page.tsx`                    | Yes (production opt-in) | Self      | Yes      | Jinya-mae morning market information          |
| `/faq`                   | `app/faq/page.tsx`                       | Yes (production opt-in) | Self      | Yes      | Customer questions                            |
| `/contact`               | `app/contact/page.tsx`                   | Yes (production opt-in) | Self      | Yes      | Contact entry point                           |
| `/voices`                | `app/voices/page.tsx`                    | Yes (production opt-in) | Self      | Yes      | Customer voices                               |
| `/news`                  | `app/news/page.tsx`                      | Yes (production opt-in) | Self      | Yes      | Announcements                                 |

`lib/current-urls.ts` is now the sitemap's route source, while the regression
test keeps an independent 17-URL contract so accidental route, catalog, or sitemap
loss is detectable. Product detail URLs in the sitemap continue to derive from the
existing catalog.

## Legacy inventory evidence policy

`lib/legacy-url-inventory.ts` separates `confirmed` and `unverified` entries at the
data-structure level. A URL is confirmed only when an Internet Archive CDX record,
an old-page link target, repository material, or equivalent direct evidence exists.
A title and date alone are not enough to construct a path.

Repository history, docs, and README contained no historical sitemap export. The
primary evidence is the Internet Archive CDX index queried on 2026-08-08. The CDX
timestamps below identify archived HTTP 200 records.

## Confirmed legacy URLs

| Confirmed legacy URL                            | Evidence                        | YM-001 decision                    |
| ----------------------------------------------- | ------------------------------- | ---------------------------------- |
| `/商品紹介/`                                    | CDX `20240225155000`, HTTP 200  | 301 to `/products`                 |
| `/お問い合わせ/`                                | CDX `20240225151300`, HTTP 200  | 301 to `/contact`                  |
| `/アレンジレシピ/`                              | CDX `20240225163707`, HTTP 200  | Defer to recipe migration          |
| `/アレンジレシピ/餅のアレンジレシピ/`           | CDX `20240225143849`, HTTP 200  | Defer                              |
| `/アレンジレシピ/漬物のアレンジレシピ/`         | CDX `20240225135752`, HTTP 200  | Defer                              |
| `/アレンジレシピ/お米-米粉のアレンジレシピ/`    | CDX `20240225153146`, HTTP 200  | Defer                              |
| `/通販-https-yamadamochi-thebase-in/`           | CDX `20240225143515`, HTTP 200  | Defer; external destination review |
| `/2020/06/05/カプレーゼ餅/`                     | CDX `20240225152052`, HTTP 200  | Defer                              |
| `/2020/06/05/ゴルゴンゾーラ餅/`                 | CDX `20240225160959`, HTTP 200  | Defer                              |
| `/2020/06/11/ピザ餅/`                           | CDX `20240225150436`, HTTP 200  | Defer                              |
| `/2020/06/11/明太子マヨ餅/`                     | CDX `20240225161938`, HTTP 200  | Defer                              |
| `/2020/06/11/草もちあんこバター/`               | CDX `20240225140111`, HTTP 200  | Defer                              |
| `/2020/06/11/餅アヒージョ/`                     | CDX `20240225153847`, HTTP 200  | Defer                              |
| `/2020/09/23/ガーリックバター餅/`               | CDX `20240225162343`, HTTP 200  | Defer                              |
| `/2020/09/23/漬物ステーキ/`                     | CDX `20240225162302`, HTTP 200  | Defer                              |
| `/2020/10/09/たくあんクリームチーズ/`           | CDX `20240225161653`, HTTP 200  | Defer                              |
| `/2020/10/09/米粉どらやき/`                     | CDX `20240225151343`, HTTP 200  | Defer                              |
| `/2021/01/05/もち玄米トマトリゾット風/`         | CDX `20240225162224`, HTTP 200  | Defer                              |
| `/2021/01/10/もち玄米の豆乳クリームリゾット風/` | CDX `20240225162423`, HTTP 200  | Defer                              |
| `/2021/03/05/チーズゴマ海老餅/`                 | CDX `20240225150835`, HTTP 200  | Defer                              |
| `/2021/08/20/もち玄米チーズリゾット風/`         | CDX `20240225153539`, HTTP 200  | Defer                              |
| `/about/`                                       | CDX `20240225151509`, HTTP 200  | Defer                              |
| `/j/privacy`                                    | Former Jimdo footer link target | Defer                              |
| `/sitemap/`                                     | CDX `20240416082319`, HTTP 200  | Defer                              |

Confirmed: **24**. Implemented redirects: **2**. Deferred confirmed URLs: **22**.

## Unverified legacy URLs

No candidates remain in the current investigation set. Unverified: **0**.

Any future title-only candidate must be placed in `unverifiedLegacyUrls` until
direct evidence is captured. Before YM-007, export Search Console URL performance
and obtain any Jimdo URL export or backup to discover URLs absent from public archives.

## Executable redirect manifest

The authoritative implementation is `lib/legacy-redirects.ts`.

| Legacy URL       | Destination | HTTP | Reason                                        | Confidence |
| ---------------- | ----------- | ---: | --------------------------------------------- | ---------- |
| `/商品紹介/`     | `/products` |  301 | Former product index to current product index | High       |
| `/お問い合わせ/` | `/contact`  |  301 | Former contact page to current contact page   | High       |

Middleware accepts encoded or decoded Japanese paths and either trailing-slash
form, preserves the query string, and emits one 301 response. It does not redirect
deferred URLs. Next.js automatic trailing-slash redirects are disabled so middleware
can send legacy paths directly to their destination; non-legacy trailing-slash paths
are normalized to their canonical no-slash form with one 301 response.

## Production domain architecture

Read-only production HTTP checks on 2026-08-08 established this ownership:

- Vercel Domain Redirect owns clean `https://yamadamochi.com/*` to
  `https://www.yamadamochi.com/*` with one HTTP 308.
- The application owns confirmed legacy-path and trailing-slash redirects after the
  request reaches the canonical `www` domain.
- Middleware does not add a clean-apex redirect. Its pure URL builder only coalesces
  host/protocol normalization as defense in depth when an application redirect is
  already required and an apex request reaches it outside normal Vercel routing.
- Vercel currently handles `http://yamadamochi.com/*` as HTTP-to-HTTPS and then
  apex-to-www, producing two edge hops. The application cannot combine redirects
  that occur before middleware.

### Read-only production HTTP evidence

| Request                                | First response | Hop count | Final URL                              | Final status |
| -------------------------------------- | -------------: | --------: | -------------------------------------- | -----------: |
| `https://yamadamochi.com/`             |            308 |         1 | `https://www.yamadamochi.com/`         |          200 |
| `https://yamadamochi.com/products`     |            308 |         1 | `https://www.yamadamochi.com/products` |          200 |
| `https://www.yamadamochi.com/`         |            200 |         0 | Same                                   |          200 |
| `https://www.yamadamochi.com/products` |            200 |         0 | Same                                   |          200 |
| `http://yamadamochi.com/products`      |            308 |         2 | `https://www.yamadamochi.com/products` |          200 |

The uncommitted YM-001 redirects are not deployed. Production legacy checks still
end in 404 after the existing edge/trailing-slash redirects, as expected before the
future PR is deployed. Preview verification requires PR and remains a human review
step; no preview was created during YM-001 Review Fix.

## Known minor limitation

Next.js normalizes duplicate slashes before middleware. A malformed path such as
`/商品紹介//` therefore uses a framework 308 before the application 301. Real former
URLs and their normal single-trailing-slash forms remain one hop. Fixing malformed
duplicate slashes would require routing outside the current minimal middleware scope.
