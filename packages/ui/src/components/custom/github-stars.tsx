"use client";

import { SiGithub } from "@icons-pack/react-simple-icons";
import { PROJECT } from "@ux-patterns/constants/author";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import { usePlausible } from "next-plausible";
import { NumberTicker } from "../magicui/number-ticker";

type StarsProps = {
	variant?: "default" | "small";
	starsCount: number;
	asLink?: boolean;
	onClick?: () => void;
	trackingEvent?: string;
};

export const GitHubStars = ({
	variant = "default",
	starsCount,
	asLink = true,
	onClick,
	trackingEvent,
}: StarsProps) => {
	const plausible = usePlausible();

	const content = (
		<>
			<div className="flex items-center gap-1 shrink-0">
				<SiGithub className="size-4" aria-hidden="true" />
				<span className="ml-1 hidden sm:inline">Star on Github</span>
			</div>

			<NumberTicker
				value={starsCount}
				className="inline-flex items-center px-2 py-0.5 rounded text-neutral-900 dark:text-neutral-100"
			/>
			<StarIcon className="size-4 hidden text-gray-500 transition-all duration-300 text-yellow-300" />
		</>
	);

	const className = asLink
		? variant === "small"
			? "!no-underline inline-flex items-center px-2 py-1 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 rounded-lg border border-neutral-400 dark:border-neutral-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-200 dark:focus:ring-neutral-700"
			: "!no-underline inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 rounded-lg border border-neutral-400 dark:border-neutral-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-200 dark:focus:ring-neutral-700"
		: "inline-flex items-center gap-1 text-sm text-neutral-900 dark:text-neutral-100";

	const handleClick = () => {
		if (onClick) {
			onClick();
		}
		// Track the click event
		if (trackingEvent) {
			plausible(trackingEvent);
		} else {
			plausible("GitHub Star Click");
		}
	};

	return (
		<div className="flex items-center justify-center gap-2">
			{asLink ? (
				<Link
					href={PROJECT.repository.url}
					target="_blank"
					rel="noopener noreferrer"
					onClick={handleClick}
					className={className}
				>
					{content}
				</Link>
			) : (
				<span className={className}>{content}</span>
			)}
		</div>
	);
};
