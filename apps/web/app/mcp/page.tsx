import type { Metadata } from "next";
import { metadataSEO } from "@/app/metadata";
import { generateArticleSchema, JsonLd } from "@/components/json-ld";
import { SetupTabs } from "@/components/mcp";
import { siteConfig } from "@/lib/site.config";
import { generateBreadcrumbSchema } from "@/utils/generate-breadcrumb-schema";
import {
	Search,
	List,
	FileText,
	BookOpen,
	Zap,
	Shield,
	Code,
	Lightbulb,
	CheckSquare,
	HelpCircle,
	ArrowRight,
	Terminal,
	Globe,
} from "lucide-react";
import Link from "next/link";

const title = "MCP Server";
const description =
	"Integrate UX Patterns directly into Claude, Cursor, and other AI-powered development tools using the Model Context Protocol.";

// MCP Server URL
const MCP_SERVER_URL = "https://mcp.uxpatterns.dev";

// Client configuration snippets
const CLIENT_CONFIGS = [
	{
		id: "cursor",
		title: "Cursor",
		description: "Add to .cursor/mcp.json (supports native remote MCP)",
		config: `{
  "mcpServers": {
    "ux-patterns": {
      "type": "streamable-http",
      "url": "${MCP_SERVER_URL}"
    }
  }
}`,
	},
	{
		id: "claude_desktop",
		title: "Claude Desktop",
		description: "Add to claude_desktop_config.json (requires Node.js)",
		config: `{
  "mcpServers": {
    "ux-patterns": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${MCP_SERVER_URL}"]
    }
  }
}`,
	},
	{
		id: "claude_code",
		title: "Claude Code",
		description: "Run this command in your terminal",
		config: `claude mcp add --transport http ux-patterns ${MCP_SERVER_URL}`,
	},
	{
		id: "vscode",
		title: "VS Code",
		description: "Add to User Settings (JSON) - requires Node.js",
		config: `{
  "mcp": {
    "servers": {
      "ux-patterns": {
        "command": "npx",
        "args": ["-y", "mcp-remote", "${MCP_SERVER_URL}"]
      }
    }
  }
}`,
	},
	{
		id: "windsurf",
		title: "Windsurf",
		description: "Add to Cascade > MCP servers (requires Node.js)",
		config: `{
  "mcpServers": {
    "ux-patterns": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${MCP_SERVER_URL}"]
    }
  }
}`,
	},
	{
		id: "http",
		title: "HTTP API",
		description: "Direct API access via POST requests",
		config: `POST ${MCP_SERVER_URL}
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "list_patterns",
    "arguments": {}
  }
}`,
	},
];

// Generate Cursor install URL
function getCursorInstallUrl() {
	const config = {
		mcpServers: {
			"ux-patterns": {
				type: "streamable-http",
				url: MCP_SERVER_URL,
			},
		},
	};
	const encodedConfig = Buffer.from(JSON.stringify(config)).toString("base64");
	return `cursor://anysphere.cursor-deeplink/mcp/install?name=ux-patterns&config=${encodedConfig}`;
}

// MCP Tools data
const mcpTools = [
	{
		name: "list_categories",
		description: "List all UX pattern categories with pattern counts",
		icon: List,
		type: "reactive",
	},
	{
		name: "list_patterns",
		description: "List patterns with optional filtering by category and pagination",
		icon: List,
		type: "reactive",
	},
	{
		name: "get_pattern",
		description: "Get detailed information about a specific UX pattern",
		icon: FileText,
		type: "reactive",
	},
	{
		name: "search_patterns",
		description: "Search for patterns by keyword with relevance scoring",
		icon: Search,
		type: "reactive",
	},
	{
		name: "get_glossary_term",
		description: "Get definition and related info for UX/UI glossary terms",
		icon: BookOpen,
		type: "reactive",
	},
	{
		name: "get_quick_reference",
		description: "Get token-efficient quick reference of patterns for AI context",
		icon: Zap,
		type: "proactive",
	},
	{
		name: "suggest_pattern",
		description: "Get pattern suggestions based on your development context",
		icon: Lightbulb,
		type: "proactive",
	},
	{
		name: "review_code",
		description: "Review UI code against UX pattern best practices",
		icon: Code,
		type: "proactive",
	},
	{
		name: "check_accessibility",
		description: "Check code for WCAG accessibility compliance issues",
		icon: Shield,
		type: "proactive",
	},
	{
		name: "pattern_advisor",
		description: "Interactive advisor to help choose the right UX pattern",
		icon: HelpCircle,
		type: "advanced",
	},
	{
		name: "get_implementation_checklist",
		description: "Get step-by-step implementation checklist for a pattern",
		icon: CheckSquare,
		type: "advanced",
	},
];

export default function MCPPage() {
	const cursorInstallUrl = getCursorInstallUrl();

	const schemas = [
		generateArticleSchema(
			title,
			description,
			"/mcp",
			undefined,
			"2026-01-15T00:00:00.000Z",
			"2026-01-15T00:00:00.000Z",
			"Page",
		),
		generateBreadcrumbSchema([
			{ name: "Home", url: "/" },
			{ name: title, url: "/mcp" },
		]),
	];

	return (
		<>
			{schemas.map((schema, index) => (
				<JsonLd
					key={`mcp-schema-${index}`}
					data={schema}
				/>
			))}

			<div className="min-h-screen bg-background relative">
				{/* Hero Section */}
				<div className="space-y-4 border-b border-border relative z-10">
					<div className="max-w-7xl mx-auto flex flex-col gap-6 p-6 py-12 md:py-16">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Terminal className="size-4" />
							<span>Developer Tools</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-balance">
							{title}
						</h1>
						<p className="text-muted-foreground max-w-3xl md:text-lg md:text-balance">
							{description}
						</p>
						<div className="flex flex-wrap gap-3 pt-2">
							<a
								href="#setup"
								className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg font-medium text-sm hover:bg-foreground/90 transition-colors"
							>
								Quick Setup
								<ArrowRight className="size-4" />
							</a>
							<a
								href="#tools"
								className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-medium text-sm hover:bg-accent transition-colors"
							>
								View All Tools
							</a>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
					{/* What is MCP */}
					<section id="what-is-mcp" className="space-y-6">
						<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
							What is MCP?
						</h2>
						<div className="prose dark:prose-invert max-w-none">
							<p className="text-muted-foreground text-lg">
								The <strong>Model Context Protocol (MCP)</strong> is an open standard
								that enables AI assistants to securely access external data sources
								and tools. Our MCP server exposes UX Patterns directly to AI-powered
								development tools like Claude Code, Cursor, and others.
							</p>
							<p className="text-muted-foreground">
								With 11 specialized tools, you can search patterns, check
								accessibility, review code against best practices, and get
								implementation guidance—all from within your AI assistant.
							</p>
						</div>
					</section>

					{/* Quick Setup */}
					<section id="setup" className="space-y-6">
						<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
							Quick Setup
						</h2>

						<p className="text-muted-foreground max-w-2xl">
							Choose your AI tool below and follow the setup instructions. The
							server exposes 11 tools for searching, reviewing, and learning UX
							patterns.
						</p>

						{/* Server URL */}
						<div className="p-4 rounded-lg bg-muted border border-border">
							<p className="text-xs text-muted-foreground mb-2">Server URL</p>
							<code className="text-sm font-mono text-foreground break-all">
								{MCP_SERVER_URL}
							</code>
						</div>

						{/* Tabbed Setup Instructions */}
						<SetupTabs
							configs={CLIENT_CONFIGS}
							cursorInstallUrl={cursorInstallUrl}
						/>

						{/* Other Clients Note */}
						<p className="text-sm text-muted-foreground">
							Hundreds of other tools support MCP servers. Configure them with
							the server URL above. Check your tool&apos;s documentation for specific
							setup instructions.
						</p>
					</section>

					{/* Available Tools */}
					<section id="tools" className="space-y-6">
						<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
							Available Tools
						</h2>
						<p className="text-muted-foreground max-w-2xl">
							The MCP server provides 11 tools organized into three categories:
							reactive tools respond to queries, proactive tools assist during
							development, and advanced tools provide deeper guidance.
						</p>

						{/* Tool Categories */}
						<div className="space-y-8">
							{/* Reactive Tools */}
							<div className="space-y-4">
								<h3 className="text-lg font-medium flex items-center gap-2">
									<span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
										Reactive
									</span>
									<span>Query & Discovery</span>
								</h3>
								<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
									{mcpTools
										.filter((t) => t.type === "reactive")
										.map((tool) => (
											<div
												key={tool.name}
												className="border border-border rounded-lg p-4 hover:border-foreground/20 transition-colors"
											>
												<div className="flex items-start gap-3">
													<tool.icon className="size-5 text-muted-foreground flex-shrink-0 mt-0.5" />
													<div>
														<p className="font-mono text-sm font-medium">
															{tool.name}
														</p>
														<p className="text-xs text-muted-foreground mt-1">
															{tool.description}
														</p>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>

							{/* Proactive Tools */}
							<div className="space-y-4">
								<h3 className="text-lg font-medium flex items-center gap-2">
									<span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-xs font-medium">
										Proactive
									</span>
									<span>Development Assistance</span>
								</h3>
								<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
									{mcpTools
										.filter((t) => t.type === "proactive")
										.map((tool) => (
											<div
												key={tool.name}
												className="border border-border rounded-lg p-4 hover:border-foreground/20 transition-colors"
											>
												<div className="flex items-start gap-3">
													<tool.icon className="size-5 text-muted-foreground flex-shrink-0 mt-0.5" />
													<div>
														<p className="font-mono text-sm font-medium">
															{tool.name}
														</p>
														<p className="text-xs text-muted-foreground mt-1">
															{tool.description}
														</p>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>

							{/* Advanced Tools */}
							<div className="space-y-4">
								<h3 className="text-lg font-medium flex items-center gap-2">
									<span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-xs font-medium">
										Advanced
									</span>
									<span>Deep Guidance</span>
								</h3>
								<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
									{mcpTools
										.filter((t) => t.type === "advanced")
										.map((tool) => (
											<div
												key={tool.name}
												className="border border-border rounded-lg p-4 hover:border-foreground/20 transition-colors"
											>
												<div className="flex items-start gap-3">
													<tool.icon className="size-5 text-muted-foreground flex-shrink-0 mt-0.5" />
													<div>
														<p className="font-mono text-sm font-medium">
															{tool.name}
														</p>
														<p className="text-xs text-muted-foreground mt-1">
															{tool.description}
														</p>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>
						</div>
					</section>

					{/* Usage Example */}
					<section id="example" className="space-y-6">
						<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
							Usage Example
						</h2>
						<p className="text-muted-foreground max-w-2xl">
							Once configured, simply ask your AI assistant about UX patterns. Here&apos;s
							what happens behind the scenes:
						</p>
						<div className="border border-border rounded-xl p-6 space-y-4 bg-muted/30">
							<p className="text-sm font-medium">You ask:</p>
							<p className="text-muted-foreground italic">
								&quot;What&apos;s the best pattern for a search input with suggestions?&quot;
							</p>
							<p className="text-sm font-medium pt-2">The AI uses:</p>
							<pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
								<code>{`// AI calls suggest_pattern tool
{
  "context": "search input with suggestions"
}

// Returns: Autocomplete pattern with full details,
// accessibility requirements, and code examples`}</code>
							</pre>
						</div>
					</section>

					{/* Features */}
					<section id="features" className="space-y-6">
						<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
							Key Features
						</h2>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<div className="border border-border rounded-lg p-5">
								<Zap className="size-5 mb-3 text-foreground" />
								<h3 className="font-medium">Fast & Cached</h3>
								<p className="text-sm text-muted-foreground mt-1">
									LRU caching with 5-minute TTL for instant responses
								</p>
							</div>
							<div className="border border-border rounded-lg p-5">
								<Search className="size-5 mb-3 text-foreground" />
								<h3 className="font-medium">Fuzzy Matching</h3>
								<p className="text-sm text-muted-foreground mt-1">
									Typo-tolerant search with &quot;did you mean&quot; suggestions
								</p>
							</div>
							<div className="border border-border rounded-lg p-5">
								<Shield className="size-5 mb-3 text-foreground" />
								<h3 className="font-medium">WCAG Checking</h3>
								<p className="text-sm text-muted-foreground mt-1">
									Built-in accessibility compliance validation
								</p>
							</div>
							<div className="border border-border rounded-lg p-5">
								<Code className="size-5 mb-3 text-foreground" />
								<h3 className="font-medium">Code Review</h3>
								<p className="text-sm text-muted-foreground mt-1">
									Analyze code against UX pattern best practices
								</p>
							</div>
							<div className="border border-border rounded-lg p-5">
								<List className="size-5 mb-3 text-foreground" />
								<h3 className="font-medium">Pagination</h3>
								<p className="text-sm text-muted-foreground mt-1">
									Cursor-based pagination for large result sets
								</p>
							</div>
							<div className="border border-border rounded-lg p-5">
								<Globe className="size-5 mb-3 text-foreground" />
								<h3 className="font-medium">HTTP + Stdio</h3>
								<p className="text-sm text-muted-foreground mt-1">
									Dual transport support for any integration
								</p>
							</div>
						</div>
					</section>

					{/* CTA */}
					<section className="border border-border rounded-2xl p-8 md:p-12 bg-gradient-to-br from-card to-secondary/20 text-center space-y-4">
						<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
							Ready to Get Started?
						</h2>
						<p className="text-muted-foreground max-w-xl mx-auto">
							Add the MCP server to your AI assistant and start building better
							user interfaces with guidance from our UX patterns library.
						</p>
						<div className="flex flex-wrap justify-center gap-3 pt-2">
							<Link
								href="/patterns/getting-started"
								className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg font-medium text-sm hover:bg-foreground/90 transition-colors"
							>
								Browse Patterns
								<ArrowRight className="size-4" />
							</Link>
							<a
								href="https://github.com/thedaviddias/ux-patterns-for-developers"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-medium text-sm hover:bg-accent transition-colors"
							>
								View on GitHub
							</a>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}

export const metadata: Metadata = {
	...metadataSEO,
	title,
	description,
	alternates: {
		canonical: `${siteConfig.url}/mcp`,
	},
	openGraph: {
		...metadataSEO.openGraph,
		title,
		description,
		url: `${siteConfig.url}/mcp`,
		images: [
			{
				url: "/og/opengraph-image.png",
				width: 1200,
				height: 630,
				type: "image/png",
				alt: `${title} - UX Patterns for Developers`,
			},
		],
	},
	twitter: {
		...metadataSEO.twitter,
		title,
		description,
		images: [
			{
				url: "/og/opengraph-image.png",
				alt: `${title} - UX Patterns for Developers`,
			},
		],
	},
};
