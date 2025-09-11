import { createMDX } from "fumadocs-mdx/next";
import { withPlausibleProxy } from "next-plausible";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
};

export default withPlausibleProxy()(withMDX(config));
