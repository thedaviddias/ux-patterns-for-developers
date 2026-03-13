import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Code, Pre } from "./code-block";

describe("MDX code blocks", () => {
	const writeText = vi.fn().mockResolvedValue(undefined);

	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: {
				writeText,
			},
		});
	});

	it("copies highlighted block code while collapsed and expanded", async () => {
		const longCode = Array.from(
			{ length: 20 },
			(_, index) => `Line ${index + 1}`,
		).join("\n");

		render(
			<Pre className="shiki" data-language="tsx">
				<code>
					{longCode.split("\n").map((line, index) => (
						<span key={line}>
							{line}
							{index < 19 ? "\n" : null}
						</span>
					))}
				</code>
			</Pre>,
		);

		const expandButton = await screen.findByRole("button", {
			name: "Show more code",
		});
		const copyButton = screen.getByRole("button", { name: "Copy code" });

		fireEvent.click(copyButton);
		await waitFor(() => {
			expect(writeText).toHaveBeenCalledWith(longCode);
		});

		fireEvent.click(expandButton);
		fireEvent.click(screen.getByRole("button", { name: /Copy code|Copied!/ }));
		await waitFor(() => {
			expect(writeText).toHaveBeenLastCalledWith(longCode);
		});
	});

	it("keeps inline code untouched", () => {
		render(<Code>const answer = 42;</Code>);

		expect(
			screen.queryByRole("button", { name: "Show more code" }),
		).not.toBeInTheDocument();
		expect(screen.getByText("const answer = 42;").tagName).toBe("CODE");
	});
});
