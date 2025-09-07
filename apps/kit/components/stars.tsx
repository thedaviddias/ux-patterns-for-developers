"use client";

type StarsProps = {
	variant?: "default" | "small";
	starsCount: number;
	asLink?: boolean;
};

export const Stars = ({
	variant = "default",
	starsCount,
	asLink = true,
}: StarsProps) => {
	const content = (
		<>
			<svg
				className="w-4 h-4"
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
			</svg>
			{variant === "default" && (
				<span className="hidden lg:inline">Star on GitHub</span>
			)}
			<span className="inline-flex items-center px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100">
				{starsCount}
			</span>
		</>
	);

	const className =
		variant === "small"
			? "!no-underline inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-900 dark:text-neutral-100 rounded-lg border border-neutral-400 dark:border-neutral-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-200 dark:focus:ring-neutral-700"
			: "!no-underline inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-900 dark:text-neutral-100 rounded-lg border border-neutral-400 dark:border-neutral-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-200 dark:focus:ring-neutral-700";

	return (
		<div className="flex items-center justify-center gap-2">
			{asLink ? (
				<a
					href="https://github.com/thedaviddias/ux-patterns-for-developers"
					target="_blank"
					rel="noopener noreferrer"
					className={className}
					aria-label="Star on GitHub"
				>
					{content}
				</a>
			) : (
				<span className={className}>{content}</span>
			)}
		</div>
	);
};
