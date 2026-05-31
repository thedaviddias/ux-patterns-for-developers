/**
 * Quality evals for the MCP server against the real pattern corpus.
 */

import { createServer } from "../../server";
import {
	getImplementationChecklist,
	getPattern,
	registerAllTools,
	searchPatterns,
	suggestPattern,
} from "../../tools";

const EXPECTED_TOOL_NAMES = [
	"list_categories",
	"list_patterns",
	"get_pattern",
	"search_patterns",
	"get_glossary_term",
	"get_quick_reference",
	"suggest_pattern",
	"review_code",
	"check_accessibility",
	"pattern_advisor",
	"get_implementation_checklist",
];

describe("MCP quality evals", () => {
	describe("protocol and tool coverage", () => {
		it("exposes the full production tool surface with useful schemas", async () => {
			const server = createServer();
			registerAllTools(server);

			const response = await server.handleRequest({
				jsonrpc: "2.0",
				id: 1,
				method: "tools/list",
			});

			expect(response.error).toBeUndefined();
			const result = response.result as {
				tools: Array<{
					name: string;
					description?: string;
					inputSchema?: { type?: string; properties?: Record<string, unknown> };
				}>;
			};
			const toolNames = result.tools.map((tool) => tool.name);

			expect(toolNames).toEqual(EXPECTED_TOOL_NAMES);
			for (const tool of result.tools) {
				expect(tool.description).toEqual(expect.any(String));
				expect(tool.description?.length).toBeGreaterThan(20);
				expect(tool.inputSchema?.type).toBe("object");
				expect(tool.inputSchema?.properties).toBeDefined();
			}
		});
	});

	describe("search relevance", () => {
		const evalCases: Array<{
			query: string;
			topResultIn: string[];
			mustIncludeWithinTopFive?: string[];
		}> = [
			{
				query: "search input with suggestions",
				topResultIn: [
					"patterns/forms/search-field",
					"patterns/forms/autocomplete",
				],
				mustIncludeWithinTopFive: [
					"patterns/forms/search-field",
					"patterns/forms/autocomplete",
				],
			},
			{
				query: "confirmation code login",
				topResultIn: [
					"patterns/forms/code-confirmation",
					"patterns/authentication/two-factor",
				],
			},
			{
				query: "table for comparing pricing plans",
				topResultIn: [
					"patterns/data-display/comparison-table",
					"patterns/data-display/table",
				],
			},
			{
				query: "multi step onboarding wizard",
				topResultIn: ["patterns/advanced/wizard"],
			},
			{
				query: "empty state after no search results",
				topResultIn: [
					"patterns/user-feedback/empty-states",
					"patterns/advanced/search-results",
				],
			},
		];

		it.each(evalCases)('returns relevant top results for "$query"', async ({
			query,
			topResultIn,
			mustIncludeWithinTopFive = [],
		}) => {
			const result = await searchPatterns({ query, limit: 5 });
			const slugs = result.results.map((pattern) => pattern.slug);

			expect(slugs.length).toBeGreaterThan(0);
			expect(topResultIn).toContain(slugs[0]);
			for (const expectedSlug of mustIncludeWithinTopFive) {
				expect(slugs).toContain(expectedSlug);
			}
		});
	});

	describe("answer usefulness", () => {
		it("returns complete pattern content for direct lookup", async () => {
			const result = await getPattern({ name: "forms/autocomplete" });

			expect(result).toMatchObject({
				slug: "patterns/forms/autocomplete",
				title: "Autocomplete",
				category: "forms",
			});
			expect("body" in result && result.body.length).toBeGreaterThan(1000);
			expect(
				"relatedPatterns" in result && result.relatedPatterns.length,
			).toBeGreaterThan(0);
			expect(
				"glossaryTerms" in result && Array.isArray(result.glossaryTerms),
			).toBe(true);
		});

		it("suggests contextually useful patterns for common build tasks", async () => {
			const result = await suggestPattern({
				context:
					"I am building a settings page with boolean preferences and notification toggles",
				limit: 5,
			});
			const slugs = result.suggestions.map((suggestion) => suggestion.pattern);

			expect(slugs).toContain("patterns/forms/toggle");
			expect(result.suggestions[0].relevance).toBeGreaterThan(0.5);
		});

		it("provides actionable implementation checklists", async () => {
			const result = await getImplementationChecklist({
				pattern: "forms/autocomplete",
			});

			expect(result).toMatchObject({
				pattern: "patterns/forms/autocomplete",
				title: "Autocomplete",
			});
			expect("checklist" in result && result.checklist.length).toBeGreaterThan(
				0,
			);
			expect(
				"checklist" in result &&
					result.checklist.some((phase) =>
						phase.items.some((item) => item.priority === "required"),
					),
			).toBe(true);
			expect("estimatedTime" in result && result.estimatedTime).toEqual(
				expect.any(String),
			);
		});
	});
});
