import assert from 'node:assert/strict';
import { catalogSets, products } from '../data/catalog.ts';
import { compatibleGiftSets, compatibleProducts, contentModel } from '../data/content-model.ts';
import { assertValidContentModel } from '../lib/content-model/validate.ts';
import { getSeasonalListingWarnings } from '../lib/seasonal-page.ts';

assertValidContentModel(contentModel);
assert.deepEqual(
  compatibleProducts,
  products,
  'normalized product compatibility projection drifted',
);

for (const warning of getSeasonalListingWarnings(new Date())) {
  console.warn(`check:content-model warning: ${warning}`);
}
assert.deepEqual(
  compatibleGiftSets,
  catalogSets,
  'normalized gift compatibility projection drifted',
);

console.log(
  `check:content-model passed: ${contentModel.products.length} products, ${contentModel.giftSets.length} gift sets, ${contentModel.seasonalProducts.length} seasonal records, ${contentModel.salesChannels.length} channels, ${contentModel.salesLocations.length} locations.`,
);
