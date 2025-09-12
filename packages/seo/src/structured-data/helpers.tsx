/**
 * JsonLd component for React/Next.js
 */
export function JsonLd({
	data,
}: {
	data: Record<string, unknown> | Record<string, unknown>[];
}) {
	const serializedData = JSON.stringify(data)
		.replace(/</g, "\\u003c")
		.replace(/\u2028/g, "\\u2028")
		.replace(/\u2029/g, "\\u2029");

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: serializedData }}
		/>
	);
}

/**
 * Helper to render JsonLd in Next.js
 */
export function renderJsonLd(
	data: Record<string, unknown> | Record<string, unknown>[],
): {
	__html: string;
} {
	const serializedData = JSON.stringify(data)
		.replace(/</g, "\\u003c")
		.replace(/\u2028/g, "\\u2028")
		.replace(/\u2029/g, "\\u2029");

	return { __html: serializedData };
}

/**
 * Helper to combine multiple schemas
 */
export function combineSchemas(
	...schemas: Array<Record<string, unknown> | null | undefined>
): Record<string, unknown>[] {
	return schemas.filter((s): s is Record<string, unknown> => Boolean(s));
}
