import { products } from '../data/catalog';
import { publishedRecipes } from './recipe-page';

export const staticIndexablePaths = [
  '/',
  '/brand-story',
  '/third-generation',
  '/craft',
  '/products',
  '/seasonal',
  '/gift',
  '/recipes',
  '/market',
  '/news',
  '/voices',
  '/faq',
  '/contact',
] as const;

export const currentIndexablePaths = [
  ...staticIndexablePaths,
  ...products.map((product) => `/products/${product.slug}`),
  ...publishedRecipes.map((recipe) => `/recipes/${recipe.slug}`),
];
