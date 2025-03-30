import { MetadataRoute } from 'next';
import { getBlogList } from '@/utils/markdown';

export default function sitemap(): MetadataRoute.Sitemap {
  // Get all blog posts
  const blogs = getBlogList();
  
  // Create sitemap entries for blog posts
  const blogEntries = blogs.map((blog) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mirza.solutions'}/blog/${blog.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Add other important pages
  const routes = [
    '',
    '/blog',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mirza.solutions'}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.7,
  }));

  return [...routes, ...blogEntries];
} 