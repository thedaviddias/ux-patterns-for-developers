import assert from "node:assert/strict";
import test from "node:test";
import {
	extractMermaidBlocks,
	validateMermaidBlocksInSource,
} from "./validate-mermaid-lib.mjs";

test("extractMermaidBlocks returns chart content and file line offsets", () => {
	const source = `# Heading

Intro text

\`\`\`mermaid
flowchart TB
A-->B
\`\`\`
`;

	const blocks = extractMermaidBlocks(source);

	assert.equal(blocks.length, 1);
	assert.equal(blocks[0].chart, "flowchart TB\nA-->B\n");
	assert.equal(blocks[0].startLine, 6);
});

test("validateMermaidBlocksInSource reports the file line for parser failures", async () => {
	const source = `# Heading

\`\`\`mermaid
flowchart TB
A-->B
end
\`\`\`
`;

	const failures = await validateMermaidBlocksInSource(
		source,
		"/tmp/example.mdx",
	);

	assert.equal(failures.length, 1);
	assert.equal(failures[0].line, 6);
	assert.match(failures[0].message, /Parse error on line 3/i);
});
