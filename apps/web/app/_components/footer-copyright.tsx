"use client";

import { trackFooterClick } from "@app/_utils/tracking";
import { usePlausible } from "next-plausible";

export const FooterCopyright = () => {
	const plausible = usePlausible();

	const handleAuthorClick = () => {
		trackFooterClick(plausible, "social", "David Dias");
	};

	return (
		<div className="pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
			<p>&copy; {new Date().getFullYear()} UX Patterns for Devs</p>
			<p className="mt-2">
				Made with ❤️ by{" "}
				<a
					href="https://thedaviddias.com"
					target="_blank"
					rel="noopener noreferrer"
					onClick={handleAuthorClick}
					className="font-semibold hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
				>
					David Dias
				</a>{" "}
				for the Open-Source Community.
			</p>
		</div>
	);
};
