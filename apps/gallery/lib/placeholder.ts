// Generate data URL placeholders instead of relying on external service
export function createPlaceholderDataURL(
	width: number = 800,
	height: number = 600,
	text: string = "Placeholder",
	bgColor: string = "f3f4f6",
	textColor: string = "374151",
): string {
	// Create SVG placeholder
	const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bgColor}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            fill="#${textColor}" font-family="Inter, sans-serif" font-size="24" font-weight="500">
        ${text}
      </text>
    </svg>
  `;

	return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// Predefined placeholders for our patterns
export const placeholders = {
	loadMoreGood: createPlaceholderDataURL(
		800,
		600,
		"Load More Good",
		"f3f4f6",
		"374151",
	),
	loadMoreBad: createPlaceholderDataURL(
		800,
		600,
		"Infinite Scroll Bad",
		"fef2f2",
		"dc2626",
	),
	expandableTextGood: createPlaceholderDataURL(
		800,
		600,
		"Progressive Disclosure",
		"f3f4f6",
		"374151",
	),
	expandableTextBad: createPlaceholderDataURL(
		800,
		600,
		"Hidden Content Bad",
		"fef2f2",
		"dc2626",
	),
	backToTopGood: createPlaceholderDataURL(
		800,
		600,
		"Back to Top Good",
		"f3f4f6",
		"374151",
	),
	backToTopBad: createPlaceholderDataURL(
		800,
		600,
		"Floating Button Bad",
		"fef2f2",
		"dc2626",
	),
};
