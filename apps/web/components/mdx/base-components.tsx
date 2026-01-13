"use client";

import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Heading Components
 *
 * Each heading has specific sizing to match the production site.
 */
const headingStyles = {
	1: "text-4xl font-extrabold tracking-tight mt-0 mb-4",
	2: "text-3xl font-bold tracking-tight mt-10 mb-4",
	3: "text-2xl font-semibold tracking-tight mt-8 mb-3",
	4: "text-xl font-semibold mt-6 mb-2",
	5: "text-lg font-semibold mt-4 mb-2",
	6: "text-base font-semibold mt-4 mb-2",
} as const;

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
	const Tag = `h${level}` as const;

	return function Heading({
		children,
		className,
		...props
	}: ComponentPropsWithoutRef<typeof Tag>) {
		return (
			<Tag
				className={cn("scroll-mt-20 group", headingStyles[level], className)}
				{...props}
			>
				{children}
			</Tag>
		);
	};
}

export const H1 = createHeading(1);
export const H2 = createHeading(2);
export const H3 = createHeading(3);
export const H4 = createHeading(4);
export const H5 = createHeading(5);
export const H6 = createHeading(6);

/**
 * Paragraph
 */
export function P({
	className,
	...props
}: ComponentPropsWithoutRef<"p">) {
	return (
		<p
			className={cn("leading-7 [&:not(:first-child)]:mt-4", className)}
			{...props}
		/>
	);
}

/**
 * Blockquote
 */
export function Blockquote({
	className,
	...props
}: ComponentPropsWithoutRef<"blockquote">) {
	return (
		<blockquote
			className={cn(
				"mt-6 border-l-4 border-primary/30 pl-4 italic text-muted-foreground",
				className
			)}
			{...props}
		/>
	);
}

/**
 * Unordered List
 */
export function Ul({
	className,
	...props
}: ComponentPropsWithoutRef<"ul">) {
	return (
		<ul
			className={cn("my-4 ml-6 list-disc [&>li]:mt-2", className)}
			{...props}
		/>
	);
}

/**
 * Ordered List
 */
export function Ol({
	className,
	...props
}: ComponentPropsWithoutRef<"ol">) {
	return (
		<ol
			className={cn("my-4 ml-6 list-decimal [&>li]:mt-2", className)}
			{...props}
		/>
	);
}

/**
 * List Item
 */
export function Li({
	className,
	...props
}: ComponentPropsWithoutRef<"li">) {
	return <li className={cn("leading-7", className)} {...props} />;
}

/**
 * Horizontal Rule
 */
export function Hr({
	className,
	...props
}: ComponentPropsWithoutRef<"hr">) {
	return <hr className={cn("my-8 border-border", className)} {...props} />;
}

/**
 * Table Components
 */
export function Table({
	className,
	...props
}: ComponentPropsWithoutRef<"table">) {
	return (
		<div className="my-6 w-full overflow-x-auto">
			<table
				className={cn("w-full border-collapse text-sm", className)}
				{...props}
			/>
		</div>
	);
}

export function Thead({
	className,
	...props
}: ComponentPropsWithoutRef<"thead">) {
	return <thead className={cn("bg-muted/50", className)} {...props} />;
}

export function Tbody({
	className,
	...props
}: ComponentPropsWithoutRef<"tbody">) {
	return <tbody className={cn("[&>tr:last-child]:border-0", className)} {...props} />;
}

export function Tr({
	className,
	...props
}: ComponentPropsWithoutRef<"tr">) {
	return (
		<tr
			className={cn("border-b border-border transition-colors hover:bg-muted/50", className)}
			{...props}
		/>
	);
}

export function Th({
	className,
	...props
}: ComponentPropsWithoutRef<"th">) {
	return (
		<th
			className={cn(
				"px-4 py-3 text-left font-semibold text-foreground [&[align=center]]:text-center [&[align=right]]:text-right",
				className
			)}
			{...props}
		/>
	);
}

export function Td({
	className,
	...props
}: ComponentPropsWithoutRef<"td">) {
	return (
		<td
			className={cn(
				"px-4 py-3 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
				className
			)}
			{...props}
		/>
	);
}

/**
 * Strong/Bold
 */
export function Strong({
	className,
	...props
}: ComponentPropsWithoutRef<"strong">) {
	return <strong className={cn("font-semibold", className)} {...props} />;
}

/**
 * Emphasis/Italic
 */
export function Em({
	className,
	...props
}: ComponentPropsWithoutRef<"em">) {
	return <em className={cn("italic", className)} {...props} />;
}

/**
 * Image
 */
export function Img({
	className,
	alt,
	...props
}: ComponentPropsWithoutRef<"img">) {
	return (
		<img
			className={cn("my-4 rounded-lg border", className)}
			alt={alt}
			{...props}
		/>
	);
}
