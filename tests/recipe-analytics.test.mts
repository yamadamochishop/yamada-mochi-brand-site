import assert from 'node:assert/strict';
import test from 'node:test';
import {
  trackRecipeInternalClick,
  trackRecipeSectionNav,
  trackRecipeProductClick,
} from '../lib/analytics.ts';

test('YM-012: each recipe tracking call sends one event with exact parameters', () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const events: unknown[][] = [];
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { gtag: (...args: unknown[]) => events.push(args) },
  });
  try {
    trackRecipeSectionNav('mochi-yakikata', 'frying-pan-oil');
    assert.deepEqual(events, [
      [
        'event',
        'recipe_section_nav',
        { recipe_slug: 'mochi-yakikata', section_id: 'frying-pan-oil' },
      ],
    ]);
    events.length = 0;
    trackRecipeInternalClick({
      recipeSlug: 'isobeyaki',
      linkType: 'technique_guide',
      targetPath: '/recipes/mochi-yakikata#frying-pan-oil',
      placement: 'method_guide',
    });
    assert.deepEqual(events, [
      [
        'event',
        'recipe_internal_click',
        {
          recipe_slug: 'isobeyaki',
          link_type: 'technique_guide',
          target_path: '/recipes/mochi-yakikata#frying-pan-oil',
          placement: 'method_guide',
        },
      ],
    ]);
    events.length = 0;
    trackRecipeProductClick({
      recipeSlug: 'isobeyaki',
      productSlug: 'plain',
      placement: 'recipe_brand_note',
    });
    assert.deepEqual(events, [
      [
        'event',
        'recipe_to_product_click',
        { recipe_slug: 'isobeyaki', product_slug: 'plain', placement: 'recipe_brand_note' },
      ],
    ]);
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});
