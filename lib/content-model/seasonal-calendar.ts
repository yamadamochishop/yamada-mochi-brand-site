import { contentModel } from '../../data/content-model.ts';
import type {
  AvailabilityStatus,
  ContentModelData,
  ProductRecord,
  SeasonalProductRecord,
} from '../../types/content-model.ts';

export type CalendarProductEntry =
  | {
      source: 'product';
      id: string;
      name: string;
      availabilityStatus: AvailabilityStatus;
      product: ProductRecord;
    }
  | {
      source: 'seasonal_product';
      id: string;
      name: string;
      availabilityStatus: AvailabilityStatus;
      product: SeasonalProductRecord;
    };

export type MonthlyProductCalendar = {
  month: number;
  yearRound: CalendarProductEntry[];
  seasonal: CalendarProductEntry[];
};

function assertMonth(month: number): void {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('month must be an integer from 1 to 12');
  }
}

export function isMonthInSalesPeriod(
  month: number,
  product: Pick<SeasonalProductRecord, 'seasonality' | 'salesPeriod'>,
): boolean {
  assertMonth(month);

  if (product.seasonality === 'year_round') return true;

  const { startMonth, endMonth } = product.salesPeriod;
  if (startMonth === undefined || endMonth === undefined) return false;
  if (startMonth <= endMonth) return month >= startMonth && month <= endMonth;
  return month >= startMonth || month <= endMonth;
}

/**
 * Builds a month view without changing availability. Injecting data keeps the
 * calendar deterministic and makes replacement rules independently testable.
 */
export function buildSeasonalProductsForMonth(
  month: number,
  data: ContentModelData,
): MonthlyProductCalendar {
  assertMonth(month);

  const replacedProductIds = new Set(
    data.seasonalReplacementRules
      .filter((rule) => rule.months.includes(month))
      .map((rule) => rule.replacedProductId),
  );

  const productsById = new Map(data.products.map((product) => [product.id, product]));
  const yearRoundProducts: CalendarProductEntry[] = data.productCalendarReferences
    .filter((reference) => !replacedProductIds.has(reference.productId))
    .flatMap((reference) => {
      const product = productsById.get(reference.productId);
      return product
        ? [
            {
              source: 'product' as const,
              id: product.id,
              name: product.name,
              availabilityStatus: reference.availabilityStatus,
              product,
            },
          ]
        : [];
    });

  const matchingSeasonal = data.seasonalProducts.filter((product) =>
    isMonthInSalesPeriod(month, product),
  );
  const yearRoundSeasonal: CalendarProductEntry[] = matchingSeasonal
    .filter((product) => product.seasonality === 'year_round')
    .map((product) => ({
      source: 'seasonal_product',
      id: product.id,
      name: product.name,
      availabilityStatus: product.availabilityStatus,
      product,
    }));
  const seasonal: CalendarProductEntry[] = matchingSeasonal
    .filter((product) => product.seasonality === 'seasonal')
    .map((product) => ({
      source: 'seasonal_product',
      id: product.id,
      name: product.name,
      availabilityStatus: product.availabilityStatus,
      product,
    }));

  return {
    month,
    yearRound: [...yearRoundSeasonal, ...yearRoundProducts],
    seasonal,
  };
}

export function getSeasonalProductsForMonth(month: number): MonthlyProductCalendar {
  return buildSeasonalProductsForMonth(month, contentModel);
}

export function getCommerceCtaOffers(product: SeasonalProductRecord) {
  return product.commerce.offers.filter(
    (offer): offer is typeof offer & { url: string } =>
      offer.status === 'confirmed' && typeof offer.url === 'string',
  );
}
