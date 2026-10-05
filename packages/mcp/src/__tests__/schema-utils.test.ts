import * as z from "zod";
import { jsonSchemaToZod } from "../schema-utils";

describe("public tool schema conversion", () => {
	it("preserves descriptions and defaults for client discovery", () => {
		const schema = jsonSchemaToZod({
			type: "object",
			properties: {
				limit: {
					type: "integer",
					description: "Page size",
					default: 20,
					minimum: 1,
					maximum: 100,
				},
			},
		});
		expect(schema.parse({})).toEqual({ limit: 20 });
		expect(z.toJSONSchema(schema)).toMatchObject({
			properties: {
				limit: {
					description: "Page size",
					default: 20,
					minimum: 1,
					maximum: 100,
				},
			},
		});
	});
	it("enforces required fields, enums, lengths and integer bounds", () => {
		const schema = jsonSchemaToZod({
			type: "object",
			required: ["count", "text", "mode"],
			properties: {
				count: { type: "integer", minimum: 1, maximum: 5 },
				text: { type: "string", minLength: 1, maxLength: 3 },
				mode: { type: "string", enum: ["one", "two"] },
			},
		});
		for (const value of [
			{},
			{ count: 1.5, text: "ok", mode: "one" },
			{ count: 6, text: "ok", mode: "one" },
			{ count: 1, text: "long", mode: "one" },
			{ count: 1, text: "ok", mode: "three" },
		])
			expect(schema.safeParse(value).success).toBe(false);
		expect(
			schema.safeParse({ count: 1, text: "ok", mode: "one" }).success,
		).toBe(true);
	});
	it("supports nullable values, nested objects and arrays", () => {
		const schema = jsonSchemaToZod({
			type: "object",
			properties: {
				names: { type: "array", items: { type: ["string", "null"] } },
				nested: {
					type: "object",
					properties: { enabled: { type: "boolean" } },
				},
			},
		});
		expect(
			schema.parse({ names: ["one", null], nested: { enabled: true } }),
		).toEqual({ names: ["one", null], nested: { enabled: true } });
	});
});
