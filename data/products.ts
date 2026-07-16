export type Product = {
  slug: string;
  name: string;
  cardName: string;
  english: string;
  catchcopy: string;
  short: string;
  story: string;
  image: string;
  imageAlt?: string;
  cardImage?: string;
  cardImageAlt?: string;
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
    cardName: "プレーン",
    english: "Plain",
    catchcopy: "米のおいしさを、そのまま味わう。",
    short: "飛騨高山で育てたもち米の甘みを、まっすぐに。",
    story:
      "山田もち店のすべての味の土台になる、いちばん基本の白もちです。飛騨高山の千島町・越後町で家族が育てたもち米「たかやまもち」を100％使用し、米の甘み、粘り、香りをまっすぐに味わえるよう仕上げました。焼くと表面は香ばしく、中はやわらかく伸び、朝市で出会う素朴なおいしさがご自宅の食卓にも広がります。初めての方にも、贈り物にも選びやすい定番です。",
    image: "/images/lineup-plain.jpg",
    imageAlt: "山田もち店の白切り餅",
    cardImage: "/images/lineup-plain.jpg",
    cardImageAlt: "山田もち店の白切り餅",
    accent: "#efe9dc",
    price: "440円（税込）",
    content: "4枚入り / 200g",
    ingredients: "もち米（岐阜県高山市産）",
    shelfLife: "商品ラベルに記載",
    storage: "直射日光・高温多湿を避けて常温保存。開封後は密封して冷蔵し、長期保存する場合は1枚ずつ包んで冷凍してください。",
    allergy: "なし",
    shipping: "常温または冷蔵（季節・配送条件により調整）",
    traits: [
      { title: "甘み", text: "自家栽培もち米「たかやまもち」の自然な甘み" },
      { title: "香り", text: "焼いた瞬間に立つ、米の素直な香ばしさ" },
      { title: "食感", text: "外は香ばしく、中はなめらかにもっちり" },
      { title: "使いやすさ", text: "甘い味にも食事にも合わせやすい基本の味" }
    ],
    ways: [
      { title: "焼き餅", text: "まずは焼きたてを、そのままシンプルに。" },
      { title: "海苔と醤油", text: "焼いたお餅に海苔と醤油を合わせる、親しみのある食べ方です。" },
      { title: "お雑煮", text: "お正月や季節の汁物に加えて楽しめます。" },
      { title: "ぜんざい", text: "甘いものが食べたい時は、ぜんざいにも合わせられます。" }
    ],
    ownerRecommendation:
      "最初の一枚は、ぜひ何もつけずに焼いてみてください。たかやまもち100％の甘みと香りが一番よくわかります。",
    recommendedFor: ["初めての方", "ご自宅用", "お子様のいる家庭", "贈り物"],
    related: ["yomogi", "sansyokumame", "kombu"],
    seo: {
      title: "プレーン｜飛騨高山の切り餅",
      description:
        "飛騨高山で自家栽培したもち米「たかやまもち」100％の白もち。通販でも選びやすい山田もち店の基本の切り餅です。"
    }
  },
  {
    slug: "yomogi",
    name: "草もち",
    cardName: "草",
    english: "Yomogi",
    catchcopy: "春の香りを、ひとくち。",
    short: "高山産よもぎの香りを楽しむ、春の風味のお餅。",
    story:
      "高山産よもぎの清らかな香りを、もち米の甘みと一緒に楽しむ草もちです。焼きはじめると、青くやさしい香りがふわりと立ち、どこか懐かしい春の風景を思わせます。自家栽培の「たかやまもち」が持つ素朴な甘みと、よもぎのほろ苦い余韻がほどよく重なり、あんこやきな粉とも相性のよい一枚。お茶の時間にも、贈り物にもおすすめです。",
    image: "/images/lineup-yomogi.jpg",
    imageAlt: "よもぎを練り込んだ草切り餅",
    accent: "#8b9b67",
    price: "440円（税込）",
    content: "4枚入り / 200g",
    ingredients: "もち米（岐阜県高山市産）、よもぎ（高山産）、重曹",
    shelfLife: "商品ラベルに記載",
    storage: "直射日光・高温多湿を避けて常温保存。開封後は密封して冷蔵し、長期保存する場合は1枚ずつ包んで冷凍してください。",
    allergy: "なし",
    shipping: "常温または冷蔵（季節・配送条件により調整）",
    traits: [
      { title: "香り", text: "高山産よもぎの青く清らかな香り" },
      { title: "甘み", text: "もち米の甘さとよもぎのほろ苦さ" },
      { title: "食感", text: "なめらかで、焼くとやわらかく伸びる" },
      { title: "余韻", text: "食後にふわりと残る春らしい風味" }
    ],
    ways: [
      { title: "焼き餅", text: "軽く焼いて、よもぎの香りを楽しみます。" },
      { title: "あんこ", text: "小豆の甘みとよもぎの香りがよく合います。" },
      { title: "きな粉", text: "香ばしさを重ねて、やさしいおやつに。" },
      { title: "軽く焼いて", text: "焼き目を少しつけると、香りがより立ちます。" }
    ],
    ownerRecommendation:
      "焼き目は軽めに。よもぎの香りが立ったところで、あんこを少し添えるのもおすすめです。",
    recommendedFor: ["草もちが好きな方", "贈り物", "お茶の時間", "リピーター"],
    related: ["plain", "sansyokumame", "tamari"],
    seo: {
      title: "草もち｜飛騨高山の切り餅",
      description:
        "高山産よもぎの香りと自家栽培もち米の甘みを楽しむ、山田もち店の草もち。春の風味を感じる切り餅です。"
    }
  },
  {
    slug: "sansyokumame",
    name: "三色豆もち",
    cardName: "三色豆",
    english: "Sansyokumame",
    catchcopy: "豆の甘みと、もちのやさしさ。",
    short: "黒豆・青大豆・大豆の甘みを楽しむ一枚。",
    story:
      "黒豆・青大豆・大豆を散りばめた、見た目にも楽しい豆もちです。噛むたびに豆のほくほくとした食感と自然な甘みが広がり、自家栽培もち米のやさしい甘さと重なります。彩りがあるので詰め合わせにも映え、贈り物にも選びやすい一枚。朝食やお茶の時間に、少しだけ特別感のあるお餅として楽しんでいただけます。",
    image: "/images/lineup-sansyokumame.jpg",
    imageAlt: "三種類の豆を練り込んだ三色豆切り餅",
    accent: "#c49a62",
    price: "440円（税込）",
    content: "4枚入り / 200g",
    ingredients: "もち米（岐阜県高山市産）、大豆、黒豆、青大豆、食塩",
    shelfLife: "商品ラベルに記載",
    storage: "直射日光・高温多湿を避けて常温保存。開封後は密封して冷蔵し、長期保存する場合は1枚ずつ包んで冷凍してください。",
    allergy: "大豆",
    shipping: "常温または冷蔵（季節・配送条件により調整）",
    traits: [
      { title: "甘み", text: "三種の豆ともち米の自然な甘み" },
      { title: "香り", text: "焼いた豆のほのかな香ばしさ" },
      { title: "食感", text: "もちもちの中に豆のほくほく感" },
      { title: "見た目", text: "彩りがあり、ギフトにも映える" }
    ],
    ways: [
      { title: "焼き餅", text: "焼くと豆の香ばしさと食感を楽しめます。" },
      { title: "海苔と醤油", text: "豆の風味を生かした、食事にも合う食べ方です。" },
      { title: "バター醤油", text: "焼いたお餅に少量のバターと醤油を合わせる食べ方です。" }
    ],
    ownerRecommendation:
      "豆の香ばしさを楽しむなら、表面が少し色づくまで焼くのがおすすめです。何もつけずにどうぞ。",
    recommendedFor: ["豆もちが好きな方", "贈り物", "朝食", "ご年配の方"],
    related: ["plain", "yomogi", "tamari"],
    seo: {
      title: "三色豆もち｜飛騨高山の切り餅",
      description:
        "黒豆・青大豆・大豆の食感と、たかやまもちのやさしい甘みを楽しむ山田もち店の三色豆もち。"
    }
  },
  {
    slug: "kombu",
    name: "昆布もち",
    cardName: "昆布",
    english: "Kombu",
    catchcopy: "旨みが、あとを引く。",
    short: "昆布の旨みを練り込んだ、食事にも合うお餅。",
    story:
      "昆布の旨みとほどよい塩気を、自家栽培もち米の甘みの中に閉じ込めた昆布もちです。焼くと昆布の香りがふわりと立ち、噛むほどにじんわりと旨みが広がります。甘いお餅とは違い、食事の一品として楽しめるのも魅力。お雑煮や汁物にも合わせやすく、いつもの食卓に飛騨高山の朝市らしい素朴なおいしさを添えてくれます。",
    image: "/images/lineup-kombu.jpg",
    imageAlt: "昆布を練り込んだ昆布切り餅",
    accent: "#51594a",
    price: "440円（税込）",
    content: "4枚入り / 200g",
    ingredients: "もち米（岐阜県高山市産）、昆布、食塩",
    shelfLife: "商品ラベルに記載",
    storage: "直射日光・高温多湿を避けて常温保存。開封後は密封して冷蔵し、長期保存する場合は1枚ずつ包んで冷凍してください。",
    allergy: "なし",
    shipping: "常温または冷蔵（季節・配送条件により調整）",
    traits: [
      { title: "旨み", text: "昆布のじんわりした旨みと塩気" },
      { title: "香り", text: "焼いた時に立つ、やさしい磯の香り" },
      { title: "食感", text: "もちのやわらかさに昆布のアクセント" },
      { title: "相性", text: "汁物にも合わせやすい食事向けの味" }
    ],
    ways: [
      { title: "焼き餅", text: "焼いて、昆布の旨みをシンプルに楽しみます。" },
      { title: "お雑煮", text: "出汁との相性が良い一枚です。" },
      { title: "汁物", text: "焼いたお餅を、お吸い物などの汁物に加えて楽しめます。" },
      { title: "海苔と醤油", text: "海苔と少量の醤油を合わせても楽しめます。" }
    ],
    ownerRecommendation:
      "甘い味付けより、醤油を少しだけ。昆布の旨みともち米の甘みが引き立ちます。",
    recommendedFor: ["甘くない餅が好きな方", "お酒のあと", "ご自宅用", "お雑煮"],
    related: ["plain", "tamari", "ebi"],
    seo: {
      title: "昆布もち｜飛騨高山の切り餅",
      description:
        "昆布の旨みと香ばしさがあとを引く、食事にも合う飛騨高山の切り餅。お雑煮や汁物にもおすすめです。"
    }
  },
  {
    slug: "tamari",
    name: "たまりもち",
    cardName: "たまり",
    english: "Tamari",
    catchcopy: "焼けば、香ばしさが広がる。",
    short: "たまり醤油の香ばしさが楽しめる一枚。",
    story:
      "醤油の香ばしさを練り込んだ、味わい深い切り餅です。焼き網にのせると、こんがりとした香りがふわっと広がり、思わず食欲を誘います。何もつけなくてもおいしく、忙しい朝や小腹が空いた時にも食べやすい一枚。焼いた瞬間の香ばしさが楽しめる、山田もち店の定番の味です。",
    image: "/images/lineup-tamari.jpg",
    imageAlt: "たまり醤油を練り込んだたまり切り餅",
    accent: "#73512f",
    price: "440円（税込）",
    content: "4枚入り / 200g",
    ingredients: "もち米（岐阜県高山市産）、醤油（一部に大豆・小麦を含む）",
    shelfLife: "商品ラベルに記載",
    storage: "直射日光・高温多湿を避けて常温保存。開封後は密封して冷蔵し、長期保存する場合は1枚ずつ包んで冷凍してください。",
    allergy: "大豆・小麦",
    shipping: "常温または冷蔵（季節・配送条件により調整）",
    traits: [
      { title: "香ばしさ", text: "焼いた時に広がる醤油の香り" },
      { title: "味わい", text: "何もつけずに楽しめるほどよい塩味" },
      { title: "食感", text: "外はこんがり、中はもっちり" },
      { title: "満足感", text: "軽食にもなるしっかりした一枚" }
    ],
    ways: [
      { title: "焼き餅", text: "焼くだけで、たまり醤油の香ばしさを楽しめます。" },
      { title: "海苔巻き", text: "香ばしさに海苔の風味を重ねる定番の食べ方です。" },
      { title: "バター醤油", text: "少し贅沢なおやつや軽食に。" },
      { title: "チーズ焼き", text: "焼いたお餅にチーズをのせて、軽く焼く食べ方です。" }
    ],
    ownerRecommendation:
      "焼きすぎない程度に、表面をこんがり。醤油の香りが立ったタイミングが食べごろです。",
    recommendedFor: ["香ばしい味が好きな方", "朝食", "軽食", "リピーター"],
    related: ["plain", "kombu", "ebi"],
    seo: {
      title: "たまりもち｜飛騨高山の切り餅",
      description:
        "焼けば醤油の香ばしさが広がる、山田もち店のたまりもち。通販でも人気の味付き切り餅です。"
    }
  },
  {
    slug: "ebi",
    name: "黒ごま海老もち",
    cardName: "黒ごま海老",
    english: "Ebi",
    catchcopy: "香ばしさ、重なる。",
    short: "海老と黒ごまの香ばしさを楽しむ一枚。",
    story:
      "干し海老の旨みと黒ごまの香ばしさを重ねた、彩りのある切り餅です。焼くと海老の香りが立ち、黒ごまの風味とほどよい塩味があとからふわりと広がります。見た目にもやさしい紅色で、詰め合わせの中でも印象に残る一枚。お正月や贈り物はもちろん、普段の食卓にも少し華やかさを添えてくれるお餅です。",
    image: "/images/lineup-ebi.jpg",
    imageAlt: "黒ごまと海老を練り込んだ切り餅",
    accent: "#d47d63",
    price: "440円（税込）",
    content: "4枚入り / 200g",
    ingredients: "もち米（岐阜県高山市産）、干し海老、黒ごま、食塩、着色料（一部にえび・ごまを含む）",
    shelfLife: "商品ラベルに記載",
    storage: "直射日光・高温多湿を避けて常温保存。開封後は密封して冷蔵し、長期保存する場合は1枚ずつ包んで冷凍してください。",
    allergy: "えび・ごま",
    shipping: "常温または冷蔵（季節・配送条件により調整）",
    traits: [
      { title: "香り", text: "干し海老と黒ごまの香ばしさ" },
      { title: "彩り", text: "淡い紅色が食卓に映える" },
      { title: "味わい", text: "塩気と旨みのほどよいバランス" },
      { title: "相性", text: "お雑煮や焼き餅におすすめ" }
    ],
    ways: [
      { title: "焼き餅", text: "焼きたてで、海老と黒ごまの香りを楽しみます。" },
      { title: "お雑煮", text: "お雑煮などの汁物に加えて楽しめます。" },
      { title: "醤油少々", text: "海老とごまの香ばしさがさらに引き立ちます。" },
      { title: "海苔と醤油", text: "味付けは控えめにして、香りを生かします。" }
    ],
    ownerRecommendation:
      "海老の香りが立つので、焼きたてをすぐに。塩味があるため、味付けは控えめで十分です。",
    recommendedFor: ["香ばしい味が好きな方", "贈り物", "お正月", "詰め合わせ"],
    related: ["kombu", "tamari", "sansyokumame"],
    seo: {
      title: "黒ごま海老もち｜飛騨高山の切り餅",
      description:
        "干し海老と黒ごまの香ばしさが重なる、彩りのある山田もち店の切り餅。ギフトにもおすすめです。"
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
