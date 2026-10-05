import { mdxToMarkdown } from "../utils/mdx-to-markdown";

describe("readable MCP content", () => {
	it("preserves fenced implementation code and inline examples literally", () => {
		const code =
			'```tsx\nimport { Button } from "ui"\nexport function Example() {\n\n\n  return <Button onClick={() => save()}>Save</Button>\n}\n```';
		const output = mdxToMarkdown(
			`import { Callout } from "ui"\n\n# Guidance\n\n${code}\n\nUse \`{value}\` here.\n\n<Callout>Keep this guidance.</Callout>`,
		);
		expect(output).toContain(code);
		expect(output).toContain("Use `{value}` here.");
		expect(output).toContain("Keep this guidance.");
		expect(output).not.toContain("import { Callout }");
		expect(output).not.toContain("<Callout>");
	});
});
