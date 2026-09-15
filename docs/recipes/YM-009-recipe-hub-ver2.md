# YM-009 Recipe Hub Ver.2 — 一覧・詳細の改善と人気順／検索の土台

作成日: 2026-09-15。YM-007（Recipe Hub Ver.1）と YM-008A（Recipe SEO Foundation）の上に、
一覧・詳細ページの見やすさ、購入導線、将来の人気順・検索・ランキングのためのデータ構造を足す。
レシピ本文（材料・手順・アレンジ・コラム）は1文字も変えていない。

## 1. Scope

- 対象: `/recipes`、`/recipes/[slug]`、`data/recipes.ts`、`types/content-model.ts`、`lib/recipe-page.ts`、`lib/seo.ts`、`lib/analytics.ts`
- 対象外: 本番デプロイ、merge、旧サイトの全面移植、Search Console 接続、価格・送料・EC変更
- 正本は「現在のサイトに掲載されているレシピ」（`data/recipes.ts` の13件）。旧URLは `lib/legacy-redirects.ts` に12本の301を実装済みで、残り12本は `defer` のまま維持する（2026-09-16同期前の「8本」は旧記載であり、このPRで追加する2本を含めて実体へ同期）。

## 2. データ項目の追加（`RecipeRecord`）

| 項目                                                                          | 用途                          | 今回の値                                               | 誰が入れるか                             |
| ----------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------ | ---------------------------------------- |
| `tags?: string[]`                                                             | 検索照合・将来のタグ絞り込み  | 全13件に設定（本文に書かれている調理法・味・場面のみ） | AI可（本文由来に限る）                   |
| `difficulty?: 'easy' \| 'normal' \| 'hard'`                                   | カード・基本情報の難易度表示  | 未設定                                                 | Human（実際に作って判断）                |
| `cookingTimeMinutes?` `servings?`                                             | （既存）目安時間・分量        | 未設定                                                 | Human（実測）                            |
| `featured?: boolean`                                                          | 一覧「注目レシピ」の優先表示  | 未設定                                                 | Human（編集判断）                        |
| `popularity?.score`                                                           | 内部優先度の比較値            | 未設定                                                 | Human／後述の算出式                      |
| `popularity?.searchConsoleClicks` `…Impressions` `…Ctr` `…Position`           | Search Console の転記         | 未設定                                                 | Human（GSC接続後）                       |
| `popularity?.method` / `version` / `periodStart` / `periodEnd` / `measuredAt` | 比較可能なsnapshotの識別      | 未設定                                                 | 数値を入れるときに必須（validateで強制） |
| `publishedAt`                                                                 | 新着順ソート、`datePublished` | 全13件に設定（初回Production公開日: 8/28 ×7、9/11 ×6） | 設定済み                                 |

検証（`lib/content-model/validate.ts`）: `difficulty` の値域、`tags` の空・重複、`popularity` の負値・CTR範囲（0〜1）・整数・日付形式、`popularity` がある場合の `method` / `version` / `periodStart` / `periodEnd` / `measuredAt` 必須、および `periodStart <= periodEnd`、`publishedAt`/`updatedAt` の `YYYY-MM-DD`。

### 2.1 人気指標の転記手順（Search Console 接続後）

1. GSC「検索パフォーマンス」→ ページ でフィルタ `/recipes/` → 直近28日をエクスポート
2. 各レシピの `popularity` に `method: 'search_console_clicks'`、`version`、`periodStart`、`periodEnd`、`measuredAt`（転記日）と、`searchConsoleClicks` / `searchConsoleImpressions` / `searchConsoleCtr`（比率）/ `searchConsolePosition` を入れる
3. 同じ `method: 'search_console_clicks'` / `version` / `periodStart` / `periodEnd` / `measuredAt` を全対象へ設定する。`score` を使うなら全対象に設定し、使わない場合は全対象の `searchConsoleClicks` を比較する。両者を混在させない
4. `pnpm run check:catalog` → `node --experimental-strip-types scripts/recipe-inventory.mjs > docs/recipes/recipe-inventory.md && pnpm exec prettier --write docs/recipes/recipe-inventory.md` で棚卸し表を再生成
5. `docs/recipes/recipe-image-needed.md` の投入順を上位から見直す

## 3. 一覧ページ（`/recipes`）

```
H1 お餅のレシピ + HERO画像（既存）
H2 山田もち店のお餅を楽しむ（既存リード）
H2 注目レシピ … Humanが `featured: true` を選んだ時だけ表示。スマホは横スクロール、md以上は3列
H2 すべてのレシピ … RecipeExplorer（検索・お餅で絞り込み・並び順） + カード全件
H2 お餅から探す（既存。商品名リンクは recipe_to_product_click を送る）
CTA（既存）
```

- 「注目レシピ」は `featured: true` のレシピだけをデータ順で表示する。**Humanが選んでいない間はセクション自体を出さない。**
- `RecipeExplorer`（client component）は初期描画で全件をSSRするので、検索UIがあってもHTMLには13件すべてのタイトル・説明・リンクが載る。状態はURLに持たせない（絞り込み結果をインデックスさせない）。
- 照合ロジックは `filterRecipeList`（`lib/recipe-page.ts`）に置き、タイトル・説明・材料名・タグ・商品名を NFKC 正規化して部分一致。

### 3.1 カード（`RecipeCard`）

画像（または枠）／使うお餅／レシピ名／目安時間・難易度（値がある時だけ）／説明（3行で省略）／「レシピを見る」。

**画像ポリシー**: 写真が無いレシピは画像枠を出さず、コンパクトなテキストカードにする。画像を生成して自動的に埋めることはしない。
`sourceType: 'generated'` の画像はカードと詳細に「盛り付けイメージ」の注記が自動で付く。

## 4. 詳細ページ（`/recipes/[slug]`）

```
可視パンくず（BreadcrumbList と同じ3階層）
H1 レシピ名 / description / [mainImage + generated注記]
基本情報 dl … 使うお餅（商品ページへ、recipe_hero）/ 目安時間 / 分量 / 難易度（値がある行だけ）
H2 材料 / H2 作り方 / H2 おいしく作るポイント / H2 アレンジ / H2 コラム（既存のまま）
CTA「このレシピに使ったお餅」… 商品を見る（recipe_product_cta）+ BASEで購入する（base_click: recipe_product）
     + 山田もち店のお餅をすべて見る（/products）+ 食べチョク・ポケマル（既存）
H2 ほかのレシピ（3件、カードに統一）
```

「料理人のポイント」は既存の `notes`（おいしく作るポイント）がその枠。Humanが追記すれば表示される。新しい文章は作っていない。

## 5. SEO / 構造化データ

| 項目                             | 変更                                                                                                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ItemList                         | 各 `ListItem` に `url` を追加（`recipeItemListJsonLd`）。YM-007 follow-up の解消                                                                                           |
| Recipe                           | `keywords`（tags）、`datePublished`、`dateModified` を追加。`totalTime` / `recipeYield` は **Human が値を入れた場合だけ** 出す。`mainImage` が無い間は従来どおり出力しない |
| 可視パンくず                     | 詳細ページに追加（`BreadcrumbList` と同じ階層）                                                                                                                            |
| title/desc/canonical/OGP/sitemap | 変更なし（既存のまま正しい）                                                                                                                                               |

`tests/seo-safety.test.mts` の「`prepTime` / `cookTime` / `totalTime` / `nutrition` / `recipeYield` を出さない」は、値が未設定の現状ではそのまま通る。Human が `cookingTimeMinutes` を入れたレシピが出た時点で、そのレシピだけ `totalTime` が出るようになるので、テストの対象レシピ（`isobeyaki`）に値を入れる場合はテストも更新する。

## 6. 計測（GA4）

既存の `base_click(placement: 'recipe_product')` はそのまま。手前の段を足した。

| イベント                  | パラメータ                                                     | 発火場所                                                                                                           |
| ------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `recipe_view`             | `recipe_slug`                                                  | 詳細ページ表示（`RecipeViewTracker`）                                                                              |
| `recipe_to_product_click` | `recipe_slug?` `product_slug` `placement`                      | 使うお餅（`recipe_hero`）／CTA 商品を見る（`recipe_product_cta`）／一覧 お餅から探す（`recipe_hub_product_group`） |
| `recipe_search`           | `query_length` `result_count`                                  | 検索入力が800ms止まった時。**検索語は送らない**                                                                    |
| `recipe_filter_use`       | `filter_type`(`product`\|`sort`\|`tag`) `value` `result_count` | お餅チップ・並び順の変更。検索イベントは再送しない                                                                 |

recipe → product → BASE の漏斗は `recipe_view` → `recipe_to_product_click` → `base_click(product_detail)` または `base_click(recipe_product)` で追える。GA4 側でカスタムディメンション `recipe_slug` / `product_slug` / `placement` を登録すると探索レポートで見られる（Human Gate: GA4管理画面）。

## 7. 将来の検索・ランキング実装方針

| 機能               | 必要な追加                                                                                                 | 今回の土台                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| タグ絞り込み       | `RecipeExplorer` に `tags` を渡してチップを1行足す。`filterRecipeList` は `tag` を既に受ける               | `tags` データ、`getRecipeFilterTags()`   |
| 人気順ソート       | HumanがPublic UI方針を決め、比較可能な同一snapshotが全対象にあること                                       | `sortRecipes('popular')`、snapshot guard |
| 人気レシピ TOP3    | Humanが`featured: true`を選ぶ。人気指標による自動補完はしない                                              | `getFeaturedRecipes()`                   |
| 商品ページの人気順 | `getRecipesForProduct` の `specific` を `sortRecipes(…, 'popular')` に通す                                 | 同上                                     |
| カテゴリ絞り込み   | `category` は既存（今は全件 `mochi`）。漬物・季節レシピが増えたらチップを足す                              | `RecipeCategory`                         |
| URLで状態を持つ    | `?q=` `?product=` を `useSearchParams` で読む。**noindex か canonical を `/recipes` に固定**して重複を防ぐ | 状態は今はローカルのみ                   |
| レシピ数が増えた時 | 30件を超えたらページング or 「もっと見る」。それまでは全件SSRで問題ない                                    | —                                        |

## 8. 変えていないもの

- レシピの材料・手順・アレンジ・コラム・SEO title/description
- 商品ページ側のレシピ枠（`getRecipesForProduct`、上限2件）
- 旧URLのリダイレクト（`lib/legacy-redirects.ts`）と `defer` の判断
- `Recipe` JSON-LD を画像なしで出さない方針
- `Cta` / `StickyPurchaseBar` の購入エリア数（`[data-purchase-area]` の数はページごとに変わらない）

## 9. Human review

- 「注目レシピ」に出したいレシピがあれば `featured: true` を付ける（無ければセクションを表示しない）
- 写真が無いレシピは、画像枠を出さないテキストカードのままとする
- `docs/recipes/recipe-image-needed.md` の「実写推奨 / AI可」の振り分け
- GA4 管理画面でカスタムディメンション（`recipe_slug` / `product_slug` / `placement` / `filter_type`）を登録するか
- Search Console 接続（YM-008A 12.2 のまま Human Gate）
