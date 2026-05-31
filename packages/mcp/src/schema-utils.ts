import * as z from "zod";

interface JsonLikeSchema {
	type?: string | string[];
	enum?: readonly string[];
	properties?: Record<string, JsonLikeSchema>;
	items?: JsonLikeSchema;
	required?: string[];
	[key: string]: unknown;
}

function applyNullable(
	schema: z.ZodTypeAny,
	type: JsonLikeSchema["type"],
): z.ZodTypeAny {
	if (!Array.isArray(type) || !type.includes("null")) {
		return schema;
	}

	return schema.nullable();
}

function buildObjectSchema(schema: JsonLikeSchema): z.ZodTypeAny {
	const required = new Set(schema.required || []);
	const shape = Object.fromEntries(
		Object.entries(schema.properties || {}).map(([key, value]) => {
			const propertySchema = required.has(key)
				? jsonSchemaToZod(value)
				: jsonSchemaToZod(value).optional();

			return [key, propertySchema];
		}),
	);

	return z.object(shape).catchall(z.any());
}

export function jsonSchemaToZod(
	schema: JsonLikeSchema | undefined,
): z.ZodTypeAny {
	if (!schema) {
		return z.any();
	}

	if (schema.enum && schema.enum.length > 0) {
		const values = [...schema.enum];
		const enumSchema =
			values.length === 1
				? z.literal(values[0])
				: z.enum([values[0], ...values.slice(1)] as [string, ...string[]]);

		return applyNullable(enumSchema, schema.type);
	}

	const type = Array.isArray(schema.type)
		? schema.type.filter((value) => value !== "null")[0]
		: schema.type;

	switch (type) {
		case "string":
			return applyNullable(z.string(), schema.type);
		case "number":
		case "integer":
			return applyNullable(z.number(), schema.type);
		case "boolean":
			return applyNullable(z.boolean(), schema.type);
		case "array":
			return applyNullable(z.array(jsonSchemaToZod(schema.items)), schema.type);
		default:
			return applyNullable(buildObjectSchema(schema), schema.type);
	}
}
