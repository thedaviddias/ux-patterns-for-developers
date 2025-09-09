"use client";

import { Panel, useReactFlow } from "@xyflow/react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { usePlausible } from "next-plausible";
import { TRACKING_EVENTS } from "@/lib/tracking";

interface DownloadButtonProps {
	title?: string;
}

const DownloadButton = ({
	title = "Decision Flow - UX Patterns for Devs",
}: DownloadButtonProps) => {
	const reactFlowInstance = useReactFlow();
	const plausible = usePlausible();

	const onClick = () => {
		// Track the download event
		plausible(TRACKING_EVENTS.DECISION_FLOW_DOWNLOAD, {
			props: {
				flow_title: title,
			},
		});
		// Store the current viewport state
		const currentViewport = reactFlowInstance.getViewport();

		// Get the viewport element
		const viewportElement = document.querySelector(
			".react-flow__viewport",
		) as HTMLElement;
		if (!viewportElement) return;

		// Get the flow wrapper element for dimensions
		const flowWrapper = document.querySelector(".react-flow") as HTMLElement;
		if (!flowWrapper) return;

		// Check if dark mode is active
		const isDarkMode = document.documentElement.classList.contains("dark");

		const rect = flowWrapper.getBoundingClientRect();

		toPng(viewportElement, {
			backgroundColor: isDarkMode ? "rgb(17 24 39)" : "rgb(255 255 255)",
			width: rect.width,
			height: rect.height,
			style: {
				width: `${rect.width}px`,
				height: `${rect.height}px`,
				transform: `translate(${currentViewport.x}px, ${currentViewport.y}px) scale(${currentViewport.zoom})`,
			},
			filter: (node) => {
				// Skip download button and controls in the image
				const className = node?.className?.toString() || "";
				return (
					!className.includes("download-btn") &&
					!className.includes("react-flow__controls")
				);
			},
		})
			.then((dataUrl) => {
				const a = document.createElement("a");
				a.setAttribute("download", `${title}${` - UX Patterns for Devs`}.png`);
				a.setAttribute("href", dataUrl);
				a.click();
			})
			.catch((err) => {
				console.error("Decision flow download failed", err);
				// Optionally: plausible(TRACKING_EVENTS.DECISION_FLOW_DOWNLOAD, { props: { flow_title: title, result: 'error' } });
			});
	};

	return (
		<Panel position="top-right" className="download-btn">
			<button
				type="button"
				onClick={onClick}
				className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 transition-colors"
			>
				<Download className="w-4 h-4" />
				Download as PNG
			</button>
		</Panel>
	);
};

export default DownloadButton;
