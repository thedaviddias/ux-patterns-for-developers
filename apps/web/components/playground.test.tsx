import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PLAYGROUND_AUTO_RESIZE_SOURCE } from "@/examples/patterns/example";

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

function getIframeFrameId(title: string) {
	const iframe = screen.getByTitle(title) as HTMLIFrameElement;
	const frameIdMatch = iframe.srcdoc.match(/const frameId = "([^"]+)";/);

	expect(frameIdMatch).not.toBeNull();

	return {
		frameId: frameIdMatch?.[1] ?? "",
		iframe,
	};
}

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

	it("uses the provided fixed height when passed", () => {
		render(
			<Playground
				patternType="navigation"
				pattern="pagination"
				example="basic"
				height="400px"
			/>,
		);

		expect(
			(
				screen.getByTitle(
					"navigation pagination basic preview",
				) as HTMLIFrameElement
			).style.height,
		).toBe("400px");
	});

	it("renders HTML, CSS, and JS tabs for the native modal example", () => {
		render(
			<Playground
				patternType="content-management"
				pattern="modal"
				example="native"
				presentation="inline"
			/>,
		);

		expect(screen.getByRole("tab", { name: "HTML" })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "CSS" })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "JS" })).toBeInTheDocument();
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
		expect(
			(
				screen.getByTitle(
					"navigation breadcrumb basic preview",
				) as HTMLIFrameElement
			).style.height,
		).toBe("220px");
		expect(
			(
				screen.getByTitle(
					"navigation breadcrumb basic preview",
				) as HTMLIFrameElement
			).srcdoc,
		).toContain(PLAYGROUND_AUTO_RESIZE_SOURCE);
		expect(
			(
				screen.getByTitle(
					"navigation breadcrumb basic preview",
				) as HTMLIFrameElement
			).srcdoc,
		).toContain("ux-patterns preview foundation");
		expect(screen.queryByRole("tab", { name: "HTML" })).not.toBeInTheDocument();
	});

	it("updates the iframe height when the matching frame reports a new size", () => {
		render(
			<Playground
				patternType="navigation"
				pattern="breadcrumb"
				example="basic"
			/>,
		);

		const { frameId, iframe } = getIframeFrameId(
			"navigation breadcrumb basic preview",
		);

		act(() => {
			window.dispatchEvent(
				new MessageEvent("message", {
					data: {
						source: PLAYGROUND_AUTO_RESIZE_SOURCE,
						frameId,
						height: 287.2,
					},
				}),
			);
		});

		expect(iframe.style.height).toBe("288px");
	});

	it("clamps very small reported heights to the minimum preview height", () => {
		render(
			<Playground
				patternType="navigation"
				pattern="breadcrumb"
				example="basic"
			/>,
		);

		const { frameId, iframe } = getIframeFrameId(
			"navigation breadcrumb basic preview",
		);

		act(() => {
			window.dispatchEvent(
				new MessageEvent("message", {
					data: {
						source: PLAYGROUND_AUTO_RESIZE_SOURCE,
						frameId,
						height: 32,
					},
				}),
			);
		});

		expect(iframe.style.height).toBe("140px");
	});

	it("ignores unrelated resize messages", () => {
		render(
			<Playground
				patternType="navigation"
				pattern="breadcrumb"
				example="basic"
			/>,
		);

		const { iframe } = getIframeFrameId("navigation breadcrumb basic preview");

		act(() => {
			window.dispatchEvent(
				new MessageEvent("message", {
					data: {
						source: PLAYGROUND_AUTO_RESIZE_SOURCE,
						frameId: "another-frame",
						height: 320,
					},
				}),
			);
		});

		expect(iframe.style.height).toBe("220px");
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
