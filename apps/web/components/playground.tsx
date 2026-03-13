"use client";

import * as React from "react";
import { PlaygroundCode } from "@/components/playground-code";
import { PlaygroundSandbox } from "@/components/playground-sandbox";
import { getPatternExample } from "@/examples/patterns";
import {
	composePatternExampleDocument,
	getPatternExampleCodeTabs,
	type PatternExamplePresentation,
	PLAYGROUND_AUTO_RESIZE_SOURCE,
} from "@/examples/patterns/example";

const AUTO_HEIGHT_FALLBACK = 220;
const AUTO_HEIGHT_MIN = 140;

type PlaygroundResizeMessage = {
	source: string;
	frameId: string;
	height: number;
};

function isPlaygroundResizeMessage(
	data: unknown,
): data is PlaygroundResizeMessage {
	return (
		typeof data === "object" &&
		data !== null &&
		"source" in data &&
		"frameId" in data &&
		"height" in data &&
		typeof data.source === "string" &&
		typeof data.frameId === "string" &&
		typeof data.height === "number" &&
		Number.isFinite(data.height)
	);
}

export const Playground = ({
	patternType,
	pattern,
	example,
	height,
	mode = "preview",
	presentation = "auto",
}: {
	patternType: string;
	pattern: string;
	example: string;
	height?: string;
	mode?: "preview" | "sandbox";
	presentation?: PatternExamplePresentation | "auto";
}) => {
	const patternExample = getPatternExample(patternType, pattern, example);
	const previewIdentity = `${patternType}:${pattern}:${example}`;
	const frameId = React.useId();
	const fixedPreviewHeight = height ?? patternExample?.height;
	const sandboxHeight = fixedPreviewHeight ?? "650px";
	const isAutoHeight =
		patternExample !== null &&
		patternExample !== undefined &&
		mode === "preview" &&
		fixedPreviewHeight === undefined;
	const [autoHeight, setAutoHeight] = React.useState(AUTO_HEIGHT_FALLBACK);

	React.useEffect(() => {
		if (!isAutoHeight) {
			return;
		}

		void previewIdentity;
		setAutoHeight(AUTO_HEIGHT_FALLBACK);
	}, [isAutoHeight, previewIdentity]);

	React.useEffect(() => {
		if (!isAutoHeight) {
			return;
		}

		const handleMessage = (event: MessageEvent) => {
			if (!isPlaygroundResizeMessage(event.data)) {
				return;
			}

			if (event.data.source !== PLAYGROUND_AUTO_RESIZE_SOURCE) {
				return;
			}

			if (event.data.frameId !== frameId) {
				return;
			}

			setAutoHeight(Math.max(AUTO_HEIGHT_MIN, Math.ceil(event.data.height)));
		};

		window.addEventListener("message", handleMessage);
		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, [frameId, isAutoHeight]);

	if (!patternExample) {
		return null;
	}

	if (mode === "sandbox") {
		return (
			<PlaygroundSandbox example={patternExample} height={sandboxHeight} />
		);
	}

	const codeTabs = getPatternExampleCodeTabs(patternExample);
	const previewTitle =
		patternExample.title || `${patternType} ${pattern} ${example} preview`;
	const resolvedPresentation =
		presentation === "auto" ? patternExample.presentation : presentation;
	const srcDoc = composePatternExampleDocument(
		patternExample,
		isAutoHeight ? { autoResizeFrameId: frameId } : undefined,
	);
	const resolvedHeight = fixedPreviewHeight ?? `${autoHeight}px`;

	return (
		<div className="mt-6">
			<div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_28px_90px_-52px_rgba(15,23,42,0.45)]">
				<div className="flex items-center justify-between gap-4 border-b border-zinc-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] px-4 py-3">
					<div className="flex items-center gap-3">
						<div aria-hidden="true" className="flex items-center gap-1.5">
							<span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
							<span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
							<span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
						</div>
						<div className="grid gap-0.5">
							<span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
								Interactive Surface
							</span>
							<span className="text-sm font-semibold text-zinc-900">
								Live preview
							</span>
						</div>
					</div>

					<div className="hidden items-center gap-2 md:flex">
						<span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
							Product-like context
						</span>
						<span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
							Live
						</span>
					</div>
				</div>
				<iframe
					className="block w-full border-0 bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(255,255,255,0.98))]"
					sandbox="allow-scripts"
					srcDoc={srcDoc}
					style={{ height: resolvedHeight }}
					title={previewTitle}
				/>
			</div>

			<PlaygroundCode presentation={resolvedPresentation} tabs={codeTabs} />
		</div>
	);
};
