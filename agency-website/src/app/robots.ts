import type { MetadataRoute } from 'next';

const BASE = 'https://www.selerim.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Non-public / parked surfaces and the API are kept out of search.
      disallow: [
        '/api/',
        '/login',
        '/dashboard',
        '/owner',
        '/account-setup',
        '/admin-setup',
        '/invite',
        '/forgot-password',
        '/reset-password',
      ],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
