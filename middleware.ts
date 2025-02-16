export { middleware } from 'nextra/locales'

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api/mdx|api/email|api/patterns/random|api/og|_next/static|_next/image|llms.txt|favicon.ico|robots.txt|og/opengraph-image.png|covers|twitter-image|sitemap.xml|6ba7b811-9dad-11d1-80b4.txt|43mg4ybv6sxxanu24g7dngawd9up5w93.txt|apple-icon.png|manifest|_pagefind|examples).*)'
  ]
}
