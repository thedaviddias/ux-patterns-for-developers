"use client";

import { ChevronDown, HelpCircle } from "lucide-react";
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
			className={`border border-border rounded-xl overflow-hidden transition-all duration-200 ${
				isOpen
					? "bg-muted/30 border-foreground/20"
					: "hover:border-foreground/10 hover:bg-muted/10"
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
			className="py-16 sm:py-20 lg:py-24 bg-muted/20"
		>
			<div className="container max-w-3xl mx-auto px-6">
				{/* Section Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-2 mb-3">
						<HelpCircle className="h-5 w-5 text-muted-foreground" />
						<span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
							FAQ
						</span>
					</div>
					<h2
						id="faq-heading"
						className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight"
					>
						Frequently Asked Questions
					</h2>
					<p className="mt-3 text-muted-foreground">
						Everything you need to know about UX Patterns for Devs
					</p>
				</div>

				{/* FAQ Items */}
				<div className="space-y-3">
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
