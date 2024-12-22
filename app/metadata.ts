import { Metadata } from "next";
import { BASE_URL } from "./_constants/project";

export const metadataSEO: Metadata = {
  title: {
    absolute: '',
    template: '%s | UX Patterns for Devs'
  },
  description:
    'UX Patterns for Devs is a collection of UX Patterns for Devs to use in their projects.',
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow"
  },
  keywords: ['ux', 'ux patterns', 'ux for devs', 'ux design', 'ux design patterns'],
  creator: 'David Dias',
  metadataBase: new URL(BASE_URL),
  category: 'ux',
  openGraph: {
    siteName: "UX Patterns for Devs",
    type: "website",
    locale: "en_US",
    title: "UX Patterns for Devs",
    description: "UX Patterns for Devs is a collection of UX Patterns for Devs to use in their projects.",
    images: [{
      url: '/og/opengraph-image.png',
      width: 1200,
      height: 630,
      type: 'image/png',
    }]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@thedaviddias'
  },
  appleWebApp: {
    title: 'UX Patterns for Devs'
  },
  other: {
    'msapplication-TileColor': '#fff'
  }
}
