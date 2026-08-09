export type Currency = 'JPY';

export type Money = {
  amount: number;
  currency: Currency;
  taxIncluded: boolean;
  display: string;
};

export type PublicationStatus = 'draft' | 'published' | 'archived';

export type AvailabilityStatus = 'unknown' | 'upcoming' | 'available' | 'sold_out' | 'ended';

export type SalesPeriod = {
  display: string;
  startMonth?: number;
  startDay?: number;
  endMonth?: number;
  endDay?: number;
};

export type Availability = {
  status: AvailabilityStatus;
  salesPeriod?: SalesPeriod;
  note?: string;
};

export type MediaRole = 'primary' | 'card' | 'gallery' | 'og' | 'recipe_step';
export type MediaSourceType = 'original_photo' | 'generated' | 'edited' | 'provided';

export type MediaAsset = {
  src: string;
  alt: string;
  role: MediaRole;
  focalPoint?: {
    x: number;
    y: number;
  };
  credit?: string;
  sourceType?: MediaSourceType;
};

export type SeoMetadata = {
  title: string;
  description: string;
  ogImage?: MediaAsset;
  canonicalPath?: string;
};

export type Commerce = {
  available: boolean;
  url?: string;
  channelId?: string;
};

export type AllergenInfo = {
  display: string;
  items?: string[];
};

export type ProductCategory = 'mochi' | 'confectionery' | 'pickles' | 'other';

export type ProductCompatibilityFields = {
  cardName: string;
  english: string;
  catchcopy: string;
  accent: string;
  afterOpening: string;
  frozenStorage: string;
  traits: { title: string; text: string }[];
  ways: { title: string; text: string }[];
  ownerRecommendation: string;
  recommendedFor: string[];
  priceDisplay: string;
};

export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  description: string;
  story: string;
  price: Money;
  contentAmount: string;
  ingredients: string;
  allergens: AllergenInfo;
  shelfLife: string;
  storage: string;
  shipping: string;
  commerce: Commerce;
  salesChannelIds: string[];
  giftEligible: boolean;
  images: MediaAsset[];
  seo: SeoMetadata;
  publishedAt?: string;
  updatedAt?: string;
  status: PublicationStatus;
  availability: Availability;
  relatedProductIds: string[];
  compatibility: ProductCompatibilityFields;
};

export type GiftSetCompatibilityFields = {
  cardName: string;
  ingredientsDisplay: string;
  allergyDisplay: string;
  priceDisplay: string;
};

export type GiftSetItem = {
  productId: string;
  quantity?: number;
};

export type GiftSetRecord = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: Money;
  includedProducts: GiftSetItem[];
  contentAmount: string;
  packaging: string;
  shelfLife: string;
  storage: string;
  shipping: string;
  commerce: Commerce;
  salesChannelIds: string[];
  images: MediaAsset[];
  seo: SeoMetadata;
  publishedAt?: string;
  updatedAt?: string;
  status: PublicationStatus;
  availability: Availability;
  compatibility: GiftSetCompatibilityFields;
};

export type SeasonalProductRecord = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  salesPeriod: SalesPeriod;
  availabilityStatus: AvailabilityStatus;
  price?: Money;
  salesChannelIds?: string[];
  story?: string;
  ingredients?: string;
  allergens?: AllergenInfo;
  commitment?: string;
  shelfLife?: string;
  storage?: string;
  shipping?: string;
  notes?: string[];
  commerce?: Commerce;
  giftEligible?: boolean;
  images: MediaAsset[];
  seo?: SeoMetadata;
  publishedAt?: string;
  updatedAt?: string;
  status: PublicationStatus;
};

export type SalesChannelType =
  | 'morning_market'
  | 'base'
  | 'furusato_tax'
  | 'store'
  | 'chilled_shipping'
  | 'frozen_shipping'
  | 'other';

export type SalesChannel = {
  id: string;
  name: string;
  type: SalesChannelType;
  url?: string;
  location?: string;
  active?: boolean;
};

export type RecipeCategory = 'mochi' | 'pickles' | 'seasonal';

export type RecipeIngredient = {
  name: string;
  amount: string;
  note?: string;
};

export type RecipeStep = {
  position: number;
  instruction: string;
  image?: MediaAsset;
};

export type RecipeRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: RecipeCategory;
  season?: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  servings: string;
  cookingTimeMinutes?: number;
  relatedProductIds: string[];
  mainImage?: MediaAsset;
  stepImages?: MediaAsset[];
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  notes?: string[];
  allergens?: AllergenInfo;
  storageNotes?: string;
  seo?: SeoMetadata;
  status: PublicationStatus;
};

export type ContentModelData = {
  products: ProductRecord[];
  giftSets: GiftSetRecord[];
  seasonalProducts: SeasonalProductRecord[];
  recipes: RecipeRecord[];
  salesChannels: SalesChannel[];
};
