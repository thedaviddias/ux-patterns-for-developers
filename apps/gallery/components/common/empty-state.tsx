interface EmptyStateProps {
	message: string;
	subMessage?: string;
	linkHref?: string;
	linkText?: string;
}

export function EmptyState({
	message,
	subMessage,
	linkHref,
	linkText,
}: EmptyStateProps) {
	return (
		<div className="text-center py-12">
			<p className="text-fd-muted-foreground text-lg">{message}</p>
			{subMessage && (
				<p className="text-fd-muted-foreground/60 text-sm mt-2">{subMessage}</p>
			)}
			{linkHref && linkText && (
				<a
					href={linkHref}
					className="text-fd-primary hover:underline mt-4 inline-block"
				>
					{linkText}
				</a>
			)}
		</div>
	);
}
