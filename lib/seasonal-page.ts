import { products } from '../data/catalog.ts';
import { contentModel } from '../data/content-model.ts';
import { salesChannels } from '../data/sales-channels.ts';
import { salesLocations } from '../data/sales-locations.ts';
import { seasonalProducts } from '../data/seasonal-products.ts';
import { buildSeasonalProductsForMonth } from './content-model/seasonal-calendar.ts';
import type { SeasonalProductRecord } from '../types/content-model.ts';

export const SEASONAL_LISTING_MONTH = 8;

export const currentSeasonalProductIds = [
  'ao-hoba-mochi',
  'hida-peach-pie',
  'konasu-pickles',
  'akakabu-nagazuke',
] as const;

const categoryLabels: Record<SeasonalProductRecord['category'], string> = {
  mochi: 'お餅',
  confectionery: '菓子',
  pickles: '漬物',
  pie: 'パイ',
  wagashi: '和菓子',
  other: 'その他',
};

export type SeasonalPageProduct = SeasonalProductRecord & {
  categoryLabel: string;
  salesLocationLabel: string;
  commerceLabel: string;
  statusLabel?: '販売中' | 'まもなく終了';
  currentMonthLabel?: string;
};

function resolveProduct(
  productId: string,
  records: SeasonalProductRecord[],
): SeasonalProductRecord {
  const product = records.find((candidate) => candidate.id === productId);
  if (!product) throw new Error(`Missing seasonal list product: ${productId}`);
  return product;
}

function commerceLabel(product: SeasonalProductRecord): string {
  if (product.commerce.status === 'unavailable') return 'なし';
  if (product.commerce.status === 'preparing') return '準備中';
  if (product.commerce.status === 'undecided') return '未定';

  const names = product.commerce.offers.map((offer) => {
    const channel = salesChannels.find((candidate) => candidate.id === offer.channelId);
    if (!channel) throw new Error(`Unknown commerce channel: ${offer.channelId}`);
    return channel.name;
  });
  return names.length > 0 ? `あり（${names.join('・')}）` : 'あり';
}

function toPageProduct(
  product: SeasonalProductRecord,
  includeStatus: boolean,
): SeasonalPageProduct {
  const locations = product.salesLocationIds.map((locationId) => {
    const location = salesLocations.find((candidate) => candidate.id === locationId);
    if (!location) throw new Error(`Unknown sales location: ${locationId}`);
    return location.name;
  });
  const statusLabel = includeStatus
    ? product.availabilityNote === 'まもなく終了'
      ? 'まもなく終了'
      : product.availabilityStatus === 'available'
        ? '販売中'
        : undefined
    : undefined;
  const currentMonthLabel = includeStatus
    ? product.salesPeriod.note ||
      product.notes?.find((note) => note.includes('終了予定')) ||
      product.salesPeriod.display
    : undefined;

  return {
    ...product,
    categoryLabel: categoryLabels[product.category],
    salesLocationLabel: locations.join('・'),
    commerceLabel: commerceLabel(product),
    ...(statusLabel ? { statusLabel } : {}),
    ...(currentMonthLabel ? { currentMonthLabel } : {}),
  };
}

export function buildSeasonalPageModel(records = seasonalProducts) {
  const modelData = { ...contentModel, seasonalProducts: records };
  const currentProducts = currentSeasonalProductIds.map((id) =>
    toPageProduct(resolveProduct(id, records), true),
  );
  const monthlyCalendar = Array.from({ length: 12 }, (_, index) => index + 1).map((month) => ({
    month,
    products: buildSeasonalProductsForMonth(month, modelData).seasonal.map((entry) =>
      toPageProduct(resolveProduct(entry.id, records), false),
    ),
  }));
  const seasonalDirectory = records
    .filter((product) => product.seasonality === 'seasonal')
    .map((product) => toPageProduct(product, false));
  const yearRoundPickles = ['umezuke', 'akakabu-maruzuke'].map((id) =>
    toPageProduct(resolveProduct(id, records), false),
  );

  return {
    currentProducts,
    monthlyCalendar,
    seasonalDirectory,
    yearRoundPickles,
    regularMochiNames: products.map((product) => product.name),
  };
}

/** A display warning, not a publication error: availability remains human-managed. */
export function getSeasonalCalendarWarnings(records = seasonalProducts): string[] {
  return records.flatMap((product) => {
    if (product.seasonality !== 'seasonal') return [];
    const { startMonth, endMonth } = product.salesPeriod;
    return startMonth === undefined || endMonth === undefined
      ? [`${product.id}: seasonal sales period is missing a month boundary`]
      : [];
  });
}

/** Non-blocking freshness check; it must never infer or mutate availability. */
export function getSeasonalListingWarnings(asOf: Date): string[] {
  const tokyoMonth = Number(
    new Intl.DateTimeFormat('en-US', { month: 'numeric', timeZone: 'Asia/Tokyo' }).format(asOf),
  );
  return tokyoMonth === SEASONAL_LISTING_MONTH
    ? []
    : [
        `seasonal listing month is ${SEASONAL_LISTING_MONTH}, but the current Asia/Tokyo month is ${tokyoMonth}`,
      ];
}
