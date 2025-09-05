import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	webpack: (config) => {
		// Ignore OpenTelemetry instrumentation warnings
		config.ignoreWarnings = [
			{ module: /@opentelemetry\/instrumentation/, message: /Critical dependency/ },
		];
		return config;
	},
};

export default withMDX(config);
