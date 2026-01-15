"use client";

import { cn } from "@/lib/cn";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface SetupConfig {
	id: string;
	title: string;
	description: string;
	config: string;
}

interface SetupTabsProps {
	configs: SetupConfig[];
	cursorInstallUrl: string;
}

export function SetupTabs({ configs, cursorInstallUrl }: SetupTabsProps) {
	const [activeTab, setActiveTab] = useState(configs[0]?.id || "");
	const [copied, setCopied] = useState(false);

	const activeConfig = configs.find((c) => c.id === activeTab);

	const handleCopy = async () => {
		if (!activeConfig) return;
		try {
			await navigator.clipboard.writeText(activeConfig.config);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy to clipboard:", err);
		}
	};

	return (
		<div className="rounded-xl border border-border bg-card overflow-hidden">
			{/* Tab Navigation */}
			<div className="flex overflow-x-auto border-b border-border bg-muted/50">
				{configs.map((config) => (
					<button
						key={config.id}
						type="button"
						onClick={() => setActiveTab(config.id)}
						className={cn(
							"px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
							"border-b-2 -mb-px",
							activeTab === config.id
								? "border-primary text-foreground bg-background"
								: "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted",
						)}
					>
						{config.title}
					</button>
				))}
			</div>

			{/* Tab Content */}
			{activeConfig && (
				<div className="p-5">
					<div className="flex items-start justify-between gap-4 mb-4">
						<div>
							<p className="text-sm text-muted-foreground">
								{activeConfig.description}
							</p>
						</div>
						<div className="flex items-center gap-2 shrink-0">
							{activeTab === "cursor" && (
								<a
									href={cursorInstallUrl}
									className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
								>
									<svg
										className="h-3.5 w-3.5"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true"
									>
										<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
									</svg>
									Add to Cursor
								</a>
							)}
							<button
								type="button"
								onClick={handleCopy}
								className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
								aria-label={copied ? "Copied" : "Copy configuration"}
							>
								{copied ? (
									<>
										<Check className="h-3.5 w-3.5 text-green-500" />
										Copied
									</>
								) : (
									<>
										<Copy className="h-3.5 w-3.5" />
										Copy
									</>
								)}
							</button>
						</div>
					</div>

					<pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto border border-border">
						<code className="text-muted-foreground">{activeConfig.config}</code>
					</pre>

					{activeTab === "cursor" && (
						<p className="mt-3 text-xs text-muted-foreground">
							Add this to{" "}
							<code className="px-1 py-0.5 rounded bg-muted">
								.cursor/mcp.json
							</code>{" "}
							in your project or global{" "}
							<code className="px-1 py-0.5 rounded bg-muted">
								~/.cursor/mcp.json
							</code>
							.
						</p>
					)}
					{activeTab === "claude_desktop" && (
						<p className="mt-3 text-xs text-muted-foreground">
							Config:{" "}
							<code className="px-1 py-0.5 rounded bg-muted">
								~/Library/Application Support/Claude/mcp.json
							</code>{" "}
							(macOS). Requires{" "}
							<a
								href="https://nodejs.org/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Node.js 18+
							</a>
							.
						</p>
					)}
					{activeTab === "vscode" && (
						<p className="mt-3 text-xs text-muted-foreground">
							Open with{" "}
							<code className="px-1 py-0.5 rounded bg-muted">
								Ctrl/Cmd + Shift + P
							</code>{" "}
							→ &quot;Preferences: Open User Settings (JSON)&quot;. Requires{" "}
							<a
								href="https://nodejs.org/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Node.js 18+
							</a>
							.
						</p>
					)}
					{activeTab === "windsurf" && (
						<p className="mt-3 text-xs text-muted-foreground">
							Open settings with{" "}
							<code className="px-1 py-0.5 rounded bg-muted">Ctrl/Cmd + ,</code>{" "}
							→ Cascade → MCP servers. Requires{" "}
							<a
								href="https://nodejs.org/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:underline"
							>
								Node.js 18+
							</a>
							.
						</p>
					)}
					{activeTab === "claude_code" && (
						<p className="mt-3 text-xs text-muted-foreground">
							Run{" "}
							<code className="px-1 py-0.5 rounded bg-muted">/mcp</code> in a
							Claude Code session to authenticate after adding.
						</p>
					)}
				</div>
			)}
		</div>
	);
}
