"use client";

import { useEffect } from "react";

export function HashScrollHandler() {
	useEffect(() => {
		const handleHashScroll = () => {
			const hash = window.location.hash;
			if (hash) {
				const element = document.getElementById(hash.slice(1));
				if (element) {
					const offset = 80;
					const elementPosition = element.getBoundingClientRect().top;
					const offsetPosition = elementPosition + window.pageYOffset - offset;
					window.scrollTo({
						top: offsetPosition,
						behavior: "smooth",
					});
				}
			}
		};
		if (window.location.hash) {
			setTimeout(handleHashScroll, 100);
		}
		window.addEventListener("hashchange", handleHashScroll);

		return () => {
			window.removeEventListener("hashchange", handleHashScroll);
		};
	}, []);

	return null;
}
