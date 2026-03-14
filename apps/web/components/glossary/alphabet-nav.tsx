"use client";

import { Letter } from "./letter";

interface AlphabetNavProps {
	availableLetters: string[];
}

export function AlphabetNav({ availableLetters }: AlphabetNavProps) {
	return (
		<div className="mb-12 flex flex-wrap gap-2 rounded-[1.5rem] border border-border/70 bg-card/70 p-4 backdrop-blur">
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
