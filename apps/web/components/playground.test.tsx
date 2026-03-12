import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("fumadocs-ui/components/dynamic-codeblock", () => ({
	DynamicCodeBlock: ({ code, lang }: { code: string; lang: string }) => (
		<pre data-lang={lang}>
			<code>{code}</code>
		</pre>
	),
}));

vi.mock("@/components/playground-sandbox", () => ({
	PlaygroundSandbox: ({
		height,
	}: {
		example: { html: string };
		height?: string;
	}) => <div data-testid="playground-sandbox" data-height={height} />,
}));

import { Playground } from "@/components/playground";

describe("Playground", () => {
	it("shows the live preview and inline code for canonical examples", () => {
		render(
			<Playground
				patternType="navigation"
				pattern="pagination"
				example="basic"
				height="400px"
			/>,
		);

		expect(
			screen.getByTitle("navigation pagination basic preview"),
		).toBeVisible();
		expect(screen.getByRole("tab", { name: "HTML" })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "CSS" })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "JS" })).toBeInTheDocument();
	});

	it("renders only the tabs that exist for an html-only example", () => {
		render(
			<Playground
				patternType="content-management"
				pattern="modal"
				example="native"
				presentation="inline"
			/>,
		);

		expect(screen.getByRole("tab", { name: "HTML" })).toBeInTheDocument();
		expect(screen.queryByRole("tab", { name: "CSS" })).not.toBeInTheDocument();
		expect(screen.queryByRole("tab", { name: "JS" })).not.toBeInTheDocument();
	});

	it("collapses code when requested", () => {
		render(
			<Playground
				patternType="navigation"
				pattern="pagination"
				example="basic"
				presentation="collapsed"
			/>,
		);

		expect(
			screen.getByRole("button", {
				name: "View code",
			}),
		).toBeInTheDocument();
		expect(screen.queryByRole("tab", { name: "HTML" })).not.toBeInTheDocument();
	});

	it("hides code when the example presentation is hidden-code", () => {
		render(
			<Playground
				patternType="navigation"
				pattern="breadcrumb"
				example="basic"
			/>,
		);

		expect(
			screen.getByTitle("navigation breadcrumb basic preview"),
		).toBeVisible();
		expect(screen.queryByRole("tab", { name: "HTML" })).not.toBeInTheDocument();
	});

	it("delegates to the sandbox renderer when requested", () => {
		render(
			<Playground
				patternType="navigation"
				pattern="pagination"
				example="basic"
				mode="sandbox"
				height="420px"
			/>,
		);

		expect(screen.getByTestId("playground-sandbox")).toHaveAttribute(
			"data-height",
			"420px",
		);
	});
});
