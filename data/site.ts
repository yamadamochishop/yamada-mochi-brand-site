const previewSiteUrl = "https://yamada-mochi-brand-site.vercel.app";
const isIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || previewSiteUrl;

export const site = {
  name: "山田もち店",
  enName: "YAMADA MOCHI TEN",
  tagline: "思い出に残るお餅を。",
  description:
    "100％自家栽培のもち米「たかやまもち」でつくる、飛騨高山・陣屋前朝市の切り餅。",
  founded: "1975年創業",
  address: "岐阜県高山市千島町1145番地",
  tel: "0577-33-7633",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@yamadamochi.com",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://yamadamochi.thebase.in",
  baseItems: {
    plain: "https://yamadamochi.thebase.in/items/42083183",
    sansyokumame: "https://yamadamochi.thebase.in/items/42083299",
    yomogi: "https://yamadamochi.thebase.in/items/42083333",
    kombu: "https://yamadamochi.thebase.in/items/42083403",
    tamari: "https://yamadamochi.thebase.in/items/42083448",
    ebi: "https://yamadamochi.thebase.in/items/42083499",
    sixSet: "https://yamadamochi.thebase.in/items/149543143",
    choiceSixSet: "https://yamadamochi.thebase.in/items/149543351",
    twelveSet: "https://yamadamochi.thebase.in/items/149544078"
  },
  pokeMarcheUrl: "https://poke-m.com/producers/297308",
  tabechokuUrl: "https://www.tabechoku.com/producers/23313",
  // Preview-safe defaults. Set these production variables only after the
  // www domain is connected and verified in Vercel.
  // Keep preview deployments self-referential even if a production URL is
  // already stored in Vercel. The configured production URL is used only
  // once indexing has been explicitly enabled.
  siteUrl: isIndexable ? configuredSiteUrl : previewSiteUrl,
  isIndexable,
  googleFormUrl: process.env.NEXT_PUBLIC_GOOGLE_FORM_URL || "",
  market: {
    name: "陣屋前朝市",
    hours: "毎朝 7:00頃〜12:00頃",
    season: "通年営業（天候・都合により休業する場合があります）",
    access: "高山陣屋前。JR高山駅から徒歩約10分。",
    parking:
      "近隣の市営・民間駐車場をご利用ください。朝市会場周辺は歩行者が多いため、時間に余裕をもってお越しください。",
    mapQuery: "高山陣屋前朝市"
  }
};

export const gift = {
  name: "飛騨高山 朝市の切り餅 6種類食べ比べセット",
  price: "2,980円（税込）",
  shipping: "送料別",
  contents: "プレーン、草もち、三色豆もち、昆布もち、たまりもち、黒ごま海老もちを各1袋",
  quantity: "4枚入り（200g）×6袋",
  shelfLife: "製造日より8日",
  shippingMethod: "常温便",
  shippingLeadTime: "通常、ご注文から3〜5営業日以内に発送"
} as const;
