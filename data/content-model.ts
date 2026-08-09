import {
  catalogSets as legacyCatalogSets,
  products as legacyProducts,
  type CatalogSet,
  type Product,
} from './catalog.ts';
import { salesChannels } from './sales-channels.ts';
import type {
  ContentModelData,
  GiftSetRecord,
  MediaAsset,
  Money,
  ProductRecord,
  RecipeRecord,
  SeasonalProductRecord,
} from '../types/content-model.ts';

const BASE_CHANNEL_ID = 'base';

export function parseLegacyPrice(display: string): Money {
  const match = display.replaceAll(',', '').match(/^(\d+)円（税込）$/u);

  if (!match) {
    throw new Error(`Unsupported legacy price display: ${display}`);
  }

  return {
    amount: Number(match[1]),
    currency: 'JPY',
    taxIncluded: true,
    display,
  };
}

function productImages(product: Product): MediaAsset[] {
  const images: MediaAsset[] = [
    {
      src: product.image,
      alt: product.imageAlt || `${product.name}の商品写真`,
      role: 'primary',
    },
  ];

  if (product.cardImage) {
    images.push({
      src: product.cardImage,
      alt: product.cardImageAlt || product.imageAlt || `${product.name}の商品写真`,
      role: 'card',
    });
  }

  return images;
}

export function migrateLegacyProduct(product: Product): ProductRecord {
  return {
    id: product.slug,
    slug: product.slug,
    name: product.name,
    shortName: product.cardName,
    category: 'mochi',
    description: product.short,
    story: product.story,
    price: parseLegacyPrice(product.price),
    contentAmount: product.content,
    ingredients: product.ingredients,
    allergens: { display: product.allergy },
    shelfLife: product.shelfLife,
    storage: product.storage,
    shipping: product.shipping,
    commerce: {
      available: true,
      url: product.baseUrl,
      channelId: BASE_CHANNEL_ID,
    },
    salesChannelIds: [BASE_CHANNEL_ID],
    giftEligible: true,
    images: productImages(product),
    seo: {
      title: product.seo.title,
      description: product.seo.description,
      canonicalPath: `/products/${product.slug}`,
    },
    status: 'published',
    // Current pages link to commerce, but real-time inventory is not synchronized.
    availability: { status: 'unknown' },
    relatedProductIds: [...product.related],
    compatibility: {
      cardName: product.cardName,
      english: product.english,
      catchcopy: product.catchcopy,
      accent: product.accent,
      afterOpening: product.afterOpening,
      frozenStorage: product.frozenStorage,
      traits: product.traits.map((trait) => ({ ...trait })),
      ways: product.ways.map((way) => ({ ...way })),
      ownerRecommendation: product.ownerRecommendation,
      recommendedFor: [...product.recommendedFor],
      priceDisplay: product.price,
    },
  };
}

function requiredImage(record: ProductRecord, role: MediaAsset['role']): MediaAsset {
  const image = record.images.find((candidate) => candidate.role === role);

  if (!image) {
    throw new Error(`${record.id}: missing ${role} image`);
  }

  return image;
}

export function toLegacyProduct(record: ProductRecord): Product {
  const primaryImage = requiredImage(record, 'primary');
  const cardImage = record.images.find((image) => image.role === 'card');

  return {
    slug: record.slug,
    name: record.name,
    cardName: record.compatibility.cardName,
    english: record.compatibility.english,
    catchcopy: record.compatibility.catchcopy,
    short: record.description,
    story: record.story,
    image: primaryImage.src,
    imageAlt: primaryImage.alt,
    ...(cardImage ? { cardImage: cardImage.src, cardImageAlt: cardImage.alt } : {}),
    accent: record.compatibility.accent,
    baseUrl: record.commerce.url || '',
    price: record.compatibility.priceDisplay,
    content: record.contentAmount,
    ingredients: record.ingredients,
    shelfLife: record.shelfLife,
    storage: record.storage,
    afterOpening: record.compatibility.afterOpening,
    frozenStorage: record.compatibility.frozenStorage,
    allergy: record.allergens.display,
    shipping: record.shipping,
    traits: record.compatibility.traits.map((trait) => ({ ...trait })),
    ways: record.compatibility.ways.map((way) => ({ ...way })),
    ownerRecommendation: record.compatibility.ownerRecommendation,
    recommendedFor: [...record.compatibility.recommendedFor],
    related: [...record.relatedProductIds],
    seo: {
      title: record.seo.title,
      description: record.seo.description,
    },
  };
}

const giftQuantityBySlug: Record<string, number | undefined> = {
  'six-flavor-gift': 1,
  'choice-six-set': undefined,
  'twelve-set': 2,
};

export function migrateLegacyGiftSet(giftSet: CatalogSet): GiftSetRecord {
  const quantity = giftQuantityBySlug[giftSet.slug];

  return {
    id: giftSet.slug,
    slug: giftSet.slug,
    name: giftSet.name,
    description: giftSet.seo.description,
    price: parseLegacyPrice(giftSet.price),
    includedProducts: legacyProducts.map((product) => ({
      productId: product.slug,
      ...(quantity === undefined ? {} : { quantity }),
    })),
    contentAmount: giftSet.content,
    packaging: giftSet.packaging,
    shelfLife: giftSet.shelfLife,
    storage: giftSet.storage,
    shipping: giftSet.shipping,
    commerce: {
      available: true,
      url: giftSet.baseUrl,
      channelId: BASE_CHANNEL_ID,
    },
    salesChannelIds: [BASE_CHANNEL_ID],
    images: [
      {
        src: giftSet.image,
        alt: giftSet.name,
        role: 'primary',
      },
    ],
    seo: {
      title: giftSet.seo.title,
      description: giftSet.seo.description,
      canonicalPath: '/gift',
    },
    status: 'published',
    availability: { status: 'unknown' },
    compatibility: {
      cardName: giftSet.cardName,
      ingredientsDisplay: giftSet.ingredients,
      allergyDisplay: giftSet.allergy,
      priceDisplay: giftSet.price,
    },
  };
}

export function toLegacyGiftSet(record: GiftSetRecord): CatalogSet {
  const primaryImage = record.images.find((image) => image.role === 'primary');

  if (!primaryImage) {
    throw new Error(`${record.id}: missing primary image`);
  }

  return {
    slug: record.slug,
    name: record.name,
    cardName: record.compatibility.cardName,
    image: primaryImage.src,
    baseUrl: record.commerce.url || '',
    price: record.compatibility.priceDisplay,
    content: record.contentAmount,
    packaging: record.packaging,
    ingredients: record.compatibility.ingredientsDisplay,
    allergy: record.compatibility.allergyDisplay,
    shelfLife: record.shelfLife,
    storage: record.storage,
    shipping: record.shipping,
    seo: {
      title: record.seo.title,
      description: record.seo.description,
    },
  };
}

export const productRecords: ProductRecord[] = legacyProducts.map(migrateLegacyProduct);
export const giftSetRecords: GiftSetRecord[] = legacyCatalogSets.map(migrateLegacyGiftSet);

// The public UI is not publishing these content types in YM-002.
export const seasonalProducts: SeasonalProductRecord[] = [];
export const recipes: RecipeRecord[] = [];

/**
 * Compatibility projections prove that the normalized model can feed the
 * existing UI without changing its display contract.
 */
export const compatibleProducts: Product[] = productRecords.map(toLegacyProduct);
export const compatibleGiftSets: CatalogSet[] = giftSetRecords.map(toLegacyGiftSet);

export const contentModel: ContentModelData = {
  products: productRecords,
  giftSets: giftSetRecords,
  seasonalProducts,
  recipes,
  salesChannels,
};
