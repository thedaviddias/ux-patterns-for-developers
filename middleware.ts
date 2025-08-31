import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only allow 'en' locale, redirect everything else to /en
  if (pathname.startsWith('/fr/') || pathname === '/fr') {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = pathname.replace(/^\/fr/, '/en');
    return NextResponse.redirect(newUrl);
  }

  // If accessing root without locale, redirect to /en
  if (pathname === '/') {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = '/en';
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api/mdx|api/email|api/patterns/random|api/og|_next/static|_next/image|llms-full.txt|llms.txt|favicon.ico|robots.txt|og/opengraph-image.png|covers|twitter-image|sitemap.xml|6ba7b811-9dad-11d1-80b4.txt|43mg4ybv6sxxanu24g7dngawd9up5w93.txt|apple-icon.png|manifest|_pagefind|examples).*)',
  ],
};
