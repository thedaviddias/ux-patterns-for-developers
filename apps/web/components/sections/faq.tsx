"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
	question: string;
	answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
	{
		question: "What is UX Patterns for Devs?",
		answer:
			"UX Patterns for Devs is a comprehensive documentation resource that helps developers implement effective, accessible, and usable UI components. Each pattern includes 17 sections covering everything from anatomy and best practices to accessibility guidelines and testing strategies.",
	},
	{
		question: "Is it free to use?",
		answer:
			"Yes! UX Patterns for Devs is completely free and open source under the MIT license. You can use it for personal projects, commercial work, and even contribute to it on GitHub.",
	},
	{
		question: "How is this different from component libraries?",
		answer:
			"Component libraries give you code to copy. We give you the knowledge to build correctly. Our patterns explain when to use each component, accessibility requirements, edge cases, and implementation considerations—so you can build components in any framework with confidence.",
	},
	{
		question: "Can I contribute to the project?",
		answer:
			"Absolutely! We welcome contributions from the community. You can suggest new patterns, improve existing documentation, fix bugs, or help with translations. Visit our GitHub repository to learn how to contribute.",
	},
	{
		question: "What tech stack do I need?",
		answer:
			"Our patterns are framework-agnostic. Whether you're using React, Vue, Svelte, Angular, or vanilla JavaScript, the patterns and guidelines apply. We focus on the UX principles and accessibility requirements that work across any technology.",
	},
];

interface FAQItemComponentProps {
	item: FAQItem;
	isOpen: boolean;
	onToggle: () => void;
}

function FAQItemComponent({ item, isOpen, onToggle }: FAQItemComponentProps) {
	return (
		<div
			className={`overflow-hidden rounded-[1.5rem] border border-border/70 transition-all duration-200 ${
				isOpen
					? "bg-muted/30 border-foreground/20"
					: "bg-background/70 hover:border-foreground/10 hover:bg-muted/10"
			}`}
		>
			<button
				type="button"
				onClick={onToggle}
				className="flex w-full items-center justify-between p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
				aria-expanded={isOpen}
			>
				<span className="text-base font-medium text-foreground pr-4">
					{item.question}
				</span>
				<div
					className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
						isOpen
							? "bg-foreground text-background rotate-180"
							: "bg-muted text-muted-foreground"
					}`}
				>
					<ChevronDown className="h-4 w-4" aria-hidden="true" />
				</div>
			</button>
			<div
				className={`overflow-hidden transition-all duration-200 ${
					isOpen ? "max-h-96" : "max-h-0"
				}`}
			>
				<p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
					{item.answer}
				</p>
			</div>
		</div>
	);
}

export function FAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section
			aria-labelledby="faq-heading"
			className="py-16 sm:py-18 lg:py-20"
		>
			<div className="container mx-auto max-w-4xl px-6">
				{/* Section Header */}
				<div className="text-center mb-12">
					<p className="font-display text-sm italic text-muted-foreground">FAQ</p>
					<h2
						id="faq-heading"
						className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl"
					>
						Common questions about the library
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
						Short answers about what the project covers, how it differs from UI
						libraries, and how to use it in real product work.
					</p>
				</div>

				{/* FAQ Items */}
				<div className="space-y-3 rounded-[2rem] border border-border/70 bg-card/80 p-4 backdrop-blur sm:p-5">
					{FAQ_ITEMS.map((item, index) => (
						<FAQItemComponent
							key={item.question}
							item={item}
							isOpen={openIndex === index}
							onToggle={() => setOpenIndex(openIndex === index ? null : index)}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
