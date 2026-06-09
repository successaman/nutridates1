import type { MetadataRoute } from 'next';

const BASE_URL = 'https://nutridates.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/thank-you',
    '/about',
    '/privacy-policy',
    '/terms-conditions',
    '/disclaimer',
    '/locations',
    '/blog',
  ];

  const locations = [
    'hazaribagh',
    'ranchi',
    'jamshedpur',
    'patna',
    'delhi',
    'mumbai',
  ];

  const blogPosts = [
    'benefits-dates-chocolate-milk',
    'healthy-drinks-without-refined-sugar-kids',
    'natural-daily-energy-boosters-busy-schedule',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static pages
  staticPages.forEach((route) => {
    sitemapEntries.push({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1.0 : route === '/about' ? 0.8 : 0.5,
    });
  });

  // Localized city pages
  locations.forEach((city) => {
    sitemapEntries.push({
      url: `${BASE_URL}/locations/${city}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // Blog posts
  blogPosts.forEach((slug) => {
    sitemapEntries.push({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  return sitemapEntries;
}
