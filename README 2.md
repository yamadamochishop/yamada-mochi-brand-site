# 山田もち店 ブランドサイト

飛騨高山の山田もち店を「飛騨高山を代表する餅ブランド」として育てるための、Next.js製ブランドサイトです。

Jimdoから卒業し、Vercelで高速に公開・運用することを前提にしています。BASEは決済・オンラインショップとして利用し、このサイトから購入導線をつなぎます。

## 使用技術

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel
- GitHub

## まずやること

```bash
cd yamada-mochi-next
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## よく使うコマンド

```bash
npm run dev        # ローカル確認
npm run build      # 公開前チェック
npm run start      # build後の本番表示確認
npm run lint       # コードチェック
npm run typecheck  # TypeScriptチェック
```

## ファイル構成

```txt
app/                 ページ
components/          共通パーツ
data/                商品・お知らせ・FAQなどの管理データ
public/images/       画像
docs/                運用メモ
cms/sanity-schema/   将来Sanityを入れる場合の下書き
```

## 商品情報の直し方

商品名、価格、原材料、保存方法、おすすめの食べ方などはここで管理します。

```txt
data/products.ts
```

1商品ごとに、以下のような情報を持っています。

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
- 画像
- SEO情報

商品を追加したい場合は、`data/products.ts` に1件追加すると、商品一覧と商品詳細ページへ反映できます。

商品詳細URLはこの形です。

```txt
/products/plain
/products/yomogi
/products/sansyokumame
/products/kombu
/products/tamari
/products/ebi
```

## 画像の追加・差し替え

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

画像はWeb用に軽くしてから入れるのがおすすめです。

目安:

- 横長メイン画像: 1600〜2400px幅
- 商品画像: 1200〜1600px幅
- 容量: 300KB〜1MB程度
- 形式: jpg / png / webp

## お知らせの更新

```txt
data/news.ts
```

ここに追加すると `/news` に表示されます。

## FAQの更新

```txt
data/faqs.ts
```

ここに追加すると、FAQページと商品詳細ページに反映されます。

## お客様の声の更新

```txt
data/voices.ts
```

ここに追加すると `/voices` に表示されます。

## 環境変数

`.env.example` をコピーして `.env.local` を作ります。

```bash
cp .env.example .env.local
```

設定項目:

```txt
NEXT_PUBLIC_SITE_URL=https://www.yamadamochi.com
NEXT_PUBLIC_BASE_URL=https://yamadamochi.thebase.in
NEXT_PUBLIC_GOOGLE_FORM_URL=
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Googleフォームを使う場合は `NEXT_PUBLIC_GOOGLE_FORM_URL` にURLを入れます。

Google Analyticsを使う場合は `NEXT_PUBLIC_GA_ID` に測定IDを入れます。

## GitHubへPushする手順

初回のみ:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ユーザー名/リポジトリ名.git
git push -u origin main
```

2回目以降:

```bash
git add .
git commit -m "Update site"
git push
```

## Vercelへデプロイする手順

1. [Vercel](https://vercel.com/) にログイン
2. `Add New...` → `Project`
3. GitHubのリポジトリを選択
4. Framework Preset が `Next.js` になっていることを確認
5. Root Directory を `yamada-mochi-next` に設定
6. Environment Variables に以下を追加

```txt
NEXT_PUBLIC_SITE_URL=https://www.yamadamochi.com
NEXT_PUBLIC_BASE_URL=https://yamadamochi.thebase.in
NEXT_PUBLIC_GOOGLE_FORM_URL=必要ならGoogleフォームURL
NEXT_PUBLIC_GA_ID=Google Analyticsの測定ID
```

7. `Deploy` を押す

公開後、VercelのURLで表示確認します。

## 独自ドメイン設定

最終公開ドメイン:

```txt
www.yamadamochi.com
```

Vercel側:

1. VercelのProjectを開く
2. `Settings` → `Domains`
3. `www.yamadamochi.com` を追加
4. 表示されたDNS設定を確認

ドメイン管理側:

- `www` のCNAMEをVercel指定の値へ向けます
- ルートドメイン `yamadamochi.com` も使う場合は、Vercelの案内に従ってAレコードまたはリダイレクトを設定します

公開時は、まず `www.yamadamochi.com` を本番にして、`yamadamochi.com` は `www` へ転送する形がおすすめです。

## Jimdoから切り替える時の注意

切り替え前に必ずやること:

1. 現在のJimdoサイトのバックアップ
2. Vercel仮URLで全ページ確認
3. BASEリンク確認
4. スマホ表示確認
5. Google Analytics / Search Console設定確認
6. DNS変更

DNS変更後、反映まで数分〜最大48時間ほどかかる場合があります。

## Google Search Console設定

1. [Google Search Console](https://search.google.com/search-console/) を開く
2. プロパティ追加
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

## Cloudflareを使う場合

Cloudflareを使う場合は、DNS管理をCloudflareへ移します。

基本方針:

- `www` はVercelへCNAME
- SSL/TLSは `Full` または `Full (strict)`
- 最初は複雑なキャッシュ設定をしない

Cloudflareは便利ですが、最初の公開では必須ではありません。まずVercelとドメイン管理会社だけで公開し、必要になったらCloudflareを追加する流れでも大丈夫です。

## バックアップ方法

GitHubにPushしておけば、コードと文章はバックアップされます。

画像も `public/images/` に入っていればGitHubで管理されます。

おすすめ:

- 大きすぎる元画像はGoogle Driveや外付けHDDにも保存
- 公開用に軽くした画像だけGitHubへ入れる
- 大きな変更前は必ず `git commit`

## CMSについて

現在は `data/` フォルダで一元管理しています。

将来的に管理画面から更新したくなったら、Sanityの導入がおすすめです。

詳しくは以下を参照してください。

```txt
docs/CMS比較と導入方針.md
```

## 公開前チェックリスト

- [ ] `npm run build` が成功する
- [ ] トップページが表示される
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
