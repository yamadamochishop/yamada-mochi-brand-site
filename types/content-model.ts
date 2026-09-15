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
  note?: string;
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

export type ProductCategory = 'mochi' | 'confectionery' | 'pickles' | 'pie' | 'wagashi' | 'other';

export type Seasonality = 'year_round' | 'seasonal';

export type SeasonalCommerceStatus = 'available' | 'unavailable' | 'preparing' | 'undecided';

export type SeasonalCommerceOfferStatus = 'confirmed' | 'preparing' | 'undecided';

export type SeasonalCommerceOffer = {
  channelId: string;
  status: SeasonalCommerceOfferStatus;
  url?: string;
  offerLabel?: string;
};

export type SeasonalCommerce = {
  status: SeasonalCommerceStatus;
  offers: SeasonalCommerceOffer[];
};

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
  seasonality: Seasonality;
  salesPeriod: SalesPeriod;
  availabilityStatus: AvailabilityStatus;
  availabilityNote?: string;
  /** Human確定の短いリード文。カードの一行目に使う（推測で埋めない）。 */
  catchcopy?: string;
  price?: Money;
  salesLocationIds: string[];
  story?: string;
  ingredients?: string;
  allergens?: AllergenInfo;
  commitment?: string;
  shelfLife?: string;
  storage?: string;
  shipping?: string;
  notes?: string[];
  commerce: SeasonalCommerce;
  giftEligible?: boolean;
  images: MediaAsset[];
  seo?: SeoMetadata;
  publishedAt?: string;
  updatedAt?: string;
  status: PublicationStatus;
};

export type SalesLocationType = 'morning_market' | 'store' | 'other';

export type SalesLocation = {
  id: string;
  name: string;
  type: SalesLocationType;
  active: boolean;
};

export type ProductCalendarReference = {
  productId: string;
  seasonality: 'year_round';
  availabilityStatus: AvailabilityStatus;
};

export type SeasonalReplacementRule = {
  id: string;
  replacedProductId: string;
  replacementSeasonalProductId: string;
  months: number[];
};

export type SalesChannelType =
  | 'morning_market'
  | 'base'
  | 'tabechoku'
  | 'pokemaru'
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

/** 「もうひとつの好きな食べ方」など、基本の作り方に対する任意のアレンジ。 */
export type RecipeVariation = {
  title: string;
  text: string;
};

/**
 * レシピに添える暮らしのコラム。調理手順ではないため、
 * 手順・材料とは別の枠として扱う。
 */
export type RecipeColumn = {
  title: string;
  body: string;
};

/** 難易度。Humanが実際に作って判断した場合にだけ設定する。 */
export type RecipeDifficulty = 'easy' | 'normal' | 'hard';

/**
 * 人気指標。Search Console・GA4の実測値を後から転記する枠で、
 * 表示・並び替えの根拠にする。未接続の間はすべて未設定のままにする。
 * 値を入れるときは `measuredAt` と `period` で「いつの・どの期間の値か」を残す。
 */
export type RecipePopularity = {
  /** 並び替え用の総合スコア。算出式は docs/recipes で決めてから入れる。 */
  score?: number;
  searchConsoleClicks?: number;
  searchConsoleImpressions?: number;
  /** 0〜1 の比率（%ではない）。 */
  searchConsoleCtr?: number;
  searchConsolePosition?: number;
  /** 転記した日（YYYY-MM-DD）。 */
  measuredAt?: string;
  /** 集計期間の説明（例: "2026-08-01〜2026-08-28"）。 */
  period?: string;
};

export type RecipeRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: RecipeCategory;
  season?: string;
  /**
   * 検索・絞り込み用の分類語。本文（手順・説明・アレンジ）に書かれている
   * 調理法や食べる場面だけを付け、本文にない特徴を付けない。
   */
  tags?: string[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  /** 人数・分量はHuman確認が取れたレシピにだけ設定する（推測で埋めない）。 */
  servings?: string;
  /** 調理時間もHuman確認が取れた場合にだけ設定する。 */
  cookingTimeMinutes?: number;
  /** 難易度もHuman確認が取れた場合にだけ設定する。 */
  difficulty?: RecipeDifficulty;
  relatedProductIds: string[];
  /** 一覧の「注目レシピ」に優先して出す。編集判断で付ける。 */
  featured?: boolean;
  popularity?: RecipePopularity;
  mainImage?: MediaAsset;
  stepImages?: MediaAsset[];
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  /** 「おいしく作るポイント」として表示する補足。 */
  notes?: string[];
  variations?: RecipeVariation[];
  column?: RecipeColumn;
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
  salesLocations: SalesLocation[];
  productCalendarReferences: ProductCalendarReference[];
  seasonalReplacementRules: SeasonalReplacementRule[];
};
