# レシピ棚卸し

`data/recipes.ts` から `scripts/recipe-inventory.mjs` で生成。手で編集しない。

生成対象: 13件（published 13件）

| #   | slug                         | title                     | 商品                                            | category | tags                                             | 材料数 | 手順数 | 時間 | 難易度 | 人数 | 画像 | featured | popularity.score | publishedAt | status    |
| --- | ---------------------------- | ------------------------- | ----------------------------------------------- | -------- | ------------------------------------------------ | ------ | ------ | ---- | ------ | ---- | ---- | -------- | ---------------- | ----------- | --------- |
| 1   | `mochi-yakikata`             | お餅のおいしい焼き方      | plain, yomogi, sansyokumame, kombu, tamari, ebi | mochi    | トースター, フライパン, 電子レンジ, 基本の焼き方 | 1      | 3      | —    | —      | —    | なし | —        | —                | 2026-08-28  | published |
| 2   | `isobeyaki`                  | 山田家の磯辺焼き          | plain                                           | mochi    | トースター, 醤油, 海苔                           | 4      | 5      | —    | —      | —    | なし | —        | —                | 2026-08-28  | published |
| 3   | `ebi-mochi-cheese-pizza`     | 海老餅の簡単チーズピザ    | ebi                                             | mochi    | トースター, チーズ, おつまみ                     | 2      | 4      | —    | —      | —    | なし | —        | —                | 2026-08-28  | published |
| 4   | `kombu-mochi-ozoni-fu`       | 昆布餅のお雑煮風          | kombu                                           | mochi    | トースター, だし, お雑煮                         | 2      | 4      | —    | —      | —    | なし | —        | —                | 2026-08-28  | published |
| 5   | `age-mame-mochi`             | カリッと揚げ豆餅          | sansyokumame                                    | mochi    | フライパン, 揚げ餅, 塩                           | 3      | 5      | —    | —      | —    | なし | —        | —                | 2026-08-28  | published |
| 6   | `yomogi-mochi-zenzai`        | 焼き草餅のぜんざい        | yomogi                                          | mochi    | トースター, あんこ, おやつ                       | 4      | 4      | —    | —      | —    | なし | —        | —                | 2026-08-28  | published |
| 7   | `tamari-mochi-butter-pepper` | たまり餅のバター黒胡椒    | tamari                                          | mochi    | トースター, バター, 黒胡椒                       | 3      | 3      | —    | —      | —    | なし | —        | —                | 2026-08-28  | published |
| 8   | `garlic-butter-mochi`        | ガーリックバター餅        | plain                                           | mochi    | トースター, バター, にんにく                     | 2      | 3      | —    | —      | —    | なし | —        | —                | 2026-09-11  | published |
| 9   | `mentaiko-mayo-mochi`        | 明太子マヨ餅              | plain                                           | mochi    | トースター, 明太子, マヨネーズ                   | 4      | 5      | —    | —      | —    | なし | —        | —                | 2026-09-11  | published |
| 10  | `yomogi-an-butter`           | 草餅のあんバター          | yomogi                                          | mochi    | トースター, あんこ, バター, おやつ               | 3      | 3      | —    | —      | —    | なし | —        | —                | 2026-09-11  | published |
| 11  | `dashi-butter-mochi`         | レンジで簡単 だしバター餅 | plain                                           | mochi    | 電子レンジ, だし, バター                         | 3      | 4      | —    | —      | —    | なし | —        | —                | 2026-09-11  | published |
| 12  | `mochi-pizza`                | トースターで簡単 ピザ餅   | plain                                           | mochi    | トースター, チーズ, 朝食・軽食                   | 4      | 4      | —    | —      | —    | なし | —        | —                | 2026-09-11  | published |
| 13  | `mochi-ebi-ajillo`           | 餅と海老のアヒージョ      | plain                                           | mochi    | フライパン, 海老, おつまみ                       | 6      | 5      | —    | —      | —    | なし | —        | —                | 2026-09-11  | published |

## 説明

- `mochi-yakikata`: 山田もち店のお餅は、まず焼くところから。ご家庭のトースターでおいしく焼くための、いちばん基本の焼き方です。フライパン・電子レンジ・冷凍したお餅の焼き方もあわせてご紹介します。
- `isobeyaki`: 焼いた白餅に砂糖醤油を絡めて、炙った焼き海苔で包みます。
- `ebi-mochi-cheese-pizza`: 焼いた海老餅に、とろけるチーズをのせるだけ。海老餅そのものに塩味があるので、ソースがなくても味が決まります。
- `kombu-mochi-ozoni-fu`: 焼いた昆布餅をお椀に入れ、薄めに作った鰹だしを注ぎます。
- `age-mame-mochi`: 三色豆餅を約2cm角に切って揚げ、熱いうちに軽く塩をふる食べ方です。
- `yomogi-mochi-zenzai`: 市販のつぶあんをお湯で溶かし、焼いた草餅を加えるぜんざいです。
- `tamari-mochi-butter-pepper`: 焼いたたまり餅に無塩バターをのせ、ブラックペッパーを削りかけます。
- `garlic-butter-mochi`: 香ばしく焼いた白餅にガーリックバターをたっぷり塗り、もう一度トースターへ。にんにくとバターの香りが広がる簡単アレンジです。
- `mentaiko-mayo-mochi`: 香ばしく焼いた白餅に明太マヨをのせてもう一度トースターへ。明太子の塩気とマヨネーズのコクがよく合う簡単アレンジです。
- `yomogi-an-butter`: 香ばしく焼いた草餅につぶあんとバターを。よもぎの香り、あんこの甘み、バターのコクを一緒に楽しむ簡単なおやつです。
- `dashi-butter-mochi`: やわらかくした白餅に、だしの効いためんつゆとバターを絡めるだけ。忙しい時にも作りやすい、シンプルなお餅アレンジです。
- `mochi-pizza`: 白餅にトマト、ソーセージまたはベーコン、チーズをのせて焼くだけ。朝食や軽食にも食べやすい、山田もち店の昔からのアレンジです。
- `mochi-ebi-ajillo`: もちもちの白餅と海老を、にんにくの香るオリーブオイルで。おつまみにも食事にも楽しめる、山田もち店の旧レシピを整えたアレンジです。

## 材料

- `mochi-yakikata`: 山田もち店の切り餅
- `isobeyaki`: プレーン（白餅） / 上白糖 / 濃口醤油 / 焼き海苔
- `ebi-mochi-cheese-pizza`: 黒ごま海老餅 / スライスのとろけるチーズ
- `kombu-mochi-ozoni-fu`: 昆布餅 / 鰹だし
- `age-mame-mochi`: 三色豆餅 / サラダ油 / 塩
- `yomogi-mochi-zenzai`: 草餅 / 市販のつぶあん / お湯 / 砂糖
- `tamari-mochi-butter-pepper`: たまり餅 / 無塩バター / ブラックペッパー
- `garlic-butter-mochi`: プレーン（白餅） / 市販のガーリックバター
- `mentaiko-mayo-mochi`: プレーン（白餅） / 明太子 / マヨネーズ / 刻み海苔
- `yomogi-an-butter`: 草餅 / つぶあん / バター
- `dashi-butter-mochi`: プレーン（白餅） / めんつゆ（4倍濃縮） / バター
- `mochi-pizza`: プレーン（白餅） / とろけるチーズ / ミニトマト / ソーセージ（またはベーコン）
- `mochi-ebi-ajillo`: プレーン（白餅） / むき海老 / にんにく / オリーブオイル / 鷹の爪 / 塩
