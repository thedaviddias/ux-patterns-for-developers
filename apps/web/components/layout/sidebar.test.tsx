import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PageTreeNode } from "@/lib/content";
import { Sidebar } from "./sidebar";
import { SidebarProvider, useSidebar } from "./sidebar-context";

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

function MobileSidebarHarness() {
	const { setOpen } = useSidebar();

	return (
		<>
			<button type="button" onClick={() => setOpen(true)}>
				Open mobile sidebar
			</button>
			<button type="button" onClick={() => setOpen(false)}>
				Close mobile sidebar
			</button>
			<Sidebar tree={tree} variant="mobile" />
		</>
	);
}

function renderMobileSidebar() {
	return render(
		<SidebarProvider defaultOpenLevel={2}>
			<MobileSidebarHarness />
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

	it("keeps the mobile drawer hidden at md and toggles the off-canvas transform", () => {
		const { container } = renderMobileSidebar();
		const drawer = container.querySelector("aside");

		expect(drawer).not.toBeNull();
		expect(drawer).toHaveClass("md:hidden");
		expect(drawer).toHaveClass("-translate-x-[calc(100%+1rem)]");
		expect(container.querySelector("div[aria-hidden='true']")).toBeNull();

		fireEvent.click(
			screen.getByRole("button", { name: "Open mobile sidebar" }),
		);

		expect(drawer).toHaveClass("translate-x-0");
		expect(drawer).toHaveClass("md:hidden");
		expect(container.querySelector("div[aria-hidden='true']")).toHaveClass(
			"md:hidden",
		);

		fireEvent.click(
			screen.getByRole("button", { name: "Close mobile sidebar" }),
		);

		expect(drawer).toHaveClass("-translate-x-[calc(100%+1rem)]");
	});
});
