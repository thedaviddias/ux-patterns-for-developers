"use client";

import { ExpandableCodeBlock } from "@ux-patterns/ui/components/custom/expandable-code-block";
import { Button } from "@ux-patterns/ui/components/shadcn/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@ux-patterns/ui/components/shadcn/collapsible";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@ux-patterns/ui/components/shadcn/tabs";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import * as React from "react";
import type {
	PatternExampleCodeTab,
	PatternExamplePresentation,
} from "@/examples/patterns/example";

function PlaygroundCodeTabs({ tabs }: { tabs: PatternExampleCodeTab[] }) {
	return (
		<div className="overflow-hidden rounded-lg border">
			<Tabs defaultValue={tabs[0]?.value}>
				<div className="border-b bg-muted/30 px-2 py-2">
					<TabsList className="h-auto bg-transparent p-0">
						{tabs.map((tab) => (
							<TabsTrigger key={tab.value} value={tab.value}>
								{tab.lang.toUpperCase()}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				{tabs.map((tab) => (
					<TabsContent key={tab.value} value={tab.value} className="mt-0">
						<ExpandableCodeBlock contentClassName="[&_pre]:my-0">
							<DynamicCodeBlock
								code={tab.code}
								lang={tab.lang}
								options={{
									themes: {
										light: "github-light",
										dark: "github-dark",
									},
								}}
							/>
						</ExpandableCodeBlock>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}

export function PlaygroundCode({
	presentation,
	tabs,
}: {
	presentation: PatternExamplePresentation;
	tabs: PatternExampleCodeTab[];
}) {
	const [isOpen, setIsOpen] = React.useState(false);

	if (presentation === "hidden-code" || tabs.length === 0) {
		return null;
	}

	if (presentation === "inline") {
		return (
			<div className="mt-3">
				<PlaygroundCodeTabs tabs={tabs} />
			</div>
		);
	}

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-3">
			<CollapsibleTrigger asChild>
				<Button variant="outline" size="sm">
					{isOpen ? "Hide code" : "View code"}
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="mt-3">
				<PlaygroundCodeTabs tabs={tabs} />
			</CollapsibleContent>
		</Collapsible>
	);
}
