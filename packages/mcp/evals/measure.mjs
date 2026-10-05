import {
	Client,
	StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { encode } from "gpt-tokenizer";
import { getPatterns } from "../dist/data/index.js";
import { createServer } from "../dist/index.js";
import { registerAllTools } from "../dist/tools/index.js";
export const tokens = (value) =>
	encode(typeof value === "string" ? value : JSON.stringify(value)).length;
export async function connect() {
	const server = createServer();
	registerAllTools(server);
	const client = new Client(
		{ name: "ux-token-eval", version: "1.0.0" },
		{ versionNegotiation: { mode: "auto" } },
	);
	await client.connect(
		new StreamableHTTPClientTransport(new URL("https://mcp.uxpatterns.dev"), {
			fetch: (input, init) =>
				server.handleHttpRequest(new Request(input, init)),
		}),
	);
	return client;
}
export const cases = {
	categories: [["list_categories", {}]],
	list: [["list_patterns", { limit: 5 }]],
	listMax: [["list_patterns", { limit: 100 }]],
	searchMax: [["search_patterns", { query: "a", limit: 100 }]],
	referenceMax: [["get_quick_reference", { limit: 100, includeRelated: true }]],
	search: [["search_patterns", { query: "accessible search field", limit: 5 }]],
	retrieve: [["get_pattern", { name: "search-field", includeToc: false }]],
	targeted: [
		[
			"get_pattern",
			{ name: "search-field", sections: ["Accessibility", "Examples"] },
		],
	],
	glossary: [["get_glossary_term", { term: "Progressive Loading" }]],
	reference: [["get_quick_reference", {}]],
	compare: [["suggest_pattern", { context: "Select one option from a list" }]],
	review: [["review_code", { code: '<div onclick="save()">Save</div>' }]],
	accessibility: [
		["check_accessibility", { code: '<div onclick="save()">Save</div>' }],
	],
	advisor: [
		[
			"pattern_advisor",
			{ mode: "direct", requirements: "Select one option from a list" },
		],
	],
	checklist: [["get_implementation_checklist", { pattern: "button" }]],
	missing: [["get_pattern", { name: "definitely-not-a-real-pattern" }]],
	searchRetrieve: [
		["search_patterns", { query: "accessible search field", limit: 3 }],
		["get_pattern", { name: "search-field", includeToc: false }],
	],
	searchTargeted: [
		["search_patterns", { query: "accessible search field", limit: 3 }],
		[
			"get_pattern",
			{ name: "search-field", sections: ["Accessibility", "Examples"] },
		],
	],
	snippetReview: [
		["review_code", { code: '<div onclick="save()">Save</div>' }],
		["check_accessibility", { code: '<div onclick="save()">Save</div>' }],
	],
};
export async function measureFlow(name) {
	const client = await connect();
	try {
		const discovery = await client.listTools();
		const results = [];
		const requests = [];
		async function call(tool, args) {
			requests.push({ name: tool, arguments: args });
			const r = await client.callTool({ name: tool, arguments: args });
			results.push(r);
			return r;
		}
		if (name === "advisorRetry") {
			const first = await call("pattern_advisor", { mode: "interactive" });
			const state = first.structuredContent;
			const args = {
				mode: "interactive",
				sessionId: state.sessionId,
				answers: { interaction_type: "Form input" },
			};
			const a = await call("pattern_advisor", args);
			const b = await call("pattern_advisor", args);
			if (JSON.stringify(a) !== JSON.stringify(b))
				throw new Error("Advisor retry changed result");
		} else {
			if (!cases[name]) throw new Error(`Unknown flow ${name}`);
			for (const [tool, args] of cases[name]) await call(tool, args);
		}
		if (name !== "missing" && results.some((r) => r.isError))
			throw new Error("Unexpected tool error");
		const discoveryTokens = tokens(discovery);
		const responseTokens = results.reduce((sum, r) => sum + tokens(r), 0);
		const requestTokens = requests.reduce((sum, r) => sum + tokens(r), 0);
		return {
			name,
			discoveryTokens,
			responseTokens,
			requestTokens,
			totalTokens: discoveryTokens + responseTokens + requestTokens,
			textTokens: results.reduce((sum, r) => sum + tokens(r.content), 0),
			results,
		};
	} finally {
		await client.close();
	}
}
export async function corpusReport() {
	const client = await connect();
	try {
		const rows = [];
		for (const p of getPatterns()) {
			const result = await client.callTool({
				name: "get_pattern",
				arguments: { name: p.slug },
			});
			if (result.isError) throw new Error(`Corpus retrieval failed: ${p.slug}`);
			rows.push({
				slug: p.slug,
				responseTokens: tokens(result),
				textTokens: tokens(result.content),
				truncated: !result.structuredContent,
			});
		}
		rows.sort((a, b) => a.responseTokens - b.responseTokens);
		const at = (p) =>
			rows[Math.min(rows.length - 1, Math.ceil(rows.length * p) - 1)];
		return {
			count: rows.length,
			median: at(0.5),
			p95: at(0.95),
			worst: at(1),
			rows,
		};
	} finally {
		await client.close();
	}
}
