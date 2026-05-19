import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${base}/#about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/#services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/#leadership`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/#contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];
}
