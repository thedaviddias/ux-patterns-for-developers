/* eslint-env node */
import { JetBrains_Mono as FontMono, Poppins as FontSans } from "next/font/google";
import {
  LastUpdated,
  Layout,
  LocaleSwitch,
  Navbar
} from 'nextra-theme-docs';
import { Banner } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { getDictionary } from '../_dictionaries/get-dictionary';

import PlausibleProvider from 'next-plausible';
import { DiscordIcon } from "nextra/icons";
import '../../styles/globals.css';
import { Footer } from "../_components/footer";
import { LinkCustom } from "../_components/link-custom";
import { Stars } from "../_components/stars";
import { GITHUB_REPO_URL, PROJECT_URL } from "../_constants/project";
import { metadataSEO } from "../metadata";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = metadataSEO

export default async function RootLayout({ children, params }: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  const pageMap = await getPageMap(`/${lang}`)

  const banner = (
    <Banner storageKey="swr-2">
      UX Patterns for Devs GPT is now available! <LinkCustom href="/blog/ux-patterns-gpt" variant="primary" className="text-sm">Read more →</LinkCustom>
    </Banner>
  )

  const navbar = (
    <Navbar
      logo={
        <>
          <span
            className="ms-2 font-extrabold select-none"
            title={`${dictionary.logo.title}`}
          >
            UX Patterns for Devs
          </span>
        </>
      }
      projectLink={PROJECT_URL}
      projectIcon={
        <Stars variant="small" />
      }
      chatLink="https://ddias.link/discord"
      chatIcon={<DiscordIcon className="w-6 h-6" aria-label="Discord" />}
    >
      <LocaleSwitch />
    </Navbar>
  )

  const footer = (
    <Footer lang={lang} />
  )
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="uxpatterns.dev" trackOutboundLinks={true} taggedEvents={true} />
      </head>
      <body className={`${fontSans.variable} ${fontMono.variable} bg-background font-sans antialiased`}>
        <Layout
          navbar={navbar}
          footer={footer}
          docsRepositoryBase={GITHUB_REPO_URL}
          banner={banner}
          sidebar={{
            defaultMenuCollapseLevel: 1,
            autoCollapse: true
          }}
          toc={{
            backToTop: dictionary.backToTop,
          }}
          editLink={dictionary.editPage}
          pageMap={pageMap}
          nextThemes={{ defaultTheme: 'dark' }}
          lastUpdated={<LastUpdated>{dictionary.lastUpdated}</LastUpdated>}
          themeSwitch={{
            dark: dictionary.dark,
            light: dictionary.light,
            system: dictionary.system
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
