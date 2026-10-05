import {
	Client,
	StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { createServer } from "../server";
import { registerAllTools } from "../tools";
import type { TocItem } from "../types";

const cases: Array<[string, Record<string, unknown>]> = [
	["list_categories", {}],
	["list_patterns", { limit: 5 }],
	["search_patterns", { query: "button" }],
	["get_pattern", { name: "button" }],
	["get_glossary_term", { term: "Progressive Loading" }],
	["get_quick_reference", {}],
	["suggest_pattern", { context: "Select one option from a list" }],
	["review_code", { code: '<button type="button">Save</button>' }],
	["check_accessibility", { code: '<button type="button">Save</button>' }],
	[
		"pattern_advisor",
		{ mode: "direct", requirements: "Select one option from a list" },
	],
	["get_implementation_checklist", { pattern: "button" }],
];

describe("public tools against built content", () => {
	for (const mode of ["legacy", "auto"] as const) {
		it(`executes every advertised tool for ${mode} clients`, async () => {
			const server = createServer();
			registerAllTools(server);
			const client = new Client(
				{ name: "connector-smoke", version: "1.0.0" },
				{ versionNegotiation: { mode } },
			);
			await client.connect(
				new StreamableHTTPClientTransport(
					new URL("https://mcp.uxpatterns.dev"),
					{
						fetch: (input, init) =>
							server.handleHttpRequest(new Request(input, init)),
					},
				),
			);
			try {
				const list = await client.listTools();
				for (const tool of list.tools) {
					expect(tool.title).toMatch(/^[A-Z]/);
					expect(tool.annotations?.readOnlyHint).toBe(true);
					expect(tool.annotations?.destructiveHint).toBe(false);
				}
				expect(list.tools.map((t) => t.name).sort()).toEqual(
					cases.map(([name]) => name).sort(),
				);
				for (const [name, args] of cases) {
					const result = await client.callTool({ name, arguments: args });
					if (result.isError)
						throw new Error(`${name}: ${JSON.stringify(result)}`);
					expect(result.content).not.toHaveLength(0);
					if (result.structuredContent) {
						expect(result.structuredContent).not.toHaveProperty("error");
					} else {
						expect(JSON.stringify(result.content)).toContain(
							"response truncated",
						);
					}
				}
				const pattern = await client.callTool({
					name: "get_pattern",
					arguments: { name: "search-field" },
				});
				expect(pattern.isError).not.toBe(true);
				const toc = pattern.structuredContent?.toc as TocItem[];
				const titles: string[] = [];
				const collectTitles = (items: TocItem[]) => {
					for (const entry of items) {
						titles.push(entry.title);
						collectTitles(entry.items);
					}
				};
				collectTitles(toc);
				expect(titles).toContain("Using the wrong validation moment");
				expect(titles.some((title) => title.startsWith("undefined"))).toBe(
					false,
				);
				const readable = pattern.structuredContent?.body;
				expect(readable).toContain("## Accessibility");
				expect(readable).not.toContain("function _createMdxContent");
				expect(readable).not.toContain("jsxDEV");
				const selected = await client.callTool({
					name: "get_pattern",
					arguments: {
						name: "search-field",
						sections: ["Accessibility", "Examples"],
					},
				});
				expect(selected.structuredContent?.body).toContain("## Accessibility");
				expect(selected.structuredContent?.body).toContain("<input");
				expect(selected.structuredContent?.body).not.toContain("## Drawbacks");
				expect(selected.structuredContent?.toc).toBeUndefined();
				expect(selected.structuredContent?.url).toBe(
					"https://uxpatterns.dev/patterns/forms/search-field",
				);
				const missingSection = await client.callTool({
					name: "get_pattern",
					arguments: {
						name: "search-field",
						sections: ["Accessibility", "not-a-section"],
					},
				});
				expect(missingSection.isError).toBe(true);
				expect(missingSection.structuredContent?.suggestions).toContain(
					"Accessibility",
				);
				const loadMore = await client.callTool({
					name: "get_pattern",
					arguments: { name: "load-more" },
				});
				expect(loadMore.isError).not.toBe(true);
				const loadMoreText = loadMore.content
					.map((part) => (part.type === "text" ? part.text : ""))
					.join("\n");
				expect(loadMoreText).toContain("## Overview");
				expect(loadMoreText).not.toContain("<BuildEffort");
				expect(loadMoreText).not.toContain("<FaqStructuredData");
				const checked = await client.callTool({
					name: "check_accessibility",
					arguments: { code: '<div onclick="save()">Save</div>' },
				});
				expect(checked.structuredContent?.passed).toEqual([]);
				expect(checked.structuredContent?.notVerified).toContain(
					"1.4.3 (Level AA)",
				);
			} finally {
				await client.close();
			}
		});
	}
});
