"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface LetterProps {
	letter: string;
}

export function Letter({ letter }: LetterProps) {
	const pathname = usePathname();
	const isActive = pathname.includes(`#${letter.toLowerCase()}`);

	return (
		<Link
			href={`#${letter.toLowerCase()}`}
			className={`
        px-3 py-2 rounded-md text-sm font-medium
        ${
					isActive
						? "bg-primary text-white"
						: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
				}
      `}
			scroll={false}
		>
			{letter}
		</Link>
	);
}
