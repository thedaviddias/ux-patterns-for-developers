"use client";

import { Icons } from "@ux-patterns/ui/components/custom/icons";
import { Button } from "@ux-patterns/ui/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@ux-patterns/ui/components/shadcn/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@ux-patterns/ui/components/shadcn/tooltip";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { track } from "@ux-patterns/analytics/track";
import React from "react";
import { Index } from "../../../../../registry/.generated/index";
import { CopyActionButton } from "../copy-action-button";
import { CopyCommandRow } from "../copy-command-row";
import { ExpandableCodeBlock } from "../expandable-code-block";

interface ComponentDocsModalProps {
	name: string;
}

export const ComponentDocsModal = ({ name }: ComponentDocsModalProps) => {
	const [rawContent, setRawContent] = React.useState<string | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [open, setOpen] = React.useState(false);

	// Commands for each package manager using v4 namespace format
	const commands = {
		pnpm: `pnpm dlx shadcn@latest add @upkit/${name}`,
		npm: `npx shadcn@latest add @upkit/${name}`,
		yarn: `yarn dlx shadcn@latest add @upkit/${name}`,
		bun: `bunx shadcn@latest add @upkit/${name}`,
	};

	const copyToClipboard = React.useCallback(
		async (text: string, type: string) => {
			try {
				await navigator.clipboard.writeText(text);

				// Track copy events
				if (type.startsWith("install-")) {
					const pm = type.slice("install-".length);
					track("Install Command Copy", {
						package_manager: pm,
						component_name: name,
					});
				} else if (type === "code") {
					track("Component Raw Code Copy", {
						component_name: name,
					});
				}
			} catch (err) {
				console.error("Failed to copy text: ", err);
				return false;
			}
			return true;
		},
		[name],
	);

	const packageManagers = Object.entries(commands) as Array<
		[keyof typeof commands, string]
	>;

	// Load raw TSX content from bundled index
	React.useEffect(() => {
		const loadRawContent = () => {
			try {
				// If this is a preview component (ends with -preview), get the base component source instead
				const componentToFetch = name.endsWith("-preview")
					? name.replace("-preview", "")
					: name;

				const registryItem = Index[componentToFetch];
				const fullContent = registryItem?.source;

				if (fullContent) {
					// Unescape the content from JSON format
					const unescapedContent = fullContent
						.replace(/\\n/g, "\n")
						.replace(/\\t/g, "\t")
						.replace(/\\"/g, '"')
						.replace(/\\\\/g, "\\");
					setRawContent(unescapedContent);
				}
			} catch (error) {
				console.error(`Failed to load raw content for ${name}:`, error);
			} finally {
				setLoading(false);
			}
		};

		loadRawContent();
	}, [name]);

	return (
		<>
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 gap-1 rounded-[6px] px-3 text-xs text-black dark:text-white hover:bg-black hover:text-white bg-transparent cursor-pointer"
							aria-label="Open source code"
							onClick={() => {
								setOpen(true);
								track("Component Docs Modal Open", {
									component_name: name,
								});
							}}
						>
							<Icons.code size={16} />
						</Button>
					</TooltipTrigger>
					<TooltipContent className="text-muted-foreground px-2 py-1 text-xs">
						Open in source code
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-fd-background border-fd-border">
					<DialogHeader>
						<DialogTitle className="text-left">Installation</DialogTitle>
					</DialogHeader>

					<div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
						{/* Installation Section */}
						<div className="space-y-3">
							<h3 className="text-sm font-medium">Package Manager</h3>
							<Tabs items={packageManagers.map(([manager]) => manager)}>
								{packageManagers.map(([manager, command]) => (
									<Tab key={manager} value={manager}>
										<CopyCommandRow
											command={command}
											idleAriaLabel={`Copy ${manager} install command`}
											copiedAriaLabel={`Copied ${manager} install command`}
											rowClassName="border-transparent bg-fd-muted hover:bg-fd-muted/80"
											codeClassName="text-sm"
											onCopy={() =>
												copyToClipboard(command, `install-${manager}`)
											}
										/>
									</Tab>
								))}
							</Tabs>
						</div>

						{/* Code Section */}
						<div className="space-y-3">
							<h3 className="text-sm font-medium">Code</h3>
							<div className="overflow-hidden">
								{loading ? (
									<div className="flex items-center text-sm text-muted-foreground p-4">
										<Icons.spinner className="mr-2 size-4 animate-spin" />
										Loading code...
									</div>
								) : rawContent ? (
									<ExpandableCodeBlock
										contentClassName="[&_pre]:my-0"
										actions={
											<CopyActionButton
												variant="ghost"
												size="sm"
												className="h-6 w-6 p-0"
												onCopy={() => copyToClipboard(rawContent, "code")}
												idleAriaLabel="Copy component source"
												copiedAriaLabel="Copied component source"
											/>
										}
									>
										<DynamicCodeBlock
											lang="tsx"
											code={rawContent}
											options={{
												themes: {
													light: "github-light",
													dark: "github-dark",
												},
											}}
										/>
									</ExpandableCodeBlock>
								) : (
									<div className="text-sm text-muted-foreground p-4">
										Failed to load code
									</div>
								)}
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
