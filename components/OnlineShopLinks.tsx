import { TrackedBaseLink } from '@/components/TrackedBaseLink';
import { TrackedSalesChannelLink } from '@/components/TrackedSalesChannelLink';
import { site } from '@/data/site';

export function OnlineShopLinks() {
  return (
    <div className="mt-8">
      <p className="mx-auto max-w-2xl leading-8 text-base/80">
        山田もち店の商品は、公式オンラインショップのほか、食べチョク・ポケットマルシェでも販売しています。普段お使いのサービスからご購入いただけます。
      </p>
      <TrackedBaseLink
        href={site.baseUrl}
        placement="online_shop"
        className="ym-btn ym-btn-lg ym-btn-on-dark-solid mt-7 min-h-14 w-full sm:w-auto sm:min-w-72"
      >
        公式オンラインショップ（BASE）
      </TrackedBaseLink>
      <div className="mx-auto mt-4 flex max-w-2xl flex-col justify-center gap-3 sm:flex-row">
        <TrackedSalesChannelLink
          href={site.tabechokuUrl}
          channel="tabechoku"
          placement="online_shop"
          className="ym-btn ym-btn-on-dark"
        >
          食べチョクで見る
        </TrackedSalesChannelLink>
        <TrackedSalesChannelLink
          href={site.pokeMarcheUrl}
          channel="pokemaru"
          placement="online_shop"
          className="ym-btn ym-btn-on-dark"
        >
          ポケットマルシェで見る
        </TrackedSalesChannelLink>
      </div>
    </div>
  );
}
