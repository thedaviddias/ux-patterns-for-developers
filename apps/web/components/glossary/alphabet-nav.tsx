"use client";

import { Letter } from "./letter";

interface AlphabetNavProps {
	availableLetters: string[];
}

export function AlphabetNav({ availableLetters }: AlphabetNavProps) {
	return (
		<div className="flex flex-wrap gap-2 mb-12">
			{Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
				<Letter
					key={letter}
					letter={letter}
					hasContent={availableLetters.includes(letter)}
				/>
			))}
		</div>
	);
}
