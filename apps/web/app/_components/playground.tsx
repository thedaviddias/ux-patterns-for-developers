"use client";

import { AppWindowIcon, CodeIcon } from "lucide-react";
import { useTheme } from "nextra-theme-docs";
import {
	SandboxCodeEditor,
	SandboxLayout,
	SandboxPreview,
	SandboxProvider,
	SandboxTabs,
	SandboxTabsContent,
	SandboxTabsList,
	SandboxTabsTrigger,
} from "@/app/_components/sandbox";
import { examples } from "@/app/_examples/patterns";

export const Playground = ({
	patternType,
	pattern,
	example,
	height = "650px",
}) => {
	const { theme } = useTheme();
	const code = examples[patternType][pattern][example] as string;

	return (
		<div className="mt-6" style={{ height }}>
			<SandboxProvider
				files={{
					"/index.html": code,
				}}
				template="static"
				theme={theme === "dark" ? "dark" : "light"}
			>
				<SandboxLayout>
					<SandboxTabs defaultValue="preview" className="h-[calc(100%-3rem)]">
						<div className="flex items-center justify-between p-2 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 bg-white">
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
