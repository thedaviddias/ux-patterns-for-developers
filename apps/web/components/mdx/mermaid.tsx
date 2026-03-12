"use client";

import { useTheme } from "next-themes";
import { useEffect, useId, useState } from "react";

export function Mermaid({ chart }: { chart: string }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return;
	return <MermaidContent chart={chart} />;
}

type MermaidRenderResult = {
	bindFunctions?: (element: Element) => void;
	svg: string;
};

const mermaidPromise = import("mermaid").then((mod) => mod.default);

function MermaidPlaceholder({ message }: { message: string }) {
	return (
		<div className="flex items-center justify-center rounded-lg border border-neutral-200 p-8 dark:border-neutral-800">
			<p className="text-sm text-muted-foreground">{message}</p>
		</div>
	);
}

function MermaidContent({ chart }: { chart: string }) {
	const id = useId();
	const { resolvedTheme } = useTheme();
	const [result, setResult] = useState<MermaidRenderResult | null>(null);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		let cancelled = false;

		setResult(null);
		setHasError(false);

		mermaidPromise
			.then((mermaid) => {
				mermaid.initialize({
					startOnLoad: false,
					securityLevel: "loose",
					fontFamily: "inherit",
					themeCSS: "margin: 1.5rem auto 0;",
					theme: resolvedTheme === "dark" ? "dark" : "default",
				});

				return mermaid.render(id, chart.replaceAll("\\n", "\n"));
			})
			.then((rendered) => {
				if (!cancelled) {
					setResult(rendered);
				}
			})
			.catch((error) => {
				console.error("Failed to render Mermaid diagram", error);
				if (!cancelled) {
					setHasError(true);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [chart, id, resolvedTheme]);

	if (hasError) {
		return <MermaidPlaceholder message="Diagram unavailable." />;
	}

	if (!result) {
		return <MermaidPlaceholder message="Loading diagram..." />;
	}

	return (
		<div
			ref={(container) => {
				if (container) result.bindFunctions?.(container);
			}}
			dangerouslySetInnerHTML={{ __html: result.svg }}
		/>
	);
}
