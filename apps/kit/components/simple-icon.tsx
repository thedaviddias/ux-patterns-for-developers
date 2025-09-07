import type { FC } from "react";
import type { SimpleIcon } from "simple-icons";

export const SimpleIconComponent: FC<{
	icon?: SimpleIcon;
	className?: string;
}> = ({ icon, className }) => (
	<svg
		role="img"
		aria-label={icon?.title || "Icon"}
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		fill="currentColor"
	>
		<path d={icon?.path} />
	</svg>
);
