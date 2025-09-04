import { z } from "zod";

export const registryItemFileSchema = z.object({
	path: z.string(),
	type: z.enum([
		"registry:ui",
		"registry:lib",
		"registry:hook",
		"registry:component",
		"registry:block",
		"registry:page",
	]),
	target: z.string().optional(),
	content: z.string().optional(),
});

export const registryItemSchema = z.object({
	name: z.string(),
	type: z.enum([
		"registry:ui",
		"registry:lib",
		"registry:hook",
		"registry:component",
		"registry:block",
		"registry:page",
	]),
	description: z.string().optional(),
	dependencies: z.array(z.string()).default([]),
	registryDependencies: z.array(z.string()).default([]),
	files: z.array(registryItemFileSchema),
	component: z.any().optional(),
	meta: z
		.object({
			tags: z.array(z.string()).default([]),
		})
		.default({ tags: [] }),
});

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type RegistryItemFile = z.infer<typeof registryItemFileSchema>;
