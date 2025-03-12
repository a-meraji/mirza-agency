import { NextResponse } from 'next/server';

export function GET() {
  // Get the site URL from environment variables or use a default
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  
  // Create robots.txt content
  const robotsTxt = `
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /admin/*
Disallow: /api/*

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;

  // Return the robots.txt content with the correct content type
  return new NextResponse(robotsTxt.trim(), {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800'
    },
  });
} 