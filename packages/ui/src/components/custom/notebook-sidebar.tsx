// @ts-nocheck - Disabled for Fumadocs v16 migration, using built-in layouts instead
import Link from "fumadocs-core/link";
import {
	Sidebar,
	SidebarCollapseTrigger,
	type SidebarComponents,
	SidebarContent,
	SidebarContentMobile,
	SidebarFolder,
	SidebarFolderContent,
	SidebarFolderLink,
	SidebarFolderTrigger,
	SidebarFooter,
	SidebarHeader,
	SidebarItem,
	SidebarPageTree,
	type SidebarProps,
	SidebarTrigger,
	SidebarViewport,
} from "fumadocs-ui/components/sidebar";
import { LanguageToggle } from "fumadocs-ui/layouts/shared/language-toggle";
import { ThemeToggle } from "fumadocs-ui/layouts/shared/theme-toggle";
import { SidebarTabsDropdown, type SidebarTab as Option } from "fumadocs-ui/components/sidebar/tabs/dropdown";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import { cn } from "../../lib/cn";
import { Languages, Sidebar as SidebarIcon, X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export interface NotebookSidebarProps
	extends ComponentProps<"aside">,
		Pick<SidebarProps, "defaultOpenLevel" | "prefetch"> {
	components?: Partial<SidebarComponents>;

	banner?: ReactNode;
	footer?: ReactNode;

	collapsible?: boolean;

	navMode?: "top" | "auto";
	navTitle?: ReactNode;
	navUrl?: string;
	navChildren?: ReactNode;

	tabMode?: "sidebar" | "navbar" | "none";
	tabs?: Option[];

	links?: LinkItemType[];
	iconLinks?: LinkItemType[];

	i18n?: boolean | any;
	themeSwitch?: {
		enabled?: boolean;
		component?: ReactNode;
		mode?: "light-dark-system" | "light-dark";
	};
}

export function NotebookSidebar(props: NotebookSidebarProps) {
	const {
		banner,
		footer,
		components,
		collapsible = true,
		prefetch,
		defaultOpenLevel,
		navMode = "auto",
		navTitle,
		navUrl = "/",
		navChildren,
		tabMode = "sidebar",
		tabs = [],
		links = [],
		iconLinks = [],
		i18n = false,
		themeSwitch = { enabled: true },
		...rest
	} = props;

	const rootToggle = (
		<>
			{tabMode !== "none" && (
				<>
					{tabMode === "sidebar" && tabs.length > 0 && (
						<SidebarTabsDropdown className="mb-2" options={tabs} />
					)}
					{tabMode === "navbar" && tabs.length > 0 && (
						<SidebarTabsDropdown options={tabs} className="lg:hidden" />
					)}
				</>
			)}
		</>
	);

	const sidebarNav = (
		<div className="flex justify-between">
			<Link
				href={navUrl}
				className="inline-flex items-center gap-2.5 font-medium"
			>
				{navTitle}
			</Link>
			{collapsible && (
				<SidebarCollapseTrigger
					className={cn(
						buttonVariants({
							color: "ghost",
							size: "icon-sm",
							className: "mt-px mb-auto text-fd-muted-foreground",
						}),
					)}
				>
					<SidebarIcon />
				</SidebarCollapseTrigger>
			)}
		</div>
	);

	const viewport = (
		<SidebarViewport>
			{links
				.filter((item) => item.type !== "icon")
				.map((item, i, arr) => (
					<SidebarLinkItem
						key={i}
						item={item}
						className={cn("lg:hidden", i === arr.length - 1 && "mb-4")}
					/>
				))}

			<SidebarPageTree components={components} />
		</SidebarViewport>
	);

	const content = (
		<SidebarContent
			{...rest}
			className={cn(
				navMode === "top"
					? "border-e-0 bg-transparent"
					: "[--fd-nav-height:0px]",
				rest.className,
			)}
		>
			<HideIfEmpty as={SidebarHeader}>
				{navMode === "auto" && sidebarNav}
				{navChildren}
				{banner}
				{rootToggle}
			</HideIfEmpty>
			{viewport}
			<HideIfEmpty
				as={SidebarFooter}
				className="flex flex-row text-fd-muted-foreground items-center"
			>
				{iconLinks.map((item, i) => {
					if (item.type !== "icon") return null;
					return (
						<Link
							key={i}
							href={item.url}
							external={item.external}
							className={cn(
								buttonVariants({
									size: "icon-sm",
									color: "ghost",
									className: "lg:hidden",
								}),
							)}
							aria-label={item.label}
						>
							{item.icon}
						</Link>
					);
				})}
				{footer}
			</HideIfEmpty>
		</SidebarContent>
	);

	const mobile = (
		<SidebarContentMobile {...rest}>
			<SidebarHeader>
				<SidebarTrigger
					className={cn(
						buttonVariants({
							size: "icon-sm",
							color: "ghost",
							className: "ms-auto text-fd-muted-foreground",
						}),
					)}
				>
					<X />
				</SidebarTrigger>
				{banner}
				{rootToggle}
			</SidebarHeader>
			{viewport}
			<HideIfEmpty
				as={SidebarFooter}
				className="flex flex-row items-center justify-end"
			>
				{iconLinks.map((item, i) => {
					if (item.type !== "icon") return null;
					return (
						<Link
							key={i}
							href={item.url}
							external={item.external}
							className={cn(
								buttonVariants({
									size: "icon-sm",
									color: "ghost",
								}),
								"text-fd-muted-foreground lg:hidden",
								i === iconLinks.length - 1 && "me-auto",
							)}
							aria-label={item.label}
						>
							{item.icon}
						</Link>
					);
				})}
				{i18n ? (
					<LanguageToggle>
						<Languages className="size-4.5 text-fd-muted-foreground" />
					</LanguageToggle>
				) : null}
				{themeSwitch.enabled !== false &&
					(themeSwitch.component ?? (
						<ThemeToggle mode={themeSwitch.mode ?? "light-dark-system"} />
					))}
				{footer}
			</HideIfEmpty>
		</SidebarContentMobile>
	);

	return (
		<Sidebar
			defaultOpenLevel={defaultOpenLevel}
			prefetch={prefetch}
			Content={content}
			Mobile={mobile}
		/>
	);
}

function SidebarLinkItem({
	item,
	...props
}: {
	item: Exclude<LinkItemType, { type: "icon" }>;
	className?: string;
}) {
	if (item.type === "menu")
		return (
			<SidebarFolder {...props}>
				{item.url ? (
					<SidebarFolderLink href={item.url} external={item.external}>
						{item.icon}
						{item.text}
					</SidebarFolderLink>
				) : (
					<SidebarFolderTrigger>
						{item.icon}
						{item.text}
					</SidebarFolderTrigger>
				)}
				<SidebarFolderContent>
					{item.items.map((child, i) => (
						<SidebarLinkItem key={i} item={child} />
					))}
				</SidebarFolderContent>
			</SidebarFolder>
		);

	if (item.type === "custom") return <div {...props}>{item.children}</div>;

	return (
		<SidebarItem
			href={item.url}
			icon={item.icon}
			external={item.external}
			{...props}
		>
			{item.text}
		</SidebarItem>
	);
}
