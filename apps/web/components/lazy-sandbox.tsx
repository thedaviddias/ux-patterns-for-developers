"use client";

import dynamic from "next/dynamic";

// Lazy load the SandboxProvider component
const SandboxProvider = dynamic(
	() => import("./sandbox").then((mod) => ({ default: mod.SandboxProvider })),
	{
		loading: () => (
			<div className="w-full h-[400px] flex items-center justify-center border border-neutral-200 dark:border-neutral-800 rounded-lg">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-sm text-muted-foreground">
						Loading code editor...
					</p>
				</div>
			</div>
		),
		ssr: false, // Disable SSR for Sandpack components
	},
);

// Lazy load other sandbox components
const SandboxLayout = dynamic(
	() => import("./sandbox").then((mod) => ({ default: mod.SandboxLayout })),
	{
		ssr: false,
	},
);

const SandboxCodeEditor = dynamic(
	() => import("./sandbox").then((mod) => ({ default: mod.SandboxCodeEditor })),
	{
		ssr: false,
	},
);

const SandboxPreview = dynamic(
	() => import("./sandbox").then((mod) => ({ default: mod.SandboxPreview })),
	{
		ssr: false,
	},
);

const SandboxTabs = dynamic(
	() => import("./sandbox").then((mod) => ({ default: mod.SandboxTabs })),
	{
		ssr: false,
	},
);

const SandboxTabsList = dynamic(
	() => import("./sandbox").then((mod) => ({ default: mod.SandboxTabsList })),
	{
		ssr: false,
	},
);

const SandboxTabsTrigger = dynamic(
	() =>
		import("./sandbox").then((mod) => ({ default: mod.SandboxTabsTrigger })),
	{
		ssr: false,
	},
);

const SandboxTabsContent = dynamic(
	() =>
		import("./sandbox").then((mod) => ({ default: mod.SandboxTabsContent })),
	{
		ssr: false,
	},
);

// Re-export all the lazy components
export {
	SandboxProvider,
	SandboxLayout,
	SandboxCodeEditor,
	SandboxPreview,
	SandboxTabs,
	SandboxTabsList,
	SandboxTabsTrigger,
	SandboxTabsContent,
};
