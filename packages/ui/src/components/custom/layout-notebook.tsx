// @ts-nocheck - Disabled for Fumadocs v16 migration, using built-in layouts instead
"use client";
import {
	LayoutBody,
	LayoutTabs,
	Navbar,
	NavbarSecondary,
	NavbarSidebarTrigger,
} from "@ux-patterns/ui/components/custom/navbar";
import { NotebookSidebar } from "@ux-patterns/ui/components/custom/notebook-sidebar";
import type { PageTree } from "fumadocs-core/page-tree";
import {
	SidebarCollapseTrigger,
	type SidebarComponents,
	type SidebarProps,
} from "fumadocs-ui/components/sidebar";
import { LanguageToggle } from "fumadocs-ui/layouts/shared/language-toggle";
import { ThemeToggle } from "fumadocs-ui/layouts/shared/theme-toggle";
import {
	SearchToggle,
	LargeSearchToggle,
} from "fumadocs-ui/layouts/shared/search-toggle";
import type { SidebarTab as Option } from "fumadocs-ui/utils/get-sidebar-tabs";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "fumadocs-ui/components/ui/popover";
import { NavProvider } from "fumadocs-ui/contexts/layout";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
import {
	type BaseLayoutProps,
	type BaseLinkType,
	resolveLinkItems,
	type LinkItemType,
} from "fumadocs-ui/layouts/shared";
import { cn } from "../../lib/cn";
import {
	type GetSidebarTabsOptions,
	getSidebarTabs,
} from "fumadocs-ui/utils/get-sidebar-tabs";
import { isTabActive } from "fumadocs-ui/utils/is-active";
import { ChevronDown, Languages, Sidebar as SidebarIcon } from "lucide-react";
import Link from "fumadocs-core/link";
import { usePathname } from "next/navigation";
import {
	type ComponentProps,
	Fragment,
	type HTMLAttributes,
	type ReactNode,
	useMemo,
} from "react";

export interface DocsLayoutProps extends BaseLayoutProps {
	tree: PageTree.Root;
	tabMode?: "sidebar" | "navbar" | "none";

	nav?: BaseLayoutProps["nav"] & {
		mode?: "top" | "auto";
	};

	sidebar?: SidebarOptions;

	containerProps?: HTMLAttributes<HTMLDivElement>;

	githubStars?: React.ReactNode;
}

interface SidebarOptions
	extends ComponentProps<"aside">,
		Pick<SidebarProps, "defaultOpenLevel" | "prefetch"> {
	components?: Partial<SidebarComponents>;

	/**
	 * Root Toggle options
	 */
	tabs?: Option[] | GetSidebarTabsOptions | false;

	banner?: ReactNode;
	footer?: ReactNode;

	/**
	 * Support collapsing the sidebar on desktop mode
	 *
	 * @defaultValue true
	 */
	collapsible?: boolean;
}

export function DocsLayout(props: DocsLayoutProps) {
	const {
		tabMode = "sidebar",
		nav: { transparentMode, ...nav } = {},
		sidebar: { tabs: tabOptions, ...sidebarProps } = {},
		i18n = false,
		themeSwitch = { enabled: true },
	} = props;

	const navMode = nav.mode ?? "auto";
	const links = resolveLinkItems(props.links ?? [], props.githubUrl);
	const tabs = useMemo(() => {
		if (Array.isArray(tabOptions)) {
			return tabOptions;
		}

		if (typeof tabOptions === "object") {
			return getSidebarTabs(props.tree, tabOptions);
		}

		if (tabOptions !== false) {
			return getSidebarTabs(props.tree);
		}

		return [];
	}, [tabOptions, props.tree]);

	function sidebar() {
		const {
			banner,
			footer,
			components,
			collapsible = true,
			prefetch,
			defaultOpenLevel,
			...rest
		} = sidebarProps;
		const iconLinks = links.filter((item) => item.type === "icon");

		return (
			<NotebookSidebar
				{...rest}
				banner={banner}
				footer={footer}
				components={components}
				collapsible={collapsible}
				prefetch={prefetch}
				defaultOpenLevel={defaultOpenLevel}
				navMode={navMode}
				navTitle={nav.title}
				navUrl={nav.url}
				navChildren={nav.children}
				tabMode={tabMode}
				tabs={tabs}
				links={links}
				iconLinks={iconLinks}
				i18n={i18n}
				themeSwitch={themeSwitch}
			/>
		);
	}

	return (
		<TreeContextProvider tree={props.tree}>
			<NavProvider transparentMode={transparentMode}>
				<LayoutBody
					{...props.containerProps}
					className={cn(
						"md:[--fd-sidebar-width:286px] xl:[--fd-toc-width:286px]",
						props.containerProps?.className,
					)}
				>
					{sidebar()}
					<DocsNavbar
						{...props}
						links={links}
						tabs={tabMode === "navbar" ? tabs : []}
					/>
					{props.children}
				</LayoutBody>
			</NavProvider>
		</TreeContextProvider>
	);
}

function DocsNavbar({
	links,
	tabs,
	searchToggle = {},
	themeSwitch = {},
	nav = {},
	...props
}: DocsLayoutProps & {
	links: LinkItemType[];
	tabs: Option[];
}) {
	const navMode = nav.mode ?? "auto";
	const sidebarCollapsible = props.sidebar?.collapsible ?? true;

	return (
		<NavbarSecondary
			mode={navMode}
			className={cn(
				"on-root:[--fd-nav-height:56px] md:on-root:[--fd-nav-height:64px]",
				tabs.length > 0 && "lg:on-root:[--fd-nav-height:104px]",
			)}
		>
			<div
				className={cn(
					"flex border-b px-4 gap-2 flex-1 md:px-6",
					navMode === "top" && "ps-7",
				)}
			>
				<div
					className={cn(
						"items-center",
						navMode === "top" && "flex flex-row gap-2",
						navMode === "auto" && [
							"hidden max-md:flex",
							sidebarCollapsible && "has-data-[collapsed=true]:md:flex",
						],
					)}
				>
					{sidebarCollapsible && navMode === "auto" && (
						<SidebarCollapseTrigger
							className={cn(
								buttonVariants({
									color: "ghost",
									size: "icon-sm",
								}),
								"text-fd-muted-foreground data-[collapsed=false]:hidden max-md:hidden",
							)}
						>
							<SidebarIcon />
						</SidebarCollapseTrigger>
					)}
					<div className="inline-flex items-center gap-2.5">{nav.title}</div>
					{nav.children}
					<ul className="flex flex-row items-center gap-2 px-6 max-lg:hidden">
						{links
							.filter((item) => item.type !== "icon")
							.map((item, i) => (
								<NavbarLinkItem
									key={i}
									item={item}
									className="inline-flex items-center gap-1 p-2 text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:text-fd-primary [&_svg]:size-4 text-sm"
								/>
							))}
					</ul>
				</div>
				<div className="flex flex-row items-center justify-end gap-1.5 flex-1">
					<div>{props.githubStars}</div>
					{searchToggle.enabled !== false &&
						(searchToggle.components?.lg ? (
							<div
								className={cn(
									"w-full my-auto max-lg:hidden",
									navMode === "top" && "max-w-[150px]",
								)}
							>
								{searchToggle.components.lg}
							</div>
						) : (
							<LargeSearchToggle
								hideIfDisabled
								className={cn(
									"w-full my-auto max-lg:hidden",
									navMode === "top" && "max-w-[150px]",
								)}
							/>
						))}

					{links
						.filter((item) => item.type === "icon")
						.map((item, i) => (
							<Link
								key={i}
								href={item.url}
								external={item.external}
								className={cn(
									buttonVariants({ size: "icon-sm", color: "ghost" }),
									"text-fd-muted-foreground max-lg:hidden",
								)}
								aria-label={item.label}
							>
								{item.icon}
							</Link>
						))}

					<div className="flex items-center md:hidden gap-2.5">
						{searchToggle.enabled !== false &&
							(searchToggle.components?.sm ?? (
								<SearchToggle hideIfDisabled className="p-2" />
							))}
						<NavbarSidebarTrigger className="p-2 -me-1.5" />
					</div>

					<div className="flex items-center gap-2 max-md:hidden">
						{props.i18n ? (
							<LanguageToggle>
								<Languages className="size-4.5 text-fd-muted-foreground" />
							</LanguageToggle>
						) : null}
						{themeSwitch.enabled !== false &&
							(themeSwitch.component ?? (
								<ThemeToggle mode={themeSwitch.mode ?? "light-dark-system"} />
							))}
						{sidebarCollapsible && navMode === "top" && (
							<SidebarCollapseTrigger
								className={cn(
									buttonVariants({
										color: "secondary",
										size: "icon-sm",
									}),
									"text-fd-muted-foreground rounded-full -me-1.5",
								)}
							>
								<SidebarIcon />
							</SidebarCollapseTrigger>
						)}
					</div>
				</div>
			</div>
			{tabs.length > 0 && (
				<LayoutTabs
					className={cn(
						"border-b px-6 h-10 max-lg:hidden",
						navMode === "top" && "ps-7",
					)}
					options={tabs}
				/>
			)}
		</NavbarSecondary>
	);
}

function NavbarLinkItem({
	item,
	...props
}: { item: LinkItemType } & HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();

	if (item.type === "menu") {
		return (
			<Popover>
				<PopoverTrigger
					{...props}
					className={cn(
						"inline-flex items-center gap-1.5 has-data-[active=true]:text-fd-primary",
						props.className,
					)}
				>
					{item.url ? (
						<Link href={item.url} external={item.external}>{item.text}</Link>
					) : (
						item.text
					)}
					<ChevronDown className="size-3" />
				</PopoverTrigger>
				<PopoverContent className="flex flex-col">
					{item.items.map((child, i) => {
						if (child.type === "custom")
							return <Fragment key={i}>{child.children}</Fragment>;

						const active = child.url ? isTabActive({ url: child.url }, pathname) : false;
						return (
							<Link
								key={i}
								href={child.url}
								external={child.external}
								data-active={active}
								className="inline-flex items-center gap-2 rounded-md p-2 text-start hover:bg-fd-accent hover:text-fd-accent-foreground data-[active=true]:text-fd-primary [&_svg]:size-4"
							>
								{child.icon}
								{child.text}
							</Link>
						);
					})}
				</PopoverContent>
			</Popover>
		);
	}

	if (item.type === "custom") return item.children;

	const active = item.url ? isTabActive({ url: item.url }, pathname) : false;
	return (
		<Link href={item.url} external={item.external} data-active={active} {...props}>
			{item.text}
		</Link>
	);
}

export { Navbar, NavbarSidebarTrigger };
