import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import nextra from 'nextra';

const withNextra = nextra({
  defaultShowCopyCode: true,
  contentDirBasePath: '/',
  unstable_shouldAddLocaleToLinks: true
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfig = withBundleAnalyzer(
  withNextra({
    reactStrictMode: true,
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true
    },
    i18n: {
      locales: ['en'],
      defaultLocale: 'en',
      localeDetection: false
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
        {
          protocol: 'https',
          hostname: 'covers.openlibrary.org',
        },
      ],
      formats: ['image/webp', 'image/avif'],
    },
    redirects: async () => [
      {
        source: '/llms-full.txt',
        destination: '/en/llms-full.txt',
        statusCode: 302
      },
      {
        source: '/llms.txt',
        destination: '/en/llms.txt',
        statusCode: 302
      },
      {
        source: '/patterns',
        destination: '/patterns/getting-started',
        statusCode: 302
      },
      {
        source: '/patterns/navigation',
        destination: '/',
        statusCode: 302
      },
      {
        source: '/patterns/docs/navigation/breadcrumb',
        destination: '/patterns/navigation/breadcrumb',
        statusCode: 302
      }
    ],
    async rewrites() {
      return [
        {
          source: '/og/:slug',
          destination: '/api/og?title=:slug',
        },
      ]
    },
  })
)

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "thedaviddias",
  project: "ux-patterns-for-developers",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: false,
  },

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: false,
});
