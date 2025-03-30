import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|fonts|images|favicon.ico|logo.svg).*)'],
};

const defaultLocale = 'en';
const locales = ['en', 'fa'];

export function middleware(request: NextRequest) {
  // Get pathname
  const pathname = request.nextUrl.pathname;
  
  // Check if pathname already has locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) {
    return NextResponse.next();
  }
  
  // If the pathname is the root, redirect to the default locale root
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  // Otherwise, rewrite the URL to include the default locale
  return NextResponse.rewrite(new URL(`/${defaultLocale}${pathname}`, request.url));
} 