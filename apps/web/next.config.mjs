import createBundleAnalyzer from "@next/bundle-analyzer";
import { createMDX } from "fumadocs-mdx/next";
import { withPlausibleProxy } from "next-plausible";

const withMDX = createMDX();

const withAnalyzer = createBundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "https",
				hostname: "covers.openlibrary.org",
			},
		],
		formats: ["image/webp"],
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	serverExternalPackages: ["ts-morph", "typescript", "twoslash", "shiki"],
	experimental: {
		optimizePackageImports: [
			"@radix-ui/react-accordion",
			"@radix-ui/react-aspect-ratio",
			"@radix-ui/react-collapsible",
			"@radix-ui/react-dialog",
			"@radix-ui/react-navigation-menu",
			"@radix-ui/react-popover",
			"@radix-ui/react-presence",
			"@radix-ui/react-scroll-area",
			"@radix-ui/react-slot",
			"lucide-react",
		],
	},
	async rewrites() {
		return [
			{
				source: "/:path*.mdx",
				destination: "/llms.mdx/:path*",
			},
		];
	},
	async redirects() {
		return [
			{
				source: "/patterns",
				destination: "/patterns/getting-started",
				permanent: true,
			},
			{
				source: "/en/:path*",
				destination: "/:path*",
				permanent: true,
			},
			// Glossary redirects - old URLs to new letter-based structure
			{
				source: "/glossary/touch-targets",
				destination: "/glossary/t/touch-targets",
				permanent: true,
			},
			{
				source: "/glossary/design-tokens",
				destination: "/glossary/d/design-tokens",
				permanent: true,
			},
			{
				source: "/glossary/viewport",
				destination: "/glossary/v/viewport",
				permanent: true,
			},
			{
				source: "/glossary/live-regions",
				destination: "/glossary/l/live-regions",
				permanent: true,
			},
			{
				source: "/glossary/canonical-tags",
				destination: "/glossary/c/canonical-tags",
				permanent: true,
			},
			{
				source: "/glossary/aria-attributes",
				destination: "/glossary/a/aria-attributes",
				permanent: true,
			},
			{
				source: "/glossary/semantic-html",
				destination: "/glossary/s/semantic-html",
				permanent: true,
			},
			{
				source: "/glossary/pagination",
				destination: "/glossary/p/pagination",
				permanent: true,
			},
			{
				source: "/glossary/cls-cumulative-layout-shift",
				destination: "/glossary/c/cls-cumulative-layout-shift",
				permanent: true,
			},
			{
				source: "/glossary/progressive-loading",
				destination: "/glossary/p/progressive-loading",
				permanent: true,
			},
			{
				source: "/glossary/lazy-loading",
				destination: "/glossary/l/lazy-loading",
				permanent: true,
			},
			{
				source: "/glossary/dom",
				destination: "/glossary/d/dom",
				permanent: true,
			},
			{
				source: "/glossary/skeleton-screen",
				destination: "/glossary/s/skeleton-screen",
				permanent: true,
			},
			{
				source: "/glossary/keyboard-navigation",
				destination: "/glossary/k/keyboard-navigation",
				permanent: true,
			},
			{
				source: "/glossary/screen-reader",
				destination: "/glossary/s/screen-reader",
				permanent: true,
			},
			// Pattern redirects - incorrect URLs to correct ones
			{
				source: "/patterns/content-management/disclosure",
				destination: "/patterns/content-management/expandable-text",
				permanent: true,
			},
			{
				source: "/patterns/forms/validation",
				destination: "/patterns/forms/form-validation",
				permanent: true,
			},
			{
				source: "/patterns/feedback/notifications",
				destination: "/patterns/user-feedback/notification",
				permanent: true,
			},
			{
				source: "/patterns/forms/buttons",
				destination: "/patterns/forms/button",
				permanent: true,
			},
			{
				source: "/patterns/navigation",
				destination: "/patterns/navigation/navigation-menu",
				permanent: true,
			},
			{
				source: "/patterns/media/audio-player",
				destination: "/patterns/media/video-player",
				permanent: true,
			},
		];
	},
};

export default withPlausibleProxy()(withAnalyzer(withMDX(config)));
