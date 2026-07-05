const product = {
  name: "product",
  title: "商品",
  type: "document",
  fields: [
    { name: "name", title: "商品名", type: "string" },
    { name: "slug", title: "URL", type: "slug", options: { source: "name" } },
    { name: "catchcopy", title: "キャッチコピー", type: "string" },
    { name: "description", title: "商品説明", type: "text" },
    { name: "price", title: "価格", type: "string" },
    { name: "content", title: "内容量", type: "string" },
    { name: "ingredients", title: "原材料", type: "text" },
    { name: "shelfLife", title: "賞味期限", type: "string" },
    { name: "storage", title: "保存方法", type: "text" },
    { name: "allergy", title: "アレルギー", type: "string" },
    { name: "image", title: "メイン画像", type: "image" },
    { name: "seoTitle", title: "SEOタイトル", type: "string" },
    { name: "seoDescription", title: "SEO説明文", type: "text" }
  ]
};

export default product;
