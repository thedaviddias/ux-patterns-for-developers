export { middleware } from 'nextra/locales'

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api/mdx|api/patterns/random|_next/static|_next/image|favicon.ico|opengraph-image.png|twitter-image.png|sitemap.xml|apple-icon.png|manifest|_pagefind).*)'
  ]
}
