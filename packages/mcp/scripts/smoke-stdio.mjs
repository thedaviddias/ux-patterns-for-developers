import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

for (const mode of ["legacy", "auto"]) {
	const client = new Client(
		{ name: "stdio-smoke", version: "1.0.0" },
		{ versionNegotiation: { mode } },
	);
	const transport = new StdioClientTransport({
		command: process.execPath,
		args: [fileURLToPath(new URL("../dist/cli.js", import.meta.url))],
		cwd: fileURLToPath(new URL("../../../", import.meta.url)),
		stderr: "pipe",
	});
	try {
		await client.connect(transport);
		const list = await client.listTools();
		if (list.tools.length !== 11)
			throw new Error(`Expected 11 tools, got ${list.tools.length}`);
		const result = await client.callTool({
			name: "search_patterns",
			arguments: { query: "button", limit: 3 },
		});
		if (result.isError) throw new Error(JSON.stringify(result));
		console.log(`${mode}: ${client.getProtocolEra()}, 11 tools, search passed`);
	} finally {
		await client.close();
	}
}
