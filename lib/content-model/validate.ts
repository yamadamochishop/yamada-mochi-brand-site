import type {
  AvailabilityStatus,
  Commerce,
  ContentModelData,
  Money,
  SalesPeriod,
} from '../../types/content-model.ts';

const availabilityStatuses = new Set<AvailabilityStatus>([
  'unknown',
  'upcoming',
  'available',
  'sold_out',
  'ended',
]);

type Identified = {
  id: string;
  slug?: string;
};

function validateIdentity(collection: string, records: Identified[], errors: string[]) {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const record of records) {
    if (!record.id.trim()) errors.push(`${collection}: missing id`);
    else if (ids.has(record.id)) errors.push(`${collection}: duplicate id "${record.id}"`);
    else ids.add(record.id);

    if (record.slug !== undefined) {
      if (!record.slug.trim()) errors.push(`${collection}:${record.id}: missing slug`);
      else if (slugs.has(record.slug)) {
        errors.push(`${collection}: duplicate slug "${record.slug}"`);
      } else slugs.add(record.slug);
    }
  }
}

function validateMoney(owner: string, price: Money | undefined, errors: string[]) {
  if (!price) return;
  if (!Number.isFinite(price.amount) || price.amount < 0) {
    errors.push(`${owner}: price amount must be zero or greater`);
  }
  if (price.currency !== 'JPY') errors.push(`${owner}: invalid currency "${price.currency}"`);
}

function validateCommerce(
  owner: string,
  commerce: Commerce | undefined,
  channelIds: Set<string>,
  errors: string[],
) {
  if (!commerce) return;

  if (commerce.available && !commerce.url) {
    errors.push(`${owner}: available commerce requires a URL`);
  }

  if (commerce.url) {
    try {
      const url = new URL(commerce.url);
      if (url.protocol !== 'https:') errors.push(`${owner}: commerce URL must use HTTPS`);
    } catch {
      errors.push(`${owner}: invalid commerce URL`);
    }
  }

  if (commerce.channelId && !channelIds.has(commerce.channelId)) {
    errors.push(`${owner}: unknown salesChannelId "${commerce.channelId}"`);
  }
}

function validateChannelReferences(
  owner: string,
  references: string[] | undefined,
  channelIds: Set<string>,
  errors: string[],
) {
  if (!references) return;
  const seen = new Set<string>();

  for (const channelId of references) {
    if (seen.has(channelId)) errors.push(`${owner}: duplicate salesChannelId "${channelId}"`);
    seen.add(channelId);
    if (!channelIds.has(channelId)) {
      errors.push(`${owner}: unknown salesChannelId "${channelId}"`);
    }
  }
}

function validateAvailability(owner: string, status: string, errors: string[]) {
  if (!availabilityStatuses.has(status as AvailabilityStatus)) {
    errors.push(`${owner}: invalid availabilityStatus "${status}"`);
  }
}

function validateSalesPeriod(
  owner: string,
  salesPeriod: SalesPeriod | undefined,
  errors: string[],
) {
  if (!salesPeriod) return;

  for (const field of ['startMonth', 'endMonth'] as const) {
    const value = salesPeriod[field];
    if (value !== undefined && (!Number.isInteger(value) || value < 1 || value > 12)) {
      errors.push(`${owner}: ${field} must be an integer from 1 to 12`);
    }
  }

  for (const field of ['startDay', 'endDay'] as const) {
    const value = salesPeriod[field];
    if (value !== undefined && (!Number.isInteger(value) || value < 1 || value > 31)) {
      errors.push(`${owner}: ${field} must be an integer from 1 to 31`);
    }
  }
}

function validateRelatedProducts(
  owner: string,
  relatedProductIds: string[],
  productIds: Set<string>,
  errors: string[],
) {
  const seen = new Set<string>();

  for (const productId of relatedProductIds) {
    if (seen.has(productId)) errors.push(`${owner}: duplicate relatedProductId "${productId}"`);
    seen.add(productId);
    if (!productIds.has(productId)) {
      errors.push(`${owner}: unknown relatedProductId "${productId}"`);
    }
  }
}

export function validateContentModel(data: ContentModelData): string[] {
  const errors: string[] = [];

  validateIdentity('products', data.products, errors);
  validateIdentity('giftSets', data.giftSets, errors);
  validateIdentity('seasonalProducts', data.seasonalProducts, errors);
  validateIdentity('recipes', data.recipes, errors);
  validateIdentity('salesChannels', data.salesChannels, errors);

  const productIds = new Set(data.products.map((product) => product.id));
  const channelIds = new Set(data.salesChannels.map((channel) => channel.id));

  for (const product of data.products) {
    const owner = `product:${product.id}`;
    if (!product.name.trim()) errors.push(`${owner}: missing product name`);
    validateMoney(owner, product.price, errors);
    validateCommerce(owner, product.commerce, channelIds, errors);
    validateChannelReferences(owner, product.salesChannelIds, channelIds, errors);
    validateAvailability(owner, product.availability.status, errors);
    validateSalesPeriod(owner, product.availability.salesPeriod, errors);
    validateRelatedProducts(owner, product.relatedProductIds, productIds, errors);
  }

  for (const giftSet of data.giftSets) {
    const owner = `giftSet:${giftSet.id}`;
    if (!giftSet.name.trim()) errors.push(`${owner}: missing product name`);
    validateMoney(owner, giftSet.price, errors);
    validateCommerce(owner, giftSet.commerce, channelIds, errors);
    validateChannelReferences(owner, giftSet.salesChannelIds, channelIds, errors);
    validateAvailability(owner, giftSet.availability.status, errors);
    validateSalesPeriod(owner, giftSet.availability.salesPeriod, errors);

    const included = new Set<string>();
    for (const item of giftSet.includedProducts) {
      if (included.has(item.productId)) {
        errors.push(`${owner}: duplicate included product "${item.productId}"`);
      }
      included.add(item.productId);
      if (!productIds.has(item.productId)) {
        errors.push(`${owner}: unknown included product "${item.productId}"`);
      }
      if (item.quantity !== undefined && (!Number.isInteger(item.quantity) || item.quantity <= 0)) {
        errors.push(`${owner}: included product quantity must be a positive integer`);
      }
    }
  }

  for (const seasonalProduct of data.seasonalProducts) {
    const owner = `seasonalProduct:${seasonalProduct.id}`;
    if (!seasonalProduct.name.trim()) errors.push(`${owner}: missing product name`);
    validateMoney(owner, seasonalProduct.price, errors);
    validateCommerce(owner, seasonalProduct.commerce, channelIds, errors);
    validateChannelReferences(owner, seasonalProduct.salesChannelIds, channelIds, errors);
    validateAvailability(owner, seasonalProduct.availabilityStatus, errors);
    validateSalesPeriod(owner, seasonalProduct.salesPeriod, errors);
  }

  for (const recipe of data.recipes) {
    const owner = `recipe:${recipe.id}`;
    if (!recipe.title.trim()) errors.push(`${owner}: missing title`);
    validateRelatedProducts(owner, recipe.relatedProductIds, productIds, errors);
  }

  for (const channel of data.salesChannels) {
    if (!channel.name.trim()) errors.push(`salesChannel:${channel.id}: missing name`);

    if (channel.url) {
      try {
        const url = new URL(channel.url);
        if (url.protocol !== 'https:') {
          errors.push(`salesChannel:${channel.id}: URL must use HTTPS`);
        }
      } catch {
        errors.push(`salesChannel:${channel.id}: invalid URL`);
      }
    }
  }

  return errors;
}

export function assertValidContentModel(data: ContentModelData): void {
  const errors = validateContentModel(data);

  if (errors.length) {
    throw new Error(`Content model validation failed (${errors.length})\n${errors.join('\n')}`);
  }
}
