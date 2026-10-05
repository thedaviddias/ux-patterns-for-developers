import * as z from "zod";

interface JsonLikeSchema {
	type?: string | string[];
	enum?: readonly string[];
	description?: string;
	default?: unknown;
	properties?: Record<string, JsonLikeSchema>;
	items?: JsonLikeSchema;
	required?: string[];
	minimum?: number;
	maximum?: number;
	minLength?: number;
	maxLength?: number;
	[key: string]: unknown;
}

export function jsonSchemaToZod(
	schema: JsonLikeSchema | undefined,
): z.ZodTypeAny {
	if (!schema) return z.any();
	const type = Array.isArray(schema.type)
		? schema.type.find((value) => value !== "null")
		: schema.type;
	let result: z.ZodTypeAny;
	if (schema.enum?.length) {
		const values = [...schema.enum] as [string, ...string[]];
		result = z.enum(values);
	} else {
		switch (type) {
			case "string": {
				let text = z.string();
				if (schema.minLength !== undefined) text = text.min(schema.minLength);
				if (schema.maxLength !== undefined) text = text.max(schema.maxLength);
				result = text;
				break;
			}
			case "integer":
			case "number": {
				let number = type === "integer" ? z.number().int() : z.number();
				if (schema.minimum !== undefined) number = number.min(schema.minimum);
				if (schema.maximum !== undefined) number = number.max(schema.maximum);
				result = number;
				break;
			}
			case "boolean":
				result = z.boolean();
				break;
			case "array":
				result = z.array(jsonSchemaToZod(schema.items));
				break;
			default: {
				const required = new Set(schema.required ?? []);
				const shape = Object.fromEntries(
					Object.entries(schema.properties ?? {}).map(([key, value]) => {
						const property = jsonSchemaToZod(value);
						return [key, required.has(key) ? property : property.optional()];
					}),
				);
				result = z.object(shape).catchall(z.unknown());
			}
		}
	}
	if (Array.isArray(schema.type) && schema.type.includes("null"))
		result = result.nullable();
	if (schema.default !== undefined) result = result.default(schema.default);
	if (schema.description) result = result.describe(schema.description);
	return result;
}
