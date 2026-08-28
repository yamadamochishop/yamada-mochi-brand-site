import { products } from '../data/catalog.ts';
import { contentModel } from '../data/content-model.ts';
import { salesChannels } from '../data/sales-channels.ts';
import { salesLocations } from '../data/sales-locations.ts';
import { seasonalProducts } from '../data/seasonal-products.ts';
import {
  buildSeasonalProductsForMonth,
  isMonthInSalesPeriod,
} from './content-model/seasonal-calendar.ts';
import type { SeasonalProductRecord } from '../types/content-model.ts';

export const SEASONAL_LISTING_MONTH = 8;

/** 「今、店先にあるもの」に出す商品はHuman管理。販売が終わった商品はここから外す。 */
export const currentSeasonalProductIds = [
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

export type SeasonalStatusLabel = '販売中' | 'まもなく終了' | '販売予定' | '販売終了';

export type SeasonalPageProduct = SeasonalProductRecord & {
  categoryLabel: string;
  salesLocationLabel: string;
  commerceLabel: string;
  statusLabel?: SeasonalStatusLabel;
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

/**
 * `upcoming` / `ended` は今月の在庫状況ではなく公開上の状態なので、
 * 「今、店先にあるもの」以外の一覧でも誤読を防ぐために常にラベルを付ける。
 */
function resolveStatusLabel(
  product: SeasonalProductRecord,
  includeStatus: boolean,
): SeasonalStatusLabel | undefined {
  if (product.availabilityStatus === 'upcoming') return '販売予定';
  if (product.availabilityStatus === 'ended') return '販売終了';
  if (!includeStatus) return undefined;
  if (product.availabilityNote === 'まもなく終了') return 'まもなく終了';
  return product.availabilityStatus === 'available' ? '販売中' : undefined;
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
  const statusLabel = resolveStatusLabel(product, includeStatus);
  const currentMonthLabel = includeStatus
    ? product.salesPeriod.note ||
      product.notes?.find((note) => note.includes('終了予定')) ||
      product.salesPeriod.display
    : undefined;

  return {
    ...product,
    categoryLabel: categoryLabels[product.category],
    salesLocationLabel: locations.length > 0 ? locations.join('・') : '未定',
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
  /**
   * 「今 / これから / 終わったもの」を同じ構造で並べられるようにしておく。
   * 該当レコードが無い期間はセクションごと描画しない。
   */
  const upcomingProducts = records
    .filter((product) => product.availabilityStatus === 'upcoming')
    .map((product) => toPageProduct(product, false));
  const endedProducts = records
    .filter((product) => product.availabilityStatus === 'ended')
    .map((product) => toPageProduct(product, false));
  const yearRoundPickles = ['umezuke', 'akakabu-maruzuke'].map((id) =>
    toPageProduct(resolveProduct(id, records), false),
  );

  return {
    currentProducts,
    upcomingProducts,
    endedProducts,
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

/**
 * 「{月}月のお品書き」の見出しと中身が食い違わないための門。
 *
 * SEASONAL_LISTING_MONTH と currentSeasonalProductIds はどちらもHuman管理で、
 * 月を進めてリストを直し忘れる／販売終了にしたのにリストへ残す、が事故の型。
 * 現在時刻は一切見ない（build時刻・タイムゾーンに依存させない）。
 */
export function getSeasonalListingConsistencyErrors(records = seasonalProducts): string[] {
  return currentSeasonalProductIds.flatMap((id) => {
    const product = records.find((candidate) => candidate.id === id);
    if (!product) return [`${id}: is listed as a current product but has no seasonal record`];

    const errors: string[] = [];
    if (product.availabilityStatus !== 'available') {
      errors.push(
        `${id}: is listed as a current product but availabilityStatus is "${product.availabilityStatus}"`,
      );
    }
    if (!isMonthInSalesPeriod(SEASONAL_LISTING_MONTH, product)) {
      errors.push(
        `${id}: is listed as a current product but its sales period does not include month ${SEASONAL_LISTING_MONTH}`,
      );
    }
    return errors;
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
