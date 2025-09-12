import { ImageResponse } from "next/og";
import type { ReactElement } from "react";

/**
 * OpenGraph image configuration
 */
export interface OGImageConfig {
	title: string;
	description?: string;
	subtitle?: string;
	theme?: "light" | "dark";
	logo?: string;
	backgroundImage?: string;
	backgroundColor?: string;
	textColor?: string;
	accentColor?: string;
	fontSize?: {
		title?: number;
		description?: number;
		subtitle?: number;
	};
}

/**
 * Standard OpenGraph image dimensions
 */
export const OG_IMAGE_DIMENSIONS = {
	standard: { width: 1200, height: 630 },
	square: { width: 1200, height: 1200 },
	twitter: { width: 1200, height: 600 },
} as const;

/**
 * Helper to create OpenGraph image metadata for Next.js file convention
 */
export function createOGImageMetadata(options: {
	alt: string;
	size?: keyof typeof OG_IMAGE_DIMENSIONS | { width: number; height: number };
	contentType?: string;
}) {
	const dimensions =
		typeof options.size === "string"
			? OG_IMAGE_DIMENSIONS[options.size]
			: options.size || OG_IMAGE_DIMENSIONS.standard;

	return {
		runtime: "edge" as const,
		alt: options.alt,
		size: dimensions,
		contentType: options.contentType || "image/png",
	};
}

/**
 * Base template for OpenGraph images
 */
export function createOGImageTemplate(config: OGImageConfig): ReactElement {
	const {
		title,
		description,
		subtitle,
		theme = "light",
		backgroundColor = theme === "dark" ? "#000000" : "#ffffff",
		textColor = theme === "dark" ? "#ffffff" : "#000000",
		accentColor = "#0066cc",
		fontSize = {},
	} = config;

	const titleSize = fontSize.title || 60;
	const descriptionSize = fontSize.description || 30;
	const subtitleSize = fontSize.subtitle || 24;

	return (
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor,
				padding: "60px",
			}}
		>
			{subtitle && (
				<div
					style={{
						fontSize: subtitleSize,
						color: accentColor,
						marginBottom: "20px",
						fontWeight: 600,
						textTransform: "uppercase",
						letterSpacing: "2px",
					}}
				>
					{subtitle}
				</div>
			)}

			<div
				style={{
					fontSize: titleSize,
					fontWeight: "bold",
					color: textColor,
					marginBottom: description ? "30px" : 0,
					textAlign: "center",
					lineHeight: 1.2,
					maxWidth: "90%",
				}}
			>
				{title}
			</div>

			{description && (
				<div
					style={{
						fontSize: descriptionSize,
						color: textColor,
						opacity: 0.8,
						textAlign: "center",
						lineHeight: 1.4,
						maxWidth: "80%",
					}}
				>
					{description}
				</div>
			)}
		</div>
	);
}

/**
 * Create a gradient background OpenGraph image
 */
export function createGradientOGImage(
	config: OGImageConfig & {
		gradient?: string;
	},
): ReactElement {
	const gradient =
		config.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

	return (
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background: gradient,
				padding: "60px",
			}}
		>
			<div
				style={{
					fontSize: config.fontSize?.title || 72,
					fontWeight: "bold",
					color: "#ffffff",
					marginBottom: config.description ? "30px" : 0,
					textAlign: "center",
					lineHeight: 1.2,
					maxWidth: "90%",
					textShadow: "0 2px 4px rgba(0,0,0,0.2)",
				}}
			>
				{config.title}
			</div>

			{config.description && (
				<div
					style={{
						fontSize: config.fontSize?.description || 32,
						color: "#ffffff",
						opacity: 0.95,
						textAlign: "center",
						lineHeight: 1.4,
						maxWidth: "80%",
						textShadow: "0 1px 2px rgba(0,0,0,0.2)",
					}}
				>
					{config.description}
				</div>
			)}
		</div>
	);
}

/**
 * Create a pattern-based OpenGraph image
 */
export function createPatternOGImage(
	config: OGImageConfig & {
		pattern?: "dots" | "grid" | "circuit" | "waves";
		patternColor?: string;
		patternOpacity?: number;
	},
): ReactElement {
	const {
		pattern = "dots",
		patternColor = "#000000",
		patternOpacity = 0.05,
		...baseConfig
	} = config;

	const _patterns = {
		dots: `radial-gradient(circle, ${patternColor} 1px, transparent 1px)`,
		grid: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`,
		circuit: `linear-gradient(90deg, ${patternColor} 1px, transparent 1px), linear-gradient(${patternColor} 1px, transparent 1px)`,
		waves: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${patternColor} 10px, ${patternColor} 20px)`,
	};

	return (
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				position: "relative",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: baseConfig.backgroundColor || "#ffffff",
			}}
		>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundImage: patterns[pattern],
					backgroundSize: pattern === "dots" ? "20px 20px" : "20px 20px",
					opacity: patternOpacity,
				}}
			/>

			<div
				style={{
					position: "relative",
					zIndex: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					padding: "60px",
				}}
			>
				{baseConfig.subtitle && (
					<div
						style={{
							fontSize: baseConfig.fontSize?.subtitle || 24,
							color: baseConfig.accentColor || "#0066cc",
							marginBottom: "20px",
							fontWeight: 600,
							textTransform: "uppercase",
							letterSpacing: "2px",
						}}
					>
						{baseConfig.subtitle}
					</div>
				)}

				<div
					style={{
						fontSize: baseConfig.fontSize?.title || 60,
						fontWeight: "bold",
						color: baseConfig.textColor || "#000000",
						marginBottom: baseConfig.description ? "30px" : 0,
						textAlign: "center",
						lineHeight: 1.2,
						maxWidth: "90%",
					}}
				>
					{baseConfig.title}
				</div>

				{baseConfig.description && (
					<div
						style={{
							fontSize: baseConfig.fontSize?.description || 30,
							color: baseConfig.textColor || "#000000",
							opacity: 0.8,
							textAlign: "center",
							lineHeight: 1.4,
							maxWidth: "80%",
						}}
					>
						{baseConfig.description}
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * Helper to generate OpenGraph image response
 */
export async function generateOGImage(
	element: ReactElement,
	options: {
		width?: number;
		height?: number;
		emoji?: "twemoji" | "blobmoji" | "noto" | "openmoji";
		fonts?: Array<{
			name: string;
			data: ArrayBuffer;
			style?: "normal" | "italic";
			weight?: number;
		}>;
	} = {},
): Promise<ImageResponse> {
	const { width = 1200, height = 630, ...rest } = options;

	return new ImageResponse(element, {
		width,
		height,
		...rest,
	});
}

/**
 * Helper to fetch and include custom fonts for OpenGraph images
 */
export async function loadOGFont(url: string): Promise<ArrayBuffer> {
	const response = await fetch(url);
	return response.arrayBuffer();
}

/**
 * Pre-configured font loaders for common fonts
 */
export const OG_FONTS = {
	async inter(_weight: number = 400): Promise<ArrayBuffer> {
		const url = `https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2`;
		return loadOGFont(url);
	},

	async roboto(_weight: number = 400): Promise<ArrayBuffer> {
		const url = `https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2`;
		return loadOGFont(url);
	},

	async montserrat(_weight: number = 400): Promise<ArrayBuffer> {
		const url = `https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2`;
		return loadOGFont(url);
	},
};

/**
 * Utility to validate OpenGraph image requirements
 */
export function validateOGImage(config: {
	width: number;
	height: number;
	format?: string;
}): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	// Check dimensions
	if (config.width < 200) {
		errors.push("Width must be at least 200px");
	}
	if (config.height < 200) {
		errors.push("Height must be at least 200px");
	}
	if (config.width > 8192) {
		errors.push("Width must not exceed 8192px");
	}
	if (config.height > 8192) {
		errors.push("Height must not exceed 8192px");
	}

	// Check aspect ratio for specific platforms
	const aspectRatio = config.width / config.height;

	// Facebook recommends 1.91:1
	if (Math.abs(aspectRatio - 1.91) < 0.1) {
		// Good for Facebook
	}

	// Twitter recommends 2:1 for summary_large_image
	if (Math.abs(aspectRatio - 2) < 0.1) {
		// Good for Twitter
	}

	// LinkedIn recommends 1.91:1
	if (Math.abs(aspectRatio - 1.91) < 0.1) {
		// Good for LinkedIn
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
