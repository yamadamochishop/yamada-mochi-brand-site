import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { SeasonalPage } from '@/components/seasonal/SeasonalPage';
import { seasonalProducts } from '@/data/seasonal-products';
import { breadcrumbJsonLd, pageOpenGraph, simpleItemListJsonLd } from '@/lib/seo';

const description =
  '飛騨高山・山田もち店の季節の商品をご紹介。餅、漬物、パイ、大福など、陣屋前朝市に並ぶ一年の流れをご覧いただけます。';

export const metadata: Metadata = {
  title: '季節の商品',
  description,
  alternates: { canonical: '/seasonal' },
  openGraph: pageOpenGraph({
    title: '季節の商品｜山田もち店',
    description,
    path: '/seasonal',
  }),
};

export default function SeasonalListPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'ホーム', path: '/' },
          { name: '季節の商品', path: '/seasonal' },
        ])}
      />
      <JsonLd
        data={simpleItemListJsonLd(
          '山田もち店 季節の商品',
          seasonalProducts.map((product) => product.name),
        )}
      />
      <SeasonalPage />
    </>
  );
}
