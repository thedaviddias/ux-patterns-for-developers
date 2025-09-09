"use client";

import { cn } from "@ux-patterns/ui/lib/utils";
import { useEffect, useState } from "react";

interface Heading {
	id: string;
	text: string;
	level: number;
}

interface TableOfContentsProps {
	className?: string;
}

export function TableOfContents({ className }: TableOfContentsProps) {
	const [headings, setHeadings] = useState<Heading[]>([]);
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		const headingElements = document.querySelectorAll("h1, h2");
		const headingsArray: Heading[] = [];

		headingElements.forEach((element) => {
			if (element.id) {
				headingsArray.push({
					id: element.id,
					text: element.textContent || "",
					level: parseInt(element.tagName.charAt(1), 10),
				});
			}
		});

		setHeadings(headingsArray);
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			() => {
				const headingPositions = headings.map((heading) => {
					const element = document.getElementById(heading.id);
					return {
						id: heading.id,
						top: element ? element.getBoundingClientRect().top : Infinity,
					};
				});

				let activeHeading = headingPositions.find(
					(heading) => heading.top >= 0 && heading.top <= 100,
				);

				if (!activeHeading) {
					const headingsAbove = headingPositions
						.filter((heading) => heading.top < 0)
						.sort((a, b) => b.top - a.top);

					activeHeading = headingsAbove[0];
				}

				if (!activeHeading) {
					const headingsBelow = headingPositions
						.filter((heading) => heading.top > 100)
						.sort((a, b) => a.top - b.top);

					activeHeading = headingsBelow[0];
				}

				if (activeHeading && activeHeading.id !== activeId) {
					setActiveId(activeHeading.id);
				}
			},
			{
				root: null,
				rootMargin: "-100px",
				threshold: 0,
			},
		);

		headings.forEach(({ id }) => {
			const element = document.getElementById(id);
			if (element) {
				observer.observe(element);
			}
		});

		const handleScroll = () => {
			const headingPositions = headings.map((heading) => {
				const element = document.getElementById(heading.id);
				return {
					id: heading.id,
					top: element ? element.getBoundingClientRect().top : Infinity,
				};
			});

			let activeHeading = headingPositions.find(
				(heading) => heading.top >= -50 && heading.top <= 100,
			);

			if (!activeHeading) {
				const headingsAbove = headingPositions
					.filter((heading) => heading.top < -50)
					.sort((a, b) => b.top - a.top);

				activeHeading = headingsAbove[0];
			}

			if (activeHeading && activeHeading.id !== activeId) {
				setActiveId(activeHeading.id);
			}
		};

		let scrollTimeout: NodeJS.Timeout;
		const throttledScroll = () => {
			if (scrollTimeout) clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(handleScroll, 10);
		};

		window.addEventListener("scroll", throttledScroll, { passive: true });

		handleScroll();

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", throttledScroll);
			if (scrollTimeout) clearTimeout(scrollTimeout);
		};
	}, [headings, activeId]);

	const handleClick = async (id: string) => {
		const url = `${window.location.origin}${window.location.pathname}#${id}`;

		window.history.pushState({}, "", `#${id}`);

		try {
			await navigator.clipboard.writeText(url);
		} catch (err) {
			console.error(err);
			const textArea = document.createElement("textarea");
			textArea.value = url;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
		}

		const element = document.getElementById(id);
		if (element) {
			const offset = 80;
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	};

	if (headings.length === 0) return null;

	return (
		<div className={cn("space-y-2", className)}>
			<h4 className="text-sm font-semibold text-foreground mb-4">
				On this page
			</h4>
			<nav>
				<ul className="space-y-2">
					{headings.map((heading) => (
						<li key={heading.id}>
							<button
								type="button"
								onClick={() => handleClick(heading.id)}
								className={cn(
									"block w-full text-left text-sm transition-colors hover:text-foreground text-muted-foreground",
									{
										"text-primary font-medium underline underline-offset-4":
											activeId === heading.id,
									},
								)}
							>
								{heading.text}
							</button>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}
