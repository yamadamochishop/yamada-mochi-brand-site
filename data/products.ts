export type Product = {
  slug: string;
  name: string;
  english: string;
  catchcopy: string;
  short: string;
  story: string;
  image: string;
  accent: string;
  price: string;
  content: string;
  ingredients: string;
  shelfLife: string;
  storage: string;
  allergy: string;
  shipping: string;
  traits: { title: string; text: string }[];
  ways: { title: string; text: string }[];
  ownerRecommendation: string;
  recommendedFor: string[];
  related: string[];
  seo: {
    title: string;
    description: string;
  };
};

export const products: Product[] = [
  {
    slug: "plain",
    name: "プレーン",
    english: "Plain",
    catchcopy: "米のおいしさを、そのまま味わう。",
    short: "飛騨高山で育てたもち米の甘みを、まっすぐに。",
    story:
      "山田もち店の基本となる、白い切り餅。千島町・越後町の田んぼで育てた「たかやまもち」を100％使用し、余計な味を加えず、米そのものの甘みと粘りを大切にしています。焼くと表面は香ばしく、中はやわらかく伸び、旅先の朝市で出会った素朴なおいしさが食卓によみがえります。まずは何もつけず、米の香りを味わっていただきたい一品です。",
    image: "/images/lineup-plain.jpg",
    accent: "#efe9dc",
    price: "440円（税込）",
    content: "4枚入り / 200g",
    ingredients: "もち米（岐阜県高山市産）",
    shelfLife: "商品ラベルに記載",
    storage: "直射日光・高温多湿を避け、冷暗所で保存。長期保存は冷凍がおすすめです。",
    allergy: "なし",
    shipping: "常温または冷蔵（季節・配送条件により調整）",
    traits: [
      { title: "甘み", text: "もち米本来のやさしい甘み" },
      { title: "香り", text: "焼いた時に広がる米の香ばしさ" },
      { title: "食感", text: "なめらかで、しっかり伸びる" },
      { title: "焼き上がり", text: "外は香ばしく、中はもっちり" }
    ],
    ways: [
      { title: "醤油", text: "焼き餅の王道。米の甘みが引き立ちます。" },
      { title: "きな粉", text: "お子様にも食べやすい、やさしい甘さ。" },
      { title: "磯辺焼き", text: "海苔の香りともち米の香ばしさを一緒に。" },
      { title: "お雑煮", text: "出汁の中でも形が崩れにくく、食べごたえがあります。" }
    ],
    ownerRecommendation:
      "最初の一枚は、ぜひ何もつけずに焼いてみてください。たかやまもちの甘みが一番わかります。",
    recommendedFor: ["初めての方", "ご自宅用", "お子様のいる家庭", "贈り物"],
    related: ["yomogi", "sansyokumame", "kombu"],
    seo: {
      title: "プレーン｜山田もち店",
      description:
        "100％自家栽培のもち米「たかやまもち」でつくる山田もち店の定番。米本来の甘みを味わえる切り餅です。"
    }
  },
  {
    slug: "yomogi",
    name: "草もち",
    english: "Yomogi",
    catchcopy: "春の香りを、ひとくち。",
    short: "よもぎの香りと、もち米の甘み。",
    story:
      "焼きはじめると、ふわりと立ち上がるよもぎの香り。山田もち店の草もちは、飛騨高山の自然を感じる香りと、もち米のやさしい甘みを一緒に楽しめる一枚です。どこか懐かしく、昔おばあちゃんが作ってくれた草餅を思い出すような味わい。あんこやきな粉を添えても、何もつけずにそのままでも、春の記憶が食卓に広がります。",
    image: "/images/lineup-yomogi.jpg",
    accent: "#8b9b67",
    price: "440円（税込）",
    content: "4枚入り / 200g",
    ingredients: "もち米（岐阜県高山市産）、よもぎ、重曹",
    shelfLife: "商品ラベルに記載",
    storage: "直射日光・高温多湿を避け、冷暗所で保存。長期保存は冷凍がおすすめです。",
    allergy: "なし",
    shipping: "常温または冷蔵（季節・配送条件により調整）",
    traits: [
      { title: "香り", text: "よもぎの青くやさしい香り" },
      { title: "甘み", text: "もち米の甘さと草の風味" },
      { title: "食感", text: "なめらかで歯切れのよい餅" },
      { title: "余韻", text: "食後に残る春らしい香り" }
    ],
    ways: [
      { title: "そのまま", text: "香りを一番まっすぐ楽しめます。" },
      { title: "あんこ", text: "よもぎの香りと小豆の甘みがよく合います。" },
      { title: "きな粉", text: "香ばしさを重ねて、やさしいおやつに。" },
      { title: "ネギ味噌", text: "甘くない食べ方にもよく合います。" }
    ],
    ownerRecommendation:
      "少し焦げ目がつくまで焼くと、よもぎの香りがより立ちます。あんこを添えるのもおすすめです。",
    recommendedFor: ["草もちが好きな方", "贈り物", "お茶の時間", "リピーター"],
    related: ["plain", "sansyokumame", "tamari"],
    seo: {
      title: "草もち｜山田もち店",
      description:
        "よもぎの香りと自家栽培もち米の甘みを楽しむ、飛騨高山の草もち。懐かしい味わいの切り餅です。"
    }
  },
  {
    slug: "sansyokumame",
    name: "三色豆もち",
    english: "Sansyokumame",
    catchcopy: "豆の甘みと、もちのやさしさ。",
    short: "黒豆・青大豆・大豆の甘みを楽しむ一枚。",
    story:
      "白い餅の中に、黒豆・青大豆・大豆を散りばめた三色豆もち。噛むたびに豆のほくほくとした甘みが広がり、もち米のやわらかな甘さと重なります。見た目にも華やかで、詰め合わせに入ると贈り物らしさが増す一枚です。朝食にも、お茶の時間にも、少しだけ特別感のあるお餅として楽しんでいただけます。",
    image: "/images/lineup-sansyokumame.jpg",
    accent: "#c49a62",
    price: "440円（税込）",
    content: "4枚入り / 200g",
    ingredients: "もち米（岐阜県高山市産）、大豆、黒豆、青大豆、食塩",
    shelfLife: "商品ラベルに記載",
    storage: "直射日光・高温多湿を避け、冷暗所で保存。長期保存は冷凍がおすすめです。",
    allergy: "大豆",
    shipping: "常温または冷蔵（季節・配送条件により調整）",
    traits: [
      { title: "甘み", text: "豆ともち米の自然な甘み" },
      { title: "香り", text: "焼いた豆の香ばしさ" },
      { title: "食感", text: "もちもちの中に豆のほくほく感" },
      { title: "見た目", text: "彩りがあり、ギフトにも映える" }
    ],
    ways: [
      { title: "そのまま", text: "豆の甘みをシンプルに。" },
      { title: "お茶と一緒に", text: "香ばしさが引き立ちます。" },
      { title: "朝食に", text: "満足感のある一枚です。" },
      { title: "詰め合わせに", text: "彩りと食感のアクセントになります。" }
    ],
    ownerRecommendation:
      "豆の香ばしさを楽しむなら、表面が少し色づくまで焼くのがおすすめです。",
    recommendedFor: ["豆もちが好きな方", "贈り物", "朝食", "ご年配の方"],
    related: ["plain", "yomogi", "tamari"],
    seo: {
      title: "三色豆もち｜山田もち店",
      description:
        "黒豆・青大豆・大豆の甘みと、たかやまもちのやさしい食感を楽しむ山田もち店の三色豆もち。"
    }
  },
  {
    slug: "kombu",
    name: "昆布もち",
    english: "Kombu",
    catchcopy: "旨みが、あとを引く。",
    short: "昆布の旨みを練り込んだ、食事にも合うお餅。",
    story:
      "昆布の旨みを、もち米の甘みの中に閉じ込めた昆布もち。焼くと昆布の香りがふわりと立ち、噛むほどにじんわりと旨みが広がります。甘いお餅とは違い、食事の一品としても楽しめるのが魅力。お雑煮やお茶漬けに入れても、出汁のように味わいが重なり、いつもの食卓に飛騨高山の朝市らしい素朴なおいしさを添えてくれます。",
    image: "/images/lineup-kombu.jpg",
    accent: "#51594a",
    price: "440円（税込）",
    content: "4枚入り / 200g",
    ingredients: "もち米（岐阜県高山市産）、昆布、食塩",
    shelfLife: "商品ラベルに記載",
    storage: "直射日光・高温多湿を避け、冷暗所で保存。長期保存は冷凍がおすすめです。",
    allergy: "なし",
    shipping: "常温または冷蔵（季節・配送条件により調整）",
    traits: [
      { title: "旨み", text: "昆布のじんわりした味わい" },
      { title: "香り", text: "焼いた時に立つ磯の香り" },
      { title: "食感", text: "もちのやわらかさと昆布のアクセント" },
      { title: "相性", text: "汁物やお茶漬けにも合う" }
    ],
    ways: [
      { title: "そのまま", text: "昆布の旨みをシンプルに。" },
      { title: "お雑煮", text: "出汁との相性が良い一枚です。" },
      { title: "お茶漬け", text: "軽い食事にもおすすめ。" },
      { title: "磯辺風", text: "海苔を巻いて旨みを重ねても。" }
    ],
    ownerRecommendation:
      "甘い味付けより、醤油を少しだけ。昆布の旨みが引き立ちます。",
    recommendedFor: ["甘くない餅が好きな方", "お酒のあと", "ご自宅用", "お雑煮"],
    related: ["plain", "tamari", "ebi"],
    seo: {
      title: "昆布もち｜山田もち店",
      description:
        "昆布の旨みがあとを引く、食事にも合う飛騨高山の切り餅。お雑煮やお茶漬けにもおすすめです。"
    }
  },
  {
    slug: "tamari",
    name: "たまりもち",
    english: "Tamari",
    catchcopy: "焼けば、香ばしさが広がる。",
    short: "たまり醤油の香ばしさが楽しめる一枚。",
    story:
      "たまり醤油を練り込んだ、香ばしい味わいの切り餅。焼き網にのせると、醤油の香りがふわっと広がり、思わず食欲を誘います。何もつけなくても味があり、忙しい朝や小腹が空いた時にも食べやすい一枚です。昔ながらの素朴さの中に、焼いた瞬間の香ばしさがあり、山田もち店の中でも根強い人気があります。",
    image: "/images/lineup-tamari.jpg",
    accent: "#73512f",
    price: "440円（税込）",
    content: "4枚入り / 200g",
    ingredients: "もち米（岐阜県高山市産）、醤油（一部に大豆・小麦を含む）",
    shelfLife: "商品ラベルに記載",
    storage: "直射日光・高温多湿を避け、冷暗所で保存。長期保存は冷凍がおすすめです。",
    allergy: "大豆・小麦",
    shipping: "常温または冷蔵（季節・配送条件により調整）",
    traits: [
      { title: "香ばしさ", text: "焼いた時に広がる醤油の香り" },
      { title: "味わい", text: "何もつけずに楽しめるほどよい味" },
      { title: "食感", text: "外はこんがり、中はもっちり" },
      { title: "満足感", text: "軽食にもなるしっかりした一枚" }
    ],
    ways: [
      { title: "そのまま", text: "味付きなので、焼くだけでおいしい。" },
      { title: "海苔巻き", text: "香ばしさに海苔の風味を重ねて。" },
      { title: "バター醤油", text: "少し贅沢なおやつに。" },
      { title: "朝食", text: "忙しい朝にも手軽です。" }
    ],
    ownerRecommendation:
      "焼きすぎない程度に、表面をこんがり。香りが立ったタイミングが食べごろです。",
    recommendedFor: ["香ばしい味が好きな方", "朝食", "軽食", "リピーター"],
    related: ["plain", "kombu", "ebi"],
    seo: {
      title: "たまりもち｜山田もち店",
      description:
        "焼けば香ばしさが広がる、たまり醤油を練り込んだ山田もち店の切り餅。"
    }
  },
  {
    slug: "ebi",
    name: "黒ごま海老もち",
    english: "Ebi",
    catchcopy: "香ばしさ、重なる。",
    short: "海老と黒ごまの香ばしさを楽しむ一枚。",
    story:
      "海老の風味と黒ごまの香ばしさを重ねた、彩りのある切り餅。焼くと海老の香りが立ち、黒ごまの風味があとからふわりと広がります。見た目にもやさしい紅色で、詰め合わせの中でも印象に残る一枚。お正月や贈り物はもちろん、普段の食卓にも少し華やかさを添えてくれるお餅です。",
    image: "/images/lineup-ebi.jpg",
    accent: "#d47d63",
    price: "440円（税込）",
    content: "4枚入り / 200g",
    ingredients: "もち米（岐阜県高山市産）、干し海老、黒ごま、食塩、着色料（一部にえび・ごまを含む）",
    shelfLife: "商品ラベルに記載",
    storage: "直射日光・高温多湿を避け、冷暗所で保存。長期保存は冷凍がおすすめです。",
    allergy: "えび・ごま",
    shipping: "常温または冷蔵（季節・配送条件により調整）",
    traits: [
      { title: "香り", text: "海老と黒ごまの香ばしさ" },
      { title: "彩り", text: "淡い紅色が食卓に映える" },
      { title: "味わい", text: "塩気と旨みのバランス" },
      { title: "相性", text: "お雑煮や焼き餅におすすめ" }
    ],
    ways: [
      { title: "そのまま", text: "香りを楽しむならシンプルに。" },
      { title: "お雑煮", text: "汁物に入れると華やかに。" },
      { title: "醤油少々", text: "香ばしさがさらに引き立ちます。" },
      { title: "ギフト", text: "詰め合わせの彩り役に。" }
    ],
    ownerRecommendation:
      "海老の香りが立つので、焼きたてをすぐに。お正月のお雑煮にもよく合います。",
    recommendedFor: ["香ばしい味が好きな方", "贈り物", "お正月", "詰め合わせ"],
    related: ["kombu", "tamari", "sansyokumame"],
    seo: {
      title: "黒ごま海老もち｜山田もち店",
      description:
        "海老と黒ごまの香ばしさが重なる、彩りのある山田もち店の切り餅。ギフトにもおすすめです。"
    }
  }
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slugs: string[]) {
  return slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));
}
