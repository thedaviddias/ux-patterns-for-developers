"use client";

import { PlaygroundCode } from "@/components/playground-code";
import { PlaygroundSandbox } from "@/components/playground-sandbox";
import { getPatternExample } from "@/examples/patterns";
import {
	composePatternExampleDocument,
	getPatternExampleCodeTabs,
	type PatternExamplePresentation,
} from "@/examples/patterns/example";

export const Playground = ({
	patternType,
	pattern,
	example,
	height,
	mode = "preview",
	presentation = "auto",
}: {
	patternType: string;
	pattern: string;
	example: string;
	height?: string;
	mode?: "preview" | "sandbox";
	presentation?: PatternExamplePresentation | "auto";
}) => {
	const patternExample = getPatternExample(patternType, pattern, example);

	if (!patternExample) {
		return null;
	}

	const resolvedHeight = height ?? patternExample.height ?? "650px";

	if (mode === "sandbox") {
		return (
			<PlaygroundSandbox example={patternExample} height={resolvedHeight} />
		);
	}

	const codeTabs = getPatternExampleCodeTabs(patternExample);
	const previewTitle =
		patternExample.title || `${patternType} ${pattern} ${example} preview`;
	const resolvedPresentation =
		presentation === "auto" ? patternExample.presentation : presentation;
	const srcDoc = composePatternExampleDocument(patternExample);

	return (
		<div className="mt-6">
			<div className="overflow-hidden rounded-lg border">
				<div className="border-b bg-muted/30 px-3 py-2 text-sm font-medium">
					Live preview
				</div>
				<iframe
					className="block w-full border-0 bg-white"
					sandbox="allow-scripts"
					srcDoc={srcDoc}
					style={{ height: resolvedHeight }}
					title={previewTitle}
				/>
			</div>

			<PlaygroundCode presentation={resolvedPresentation} tabs={codeTabs} />
		</div>
	);
};
