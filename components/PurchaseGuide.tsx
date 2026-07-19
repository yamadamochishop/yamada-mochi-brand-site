type PurchaseGuideProps = {
  shelfLife: string;
  shipping?: string;
  isGift?: boolean;
};

export function PurchaseGuide({ shelfLife, shipping = "常温便 / 通常、ご注文から3〜5営業日以内に発送", isGift = false }: PurchaseGuideProps) {
  return (
    <div className="mt-8 border-y border-sumi/10 bg-[#f1ece3] px-5 py-2 text-sm text-sumi/70">
      <dl className="divide-y divide-sumi/10">
        {[
          ["賞味期限", shelfLife],
          ["発送", "通常、ご注文から3〜5営業日以内に発送"],
          ["配送方法", shipping.split(" / ")[0]],
          ["送料", "地域別送料はBASEの商品ページ・購入画面でご確認ください。"],
          ["ギフト対応", isGift ? "ギフト箱・包装に対応。熨斗・手提げ袋の可否はBASEの商品ページでご確認ください。" : "熨斗・手提げ袋などのご希望はBASEの商品ページでご確認ください。"]
        ].map(([label, value]) => (
          <div key={label} className="grid gap-1 py-3 sm:grid-cols-[7rem_1fr]">
            <dt className="text-xs tracking-[0.12em] text-sumi/45">{label}</dt>
            <dd className="leading-6">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
