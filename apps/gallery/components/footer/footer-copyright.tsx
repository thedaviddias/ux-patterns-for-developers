"use client";

import { AUTHOR } from "@ux-patterns/constants/author";
import { usePlausible } from "next-plausible";
import { trackFooterClick } from "@/lib/tracking";

export const FooterCopyright = () => {
	const plausible = usePlausible();

	const handleAuthorClick = () => {
		trackFooterClick(plausible, "social", AUTHOR.name);
	};

	return (
		<div className="pt-8 flex justify-between text-sm">
			<p>&copy; {new Date().getFullYear()} UX Patterns for Devs</p>
			<p className="mt-2">
				Made with{" "}
				<span aria-label="love" role="img">
					♥
				</span>{" "}
				by{" "}
				<a
					href={AUTHOR.website}
					target="_blank"
					rel="noopener noreferrer"
					onClick={handleAuthorClick}
					className="font-semibold hover:underline"
				>
					{AUTHOR.name}
				</a>{" "}
				for the Open-Source Community.
			</p>
		</div>
	);
};
