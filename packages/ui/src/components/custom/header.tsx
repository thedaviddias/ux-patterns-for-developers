// @ts-nocheck - Disabled for Fumadocs v16 migration, using built-in layouts instead
/** biome-ignore-all lint/suspicious/noArrayIndexKey: not an issue */
import {
	Menu,
	MenuContent,
	MenuLinkItem,
	MenuTrigger,
} from "@ux-patterns/ui/components/custom/menu";
import {
	Navbar,
	NavbarLink,
	NavbarMenu,
	NavbarMenuContent,
	NavbarMenuLink,
	NavbarMenuTrigger,
} from "@ux-patterns/ui/components/custom/navbar";
import { buttonVariants } from "@ux-patterns/ui/components/shadcn/button";
import { cn } from "@ux-patterns/ui/lib/utils";
import Link from "fumadocs-core/link";
import {
	type BaseLayoutProps,
	resolveLinkItems,
	type LinkItemType,
	type NavOptions,
} from "fumadocs-ui/layouts/shared";
// TODO: Fix imports for Fumadocs v16 - these paths don't exist in package exports
// import {
// 	LargeSearchToggle,
// 	SearchToggle,
// } from "fumadocs-ui/layouts/shared/search-toggle";
type LargeSearchToggle = any;
type SearchToggle = any;
import { ChevronDown } from "lucide-react";
import { Fragment, type HTMLAttributes, useMemo } from "react";

export interface HomeLayoutProps extends BaseLayoutProps {
	nav?: Partial<
		NavOptions & {
			/**
			 * Open mobile menu when hovering the trigger
			 */
			enableHoverToOpen?: boolean;
		}
	>;
	wide?: boolean;
	githubStars?: React.ReactNode;
}

export async function HomeLayout(
	props: HomeLayoutProps & HTMLAttributes<HTMLElement>,
) {
	const {
		nav = {},
		links,
		githubUrl,
		i18n,
		searchToggle,
		wide,
		githubStars,
		...rest
	} = props;

	return (
		<>
			<Header
				links={links}
				nav={nav}
				searchToggle={searchToggle}
				i18n={i18n}
				githubUrl={githubUrl}
				githubStars={githubStars}
				wide={wide}
				{...rest}
			/>
			<div className={cn("flex flex-1 flex-col pt-14")}>{props.children}</div>
		</>
	);
}

export function Header({
	nav = {},
	links,
	githubUrl,
	searchToggle = {},
	wide,
	githubStars,
}: HomeLayoutProps) {
	const finalLinks = useMemo(
		() => resolveLinkItems({ links, githubUrl }),
		[links, githubUrl],
	);

	const navItems = finalLinks.filter((item) =>
		["nav", "all"].includes(item.on ?? "all"),
	);
	const menuItems = finalLinks.filter((item) =>
		["menu", "all"].includes(item.on ?? "all"),
	);

	return (
		<Navbar className="container-responsive" wide={wide}>
			<div className="inline-flex items-center gap-2.5">{nav.title}</div>

			{nav.children}
			<ul className="flex flex-row items-center gap-2 px-6 max-sm:hidden">
				{navItems
					.filter((item) => !isSecondary(item))
					.map((item, i) => (
						<NavbarLinkItem key={i} item={item} className="text-sm" />
					))}
			</ul>
			<div className="flex flex-row items-center justify-end gap-1.5 flex-1">
				<div>{githubStars}</div>
				{searchToggle.enabled !== false &&
					(searchToggle.components?.lg ?? (
						<LargeSearchToggle
							className="hidden md:flex w-full my-auto max-w-[240px]"
							hideIfDisabled
						/>
					))}
				<div className="flex flex-row items-center empty:hidden max-lg:hidden">
					{navItems.filter(isSecondary).map((item, i) => (
						<NavbarLinkItem key={i} item={item} />
					))}
				</div>
			</div>
			<ul className="flex flex-row items-center ms-auto -me-1.5 lg:hidden">
				{searchToggle.enabled !== false &&
					(searchToggle.components?.sm ?? (
						<SearchToggle className="p-2" hideIfDisabled />
					))}
				<Menu>
					<MenuTrigger
						aria-label="Toggle Menu"
						className={cn(
							buttonVariants({
								size: "icon",
								variant: "ghost",
								className: "group",
							}),
						)}
						enableHover={nav.enableHoverToOpen}
					>
						<ChevronDown className="!size-5.5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
					</MenuTrigger>
					<MenuContent className="sm:flex-row sm:items-center sm:justify-end">
						{menuItems
							.filter((item) => !isSecondary(item))
							.map((item, i) => (
								<MenuLinkItem
									key={`${i}-menu-item`}
									item={item}
									className="sm:hidden"
								/>
							))}
						<div className="-ms-1.5 flex flex-row items-center gap-1.5 max-sm:mt-2">
							{menuItems.filter(isSecondary).map((item, i) => (
								<MenuLinkItem
									key={`${i}-menu-item-secondary`}
									item={item}
									className="-me-1.5"
								/>
							))}
						</div>
					</MenuContent>
				</Menu>
			</ul>
		</Navbar>
	);
}

function NavbarLinkItem({
	item,
	...props
}: {
	item: LinkItemType;
	className?: string;
}) {
	if (item.type === "custom") return <div {...props}>{item.children}</div>;

	if (item.type === "menu") {
		const children = item.items.map((child, j) => {
			if (child.type === "custom")
				return <Fragment key={j}>{child.children}</Fragment>;

			const {
				banner = child.icon ? (
					<div className="w-fit rounded-md border bg-fd-muted p-1 [&_svg]:size-4">
						{child.icon}
					</div>
				) : null,
				...rest
			} = child.menu ?? {};

			return (
				<NavbarMenuLink
					key={j}
					href={child.url}
					external={child.external}
					{...rest}
				>
					{rest.children ?? (
						<>
							{banner}
							<p className="text-[15px] font-medium">{child.text}</p>
							<p className="text-sm text-fd-muted-foreground empty:hidden">
								{child.description}
							</p>
						</>
					)}
				</NavbarMenuLink>
			);
		});

		return (
			<NavbarMenu>
				<NavbarMenuTrigger {...props}>
					{item.url ? (
						<Link href={item.url} external={item.external}>
							{item.text}
						</Link>
					) : (
						item.text
					)}
				</NavbarMenuTrigger>
				<NavbarMenuContent>{children}</NavbarMenuContent>
			</NavbarMenu>
		);
	}

	return (
		<NavbarLink
			{...props}
			item={item}
			variant={item.type}
			aria-label={item.type === "icon" ? item.label : undefined}
		>
			{item.type === "icon" ? item.icon : item.text}
		</NavbarLink>
	);
}

function isSecondary(item: LinkItemType): boolean {
	if ("secondary" in item && item.secondary != null) return item.secondary;

	return item.type === "icon";
}
