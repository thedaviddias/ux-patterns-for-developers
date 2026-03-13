import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PageTreeNode } from "@/lib/content";
import { Sidebar } from "./sidebar";
import { SidebarProvider } from "./sidebar-context";

let mockPathname = "/patterns/navigation/sidebar";

vi.mock("next/navigation", () => ({
	usePathname: () => mockPathname,
}));

vi.mock("next/link", () => ({
	default: forwardRef<
		HTMLAnchorElement,
		ComponentPropsWithoutRef<"a"> & { href: string }
	>(({ href, children, ...props }, ref) => (
		<a ref={ref} href={href} {...props}>
			{children}
		</a>
	)),
}));

const tree: PageTreeNode[] = [
	{
		type: "page",
		name: "Sidebar",
		url: "/patterns/navigation/sidebar",
	},
	{
		type: "page",
		name: "Pagination",
		url: "/patterns/navigation/pagination",
	},
	{
		type: "page",
		name: "Tabs",
		url: "/patterns/navigation/tabs",
	},
];

function renderSidebar() {
	return render(
		<SidebarProvider defaultOpenLevel={2}>
			<Sidebar tree={tree} variant="desktop" />
		</SidebarProvider>,
	);
}

describe("Sidebar", () => {
	beforeEach(() => {
		localStorage.clear();
		mockPathname = "/patterns/navigation/sidebar";
	});

	it("restores the saved sidebar scroll position after hydration", async () => {
		localStorage.setItem("sidebar-scroll-position", JSON.stringify(240));

		renderSidebar();

		await waitFor(() => {
			expect(
				screen.getByRole("navigation", {
					name: "Documentation navigation",
				}).scrollTop,
			).toBe(240);
		});
	});

	it("preserves the sidebar scroll position across pathname changes", async () => {
		const view = renderSidebar();
		const nav = screen.getByRole("navigation", {
			name: "Documentation navigation",
		});

		nav.scrollTop = 180;
		fireEvent.scroll(nav);

		nav.scrollTop = 0;
		mockPathname = "/patterns/navigation/pagination";

		view.rerender(
			<SidebarProvider defaultOpenLevel={2}>
				<Sidebar tree={tree} variant="desktop" />
			</SidebarProvider>,
		);

		await waitFor(() => {
			expect(screen.getByRole("link", { name: "Pagination" })).toHaveAttribute(
				"aria-current",
				"page",
			);
			expect(
				screen.getByRole("navigation", {
					name: "Documentation navigation",
				}).scrollTop,
			).toBe(180);
		});
	});
});
