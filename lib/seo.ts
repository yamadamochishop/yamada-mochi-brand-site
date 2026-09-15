import type { Metadata } from 'next';
import type { Product } from '../data/catalog.ts';
import { site } from '../data/site.ts';
import type { RecipeRecord } from '../types/content-model.ts';

export function absoluteUrl(path = '') {
  const base = site.siteUrl.replace(/\/$/, '');
  return path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

const organizationId = absoluteUrl('/#organization');
const websiteId = absoluteUrl('/#website');

export function pageOpenGraph({
  title,
  description,
  path,
  image = '/images/og-yamada-mochi.webp',
  imageAlt = '山田もち店の高山もちギフトボックス',
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata['openGraph'] {
  return {
    title,
    description,
    url: absoluteUrl(path),
    siteName: site.name,
    images: [{ url: image, alt: imageAlt }],
    locale: 'ja_JP',
    type: 'website',
  };
}

export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': organizationId,
        name: site.name,
        alternateName: site.enName,
        description: site.description,
        url: site.siteUrl,
        telephone: site.tel,
        address: {
          '@type': 'PostalAddress',
          addressRegion: '岐阜県',
          addressLocality: '高山市',
          streetAddress: '千島町1145',
          addressCountry: 'JP',
        },
        foundingDate: '1975',
        sameAs: [site.baseUrl, site.pokeMarcheUrl, site.tabechokuUrl],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: site.name,
        alternateName: site.enName,
        description: site.description,
        url: site.siteUrl,
        inLanguage: 'ja',
        publisher: { '@id': organizationId },
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function numericPrice(price: string) {
  const value = Number(price.replace(/[^0-9.]/g, ''));

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid product price: ${price}`);
  }

  return value;
}

export function productSchema(product: Product) {
  return {
    '@type': 'Product',
    name: `${product.name} 高山もち`,
    image: absoluteUrl(product.image),
    description: product.seo.description,
    brand: {
      '@type': 'Brand',
      name: site.name,
    },
    offers: {
      '@type': 'Offer',
      price: numericPrice(product.price),
      priceCurrency: 'JPY',
      availability: 'https://schema.org/InStock',
    },
  };
}

export function productJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    ...productSchema(product),
  };
}

export function productListJsonLd(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '山田もち店 商品一覧',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: productSchema(product),
    })),
  };
}

export function simpleItemListJsonLd(name: string, itemNames: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: itemNames.map((itemName, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: itemName,
    })),
  };
}

/**
 * Recipe Hubの ItemList。各項目に `url` を持たせ、Googleのレシピ一覧
 * （ホストカルーセル）の要件に合わせる。個々の `Recipe` は詳細ページ側で出す。
 */
export function recipeItemListJsonLd(recipes: RecipeRecord[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '山田もち店 お餅のレシピ',
    itemListElement: recipes.map((recipe, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: recipe.title,
      url: absoluteUrl(`/recipes/${recipe.slug}`),
    })),
  };
}

/** 分単位の調理時間を ISO 8601 duration に変換する（Recipe.cookTime 用）。 */
function isoDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `PT${hours > 0 ? `${hours}H` : ''}${rest > 0 || hours === 0 ? `${rest}M` : ''}`;
}

/**
 * Recipe構造化データ。
 *
 * ページに表示されている事実だけを出力する。人数・調理時間は `data/recipes.ts` に
 * Human確認済みの値がある場合だけ出力し、カロリー等は扱わない。Googleのレシピリッチリザルトは画像を
 * 必須とするため、写真が未登録のレシピでは `null` を返し、構造化データ自体を
 * 出力しない。`mainImage` を登録した時点で自動的に有効になる。
 */
export function recipeJsonLd(recipe: RecipeRecord) {
  if (!recipe.mainImage) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: absoluteUrl(recipe.mainImage.src),
    url: absoluteUrl(`/recipes/${recipe.slug}`),
    inLanguage: 'ja',
    author: { '@id': organizationId },
    publisher: { '@id': organizationId },
    recipeCategory: 'お餅',
    ...(recipe.tags && recipe.tags.length > 0 ? { keywords: recipe.tags.join(', ') } : {}),
    ...(recipe.publishedAt ? { datePublished: recipe.publishedAt } : {}),
    ...(recipe.updatedAt ? { dateModified: recipe.updatedAt } : {}),
    // 調理時間・人数はHumanが実測して `data/recipes.ts` に入れた場合にだけ出す。
    ...(recipe.cookingTimeMinutes !== undefined
      ? { totalTime: isoDuration(recipe.cookingTimeMinutes) }
      : {}),
    ...(recipe.servings ? { recipeYield: recipe.servings } : {}),
    recipeIngredient: recipe.ingredients.map((ingredient) =>
      `${ingredient.name} ${ingredient.amount}`.trim(),
    ),
    recipeInstructions: recipe.steps.map((step) => ({
      '@type': 'HowToStep',
      position: step.position,
      text: step.instruction,
    })),
  };
}

export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}
