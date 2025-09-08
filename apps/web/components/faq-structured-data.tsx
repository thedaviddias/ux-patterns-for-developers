import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import removeMarkdown from "remove-markdown";

type FAQItem = {
	question: string;
	answer: string;
};

interface FAQProps {
	items: FAQItem[];
}

export const FaqStructuredData: React.FC<FAQProps> = ({ items }) => {
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: removeMarkdown(item.answer), // Strip markdown for schema
			},
		})),
	};

	return (
		<>
			<div className="space-y-8 pt-8">
				<dl className="space-y-6">
					{items.map((item, index) => (
						<div
							key={`faq-item-${item.question}-${index}`}
							className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6"
						>
							<dt className="text-lg font-semibold leading-snug text-neutral-900 dark:text-neutral-100 mt-0">
								{item.question}
							</dt>
							<dd className="mt-3 !m-0 !p-0 max-w-none">
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									components={{
										a: ({ ...props }) => (
											<a
												{...props}
												className="text-neutral-900 dark:text-neutral-100 underline hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
											/>
										),
										ol: ({ ...props }) => (
											<ol {...props} className="list-decimal pl-5 space-y-1" />
										),
										p: ({ ...props }) => (
											<p className="mb-0">{props.children}</p>
										),
									}}
								>
									{item.answer}
								</ReactMarkdown>
							</dd>
						</div>
					))}
				</dl>
			</div>

			<script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
		</>
	);
};
