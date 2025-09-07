"use client";

import { Index } from "@ux-patterns/registry/.generated";
import { Icons } from "@ux-patterns/ui/components/custom/icons";
import { Button } from "@ux-patterns/ui/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@ux-patterns/ui/components/shadcn/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@ux-patterns/ui/components/shadcn/tooltip";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Copy } from "lucide-react";
import { usePlausible } from "next-plausible";
import React from "react";

interface ComponentDocsModalProps {
	name: string;
}

export const ComponentDocsModal = ({ name }: ComponentDocsModalProps) => {
	const [copied, setCopied] = React.useState<string | null>(null);
	const [rawContent, setRawContent] = React.useState<string | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [open, setOpen] = React.useState(false);
	const plausible = usePlausible();

	// Commands for each package manager using v4 namespace format
	const commands = {
		pnpm: `pnpm dlx shadcn@latest add @upkit/${name}`,
		npm: `npx shadcn@latest add @upkit/${name}`,
		yarn: `yarn dlx shadcn@latest add @upkit/${name}`,
		bun: `bunx shadcn@latest add @upkit/${name}`,
	};

	const copyToClipboard = async (text: string, type: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(type);
			setTimeout(() => setCopied(null), 2000);

			// Track install command copy
			if (type in commands) {
				plausible("Install Command Copy", {
					props: {
						package_manager: type,
						component_name: name,
					},
				});
			} else if (type === "raw") {
				plausible("Component Raw Code Copy", {
					props: {
						component_name: name,
					},
				});
			}
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

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
							className="h-8 gap-1 rounded-[6px] px-3 text-xs dark:text-white text-black bg:text-white hover:bg-black hover:text-white bg-transparent cursor-pointer"
							onClick={() => {
								setOpen(true);
								plausible("Component Docs Modal Open", {
									props: {
										component_name: name,
									},
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
							<Tabs items={["pnpm", "npm", "yarn", "bun"]}>
								<Tab value="pnpm">
									<div className="relative">
										<pre className="bg-fd-muted p-3 rounded-md text-sm overflow-x-auto">
											<code>{commands.pnpm}</code>
										</pre>
										<Button
											variant="ghost"
											size="sm"
											className="absolute right-2 top-2 h-6 w-6 p-0"
											onClick={() =>
												copyToClipboard(commands.pnpm, "install-pnpm")
											}
										>
											<Copy className="h-3 w-3" />
										</Button>
										{copied === "install-pnpm" && (
											<div className="absolute right-2 top-8 text-xs text-green-600">
												Copied!
											</div>
										)}
									</div>
								</Tab>
								<Tab value="npm">
									<div className="relative">
										<pre className="bg-fd-muted p-3 rounded-md text-sm overflow-x-auto">
											<code>{commands.npm}</code>
										</pre>
										<Button
											variant="ghost"
											size="sm"
											className="absolute right-2 top-2 h-6 w-6 p-0"
											onClick={() =>
												copyToClipboard(commands.npm, "install-npm")
											}
										>
											<Copy className="h-3 w-3" />
										</Button>
										{copied === "install-npm" && (
											<div className="absolute right-2 top-8 text-xs text-green-600">
												Copied!
											</div>
										)}
									</div>
								</Tab>
								<Tab value="yarn">
									<div className="relative">
										<pre className="bg-fd-muted p-3 rounded-md text-sm overflow-x-auto">
											<code>{commands.yarn}</code>
										</pre>
										<Button
											variant="ghost"
											size="sm"
											className="absolute right-2 top-2 h-6 w-6 p-0"
											onClick={() =>
												copyToClipboard(commands.yarn, "install-yarn")
											}
										>
											<Copy className="h-3 w-3" />
										</Button>
										{copied === "install-yarn" && (
											<div className="absolute right-2 top-8 text-xs text-green-600">
												Copied!
											</div>
										)}
									</div>
								</Tab>
								<Tab value="bun">
									<div className="relative">
										<pre className="bg-fd-muted p-3 rounded-md text-sm overflow-x-auto">
											<code>{commands.bun}</code>
										</pre>
										<Button
											variant="ghost"
											size="sm"
											className="absolute right-2 top-2 h-6 w-6 p-0"
											onClick={() =>
												copyToClipboard(commands.bun, "install-bun")
											}
										>
											<Copy className="h-3 w-3" />
										</Button>
										{copied === "install-bun" && (
											<div className="absolute right-2 top-8 text-xs text-green-600">
												Copied!
											</div>
										)}
									</div>
								</Tab>
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
									<div className="relative">
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
										<Button
											variant="ghost"
											size="sm"
											className="absolute right-2 top-2 h-6 w-6 p-0"
											onClick={() => copyToClipboard(rawContent, "code")}
										>
											<Copy className="h-3 w-3" />
										</Button>
										{copied === "code" && (
											<div className="absolute right-2 top-8 text-xs text-green-600">
												Copied!
											</div>
										)}
									</div>
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
