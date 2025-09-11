import { createMDX } from "fumadocs-mdx/next";
import { withPlausibleProxy } from "next-plausible";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.google.com",
				pathname: "/s2/favicons",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
		],
	},
	async rewrites() {
		return [
			{
				source: "/docs/:path*.mdx",
				destination: "/llms.mdx/:path*",
			},
		];
	},
	webpack: (config) => {
		// Ignore OpenTelemetry instrumentation warnings
		config.ignoreWarnings = [
			{
				module: /@opentelemetry\/instrumentation/,
				message: /Critical dependency/,
			},
		];
		return config;
	},
};

export default withPlausibleProxy()(withMDX(config));
