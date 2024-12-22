export { middleware } from 'nextra/locales'

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api/mdx|api/patterns/random|api/og|_next/static|_next/image|favicon.ico|robots.txt|og/opengraph-image.png|twitter-image|sitemap.xml|apple-icon.png|manifest|_pagefind).*)'
  ]
}
