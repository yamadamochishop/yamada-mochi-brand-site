import type { RecipeRecord } from '../types/content-model.ts';

/**
 * Recipe Hub の公開レシピ。
 *
 * 山田家で親しんできた食べ方、旧山田もち店サイトで公開していたレシピ、
 * 調査した定番アレンジのうちHumanが掲載を承認した内容で構成する。
 * 次の値は確認が取れていないため、推測で設定しない。
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
      '山田もち店のお餅は、まず焼くところから。ご家庭のトースターでおいしく焼くための、いちばん基本の焼き方です。フライパン・電子レンジ・冷凍したお餅の焼き方もあわせてご紹介します。',
    category: 'mochi',
    ingredients: [{ name: '山田もち店の切り餅', amount: '適量' }],
    steps: [
      { position: 1, instruction: 'お餅の表面を、さっと水で濡らします。' },
      { position: 2, instruction: 'トースター（1000W）で4〜5分を目安に焼きます。' },
      {
        position: 3,
        instruction:
          '表面に軽く焼き色がつき、中までやわらかくなれば食べ頃です。硬ければ様子を見ながら追加で加熱します。',
      },
    ],
    notes: [
      'トースターによって火力が違うため、時間は目安です。',
      '焦げそうなのに中心が硬い場合は、火を止めて庫内の余熱で少し置きます。',
      'くっつきが気になる場合は、使用機器の説明書を確認したうえで、餅がくっつきにくいアルミホイル等を使用してください。',
    ],
    // Recipe構造化データの手順（recipeInstructions）は上の主工程だけ。
    // ここに並べる別の焼き方はvariationとして表示のみに使い、構造化データへは混ぜない。
    variations: [
      {
        title: 'フライパンで焼く',
        text: '薄く油をひいたフライパンに餅を置き、中火で焼き色がつくまで約4分。裏返し、弱めの中火で4〜5分を目安に、中までやわらかくなるまで焼きます。餅の厚さによって時間を調整してください。',
      },
      {
        title: '電子レンジでやわらかく',
        text: '切り餅2個を耐熱容器に重ならないように置き、水約50mlを加えて上下を濡らします。ラップをせず600Wで1〜1分30秒を目安に加熱し、水気を切ります。焼き目はつかないため、きなこ餅・あんこ餅などに向きます。',
      },
      {
        title: '冷凍したお餅',
        text: '冷凍餅を香ばしく焼きたい場合は、ラップを外す前に500Wの電子レンジで約30秒加熱して半解凍し、その後トースターで焼き色がつくまで焼きます。餅の大きさによって加熱時間を調整してください。',
      },
    ],
    column: {
      title: '山田家では、ストーブの上で。',
      body: '冬になると、山田家では石油ストーブの上でじっくり焼くことも多くあります。ご家庭でおすすめしているのはトースターです。',
    },
    relatedProductIds: ['plain', 'yomogi', 'sansyokumame', 'kombu', 'tamari', 'ebi'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: 'お餅のおいしい焼き方｜トースター・フライパン・レンジ',
      description:
        '切り餅のおいしい焼き方を餅屋が紹介。山田もち店おすすめのトースター1000Wで4〜5分を基本に、フライパン、電子レンジ、冷凍餅の焼き方もまとめました。',
      canonicalPath: '/recipes/mochi-yakikata',
    },
  },
  {
    id: 'isobeyaki',
    slug: 'isobeyaki',
    title: '山田家の磯辺焼き',
    description: '焼いた白餅に砂糖醤油を絡めて、炙った焼き海苔で包みます。',
    category: 'mochi',
    ingredients: [
      { name: 'プレーン（白餅）', amount: '適量' },
      { name: '上白糖', amount: '大さじ1' },
      { name: '濃口醤油', amount: '大さじ2' },
      { name: '焼き海苔', amount: '適量' },
    ],
    steps: [
      { position: 1, instruction: '白餅をトースターで焼きます。' },
      { position: 2, instruction: '上白糖大さじ1と濃口醤油大さじ2を混ぜます。' },
      { position: 3, instruction: '焼けた餅を絡めます。' },
      { position: 4, instruction: '焼き海苔をさっと炙ります。' },
      { position: 5, instruction: '海苔で餅を包んで食べます。' },
    ],
    variations: [
      {
        title: '九州地方の甘い醤油で',
        text: '砂糖を入れずに、九州地方の甘い醤油で絡めて食べるのもおすすめです。',
      },
    ],
    relatedProductIds: ['plain'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: '磯辺焼きの作り方｜砂糖醤油と焼き海苔で楽しむ山田家の味',
      description:
        '焼いた白餅に砂糖醤油を絡め、炙った焼き海苔で包む磯辺焼きの作り方。飛騨高山・山田もち店の山田家で親しんできた食べ方です。',
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
    variations: [
      {
        title: 'ごま油とブラックペッパーで',
        text: '旧山田もち店サイトでは、焼き上がりにごま油をほんの少しとブラックペッパーを合わせる食べ方も紹介していました。おつまみにもおすすめです。',
      },
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
    description: '焼いた昆布餅をお椀に入れ、薄めに作った鰹だしを注ぎます。',
    category: 'mochi',
    ingredients: [
      { name: '昆布餅', amount: '適量' },
      { name: '鰹だし', amount: '約100ml', note: 'ほんだしでも可' },
    ],
    steps: [
      { position: 1, instruction: '昆布餅をトースターで焼きます。' },
      { position: 2, instruction: '鰹だしを、塩味が控えめになるよう薄めに作ります。' },
      { position: 3, instruction: '焼いた昆布餅をお椀に入れます。' },
      { position: 4, instruction: '鰹だしを注ぎます。' },
    ],
    notes: ['焼いた昆布餅から昆布の旨みが出て、合わせだしのような味わいになります。'],
    relatedProductIds: ['kombu'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: '昆布餅のお雑煮風｜鰹だしで楽しむ簡単な食べ方',
      description:
        '焼いた昆布餅に薄めの鰹だしを注ぐだけのお雑煮風。飛騨高山・山田もち店の昆布餅を使った簡単な食べ方です。',
      canonicalPath: '/recipes/kombu-mochi-ozoni-fu',
    },
  },
  {
    id: 'age-mame-mochi',
    slug: 'age-mame-mochi',
    title: 'カリッと揚げ豆餅',
    description: '三色豆餅を約2cm角に切って揚げ、熱いうちに軽く塩をふる食べ方です。',
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
    description: '市販のつぶあんをお湯で溶かし、焼いた草餅を加えるぜんざいです。',
    category: 'mochi',
    ingredients: [
      { name: '草餅', amount: '適量' },
      { name: '市販のつぶあん', amount: '適量' },
      { name: 'お湯', amount: '適量' },
      { name: '砂糖', amount: '好みで少し' },
    ],
    steps: [
      { position: 1, instruction: '草餅をトースターで焼きます。' },
      {
        position: 2,
        instruction: '市販のつぶあんをお湯で溶かし、お汁粉くらいの濃度にします。',
      },
      { position: 3, instruction: '甘さが欲しければ、砂糖を少し足します。' },
      { position: 4, instruction: '焼いた草餅を加えます。' },
    ],
    variations: [
      {
        title: '甘酒で作る',
        text: 'お湯の代わりに甘酒を入れて作るのもおすすめです。',
      },
    ],
    relatedProductIds: ['yomogi'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: '草餅のぜんざい｜焼いたよもぎ餅で作る簡単おやつ',
      description:
        '市販のつぶあんをお湯で溶かし、焼いた草餅を加えるだけの簡単なぜんざい。飛騨高山・山田もち店の草餅を使ったおやつです。',
      canonicalPath: '/recipes/yomogi-mochi-zenzai',
    },
  },
  {
    id: 'tamari-mochi-butter-pepper',
    slug: 'tamari-mochi-butter-pepper',
    title: 'たまり餅のバター黒胡椒',
    description: '焼いたたまり餅に無塩バターをのせ、ブラックペッパーを削りかけます。',
    category: 'mochi',
    ingredients: [
      { name: 'たまり餅', amount: '適量' },
      { name: '無塩バター', amount: '適量' },
      { name: 'ブラックペッパー', amount: '適量' },
    ],
    steps: [
      { position: 1, instruction: 'たまり餅をトースターで焼きます。' },
      { position: 2, instruction: '無塩バターをのせます。' },
      { position: 3, instruction: 'ブラックペッパーを削りかけて食べます。' },
    ],
    relatedProductIds: ['tamari'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: 'たまり餅のバター黒胡椒',
      description:
        '焼いたたまり餅に無塩バターとブラックペッパーを合わせる、飛騨高山・山田もち店のたまり餅の食べ方です。',
      canonicalPath: '/recipes/tamari-mochi-butter-pepper',
    },
  },
  {
    id: 'garlic-butter-mochi',
    slug: 'garlic-butter-mochi',
    title: 'ガーリックバター餅',
    description:
      '香ばしく焼いた白餅にガーリックバターをたっぷり塗り、もう一度トースターへ。にんにくとバターの香りが広がる簡単アレンジです。',
    category: 'mochi',
    ingredients: [
      { name: 'プレーン（白餅）', amount: '2切れ' },
      { name: '市販のガーリックバター', amount: '大さじ1程度' },
    ],
    steps: [
      { position: 1, instruction: '白餅をトースターで3分ほど焼きます。' },
      { position: 2, instruction: '表面にガーリックバターをしっかり塗ります。' },
      {
        position: 3,
        instruction: '再びトースターへ入れ、約2分、表面に軽く焼き色がつくまで焼きます。',
      },
    ],
    notes: [
      'トースターによって火力が異なるため、ガーリックバターが焦げすぎないよう様子を見ながら焼いてください。',
    ],
    relatedProductIds: ['plain'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: 'ガーリックバター餅の作り方｜トースターで簡単',
      description:
        '焼いた白餅にガーリックバターを塗ってもう一度トースターで焼くだけ。飛騨高山・山田もち店の切り餅で作る簡単アレンジです。',
      canonicalPath: '/recipes/garlic-butter-mochi',
    },
  },
  {
    id: 'mentaiko-mayo-mochi',
    slug: 'mentaiko-mayo-mochi',
    title: '明太子マヨ餅',
    description:
      '香ばしく焼いた白餅に明太マヨをのせてもう一度トースターへ。明太子の塩気とマヨネーズのコクがよく合う簡単アレンジです。',
    category: 'mochi',
    ingredients: [
      { name: 'プレーン（白餅）', amount: '1切れ' },
      { name: '明太子', amount: '1/4本' },
      { name: 'マヨネーズ', amount: '大さじ1' },
      { name: '刻み海苔', amount: '適量' },
    ],
    steps: [
      { position: 1, instruction: '白餅をトースターで軽く焼き色がつくまで焼きます。' },
      { position: 2, instruction: '明太子とマヨネーズを混ぜます。' },
      { position: 3, instruction: '焼いた餅の上に明太マヨを塗ります。' },
      { position: 4, instruction: '再びトースターで約2分焼きます。' },
      { position: 5, instruction: '好みで刻み海苔をのせます。' },
    ],
    relatedProductIds: ['plain'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: '明太子マヨ餅の作り方｜トースターで簡単アレンジ',
      description:
        '焼いた白餅に明太マヨをのせて、もう一度トースターで焼くだけ。飛騨高山・山田もち店の切り餅で作る簡単アレンジです。',
      canonicalPath: '/recipes/mentaiko-mayo-mochi',
    },
  },
  {
    id: 'yomogi-an-butter',
    slug: 'yomogi-an-butter',
    title: '草餅のあんバター',
    description:
      '香ばしく焼いた草餅につぶあんとバターを。よもぎの香り、あんこの甘み、バターのコクを一緒に楽しむ簡単なおやつです。',
    category: 'mochi',
    ingredients: [
      { name: '草餅', amount: '2切れ' },
      { name: 'つぶあん', amount: '適量' },
      { name: 'バター', amount: '2片' },
    ],
    steps: [
      { position: 1, instruction: '草餅をトースターで5分ほど、やわらかくなるまで焼きます。' },
      { position: 2, instruction: '焼いた草餅につぶあんとバターをのせます。' },
      {
        position: 3,
        instruction:
          '火を止めたトースターの余熱で2分ほど置き、バターが少しやわらかくなったら完成です。',
      },
    ],
    relatedProductIds: ['yomogi'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: '草餅のあんバター｜よもぎ餅の簡単アレンジ',
      description:
        '焼いた草餅につぶあんとバターをのせるだけ。飛騨高山・山田もち店のよもぎ餅で作る簡単なおやつです。',
      canonicalPath: '/recipes/yomogi-an-butter',
    },
  },
  {
    id: 'dashi-butter-mochi',
    slug: 'dashi-butter-mochi',
    title: 'レンジで簡単 だしバター餅',
    description:
      'やわらかくした白餅に、だしの効いためんつゆとバターを絡めるだけ。忙しい時にも作りやすい、シンプルなお餅アレンジです。',
    category: 'mochi',
    ingredients: [
      { name: 'プレーン（白餅）', amount: '2切れ' },
      { name: 'めんつゆ（4倍濃縮）', amount: '小さじ1' },
      { name: 'バター', amount: '5g' },
    ],
    steps: [
      { position: 1, instruction: '白餅をさっと水にくぐらせ、耐熱皿へ置きます。' },
      {
        position: 2,
        instruction: 'ラップをせず600Wの電子レンジで約1分、やわらかくなるまで加熱します。',
      },
      { position: 3, instruction: 'めんつゆをかけて餅に絡めます。' },
      { position: 4, instruction: 'バターをのせます。' },
    ],
    notes: [
      '電子レンジによって加熱時間が異なります。硬い場合は短時間ずつ追加してください。めんつゆの濃縮倍率が違う場合は量を調整してください。',
    ],
    relatedProductIds: ['plain'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: 'だしバター餅｜電子レンジで簡単なお餅レシピ',
      description:
        '電子レンジでやわらかくした白餅に、めんつゆとバターを絡めるだけ。飛騨高山・山田もち店の切り餅で作るシンプルなアレンジです。',
      canonicalPath: '/recipes/dashi-butter-mochi',
    },
  },
  {
    id: 'mochi-pizza',
    slug: 'mochi-pizza',
    title: 'トースターで簡単 ピザ餅',
    description:
      '白餅にトマト、ソーセージまたはベーコン、チーズをのせて焼くだけ。朝食や軽食にも食べやすい、山田もち店の昔からのアレンジです。',
    category: 'mochi',
    ingredients: [
      { name: 'プレーン（白餅）', amount: '1切れ' },
      { name: 'とろけるチーズ', amount: 'ひとつかみ', note: 'スライスチーズなら1枚' },
      { name: 'ミニトマト', amount: '1個' },
      { name: 'ソーセージ（またはベーコン）', amount: '1本', note: 'ベーコンなら約20g' },
    ],
    steps: [
      {
        position: 1,
        instruction: 'ミニトマトを半分に切り、ソーセージまたはベーコンを食べやすく切ります。',
      },
      { position: 2, instruction: '白餅の上にトマト、ソーセージまたはベーコンをのせます。' },
      { position: 3, instruction: '上からチーズをのせます。' },
      {
        position: 4,
        instruction: 'トースターで、餅がやわらかく膨らみ、チーズが溶けるまで焼きます。',
      },
    ],
    relatedProductIds: ['plain'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: '餅ピザの簡単レシピ｜トースターでチーズがとろける',
      description:
        '白餅にトマト、ソーセージまたはベーコン、チーズをのせてトースターで焼くだけ。飛騨高山・山田もち店の昔からのアレンジです。',
      canonicalPath: '/recipes/mochi-pizza',
    },
  },
  {
    id: 'mochi-ebi-ajillo',
    slug: 'mochi-ebi-ajillo',
    title: '餅と海老のアヒージョ',
    description:
      'もちもちの白餅と海老を、にんにくの香るオリーブオイルで。おつまみにも食事にも楽しめる、山田もち店の旧レシピを整えたアレンジです。',
    category: 'mochi',
    ingredients: [
      { name: 'プレーン（白餅）', amount: '1切れ' },
      { name: 'むき海老', amount: '4尾' },
      { name: 'にんにく', amount: '1片' },
      { name: 'オリーブオイル', amount: '100ml' },
      { name: '鷹の爪', amount: '1本' },
      { name: '塩', amount: '少々' },
    ],
    steps: [
      { position: 1, instruction: '白餅を1.5〜2cm程度の一口サイズに切ります。' },
      { position: 2, instruction: '海老は必要に応じて背わたを取り、水気をしっかり拭きます。' },
      { position: 3, instruction: 'にんにくを薄切りにします。' },
      {
        position: 4,
        instruction:
          '小さめのフライパンまたはスキレットにオリーブオイル、にんにく、鷹の爪、塩を入れ、弱火で香りを出します。',
      },
      {
        position: 5,
        instruction:
          '餅と海老を加え、海老に火が通り、餅の表面が膨らんでやわらかくなるまで3〜5分を目安に加熱します。',
      },
    ],
    notes: ['水分が残っていると油がはねやすいため、海老の水気をよく拭いてから加えてください。'],
    relatedProductIds: ['plain'],
    author: '山田もち店',
    status: 'published',
    seo: {
      title: '餅と海老のアヒージョ｜切り餅のおつまみアレンジ',
      description:
        '一口大に切った白餅と海老を、にんにくの香るオリーブオイルで。飛騨高山・山田もち店の切り餅で作るおつまみアレンジです。',
      canonicalPath: '/recipes/mochi-ebi-ajillo',
    },
  },
];
