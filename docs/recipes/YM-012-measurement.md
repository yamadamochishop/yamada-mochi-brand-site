# YM-012 計測仕様

焼き方・磯辺焼きの2ページで、導線ごとのクリックを区別する。既存イベント名と既存パラメータは変更しない。

| 導線                         | イベント                                     | パラメータ                                                                                               | 発火箇所                                                        |
| ---------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| ページ内ナビ                 | `recipe_section_nav`                         | `recipe_slug`, `section_id`                                                                              | 詳細ページの「このページで紹介する方法」のアンカーリンク        |
| アレンジのページ内リンク     | `recipe_section_nav`                         | `recipe_slug`, `section_id=arrange-shoyu / arrange-butter / arrange-sesame / arrange-shichimi`           | 磯辺焼きの調味料アレンジ4件へのリンク                           |
| 焼き方ガイド                 | `recipe_internal_click`                      | `recipe_slug`, `link_type=technique_guide`, `target_path`, `placement=method_guide / steps_footer / faq` | 磯辺焼きの焼き方カード・案内・FAQ、既存手順直後の案内           |
| 関連レシピ                   | `recipe_internal_click`                      | `recipe_slug`, `link_type=related_recipe`, `target_path`, `placement=related_recipes`                    | 詳細ページ下部の関連カードの画像・タイトル・ボタン              |
| アレンジの関連レシピ         | `recipe_internal_click`                      | `recipe_slug`, `link_type=related_recipe`, `target_path`, `placement=arrangement`                        | バター醤油アレンジ内の関連レシピリンク                          |
| 商品詳細                     | `recipe_to_product_click`（既存）            | `recipe_slug`, `product_slug`, `placement=recipe_brand_note` など                                        | ブランド紹介の商品リンク、既存の冒頭・アレンジ・CTAの商品リンク |
| 相性のよいお餅               | `recipe_to_product_click`                    | `recipe_slug`, `product_slug`, `placement=recipe_arrangement`                                            | 調味料アレンジ4件の商品リンク                                   |
| ブランドストーリー・商品一覧 | `recipe_internal_click`                      | `recipe_slug`, `link_type=brand_story / products_list`, `target_path`, `placement=brand_note`            | 磯辺焼きのブランド紹介の文字リンク                              |
| 外部EC                       | `base_click` / `sales_channel_click`（既存） | 既存の `placement`、商品・チャネル等                                                                     | 商品CTAからBASE・食べチョク・ポケマルへ移るリンク               |

`recipe_view` は既存の閲覧イベントとして残す。`recipe_section_nav` は同一ページ内の移動、`recipe_internal_click` は別ページへの回遊に使う。1つのリンクには1つのクリック計測だけを付け、カードの3つのリンクもそれぞれ単独で発火させる。FAQPage構造化データは追加しない。

`base_click` / `sales_channel_click` は外部ECへの遷移であって購入完了ではない。キーイベントにしても購入として扱わない。

## GA4側の設定と確認

イベントスコープのカスタムディメンション登録候補は `section_id`, `link_type`, `target_path`, `placement`, `recipe_slug`, `product_slug`。既に登録済みのものはHumanが確認し、重複登録しない。イベント名やパラメータ名を変更する場合は、過去データとの連続性を確認する。

DebugViewでは、対象ページを開いて `recipe_view` を確認する。目次、アレンジのページ内リンクと商品・関連レシピリンク、焼き方カード、FAQ、関連カードの画像・タイトル・ボタン、ブランド紹介の3リンク、商品CTA、外部ECリンクをそれぞれ1回ずつ押す。各クリックで期待するイベントが1件だけ届き、`recipe_slug` が元ページ、`target_path` がリンク先（フラグメントを含む）、`placement` が表の位置と一致することを確認する。外部ECの購入完了はこの画面では判定しない。

## 開発環境・Previewからの送信防止

`app/layout.tsx` は `lib/analytics-config.ts` の `resolveGaMeasurementId` を使い、Vercel がビルド時に設定する `VERCEL_ENV` が `production` のときだけ GA4 を読み込む。

| 環境                                            | `VERCEL_ENV` | GA4                                               |
| ----------------------------------------------- | ------------ | ------------------------------------------------- |
| Vercel Production（`main` から自動デプロイ）    | `production` | 読み込む（`NEXT_PUBLIC_GA_ID`、未設定なら既定ID） |
| Vercel Preview                                  | `preview`    | 読み込まない                                      |
| ローカル `next dev`／`next build && next start` | 未設定       | 読み込まない                                      |

イベント送信関数は `window.gtag?.()` を使うため、GA4 が無い環境では何も送らない。テストは `window.gtag` をモックして検証する（`tests/recipe-analytics.test.mts`）。

公開後の確認（Human）: 本番デプロイ後に GA4 のリアルタイムレポートで本番サイトの `page_view` が届くこと、Preview URL を開いても届かないことを確認する。Vercel の「Automatically expose System Environment Variables」が無効だと `VERCEL_ENV` が渡らず本番でも GA4 が止まるため、届かない場合はこの設定を確認する。
