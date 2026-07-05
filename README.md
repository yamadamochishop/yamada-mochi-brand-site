# 山田もち店 ブランドサイト

飛騨高山の山田もち店を「飛騨高山を代表する餅ブランド」として育てるための、Next.js製ブランドサイトです。

このサイトは、公式ホームページ＝ブランドサイト、BASE＝オンラインショップ、という役割分担で設計しています。購入ボタンはBASEへリンクし、決済機能はこのサイト側には持たせません。

## いまの構成

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel
- GitHub
- 商品情報は `data/products.ts` で一元管理
- 画像は `public/images/` に追加
- `sitemap.xml` / `robots.txt` は自動生成
- 商品ページごとに構造化データを出力
- Google Analyticsは環境変数でON/OFF

## ローカルで確認する方法

最初にプロジェクトへ移動します。

```bash
cd yamada-mochi-next
```

依存関係を入れます。

```bash
pnpm install
```

もし `pnpm` が見つからない場合は、Node.jsを入れたあとに以下を実行してください。

```bash
corepack enable
corepack prepare pnpm@11.7.0 --activate
```

ローカル確認を起動します。

```bash
pnpm run dev
```

ブラウザで開きます。

```txt
http://localhost:3000
```

## よく使うコマンド

```bash
pnpm run dev        # ローカル確認
pnpm run build      # Vercel公開前チェック
pnpm run start      # build後の本番表示確認
pnpm run lint       # コードチェック
pnpm run typecheck  # TypeScriptチェック
```

公開前は、最低でもこれを実行してください。

```bash
pnpm run build
```

## ファイル構成

```txt
app/                 ページ
components/          共通パーツ
data/                商品・お知らせ・FAQなどの管理データ
public/images/       公開用画像
docs/                運用メモ
cms/sanity-schema/   将来Sanity CMSを入れる場合の下書き
```

## GitHubへPushする方法

GitHubアカウント:

```txt
yamadamochishop
```

GitHubで新しいリポジトリを作ります。おすすめ名:

```txt
yamada-mochi-brand-site
```

このプロジェクトはすでにGit初期化と初回コミットまで完了しています。

GitHubで空のリポジトリを作成したら、初回だけ以下を実行します。

```bash
git branch -M main
git remote add origin https://github.com/yamadamochishop/yamada-mochi-brand-site.git
git push -u origin main
```

2回目以降の更新はこれだけです。

```bash
git add .
git commit -m "Update site"
git push
```

## Vercelへデプロイする方法

VercelはGitHub連携済みなので、基本はリポジトリを選ぶだけです。

1. Vercelを開く
2. `Add New...` → `Project`
3. GitHubの `yamadamochishop/yamada-mochi-brand-site` を選択
4. Framework Preset が `Next.js` になっていることを確認
5. Root Directory を確認
   - GitHubに `yamada-mochi-next` フォルダだけをPushした場合: 空欄でOK
   - 親フォルダごとPushした場合: `yamada-mochi-next` を指定
6. Build Command: `pnpm run build`
7. Install Command: `pnpm install`
8. Deployを押す

以後は、GitHubへPushするとVercelが自動で再デプロイします。

## Vercelの環境変数

VercelのProjectで、`Settings` → `Environment Variables` に以下を追加します。

```txt
NEXT_PUBLIC_SITE_URL=https://www.yamadamochi.com
NEXT_PUBLIC_BASE_URL=https://yamadamochi.thebase.in
NEXT_PUBLIC_CONTACT_EMAIL=info@yamadamochi.com
NEXT_PUBLIC_GOOGLE_FORM_URL=
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

補足:

- `NEXT_PUBLIC_CONTACT_EMAIL` は将来 `info@yamadamochi.com` を使う前提です。
- Googleフォームを使う場合は `NEXT_PUBLIC_GOOGLE_FORM_URL` にURLを入れます。
- Google Analyticsを使う場合は `NEXT_PUBLIC_GA_ID` にGA4の測定IDを入れます。
- GAをまだ使わない場合は `G-XXXXXXXXXX` のままでもサイトは動きます。

ローカルで確認する場合は、`.env.example` をコピーして `.env.local` を作ります。

```bash
cp .env.example .env.local
```

## 独自ドメイン設定

最終公開ドメイン:

```txt
www.yamadamochi.com
```

Vercel側:

1. VercelのProjectを開く
2. `Settings` → `Domains`
3. `www.yamadamochi.com` を追加
4. 画面に表示されたDNS設定を確認

Cloudflare側:

1. Cloudflareで `yamadamochi.com` のDNSを開く
2. `www` のCNAMEをVercel指定の値へ向ける
   - 一般的には `cname.vercel-dns.com`
   - ただし、Vercel画面に表示された値を優先してください
3. `yamadamochi.com` 本体も使う場合は、Vercelの案内に従ってAレコード、または `www` へのリダイレクトを設定
4. SSL/TLSは `Full` または `Full (strict)` を推奨

公開時は、まずVercelの仮URLで確認し、問題なければDNSを切り替えます。

DNS反映は数分〜最大48時間ほどかかる場合があります。

## Jimdoから切り替える前のチェック

- [ ] Vercel仮URLでトップページが見える
- [ ] 商品一覧が見える
- [ ] 商品詳細ページが見える
- [ ] BASEリンクが正しい
- [ ] スマホ表示が崩れていない
- [ ] `/sitemap.xml` が見える
- [ ] `/robots.txt` が見える
- [ ] Google Analyticsを設定した
- [ ] Google Search Console用意済み
- [ ] DNS変更前にJimdo側のバックアップを取った

## 画像を追加・差し替えする方法

画像はここへ入れます。

```txt
public/images/
```

例:

```txt
public/images/new-package.jpg
```

商品画像を差し替える場合は、`data/products.ts` の `image` を変更します。

```ts
image: "/images/new-package.jpg"
```

画像の目安:

- 横長メイン画像: 1600〜2400px幅
- 商品画像: 1200〜1600px幅
- 容量: 300KB〜1MB程度
- 形式: jpg / png / webp

元画像は大きいままGoogle Driveなどに保管し、GitHubには軽くした公開用画像だけ入れるのがおすすめです。

## 商品を追加・修正する方法

商品名、価格、原材料、保存方法、おすすめの食べ方などはここで管理します。

```txt
data/products.ts
```

1商品ごとに管理している情報:

- 商品名
- キャッチコピー
- 商品説明
- 価格
- 内容量
- 原材料
- 賞味期限
- 保存方法
- アレルギー
- おすすめの食べ方
- 店主おすすめ
- 画像
- SEO情報

商品を追加すると、商品一覧と商品詳細ページに反映されます。

現在のURL:

```txt
/products/plain
/products/yomogi
/products/sansyokumame
/products/kombu
/products/tamari
/products/ebi
```

## 文章を修正する方法

ページ本文:

```txt
app/
```

商品情報:

```txt
data/products.ts
```

お知らせ:

```txt
data/news.ts
```

FAQ:

```txt
data/faqs.ts
```

お客様の声:

```txt
data/voices.ts
```

店舗情報・BASE URL・電話番号など:

```txt
data/site.ts
```

## Google Search Console設定

1. Google Search Consoleを開く
2. プロパティを追加
3. `URLプレフィックス` で `https://www.yamadamochi.com` を追加
4. 所有権確認を行う
5. サイトマップを送信

サイトマップURL:

```txt
https://www.yamadamochi.com/sitemap.xml
```

## Google Analytics設定

1. Google AnalyticsでGA4プロパティを作成
2. Webデータストリームを作成
3. 測定ID `G-XXXXXXXXXX` をコピー
4. Vercelの環境変数 `NEXT_PUBLIC_GA_ID` に設定
5. Vercelで再デプロイ

## Cloudflareでメールアドレスを使う場合

将来 `info@yamadamochi.com` を使う場合は、Cloudflare Email Routing、Google Workspace、または別のメールサービスを設定します。

サイト側では以下の環境変数だけ変更すれば表示を変えられます。

```txt
NEXT_PUBLIC_CONTACT_EMAIL=info@yamadamochi.com
```

## CMSについて

現在は、まず公開しやすく壊れにくい `data/` 管理にしています。

将来、コードを触らずに管理画面から商品やお知らせを更新したくなったら、Sanity CMSの導入がおすすめです。

比較メモ:

```txt
docs/CMS比較と導入方針.md
```

## 公開前チェックリスト

- [ ] `pnpm run build` が成功する
- [ ] VercelのPreview URLで表示確認した
- [ ] 商品詳細ページが表示される
- [ ] BASEへのリンクが正しい
- [ ] スマホで崩れていない
- [ ] sitemap.xml が表示される
- [ ] robots.txt が表示される
- [ ] GA測定IDを設定した
- [ ] Search Consoleへサイトマップ送信した
- [ ] 独自ドメインをVercelへ向けた

## 今後Codexへ頼む時の例

```txt
新商品「玄米もち」を追加して
```

```txt
トップページのギフト写真を差し替えて
```

```txt
お知らせに年末発送について追加して
```

この構成なら、ページのHTMLを直接触らず、データと画像を中心に更新できます。
