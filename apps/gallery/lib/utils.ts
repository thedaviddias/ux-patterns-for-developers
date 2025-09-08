import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}

export function formatWebsite(website: string): string {
	return website.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "");
}

export function getPatternSlug(pattern: string): string {
	return pattern.toLowerCase().replace(/\s+/g, "-");
}
