import { render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { CodeSection } from "../code-section";

const renderCodeSection = (
	props?: Partial<ComponentProps<typeof CodeSection>>,
) =>
	render(
		<CodeSection {...props}>
			<pre>
				<code>{props?.children ?? "console.log('test')"}</code>
			</pre>
		</CodeSection>,
	);

describe("CodeSection", () => {
	it("should render children correctly", () => {
		renderCodeSection();

		expect(screen.getByText("console.log('test')")).toBeInTheDocument();
	});

	it("should NOT show expand button for short content", async () => {
		const onShouldShowExpandChange = vi.fn();
		const { container } = renderCodeSection({
			children: "Short code",
			onShouldShowExpandChange,
		});

		await waitFor(() => {
			expect(onShouldShowExpandChange).toHaveBeenLastCalledWith(false);
		});

		expect(
			screen.queryByRole("button", { name: "Show more code" }),
		).not.toBeInTheDocument();
		expect(
			container.querySelector(".bg-gradient-to-t"),
		).not.toBeInTheDocument();
	});

	it("should detect tall content and collapse it by default", async () => {
		const onShouldShowExpandChange = vi.fn();
		const tallContent = Array.from(
			{ length: 20 },
			(_, index) => `Line ${index + 1}`,
		).join("\n");
		const { container } = renderCodeSection({
			children: tallContent,
			onShouldShowExpandChange,
		});

		const toggle = await screen.findByRole("button", {
			name: "Show more code",
		});
		const panel = document.getElementById(
			toggle.getAttribute("aria-controls") ?? "",
		);

		expect(onShouldShowExpandChange).toHaveBeenLastCalledWith(true);
		expect(container.querySelector(".bg-gradient-to-t")).toBeInTheDocument();
		expect(panel?.style.maxHeight).toBe("350px");
		expect(panel?.style.overflow).toBe("hidden");
	});

	it("should hide gradient overlay when expanded", async () => {
		const tallContent = Array.from(
			{ length: 20 },
			(_, index) => `Line ${index + 1}`,
		).join("\n");
		const { container } = renderCodeSection({
			children: tallContent,
			isExpanded: true,
			shouldShowExpand: true,
		});

		const toggle = await screen.findByRole("button", {
			name: "Show less code",
		});
		const panel = document.getElementById(
			toggle.getAttribute("aria-controls") ?? "",
		);

		expect(
			container.querySelector(".bg-gradient-to-t"),
		).not.toBeInTheDocument();
		expect(panel?.style.maxHeight).toBe("");
		expect(panel?.style.overflow).toBe("");
	});

	it("should report extracted code content", async () => {
		const onCodeContentChange = vi.fn();
		renderCodeSection({
			children: "const answer = 42;",
			onCodeContentChange,
		});

		await waitFor(() => {
			expect(onCodeContentChange).toHaveBeenLastCalledWith(
				"const answer = 42;",
			);
		});
	});
});
