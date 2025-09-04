"use client";

import { Letter } from "./letter";

export function AlphabetNav() {
	return (
		<div className="flex flex-wrap gap-2 mb-12">
			{Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
				<Letter key={letter} letter={letter} />
			))}
		</div>
	);
}
