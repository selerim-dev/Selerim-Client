import type { MetadataRoute } from 'next';

const BASE = 'https://www.selerim.com';

// Public, indexable pages only.
const ROUTES = [
  '',
  '/services',
  '/pricing',
  '/case-studies',
  '/about',
  '/how-we-work',
  '/success',
  '/contact',
  '/terms',
  '/privacy',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
