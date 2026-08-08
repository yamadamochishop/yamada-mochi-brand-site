import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { currentIndexablePaths } from '@/lib/current-urls';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return currentIndexablePaths.map((path) => ({
    url: `${site.siteUrl}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: path.startsWith('/products') ? 'monthly' : 'weekly',
    priority: path === '/' ? 1 : path.startsWith('/products') ? 0.8 : 0.7,
  }));
}
