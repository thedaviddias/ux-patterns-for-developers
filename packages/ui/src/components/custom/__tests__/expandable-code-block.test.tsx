import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ExpandableCodeBlock } from "../expandable-code-block";

function renderExpandableCodeBlock(content: string) {
	return render(
		<ExpandableCodeBlock>
			<pre>
				<code>{content}</code>
			</pre>
		</ExpandableCodeBlock>,
	);
}

describe("ExpandableCodeBlock", () => {
	it("does not render a toggle for short code blocks", async () => {
		renderExpandableCodeBlock("const answer = 42;");

		await waitFor(() => {
			expect(
				screen.queryByRole("button", { name: "Show more code" }),
			).not.toBeInTheDocument();
		});
	});

	it("renders a collapsed toggle for long code blocks", async () => {
		const longCode = Array.from(
			{ length: 20 },
			(_, index) => `Line ${index + 1}`,
		).join("\n");

		renderExpandableCodeBlock(longCode);

		const toggle = await screen.findByRole("button", {
			name: "Show more code",
		});
		const panel = document.getElementById(
			toggle.getAttribute("aria-controls") ?? "",
		);

		expect(toggle).toHaveAttribute("aria-expanded", "false");
		expect(panel).not.toBeNull();
		expect(panel?.style.maxHeight).toBe("350px");
		expect(panel?.style.overflow).toBe("hidden");
	});

	it("supports click and keyboard toggling", async () => {
		const user = userEvent.setup();
		const longCode = Array.from(
			{ length: 20 },
			(_, index) => `Line ${index + 1}`,
		).join("\n");

		renderExpandableCodeBlock(longCode);

		const toggle = await screen.findByRole("button", {
			name: "Show more code",
		});
		const panel = document.getElementById(
			toggle.getAttribute("aria-controls") ?? "",
		);

		await user.click(toggle);
		expect(toggle).toHaveAttribute("aria-expanded", "true");
		expect(toggle).toHaveTextContent("Show less code");
		expect(panel?.style.maxHeight).toBe("");
		expect(panel?.style.overflow).toBe("");

		toggle.focus();
		expect(toggle).toHaveFocus();
		await user.keyboard("{Enter}");
		expect(toggle).toHaveAttribute("aria-expanded", "false");
		expect(toggle).toHaveTextContent("Show more code");
	});
});
