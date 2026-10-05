import { mdxToMarkdown, selectSections } from "../utils/mdx-to-markdown";

describe("readable MCP content", () => {
	it("selects requested sections while retaining code headings literally", () => {
		const markdown =
			"## Overview\nBrief\n## Examples\n````md\n## Not a section\n```\n````\nExample\n## Accessibility\nKeyboard\n## Resources\nLinks";
		expect(selectSections(markdown, ["examples", "Accessibility"]).body).toBe(
			"## Examples\n````md\n## Not a section\n```\n````\nExample\n\n## Accessibility\nKeyboard",
		);
		expect(selectSections(markdown, ["missing"]).body).toBe("");
	});
	it("preserves shorter fences and marker lines with content inside longer blocks", () => {
		const block =
			"````tsx\n``` <Button />\n~~~\n<Button value={state} />\n````";
		expect(mdxToMarkdown(`${block}\n\n<Widget />`)).toBe(block);
	});
	it("removes complete component tags whose props contain inline code", () => {
		const output = mdxToMarkdown(
			'<BuildEffort description="Use `aria-live` for updates" />\n\n<FaqStructuredData items={[{ question: "How?", answer: "Use `button`" }]} />\n\nUse `aria-live` in your implementation.',
		);
		expect(output).toBe("Use `aria-live` in your implementation.");
	});
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
