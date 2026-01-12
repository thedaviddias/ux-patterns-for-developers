"use client";

import * as runtime from "react/jsx-runtime";
import { useEffect, useState, useMemo, useRef } from "react";
import { getMDXComponents } from "@/mdx-components";
import type { MDXComponents } from "mdx/types";

/**
 * MDX Content Component
 *
 * Renders compiled MDX content from Velite.
 * The body is a string of compiled JSX that needs to be evaluated.
 *
 * Velite compiles MDX to a function body format that uses dynamic imports,
 * which requires async evaluation with the proper baseUrl.
 */

interface MDXContentProps {
	/** Compiled MDX code from Velite */
	code: string;
	/** Additional components to merge with defaults */
	components?: MDXComponents;
}

// Create AsyncFunction constructor for evaluating async code
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

// Cache for evaluated MDX components to avoid re-evaluation on hot reload
const mdxCache = new Map<string, React.ComponentType<any>>();

/**
 * Preprocess MDX code to replace dynamic imports with component references
 * This handles the @/ alias which can't be resolved at runtime
 *
 * Velite compiles MDX imports to patterns like:
 * const{Playground:r}=await import(_resolveDynamicMdxSpecifier("@/components/playground"))
 */
function preprocessMdxCode(code: string, components: MDXComponents): string {
	// Create a list of available component names
	const componentNames = Object.keys(components);

	let processedCode = code;

	// Match patterns like: const{Playground:r}=await import(function(e){...}("@/components/playground"))
	// We need to replace these with: const{Playground:r}={Playground:_components.Playground}
	for (const name of componentNames) {
		// Pattern for any wrapper function (Velite's actual format)
		// Handles: const{Name:x}=await import(<anything>("<@/path>"))
		// Uses non-greedy .+? to match the wrapper function body
		const wrapperPattern = new RegExp(
			`const\\{${name}:(\\w+)\\}=await import\\(.+?\\(["']@\\/[^"']+["']\\)\\)`,
			'g'
		);
		processedCode = processedCode.replace(
			wrapperPattern,
			`const{${name}:$1}={${name}:_components.${name}}`
		);

		// Direct dynamic import: const{Name:x}=await import("@/...")
		const directImportPattern = new RegExp(
			`const\\{${name}:(\\w+)\\}=await import\\(["']@\\/[^"']+["']\\)`,
			'g'
		);
		processedCode = processedCode.replace(
			directImportPattern,
			`const{${name}:$1}={${name}:_components.${name}}`
		);
	}

	// Catch-all: Replace any remaining wrapper imports with empty object
	// Matches: await import(<anything>("@/..."))
	processedCode = processedCode.replace(
		/await import\(.+?\(["']@\/[^"']+["']\)\)/g,
		'({})'
	);

	// Catch-all: Replace direct @/ imports with empty object
	processedCode = processedCode.replace(
		/await import\(["']@\/[^"']+["']\)/g,
		'({})'
	);

	return processedCode;
}

/**
 * Evaluate and render MDX content
 */
export function MDXContent({ code, components = {} }: MDXContentProps) {
	// Check cache first to avoid loader flash on hot reload
	const cachedComponent = mdxCache.get(code);
	// Only use cached component if it's a valid function
	const validCachedComponent = typeof cachedComponent === 'function' ? cachedComponent : null;
	const [Component, setComponent] = useState<React.ComponentType<any> | null>(
		validCachedComponent
	);
	const [error, setError] = useState<Error | null>(null);
	const hasEvaluated = useRef(!!validCachedComponent);

	const mergedComponents = useMemo<MDXComponents>(
		() => ({
			...getMDXComponents(),
			...components,
		}),
		[components]
	);

	useEffect(() => {
		// Skip if we already have a cached component
		if (hasEvaluated.current && Component) return;

		let cancelled = false;

		async function evaluate() {
			try {
				// Preprocess code to handle @/ imports
				const processedCode = preprocessMdxCode(code, mergedComponents);

				// Create async function to evaluate MDX code with await support
				const fn = new AsyncFunction("runtime", "_components", processedCode);

				// Execute with runtime, components map, and baseUrl for any remaining dynamic imports
				const result = await fn(
					{
						...runtime,
						baseUrl: import.meta.url,
					},
					mergedComponents
				);

				if (!cancelled) {
					const comp = result.default || result;
					// Validate the component before caching
					if (typeof comp !== 'function') {
						console.error("MDX evaluation returned non-function:", typeof comp, comp);
						throw new Error(`MDX evaluation returned ${typeof comp} instead of a component function`);
					}
					mdxCache.set(code, comp);
					setComponent(() => comp);
					setError(null);
					hasEvaluated.current = true;
				}
			} catch (err) {
				if (!cancelled) {
					console.error("MDX evaluation error:", err);
					setError(err instanceof Error ? err : new Error(String(err)));
				}
			}
		}

		evaluate();

		return () => {
			cancelled = true;
		};
	}, [code, mergedComponents, Component]);

	if (error) {
		return (
			<div className="p-4 border border-red-500 rounded-md bg-red-50 dark:bg-red-950">
				<p className="text-red-600 dark:text-red-400 font-medium">
					Error rendering content
				</p>
				<pre className="text-sm text-red-500 mt-2 overflow-auto">
					{error.message}
				</pre>
			</div>
		);
	}

	if (!Component) {
		return (
			<div className="animate-pulse space-y-4">
				<div className="h-4 bg-muted rounded w-3/4" />
				<div className="h-4 bg-muted rounded w-1/2" />
				<div className="h-4 bg-muted rounded w-5/6" />
			</div>
		);
	}

	return <Component components={mergedComponents} />;
}

export default MDXContent;
