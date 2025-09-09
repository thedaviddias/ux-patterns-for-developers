import createBundleAnalyzer from "@next/bundle-analyzer";
import { createMDX } from "fumadocs-mdx/next";

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
				hostname: "covers.openlibrary.org",
				port: "",
				pathname: "/**",
			},
		],
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
	async rewrites() {
		return [
			{
				source: "/docs/:path*.mdx",
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
		];
	},
};

export default withAnalyzer(withMDX(config));
