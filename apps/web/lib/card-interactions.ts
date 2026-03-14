import { cn } from "@/lib/cn";

export const CARD_HOVER_LIFT =
	"transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function cardHoverClassName(className?: string) {
	return cn(CARD_HOVER_LIFT, className);
}
