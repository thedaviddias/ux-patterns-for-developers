/* eslint-env node */
import { JetBrains_Mono as FontMono, Inter as FontSans } from "next/font/google";
import {
  LastUpdated,
  Layout,
  LocaleSwitch,
  Navbar
} from 'nextra-theme-docs';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { getDictionary } from '../_dictionaries/get-dictionary';

import PlausibleProvider from 'next-plausible';
import { DiscordIcon, GitHubIcon } from "nextra/icons";
import '../../styles/globals.css';
import { Footer } from "../_components/footer";
import { GITHUB_REPO_URL, PROJECT_URL } from "../_constants/project";
import { metadataSEO } from "../metadata";

export const { viewport } = Head

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = metadataSEO

export default async function RootLayout({ children, params }) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  const pageMap = await getPageMap(`/${lang}`)

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
      projectIcon={<GitHubIcon className="w-6 h-6" aria-label="Github" />}
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
