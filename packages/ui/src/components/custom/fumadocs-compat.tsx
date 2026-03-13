"use client";

import { cn } from "@ux-patterns/ui/lib/utils";
import { cva } from "class-variance-authority";
import {
	type ButtonProps,
	buttonVariants,
} from "fumadocs-ui/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "fumadocs-ui/components/ui/popover";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { Airplay, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
	type ComponentProps,
	createContext,
	type MouseEvent,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type TransparentMode = "always" | "top" | "none";

const NavContext = createContext({ isTransparent: false });

export function NavProvider({
	children,
	transparentMode = "none",
}: {
	children: ReactNode;
	transparentMode?: TransparentMode;
}) {
	const [isAtTop, setIsAtTop] = useState(true);

	useEffect(() => {
		if (transparentMode !== "top") {
			setIsAtTop(true);
			return;
		}

		const update = () => {
			setIsAtTop(window.scrollY <= 0);
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, [transparentMode]);

	const value = useMemo(
		() => ({
			isTransparent:
				transparentMode === "always" || (transparentMode === "top" && isAtTop),
		}),
		[isAtTop, transparentMode],
	);

	return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
	return useContext(NavContext);
}

type SearchToggleProps = Omit<ComponentProps<"button">, "color"> &
	ButtonProps & {
		hideIfDisabled?: boolean;
	};

export function SearchToggle({
	hideIfDisabled,
	size = "icon-sm",
	color = "ghost",
	onClick,
	...props
}: SearchToggleProps) {
	const { enabled, setOpenSearch } = useSearchContext();

	if (hideIfDisabled && !enabled) return null;

	return (
		<button
			type="button"
			data-search=""
			aria-label="Open Search"
			{...props}
			className={cn(buttonVariants({ size, color }), props.className)}
			onClick={(event: MouseEvent<HTMLButtonElement>) => {
				setOpenSearch(true);
				onClick?.(event);
			}}
		>
			<Search />
		</button>
	);
}

export function LargeSearchToggle({
	hideIfDisabled,
	onClick,
	...props
}: ComponentProps<"button"> & {
	hideIfDisabled?: boolean;
}) {
	const { enabled, hotKey, setOpenSearch } = useSearchContext();
	const { text } = useI18n();

	if (hideIfDisabled && !enabled) return null;

	return (
		<button
			type="button"
			data-search-full=""
			{...props}
			className={cn(
				"inline-flex items-center gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
				props.className,
			)}
			onClick={(event: MouseEvent<HTMLButtonElement>) => {
				setOpenSearch(true);
				onClick?.(event);
			}}
		>
			<Search className="size-4" />
			{text.search}
			<div className="ms-auto inline-flex gap-0.5">
				{hotKey.map((key, index) => (
					<kbd
						key={`${key.key}-${index}`}
						className="rounded-md border bg-fd-background px-1.5"
					>
						{key.display}
					</kbd>
				))}
			</div>
		</button>
	);
}

const themeItemVariants = cva(
	"size-6.5 rounded-full p-1.5 text-fd-muted-foreground",
	{
		variants: {
			active: {
				true: "bg-fd-accent text-fd-accent-foreground",
				false: "text-fd-muted-foreground",
			},
		},
	},
);

const themeOptions = [
	["light", Sun],
	["dark", Moon],
	["system", Airplay],
] as const;

export function ThemeToggle({
	className,
	mode = "light-dark",
	...props
}: ComponentProps<"div"> & {
	mode?: "light-dark-system" | "light-dark";
}) {
	const { resolvedTheme, setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const containerClassName = cn(
		"inline-flex items-center rounded-full border p-1",
		className,
	);

	if (mode === "light-dark") {
		const value = mounted ? resolvedTheme : null;

		return (
			<button
				type="button"
				className={containerClassName}
				aria-label="Toggle Theme"
				data-theme-toggle=""
				onClick={() => setTheme(value === "light" ? "dark" : "light")}
			>
				{themeOptions.map(([key, Icon]) => {
					if (key === "system") return null;
					return (
						<Icon
							key={key}
							fill="currentColor"
							className={cn(themeItemVariants({ active: value === key }))}
						/>
					);
				})}
			</button>
		);
	}

	const value = mounted ? theme : null;

	return (
		<div {...props} className={containerClassName} data-theme-toggle="">
			{themeOptions.map(([key, Icon]) => (
				<button
					key={key}
					type="button"
					aria-label={key}
					className={cn(themeItemVariants({ active: value === key }))}
					onClick={() => setTheme(key)}
				>
					<Icon className="size-full" fill="currentColor" />
				</button>
			))}
		</div>
	);
}

export function LanguageToggle(
	props: Omit<ComponentProps<typeof PopoverTrigger>, "children"> & {
		children?: ReactNode;
	},
) {
	const context = useI18n();

	if (!context.locales || context.locales.length === 0) {
		return null;
	}

	return (
		<Popover>
			<PopoverTrigger
				aria-label={context.text.chooseLanguage}
				{...props}
				className={cn(
					buttonVariants({
						color: "ghost",
						className: "gap-1.5 p-1.5",
					}),
					props.className,
				)}
			>
				{props.children}
			</PopoverTrigger>
			<PopoverContent className="flex flex-col overflow-x-hidden p-0">
				<p className="mb-1 p-2 text-xs font-medium text-fd-muted-foreground">
					{context.text.chooseLanguage}
				</p>
				{context.locales.map((locale) => (
					<button
						key={locale.locale}
						type="button"
						className={cn(
							"p-2 text-start text-sm",
							locale.locale === context.locale
								? "bg-fd-primary/10 font-medium text-fd-primary"
								: "hover:bg-fd-accent hover:text-fd-accent-foreground",
						)}
						onClick={() => {
							context.onChange?.(locale.locale);
						}}
					>
						{locale.name}
					</button>
				))}
			</PopoverContent>
		</Popover>
	);
}
