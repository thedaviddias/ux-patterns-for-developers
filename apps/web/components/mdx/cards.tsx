"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cardHoverClassName } from "@/lib/card-interactions";
import { cn } from "@/lib/cn";

interface CardsProps {
	children: ReactNode;
	className?: string;
}

interface CardProps {
	title: string;
	href: string;
	children?: ReactNode;
	className?: string;
}

/**
 * Cards Container
 *
 * Grid container for Card components.
 */
export function Cards({ children, className }: CardsProps) {
	return (
		<div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
			{children}
		</div>
	);
}

/**
 * Card Component
 *
 * A clickable card with title and optional description.
 */
export function Card({ title, href, children, className }: CardProps) {
	return (
		<Link
			href={href}
			data-card
			className={cn(
				"not-prose group relative flex flex-col gap-2 rounded-[1.5rem] border border-border/70 bg-card/80 px-4 py-3",
				cardHoverClassName(),
				className,
			)}
		>
			<h3 className="font-semibold tracking-tight">{title}</h3>
			{children && (
				<div className="text-sm text-muted-foreground">{children}</div>
			)}
		</Link>
	);
}
