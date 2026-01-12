// @ts-nocheck - Disabled for Fumadocs v16 migration, using built-in layouts instead
"use client";
import type {
	NavigationMenuContentProps,
	NavigationMenuTriggerProps,
} from "@radix-ui/react-navigation-menu";
import { buttonVariants } from "@ux-patterns/ui/components/shadcn/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from "@ux-patterns/ui/components/shadcn/navigation-menu";
import { cn } from "@ux-patterns/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link, { type LinkProps } from "fumadocs-core/link";
import type { Option } from "fumadocs-ui/components/layout/root-toggle";
import { useNav } from "fumadocs-ui/contexts/layout";
import { useSidebar } from "fumadocs-ui/contexts/sidebar";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import { isTabActive } from "fumadocs-ui/utils/is-active";
import { SidebarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ComponentProps, useId, useMemo, useState } from "react";

export const navItemVariants = cva(
	"inline-flex items-center gap-1 p-2 text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary [&_svg]:size-4",
);

export function Navbar(props: ComponentProps<"div"> & { wide?: boolean }) {
	const [value, setValue] = useState("");
	const id = useId();
	const { wide, ...rest } = props;

	return (
		<NavigationMenu value={value} onValueChange={setValue} asChild>
			<header
				id={id}
				{...rest}
				className={cn(
					"fixed top-(--fd-banner-height) z-40 left-0 right-(--removed-body-scroll-bar-size,0) backdrop-blur-lg border-b transition-colors *:mx-auto",
					value.length > 0 && "max-lg:shadow-lg max-lg:rounded-b-2xl",
					!wide && "*:max-w-fd-container",
					props.className,
				)}
			>
				<NavigationMenuList
					className="flex border-b gap-2 flex-1 h-16 px-4 md:px-6 ps-7"
					asChild
				>
					<nav>{props.children}</nav>
				</NavigationMenuList>

				<NavigationMenuViewport />
			</header>
		</NavigationMenu>
	);
}

export const NavbarMenu = NavigationMenuItem;

export function NavbarMenuContent(props: NavigationMenuContentProps) {
	return (
		<NavigationMenuContent
			{...props}
			className={cn(
				"grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3",
				props.className,
			)}
		>
			{props.children}
		</NavigationMenuContent>
	);
}

export function NavbarMenuTrigger(props: NavigationMenuTriggerProps) {
	return (
		<NavigationMenuTrigger
			{...props}
			className={cn(navItemVariants(), "rounded-md", props.className)}
		>
			{props.children}
		</NavigationMenuTrigger>
	);
}

export function NavbarMenuLink(props: LinkProps) {
	return (
		<NavigationMenuLink asChild>
			<Link
				{...props}
				className={cn(
					"flex flex-col gap-2 rounded-lg border bg-fd-card p-3 transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground",
					props.className,
				)}
			>
				{props.children}
			</Link>
		</NavigationMenuLink>
	);
}

const linkVariants = cva("", {
	variants: {
		variant: {
			main: navItemVariants(),
			button: buttonVariants({
				variant: "secondary",
				className: "gap-1.5 [&_svg]:size-4",
			}),
			icon: buttonVariants({
				variant: "ghost",
				size: "icon",
			}),
		},
	},
	defaultVariants: {
		variant: "main",
	},
});

export function NavbarLink({
	item,
	variant,
	className,
	children,
	...props
}: {
	item: LinkItemType;
	className?: string;
	children?: React.ReactNode;
} & VariantProps<typeof linkVariants> & Omit<ComponentProps<typeof Link>, 'href'>) {
	const pathname = usePathname();
	const active = item.url ? isTabActive({ url: item.url }, pathname) : false;

	return (
		<NavigationMenuItem>
			<NavigationMenuLink asChild>
				<Link
					href={item.url}
					external={item.external}
					data-active={active}
					className={cn(linkVariants({ variant }), className)}
					{...props}
				>
					{children}
				</Link>
			</NavigationMenuLink>
		</NavigationMenuItem>
	);
}

export function NavbarSecondary({
	mode,
	...props
}: ComponentProps<"header"> & { mode: "top" | "auto" }) {
	const { open, collapsed } = useSidebar();
	const { isTransparent } = useNav();
	const id = useId();

	return (
		<header
			id={id}
			{...props}
			className={cn(
				"fixed flex flex-col top-(--fd-banner-height) left-0 right-(--removed-body-scroll-bar-size,0) z-10 px-(--fd-layout-offset) h-(--fd-nav-height) backdrop-blur-sm transition-colors",
				(!isTransparent || open) && "bg-fd-background/80",
				mode === "auto" &&
					!collapsed &&
					"ps-[calc(var(--fd-layout-offset)+var(--fd-sidebar-width))]",
				props.className,
			)}
		>
			{props.children}
		</header>
	);
}

export function LayoutBody(props: ComponentProps<"main">) {
	const { collapsed } = useSidebar();
	const id = useId();

	return (
		<main
			id={id}
			{...props}
			className={cn(
				"flex flex-1 flex-col transition-[padding] pt-(--fd-nav-height) fd-notebook-layout",
				!collapsed && "mx-(--fd-layout-offset)",
				props.className,
			)}
			style={{
				...props.style,
				paddingInlineStart: collapsed
					? "min(calc(100vw - var(--fd-page-width)), var(--fd-sidebar-width))"
					: "var(--fd-sidebar-width)",
			}}
		>
			{props.children}
		</main>
	);
}

export function NavbarSidebarTrigger({
	className,
	...props
}: ComponentProps<"button">) {
	const { setOpen } = useSidebar();

	return (
		<button
			{...props}
			className={cn(
				buttonVariants({
					variant: "ghost",
					size: "icon",
					className,
				}),
			)}
			onClick={() => setOpen((prev) => !prev)}
		>
			<SidebarIcon />
		</button>
	);
}

export function LayoutTabs({
	options,
	...props
}: ComponentProps<"div"> & {
	options: Option[];
}) {
	const pathname = usePathname();
	const selected = useMemo(() => {
		const matches = options.filter((option) => isTabActive(option, pathname));
		return matches[matches.length - 1];
	}, [options, pathname]);

	return (
		<div
			{...props}
			className={cn(
				"flex flex-row items-end gap-6 overflow-auto",
				props.className,
			)}
		>
			{options.map((option) => (
				<LayoutTab
					key={option.url}
					selected={selected === option}
					option={option}
				/>
			))}
		</div>
	);
}

function LayoutTab({
	option: { title, url, unlisted, props },
	selected = false,
}: {
	option: Option;
	selected?: boolean;
}) {
	return (
		<Link
			href={url}
			{...props}
			className={cn(
				"inline-flex border-b-2 border-transparent transition-colors items-center pb-1.5 font-medium gap-2 text-fd-muted-foreground text-sm text-nowrap hover:text-fd-accent-foreground",
				unlisted && !selected && "hidden",
				selected && "border-fd-primary text-fd-primary",
				props?.className,
			)}
		>
			{title}
		</Link>
	);
}
