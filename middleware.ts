export { middleware } from 'nextra/locales'

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api/mdx|api/patterns/random|api/og|_next/static|_next/image|favicon.ico|robots.txt|og/opengraph-image.png|twitter-image|sitemap.xml|6ba7b811-9dad-11d1-80b4.txt|apple-icon.png|manifest|_pagefind).*)'
  ]
}
