"use client";

import { AppWindowIcon, CodeIcon } from "lucide-react";
import {
	SandboxCodeEditor,
	SandboxLayout,
	SandboxPreview,
	SandboxProvider,
	SandboxTabs,
	SandboxTabsContent,
	SandboxTabsList,
	SandboxTabsTrigger,
} from "@/components/lazy-sandbox";
import {
	composePatternExampleMarkup,
	type PatternExampleDefinition,
} from "@/examples/patterns/example";

export const PlaygroundSandbox = ({
	example,
	height = "650px",
}: {
	example: PatternExampleDefinition;
	height?: string;
}) => {
	const code = composePatternExampleMarkup(example);

	return (
		<div className="mt-6" style={{ height }}>
			<SandboxProvider
				files={{
					"/index.html": code,
				}}
				template="static"
			>
				<SandboxLayout>
					<SandboxTabs defaultValue="preview" className="h-[calc(100%-3rem)]">
						<div className="flex items-center justify-between border-b border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950">
							<SandboxTabsList className="border-none">
								<SandboxTabsTrigger
									value="code"
									className="data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-900"
								>
									<CodeIcon size={14} />
									Code
								</SandboxTabsTrigger>
								<SandboxTabsTrigger
									value="preview"
									className="data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-900"
								>
									<AppWindowIcon size={14} />
									Preview
								</SandboxTabsTrigger>
							</SandboxTabsList>
						</div>
						<SandboxTabsContent value="code" className="h-full p-0">
							<SandboxCodeEditor className="h-full" />
						</SandboxTabsContent>
						<SandboxTabsContent value="preview" className="h-full p-0">
							<SandboxPreview
								showOpenInCodeSandbox={true}
								showRefreshButton={false}
							/>
						</SandboxTabsContent>
					</SandboxTabs>
				</SandboxLayout>
			</SandboxProvider>
		</div>
	);
};
