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
  pokeMarcheUrl: "https://poke-m.com/producers/297308",
  tabechokuUrl: "https://www.tabechoku.com/producers/23313",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.yamadamochi.com",
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
