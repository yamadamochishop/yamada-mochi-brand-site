import type {
  AvailabilityStatus,
  Commerce,
  ContentModelData,
  MediaAsset,
  Money,
  ProductCategory,
  RecipeCategory,
  RecipeDifficulty,
  RecipePopularity,
  RecipeRecord,
  SalesPeriod,
  SeasonalCommerce,
  Seasonality,
} from '../../types/content-model.ts';

const availabilityStatuses = new Set<AvailabilityStatus>([
  'unknown',
  'upcoming',
  'available',
  'sold_out',
  'ended',
]);

const productCategories = new Set<ProductCategory>([
  'mochi',
  'confectionery',
  'pickles',
  'pie',
  'wagashi',
  'other',
]);

const seasonalities = new Set<Seasonality>(['year_round', 'seasonal']);

const recipeCategories = new Set<RecipeCategory>(['mochi', 'pickles', 'seasonal']);

const recipeDifficulties = new Set<RecipeDifficulty>(['easy', 'normal', 'hard']);

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

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

function validateSeasonalCommerce(
  owner: string,
  commerce: SeasonalCommerce,
  channelIds: Set<string>,
  errors: string[],
) {
  const statuses = new Set(['available', 'unavailable', 'preparing', 'undecided']);
  const offerStatuses = new Set(['confirmed', 'preparing', 'undecided']);

  if (!statuses.has(commerce.status)) {
    errors.push(`${owner}: invalid commerce status "${commerce.status}"`);
  }
  if (commerce.status === 'unavailable' && commerce.offers.length > 0) {
    errors.push(`${owner}: unavailable commerce cannot have offers`);
  }
  if (
    commerce.status === 'available' &&
    !commerce.offers.some((offer) => offer.status === 'confirmed')
  ) {
    errors.push(`${owner}: available commerce requires a confirmed offer`);
  }

  const seen = new Set<string>();
  for (const offer of commerce.offers) {
    if (seen.has(offer.channelId)) {
      errors.push(`${owner}: duplicate commerce channelId "${offer.channelId}"`);
    }
    seen.add(offer.channelId);
    if (!channelIds.has(offer.channelId)) {
      errors.push(`${owner}: unknown commerce channelId "${offer.channelId}"`);
    }
    if (!offerStatuses.has(offer.status)) {
      errors.push(`${owner}: invalid commerce offer status "${offer.status}"`);
    }
    if (offer.url && offer.status !== 'confirmed') {
      errors.push(`${owner}: only a confirmed commerce offer may have a CTA URL`);
    }
    if (offer.url) {
      try {
        const url = new URL(offer.url);
        if (url.protocol !== 'https:') {
          errors.push(`${owner}: commerce offer URL must use HTTPS`);
        }
      } catch {
        errors.push(`${owner}: invalid commerce offer URL`);
      }
    }
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

function validateLocationReferences(
  owner: string,
  references: string[],
  locationIds: Set<string>,
  errors: string[],
) {
  const seen = new Set<string>();

  for (const locationId of references) {
    if (seen.has(locationId)) {
      errors.push(`${owner}: duplicate salesLocationId "${locationId}"`);
    }
    seen.add(locationId);
    if (!locationIds.has(locationId)) {
      errors.push(`${owner}: unknown salesLocationId "${locationId}"`);
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

function salesPeriodIncludesMonth(salesPeriod: SalesPeriod, month: number): boolean {
  const { startMonth, endMonth } = salesPeriod;
  if (startMonth === undefined || endMonth === undefined) return false;
  if (startMonth <= endMonth) return month >= startMonth && month <= endMonth;
  return month >= startMonth || month <= endMonth;
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

/**
 * レシピ画像。altが無い画像は読み上げ・検索の両方で情報を失うため、
 * 登録された画像には必ずaltを求める。
 */
function validateRecipeImage(owner: string, image: MediaAsset | undefined, errors: string[]) {
  if (!image) return;
  if (!image.src.trim()) errors.push(`${owner}: missing image src`);
  if (!image.alt.trim()) errors.push(`${owner}: missing image alt text`);
}

/**
 * 材料名の重複判定に使う比較キー。
 *
 * 前後の空白、全角・半角の違い（NFKC）、ASCIIの大文字小文字だけが異なる名前は、
 * 同じ材料の書き分けとして重複扱いにする。内部の空白は残す。日本語の材料名では
 * 空白が語の区切りとして意味を持つことがあり、詰めると別の材料まで同一視しかねない。
 * ここで閉じたいのは明白な表記ゆれであって、材料名の意味解決ではない。
 */
function ingredientKey(name: string): string {
  return name.trim().normalize('NFKC').toLowerCase();
}

/**
 * 材料。名前と分量のどちらが欠けても読者は作れないため、両方を必須にする。
 * 同じ材料名が二度現れるのは転記ミスなので弾く。
 */
function validateRecipeIngredients(owner: string, recipe: RecipeRecord, errors: string[]) {
  if (recipe.ingredients.length === 0) {
    errors.push(`${owner}: recipe requires at least one ingredient`);
    return;
  }

  const seen = new Set<string>();
  for (const ingredient of recipe.ingredients) {
    const name = ingredient.name.trim();
    if (!name) {
      errors.push(`${owner}: missing ingredient name`);
      continue;
    }
    const key = ingredientKey(name);
    if (seen.has(key)) errors.push(`${owner}: duplicate ingredient "${name}"`);
    seen.add(key);
    if (!ingredient.amount.trim()) errors.push(`${owner}: missing amount for "${name}"`);
  }
}

/**
 * 手順。`position` は表示にもRecipe構造化データにも出るため、
 * 1から始まる連番であることを配列の順序と合わせて求める。
 */
function validateRecipeSteps(owner: string, recipe: RecipeRecord, errors: string[]) {
  if (recipe.steps.length === 0) {
    errors.push(`${owner}: recipe requires at least one step`);
    return;
  }

  recipe.steps.forEach((step, index) => {
    const expected = index + 1;
    if (step.position !== expected) {
      errors.push(`${owner}: step position "${step.position}" must be ${expected}`);
    }
    if (!step.instruction.trim()) {
      errors.push(`${owner}: step ${expected} has no instruction`);
    }
    validateRecipeImage(`${owner}: step ${expected}`, step.image, errors);
  });
}

/**
 * タグ。検索・絞り込みのキーになるため、空文字と重複（表記ゆれ含む）を弾く。
 */
function validateRecipeTags(owner: string, tags: string[] | undefined, errors: string[]) {
  if (!tags) return;
  const seen = new Set<string>();
  for (const tag of tags) {
    const name = tag.trim();
    if (!name) {
      errors.push(`${owner}: empty tag`);
      continue;
    }
    const key = ingredientKey(name);
    if (seen.has(key)) errors.push(`${owner}: duplicate tag "${name}"`);
    seen.add(key);
  }
}

/**
 * 人気指標。Search Console から転記した実測値だけを想定し、
 * 負の値・比率の範囲外・日付形式のずれを転記ミスとして弾く。
 * 数値を入れたら `measuredAt` を必須にし、「いつの値か」が分からない指標を残さない。
 */
function validateRecipePopularity(
  owner: string,
  popularity: RecipePopularity | undefined,
  errors: string[],
) {
  if (!popularity) return;

  const nonNegative = [
    'score',
    'searchConsoleClicks',
    'searchConsoleImpressions',
    'searchConsolePosition',
  ] as const;
  for (const field of nonNegative) {
    const value = popularity[field];
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
      errors.push(`${owner}: popularity.${field} must be zero or greater`);
    }
  }
  for (const field of ['searchConsoleClicks', 'searchConsoleImpressions'] as const) {
    const value = popularity[field];
    if (value !== undefined && !Number.isInteger(value)) {
      errors.push(`${owner}: popularity.${field} must be an integer`);
    }
  }

  const ctr = popularity.searchConsoleCtr;
  if (ctr !== undefined && (!Number.isFinite(ctr) || ctr < 0 || ctr > 1)) {
    errors.push(`${owner}: popularity.searchConsoleCtr must be a ratio from 0 to 1`);
  }

  if (popularity.measuredAt !== undefined && !isoDatePattern.test(popularity.measuredAt)) {
    errors.push(`${owner}: popularity.measuredAt must be YYYY-MM-DD`);
  }

  const hasMetric = [
    popularity.score,
    popularity.searchConsoleClicks,
    popularity.searchConsoleImpressions,
    popularity.searchConsoleCtr,
    popularity.searchConsolePosition,
  ].some((value) => value !== undefined);
  if (hasMetric && !popularity.measuredAt) {
    errors.push(`${owner}: popularity metrics require measuredAt`);
  }
}

function validateRecipe(recipe: RecipeRecord, productIds: Set<string>, errors: string[]) {
  const owner = `recipe:${recipe.id}`;

  if (!recipe.title.trim()) errors.push(`${owner}: missing title`);
  if (!recipe.description.trim()) errors.push(`${owner}: missing description`);
  if (!recipeCategories.has(recipe.category)) {
    errors.push(`${owner}: invalid category "${recipe.category}"`);
  }

  validateRecipeIngredients(owner, recipe, errors);
  validateRecipeSteps(owner, recipe, errors);

  // レシピは必ずどれかの商品に接続する。接続先のないレシピは購入導線を持たない。
  if (recipe.relatedProductIds.length === 0) {
    errors.push(`${owner}: recipe requires at least one relatedProductId`);
  }
  validateRelatedProducts(owner, recipe.relatedProductIds, productIds, errors);

  validateRecipeImage(owner, recipe.mainImage, errors);
  for (const image of recipe.stepImages ?? []) {
    validateRecipeImage(owner, image, errors);
  }

  // 調理時間はHuman確認が取れた場合だけ設定する任意項目。設定するなら正の整数。
  if (
    recipe.cookingTimeMinutes !== undefined &&
    (!Number.isInteger(recipe.cookingTimeMinutes) || recipe.cookingTimeMinutes <= 0)
  ) {
    errors.push(`${owner}: cookingTimeMinutes must be a positive integer`);
  }

  // 難易度も同じくHuman確認後の任意項目。
  if (recipe.difficulty !== undefined && !recipeDifficulties.has(recipe.difficulty)) {
    errors.push(`${owner}: invalid difficulty "${recipe.difficulty}"`);
  }

  validateRecipeTags(owner, recipe.tags, errors);
  validateRecipePopularity(owner, recipe.popularity, errors);

  for (const field of ['publishedAt', 'updatedAt'] as const) {
    const value = recipe[field];
    if (value !== undefined && !isoDatePattern.test(value)) {
      errors.push(`${owner}: ${field} must be YYYY-MM-DD`);
    }
  }

  // canonicalPathは実際のルートと一致させる。ずれると自己参照canonicalが別URLを指す。
  const canonicalPath = recipe.seo?.canonicalPath;
  if (canonicalPath !== undefined && canonicalPath !== `/recipes/${recipe.slug}`) {
    errors.push(`${owner}: canonicalPath must be "/recipes/${recipe.slug}"`);
  }
}

export function validateContentModel(data: ContentModelData): string[] {
  const errors: string[] = [];

  validateIdentity('products', data.products, errors);
  validateIdentity('giftSets', data.giftSets, errors);
  validateIdentity('seasonalProducts', data.seasonalProducts, errors);
  validateIdentity('recipes', data.recipes, errors);
  validateIdentity('salesChannels', data.salesChannels, errors);
  validateIdentity('salesLocations', data.salesLocations, errors);
  validateIdentity('seasonalReplacementRules', data.seasonalReplacementRules, errors);

  const productIds = new Set(data.products.map((product) => product.id));
  const seasonalProductIds = new Set(data.seasonalProducts.map((product) => product.id));
  const channelIds = new Set(data.salesChannels.map((channel) => channel.id));
  const locationIds = new Set(data.salesLocations.map((location) => location.id));

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
    if (!productCategories.has(seasonalProduct.category)) {
      errors.push(`${owner}: invalid category "${seasonalProduct.category}"`);
    }
    if (!seasonalities.has(seasonalProduct.seasonality)) {
      errors.push(`${owner}: invalid seasonality "${seasonalProduct.seasonality}"`);
    }
    if (
      seasonalProduct.seasonality === 'year_round' &&
      (seasonalProduct.salesPeriod.startMonth !== undefined ||
        seasonalProduct.salesPeriod.endMonth !== undefined)
    ) {
      errors.push(`${owner}: year_round product cannot have calendar month boundaries`);
    }
    validateMoney(owner, seasonalProduct.price, errors);
    validateSeasonalCommerce(owner, seasonalProduct.commerce, channelIds, errors);
    validateLocationReferences(owner, seasonalProduct.salesLocationIds, locationIds, errors);
    validateAvailability(owner, seasonalProduct.availabilityStatus, errors);
    validateSalesPeriod(owner, seasonalProduct.salesPeriod, errors);
  }

  const referencedProducts = new Set<string>();
  for (const reference of data.productCalendarReferences) {
    const owner = `productCalendarReference:${reference.productId}`;
    if (referencedProducts.has(reference.productId)) {
      errors.push(`${owner}: duplicate product calendar reference`);
    }
    referencedProducts.add(reference.productId);
    if (!productIds.has(reference.productId)) {
      errors.push(`${owner}: unknown productId "${reference.productId}"`);
    }
    if (reference.seasonality !== 'year_round') {
      errors.push(`${owner}: existing product reference must be year_round`);
    }
    validateAvailability(owner, reference.availabilityStatus, errors);
  }

  for (const rule of data.seasonalReplacementRules) {
    const owner = `seasonalReplacementRule:${rule.id}`;
    const replacement = data.seasonalProducts.find(
      (product) => product.id === rule.replacementSeasonalProductId,
    );
    if (!productIds.has(rule.replacedProductId)) {
      errors.push(`${owner}: unknown replacedProductId "${rule.replacedProductId}"`);
    }
    if (!referencedProducts.has(rule.replacedProductId)) {
      errors.push(`${owner}: replaced product must have a calendar reference`);
    }
    if (!seasonalProductIds.has(rule.replacementSeasonalProductId) || !replacement) {
      errors.push(
        `${owner}: unknown replacementSeasonalProductId "${rule.replacementSeasonalProductId}"`,
      );
    } else if (replacement.seasonality !== 'seasonal') {
      errors.push(`${owner}: replacement product must be seasonal`);
    }
    if (rule.months.length === 0) errors.push(`${owner}: replacement months cannot be empty`);
    const seenMonths = new Set<number>();
    for (const month of rule.months) {
      if (!Number.isInteger(month) || month < 1 || month > 12) {
        errors.push(`${owner}: replacement month must be an integer from 1 to 12`);
      }
      if (seenMonths.has(month)) errors.push(`${owner}: duplicate replacement month "${month}"`);
      seenMonths.add(month);
      if (replacement && !salesPeriodIncludesMonth(replacement.salesPeriod, month)) {
        errors.push(`${owner}: replacement month "${month}" is outside replacement salesPeriod`);
      }
    }
  }

  for (const recipe of data.recipes) {
    validateRecipe(recipe, productIds, errors);
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

  for (const location of data.salesLocations) {
    if (!location.name.trim()) errors.push(`salesLocation:${location.id}: missing name`);
  }

  return errors;
}

export function assertValidContentModel(data: ContentModelData): void {
  const errors = validateContentModel(data);

  if (errors.length) {
    throw new Error(`Content model validation failed (${errors.length})\n${errors.join('\n')}`);
  }
}
