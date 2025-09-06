import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Button variant styles using class-variance-authority
 * @description Defines the visual appearance and size variants for the button component
 */
const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			/**
			 * Visual style variant of the button
			 * @default "default"
			 */
			variant: {
				/** Primary button style with solid background */
				default:
					"bg-primary text-primary-foreground shadow hover:bg-primary/90",
				/** Destructive button for dangerous actions */
				destructive:
					"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				/** Button with border and transparent background */
				outline:
					"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
				/** Secondary button style for less prominent actions */
				secondary:
					"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
				/** Subtle button with no background until hovered */
				ghost: "hover:bg-accent hover:text-accent-foreground",
				/** Text button that looks like a link */
				link: "text-primary underline-offset-4 hover:underline",
			},
			/**
			 * Size variant of the button
			 * @default "default"
			 */
			size: {
				/** Standard button size */
				default: "h-9 px-4 py-2",
				/** Small button size */
				sm: "h-8 px-3 text-xs",
				/** Large button size */
				lg: "h-10 px-8",
				/** Square button for icons only */
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	/**
	 * Visual style variant of the button
	 * @default "default"
	 */
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";

	/**
	 * Size variant of the button
	 * @default "default"
	 */
	size?: "default" | "sm" | "lg" | "icon";

	/** Whether to render as a child component (useful with Next.js Link) */
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? "span" : "button";

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
