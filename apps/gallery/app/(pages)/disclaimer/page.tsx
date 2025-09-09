import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useMDXComponents } from "@/lib/mdx-components";
import { pagesSource } from "@/lib/source";

export const metadata: Metadata = {
	title: "Disclaimer - UX Patterns Gallery",
	description: "Educational disclaimer for UX pattern analysis and examples",
};

export default function DisclaimerPage() {
	const page = pagesSource.getPage(["disclaimer"]);
	if (!page) notFound();

	const MDXContent = page.data.body;

	return (
		<div className="container-responsive py-16">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold mb-8">{page.data.title}</h1>
				<div className="prose prose-fd max-w-none">
					<MDXContent components={useMDXComponents({})} />
				</div>
			</div>
		</div>
	);
}
