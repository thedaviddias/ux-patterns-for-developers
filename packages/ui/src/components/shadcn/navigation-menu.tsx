"use client";
import * as Primitive from "@radix-ui/react-navigation-menu";
import * as React from "react";
import { cn } from "../../lib/utils";

const NavigationMenu = Primitive.Root;

const NavigationMenuList = Primitive.List;

const NavigationMenuItem = React.forwardRef<
	React.ComponentRef<typeof Primitive.NavigationMenuItem>,
	React.ComponentPropsWithoutRef<typeof Primitive.NavigationMenuItem>
>(({ className, children, ...props }, ref) => (
	<Primitive.NavigationMenuItem
		ref={ref}
		className={cn("list-none", className)}
		{...props}
	>
		{children}
	</Primitive.NavigationMenuItem>
));

NavigationMenuItem.displayName = Primitive.NavigationMenuItem.displayName;

const NavigationMenuTrigger = React.forwardRef<
	React.ComponentRef<typeof Primitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof Primitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<Primitive.Trigger
		ref={ref}
		className={cn("data-[state=open]:bg-accent/50", className)}
		{...props}
	>
		{children}
	</Primitive.Trigger>
));
NavigationMenuTrigger.displayName = Primitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
	React.ComponentRef<typeof Primitive.Content>,
	React.ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ className, ...props }, ref) => (
	<Primitive.Content
		ref={ref}
		className={cn(
			"absolute inset-x-0 top-0 overflow-auto scroll-container max-h-[80svh] data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft",
			className,
		)}
		{...props}
	/>
));
NavigationMenuContent.displayName = Primitive.Content.displayName;

const NavigationMenuLink = Primitive.Link;

const NavigationMenuViewport = React.forwardRef<
	React.ComponentRef<typeof Primitive.Viewport>,
	React.ComponentPropsWithoutRef<typeof Primitive.Viewport>
>(({ className, ...props }, ref) => (
	<div ref={ref} className="flex w-full justify-center">
		<Primitive.Viewport
			{...props}
			className={cn(
				"relative h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden transition-[width,height] duration-300 data-[state=closed]:animate-nav-menu-out data-[state=open]:animate-nav-menu-in",
				className,
			)}
		/>
	</div>
));
NavigationMenuViewport.displayName = Primitive.Viewport.displayName;

export {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuContent,
	NavigationMenuTrigger,
	NavigationMenuLink,
	NavigationMenuViewport,
};
