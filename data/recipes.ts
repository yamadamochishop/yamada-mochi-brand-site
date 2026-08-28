import type { RecipeRecord } from '../types/content-model.ts';

/**
 * Recipe Hub Ver.1 の公開レシピ。
 *
 * すべて山田家で実際に行っている食べ方をHumanから受け取った内容だけで構成する。
 * 次の値は確認が取れていないため、意図的に設定しない。
 *
 * - `servings`（人数）
 * - `cookingTimeMinutes`（調理時間）
 * - `allergens`（アレルゲン表示は各商品ページの正本を参照する）
 * - `mainImage` / `stepImages`（レシピ写真は未撮影）
 *
 * 写真が用意でき次第 `mainImage` を追加すると、詳細ページのHEROと
 * Recipe構造化データが自動的に有効になる（`lib/recipe-page.ts` を参照）。
 */
export const recipes: RecipeRecord[] = [
  {
    id: 'mochi-yakikata',
    slug: 'mochi-yakikata',
    title: 'お餅のおいしい焼き方',
    description:
      '山田もち店のお餅は、まず焼くところから。ご家庭のトースターでおいしく焼くための、いちばん基本の焼き方です。',
    category: 'mochi',
    ingredients: [{ name: '山田もち店の切り餅', amount: '適量' }],
    steps: [
      { position: 1, instruction: 'お餅の表面を、さっと水で濡らします。' },
      { position: 2, instruction: 'トースター（1000W）で4〜5分を目安に焼きます。' },
      {
        position: 3,
        instruction:
          'お餅が硬くなっている場合はもう少し時間がかかるため、様子を見ながら追加で焼きます。',
      },
    ],
    notes: [
      '1000Wで4〜5分は目安です。お餅の状態やトースターによって変わるため、様子を見ながら調整してください。',
    ],
    column: {
      title: '山田家では、ストーブの上で。',
      body: '冬になると、山田家では石油ストーブの上でじっくり焼くことも多くあります。ご家庭でおすすめしているのはトースターですが、飛騨の冬の暮らしの中では、ストーブの上のお餅を待つ時間も、この土地らしい風景のひとつです。',
    },
    relatedProductIds: ['plain', 'yomogi', 'sansyokumame', 'kombu', 'tamari', 'ebi'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: 'お餅のおいしい焼き方',
      description:
        '飛騨高山・山田もち店の切り餅を、トースター1000Wで4〜5分を目安に焼く基本の焼き方をご紹介します。',
      canonicalPath: '/recipes/mochi-yakikata',
    },
  },
  {
    id: 'isobeyaki',
    slug: 'isobeyaki',
    title: '山田家の磯辺焼き',
    description:
      '焼いた白餅に砂糖醤油を絡めて、炙った焼き海苔で包みます。山田家でいちばんよく食べている、定番の食べ方です。',
    category: 'mochi',
    ingredients: [
      { name: 'プレーン（白餅）', amount: '適量' },
      { name: '上白糖', amount: '大さじ1' },
      { name: '濃口醤油', amount: '大さじ2' },
      { name: '焼き海苔', amount: '適量' },
    ],
    steps: [
      { position: 1, instruction: '白餅の表面を、水でさっと濡らします。' },
      { position: 2, instruction: 'トースターで焼きます。' },
      { position: 3, instruction: '上白糖大さじ1と濃口醤油大さじ2を混ぜ、砂糖醤油を作ります。' },
      { position: 4, instruction: '焼けたお餅を、混ぜた砂糖醤油に絡めます。' },
      { position: 5, instruction: '焼き海苔をさっと炙ります。' },
      { position: 6, instruction: '海苔でお餅を包みます。' },
    ],
    notes: [
      '砂糖と醤油の比率は基本の目安です。お好みで甘さを調整してください。',
      '焼き方の詳しい手順は「お餅のおいしい焼き方」をご覧ください。',
    ],
    variations: [
      {
        title: '九州の甘い醤油で',
        text: '砂糖を入れず、九州地方の甘い醤油を絡めて食べる方法も、山田家で好まれているもうひとつの食べ方です。',
      },
    ],
    relatedProductIds: ['plain'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: '山田家の磯辺焼き',
      description:
        '焼いた白餅に砂糖醤油を絡め、炙った焼き海苔で包む磯辺焼き。飛騨高山・山田もち店の家庭の食べ方です。',
      canonicalPath: '/recipes/isobeyaki',
    },
  },
  {
    id: 'ebi-mochi-cheese-pizza',
    slug: 'ebi-mochi-cheese-pizza',
    title: '海老餅の簡単チーズピザ',
    description:
      '焼いた海老餅に、とろけるチーズをのせるだけ。海老餅そのものに塩味があるので、ソースがなくても味が決まります。',
    category: 'mochi',
    ingredients: [
      { name: '黒ごま海老餅', amount: '適量' },
      { name: 'スライスのとろけるチーズ', amount: '適量' },
    ],
    steps: [
      { position: 1, instruction: '海老餅を、さっと水で濡らします。' },
      { position: 2, instruction: 'トースターで焼きます。' },
      { position: 3, instruction: '焼けてきたら、スライスのとろけるチーズをのせます。' },
      { position: 4, instruction: 'チーズが溶けるまで、追加で焼きます。' },
    ],
    notes: [
      '海老餅には塩味がついているため、ソースや追加の調味料がなくてもおいしく食べられます。',
      'おすすめは海老餅ですが、他のお餅でも作れます。',
    ],
    relatedProductIds: ['ebi'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: '海老餅の簡単チーズピザ',
      description:
        '焼いた黒ごま海老餅にとろけるチーズをのせるだけの簡単アレンジ。飛騨高山・山田もち店の食べ方です。',
      canonicalPath: '/recipes/ebi-mochi-cheese-pizza',
    },
  },
  {
    id: 'kombu-mochi-ozoni-fu',
    slug: 'kombu-mochi-ozoni-fu',
    title: '昆布餅のお雑煮風',
    description:
      '焼いた昆布餅に、薄めに仕立てた鰹だしを注ぎます。お餅から出る昆布の旨みが、合わせ出汁のような味わいになります。',
    category: 'mochi',
    ingredients: [
      { name: '昆布餅', amount: '適量' },
      { name: '鰹だし', amount: '約100cc', note: 'ほんだしでも作れます' },
    ],
    steps: [
      { position: 1, instruction: '昆布餅を、さっと水で濡らします。' },
      { position: 2, instruction: 'トースターで焼きます。' },
      { position: 3, instruction: '鰹だしを、塩味控えめ・薄めに作ります。' },
      { position: 4, instruction: '焼いた昆布餅を椀に入れます。' },
      { position: 5, instruction: '温かい鰹だしを注ぎます。' },
    ],
    notes: [
      'だしは塩味控えめ・薄めに作るのがポイントです。',
      '焼いた昆布餅から昆布の旨みが出て、鰹だしと合わさることで合わせ出汁のような味わいになります。',
    ],
    relatedProductIds: ['kombu'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: '昆布餅のお雑煮風',
      description:
        '焼いた昆布餅に薄めの鰹だしを注ぐお雑煮風。飛騨高山・山田もち店の昆布餅を使った食事のレシピです。',
      canonicalPath: '/recipes/kombu-mochi-ozoni-fu',
    },
  },
  {
    id: 'age-mame-mochi',
    slug: 'age-mame-mochi',
    title: 'カリッと揚げ豆餅',
    description:
      '三色豆餅を小さく切って揚げ、熱いうちに塩をふります。外はカリッと、中はやわらかい、手が止まらない食べ方です。',
    category: 'mochi',
    ingredients: [
      { name: '三色豆餅', amount: '適量' },
      { name: 'サラダ油', amount: '適量', note: 'フライパンに少し多めに' },
      { name: '塩', amount: '少々' },
    ],
    steps: [
      { position: 1, instruction: '三色豆餅を、約2cm角に切ります。' },
      {
        position: 2,
        instruction: 'フライパンにサラダ油を少し多めに入れ、約180℃に温めます。',
      },
      {
        position: 3,
        instruction: 'お餅同士がくっつかないよう、1つずつ離して入れます。',
      },
      { position: 4, instruction: 'ふくらんでカリッとしたら引き上げます。' },
      { position: 5, instruction: '熱いうちに、軽く塩をふります。' },
    ],
    notes: ['まとめて入れるとお餅同士がくっつきやすいため、1つずつ離して入れてください。'],
    variations: [
      {
        title: '塩を変えて',
        text: '塩のかわりに、山椒塩、抹茶塩、七味もおすすめです。',
      },
    ],
    relatedProductIds: ['sansyokumame'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: 'カリッと揚げ豆餅',
      description:
        '三色豆餅を約2cm角に切って揚げ、熱いうちに塩をふる食べ方。飛騨高山・山田もち店の豆餅アレンジです。',
      canonicalPath: '/recipes/age-mame-mochi',
    },
  },
  {
    id: 'yomogi-mochi-zenzai',
    slug: 'yomogi-mochi-zenzai',
    title: '焼き草餅のぜんざい',
    description:
      '市販のつぶあんをお湯で溶いて、焼いた草餅を加えるだけ。よもぎの香りとあんこの甘さが重なる、休憩時間のおやつです。',
    category: 'mochi',
    ingredients: [
      { name: '草餅', amount: '適量' },
      { name: '市販のつぶあん', amount: '適量' },
      { name: 'お湯', amount: '適量' },
      { name: '砂糖', amount: '好みで少量' },
    ],
    steps: [
      { position: 1, instruction: '草餅をトースターで焼きます。' },
      { position: 2, instruction: '市販のつぶあんを、お湯で溶きます。' },
      { position: 3, instruction: 'お汁粉程度の、好みの濃度にします。' },
      { position: 4, instruction: '甘さが欲しければ、砂糖を少量加えます。' },
      { position: 5, instruction: '焼いた草餅を加えます。' },
    ],
    variations: [
      {
        title: '甘酒で作る',
        text: '水やお湯のかわりに甘酒を使うと、よりおいしく仕上がります。甘酒自体に甘みがあるため、砂糖は味を見て調整してください。',
      },
    ],
    relatedProductIds: ['yomogi'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: '焼き草餅のぜんざい',
      description:
        '市販のつぶあんをお湯で溶き、焼いた草餅を加えるぜんざい。飛騨高山・山田もち店の草餅を使ったおやつです。',
      canonicalPath: '/recipes/yomogi-mochi-zenzai',
    },
  },
  {
    id: 'tamari-mochi-butter-pepper',
    slug: 'tamari-mochi-butter-pepper',
    title: 'たまり餅のバター黒胡椒',
    description:
      '焼きたてのたまり餅に、無塩バターをのせて黒胡椒を挽くだけ。お餅に味がついているので、これだけで十分に仕上がります。',
    category: 'mochi',
    ingredients: [
      { name: 'たまり餅', amount: '適量' },
      { name: '無塩バター', amount: '適量' },
      { name: 'ブラックペッパー', amount: '適量' },
    ],
    steps: [
      { position: 1, instruction: 'たまり餅を、さっと水で濡らします。' },
      { position: 2, instruction: 'トースターで焼きます。' },
      { position: 3, instruction: '焼きたてに、無塩バターをのせます。' },
      { position: 4, instruction: 'ブラックペッパーを挽きかけます。' },
    ],
    notes: ['たまり餅自体に味がついているため、無塩バターがおすすめです。'],
    relatedProductIds: ['tamari'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: 'たまり餅のバター黒胡椒',
      description:
        '焼きたてのたまり餅に無塩バターと黒胡椒を合わせる食べ方。飛騨高山・山田もち店のたまり餅アレンジです。',
      canonicalPath: '/recipes/tamari-mochi-butter-pepper',
    },
  },
];
