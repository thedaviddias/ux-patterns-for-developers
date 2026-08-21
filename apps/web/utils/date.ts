export const formatDate = (date: Date): string => {
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		// Frontmatter dates parse as UTC midnight. Without this the server's
		// local zone shifts them a day backwards anywhere west of UTC, so a
		// post dated 2024-12-13 renders as "December 12, 2024" locally and
		// "December 13, 2024" on Vercel.
		timeZone: "UTC",
	});
};
