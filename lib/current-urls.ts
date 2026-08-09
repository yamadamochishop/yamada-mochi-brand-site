import { products } from '../data/catalog';

export const staticIndexablePaths = [
  '/',
  '/brand-story',
  '/third-generation',
  '/craft',
  '/products',
  '/seasonal',
  '/gift',
  '/market',
  '/news',
  '/voices',
  '/faq',
  '/contact',
] as const;

export const currentIndexablePaths = [
  ...staticIndexablePaths,
  ...products.map((product) => `/products/${product.slug}`),
];
