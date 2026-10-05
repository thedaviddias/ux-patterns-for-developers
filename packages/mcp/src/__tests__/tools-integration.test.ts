import {
	Client,
	StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { createServer } from "../server";
import { registerAllTools } from "../tools";

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
			} finally {
				await client.close();
			}
		});
	}
});
