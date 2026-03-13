import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CopyActionButton } from "../copy-action-button";
import { CopyCommandRow } from "../copy-command-row";
import { CopyMarkdownButton } from "../copy-markdown-button";

const writeText = vi.fn().mockResolvedValue(undefined);
const write = vi.fn().mockResolvedValue(undefined);
const fetchMock = vi.fn();

class ClipboardItemMock {
	items: Record<string, Promise<string>>;

	constructor(items: Record<string, Promise<string>>) {
		this.items = items;
	}
}

describe("copy components", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(globalThis, "fetch", {
			configurable: true,
			value: fetchMock,
		});
		Object.defineProperty(globalThis, "ClipboardItem", {
			configurable: true,
			value: ClipboardItemMock,
		});
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: {
				writeText,
				write,
			},
		});
	});

	it("copies text with the shared action button", async () => {
		render(
			<CopyActionButton
				textToCopy="pnpm dlx ux-patterns"
				idleAriaLabel="Copy command"
				copiedAriaLabel="Copied command"
				idleLabel="Copy"
				copiedLabel="Copied"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Copy command" }));

		await waitFor(() => {
			expect(writeText).toHaveBeenCalledWith("pnpm dlx ux-patterns");
		});
		expect(
			screen.getByRole("button", { name: "Copied command" }),
		).toHaveTextContent("Copied");
	});

	it("copies command rows via keyboard activation", async () => {
		const user = userEvent.setup({ writeToClipboard: false });

		render(
			<CopyCommandRow
				command="npx ux-patterns@latest pagination"
				label="Install pagination"
				idleAriaLabel="Copy install command"
				copiedAriaLabel="Copied install command"
			/>,
		);

		const button = screen.getByRole("button", { name: "Copy install command" });
		button.focus();
		await user.keyboard("{Enter}");

		expect(
			screen.getByRole("button", { name: "Copied install command" }),
		).toBeInTheDocument();
	});

	it("caches fetched markdown after the first copy", async () => {
		fetchMock.mockResolvedValue({
			text: vi.fn().mockResolvedValue("# copied markdown"),
		});

		render(<CopyMarkdownButton markdownUrl="/patterns/pagination.mdx" />);

		fireEvent.click(screen.getByRole("button", { name: "Copy Markdown" }));

		await waitFor(() => {
			expect(write).toHaveBeenCalledTimes(1);
		});

		const clipboardItem = write.mock.calls[0]?.[0]?.[0] as ClipboardItemMock;
		expect(clipboardItem).toBeInstanceOf(ClipboardItemMock);
		await clipboardItem.items["text/plain"];

		fireEvent.click(
			screen.getByRole("button", { name: /Copy Markdown|Copied Markdown/ }),
		);

		await waitFor(() => {
			expect(writeText).toHaveBeenCalledWith("# copied markdown");
		});
		expect(write).toHaveBeenCalledTimes(1);
	});
});
