import { act, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CodeSection } from "../code-section";

const flushHeightChecks = async () => {
	await act(async () => {
		vi.runAllTimers();
	});
};

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
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

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

		await flushHeightChecks();

		const preElement = container.querySelector("pre");
		expect(onShouldShowExpandChange).toHaveBeenLastCalledWith(false);
		expect(
			container.querySelector(".bg-gradient-to-t"),
		).not.toBeInTheDocument();
		expect(preElement).toHaveStyle({ maxHeight: "none", overflow: "visible" });
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

		await flushHeightChecks();

		const preElement = container.querySelector("pre");
		expect(onShouldShowExpandChange).toHaveBeenLastCalledWith(true);
		expect(container.querySelector(".bg-gradient-to-t")).toBeInTheDocument();
		expect(preElement).toHaveStyle({ maxHeight: "350px", overflow: "hidden" });
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

		await flushHeightChecks();

		const preElement = container.querySelector("pre");
		expect(
			container.querySelector(".bg-gradient-to-t"),
		).not.toBeInTheDocument();
		expect(preElement).toHaveStyle({ maxHeight: "none", overflow: "visible" });
	});

	it("should report extracted code content", async () => {
		const onCodeContentChange = vi.fn();
		renderCodeSection({
			children: "const answer = 42;",
			onCodeContentChange,
		});

		await flushHeightChecks();

		expect(onCodeContentChange).toHaveBeenLastCalledWith("const answer = 42;");
	});
});
