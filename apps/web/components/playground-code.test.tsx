import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlaygroundCode } from "./playground-code";

vi.mock("fumadocs-ui/components/dynamic-codeblock", () => ({
	DynamicCodeBlock: ({ code, lang }: { code: string; lang: string }) => (
		<pre data-lang={lang}>
			<code>{code}</code>
		</pre>
	),
}));

describe("PlaygroundCode", () => {
	it("keeps the top-level view code disclosure and nests long-code toggles inside it", async () => {
		const longCode = Array.from(
			{ length: 20 },
			(_, index) => `Line ${index + 1}`,
		).join("\n");

		render(
			<PlaygroundCode
				presentation="collapsed"
				tabs={[
					{
						code: longCode,
						lang: "html",
						value: "html",
					},
				]}
			/>,
		);

		expect(
			screen.getByRole("button", { name: "View code" }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Show more code" }),
		).not.toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "View code" }));

		expect(
			await screen.findByRole("button", { name: "Show more code" }),
		).toBeInTheDocument();
	});
});
