import { Index } from "@ux-patterns/registry/.generated";
import { cn } from "@ux-patterns/ui/lib/utils";
import * as React from "react";
import { CodeDisplayServer } from "./code-display-server";
import { ComponentWrapper } from "./component-wrapper";

interface ComponentPreviewServerProps
	extends React.HTMLAttributes<HTMLDivElement> {
	name: string;
	align?: "center" | "start" | "end";
	preview?: boolean;
	height?: string;
	kit?: boolean;
	extractJSX?: boolean;
	showHTML?: boolean;
	pageMetadata?: {
		title?: string;
		description?: string;
		[key: string]: unknown;
	} | null;
}

export async function ComponentPreviewServer({
	name,
	children,
	className,
	align = "center",
	preview = false,
	height,
	kit = false,
	extractJSX = true,
	showHTML = false,
	pageMetadata,
	...props
}: ComponentPreviewServerProps) {
	const Codes = React.Children.toArray(children) as React.ReactElement[];
	const Code = Codes[0];

	const registryItem = Index[name];

	const Preview = (() => {
		const Component = registryItem?.component;

		if (!Component) {
			console.error(`Component with name "${name}" not found in registry.`);
			return (
				<p className="text-sm text-muted-foreground">
					Component{" "}
					<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
						{name}
					</code>{" "}
					not found in registry.
				</p>
			);
		}

		return <Component />;
	})();

	return (
		<div
			className={cn(
				"relative my-4 flex flex-col space-y-4 lg:max-w-[120ch]",
				className,
			)}
			{...props}
		>
			{/* Preview Section */}
			<div className="relative rounded-md">
				<ComponentWrapper
					name={name}
					height={height}
					kit={kit}
					pageMetadata={pageMetadata}
				>
					<React.Suspense
						fallback={
							<div className="flex items-center text-sm text-muted-foreground">
								Loading...
							</div>
						}
					>
						{Preview}
					</React.Suspense>
				</ComponentWrapper>
			</div>

			{/* Code Section - Server-side loaded */}
			{!preview &&
				(Code || (
					<CodeDisplayServer
						name={name}
						extractJSX={extractJSX}
						showHTML={showHTML}
					/>
				))}
		</div>
	);
}
