"use client";

import {
	Background,
	ConnectionMode,
	Controls,
	type Edge,
	MarkerType,
	type Node,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import dagre from "dagre";
import { useCallback } from "react";
import "@xyflow/react/dist/style.css";
import "./flow-controls.css";

import DownloadButton from "./download-button";
import { ConsiderationNode } from "./nodes/ConsiderationNode";
import { PatternNode } from "./nodes/PatternNode";
import { QuestionNode } from "./nodes/QuestionNode";
import type { DecisionFlowProps } from "./types";

const nodeTypes = {
	question: QuestionNode,
	pattern: PatternNode,
	consideration: ConsiderationNode,
};

// Custom edge style
const edgeStyles = {
	stroke: "#6b7280", // gray-500
	strokeWidth: 2,
};

// Custom edge label style
const edgeLabelStyles = {
	fill: "#374151", // gray-700
	fontWeight: 500,
	fontSize: 12,
};

// Helper function to layout nodes using dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
	const dagreGraph = new dagre.graphlib.Graph();
	dagreGraph.setDefaultEdgeLabel(() => ({}));

	// Detect if this is the pagination vs infinite scroll flow
	const isPaginationFlow = nodes.some(
		(node) =>
			typeof node.data?.label === "string" &&
			(node.data.label.toLowerCase().includes("pagination") ||
				node.data.label.toLowerCase().includes("infinite scroll")),
	);

	// Set spacing based on flow type
	dagreGraph.setGraph({
		rankdir: "TB",
		ranksep: isPaginationFlow ? 150 : 75, // More space for pagination flow
		nodesep: isPaginationFlow ? 200 : 100, // More horizontal space for pagination
		edgesep: isPaginationFlow ? 100 : 50, // More edge space for pagination
	});

	// Adjust node size based on flow type
	nodes.forEach((node) => {
		dagreGraph.setNode(node.id, {
			width: isPaginationFlow ? 300 : 250,
			height: isPaginationFlow ? 120 : 100,
		});
	});

	edges.forEach((edge) => {
		dagreGraph.setEdge(edge.source, edge.target);
	});

	dagre.layout(dagreGraph);

	const layoutedNodes = nodes.map((node) => {
		const nodeWithPosition = dagreGraph.node(node.id);
		return {
			...node,
			position: {
				x: nodeWithPosition.x - 150, // Center node by subtracting half the width
				y: nodeWithPosition.y,
			},
		};
	});

	// Add styling to edges
	const styledEdges = edges.map((edge) => ({
		...edge,
		style: edgeStyles,
		labelStyle: edgeLabelStyles,
		labelBgStyle: {
			fill: "#ffffff", // white background for labels
			rx: 4, // rounded corners
			ry: 4,
		},
		labelBgPadding: [8, 4],
		labelBgBorderRadius: 4,
		type: "default", // Use smooth default edges instead of smoothstep
		// Add markerEnd configuration for arrows
		markerEnd: {
			type: MarkerType.ArrowClosed,
			width: 20,
			height: 20,
			color: "#6b7280", // gray-500 - same as edge stroke
		},
	})) as Edge[];

	return { nodes: layoutedNodes, edges: styledEdges };
};

export function DecisionFlow({
	nodes: initialNodes,
	edges: initialEdges,
	className = "",
	title,
}: DecisionFlowProps) {
	// Layout the nodes on first render
	const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
		initialNodes,
		initialEdges,
	);

	const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
	const [edges, , onEdgesChange] = useEdgesState(layoutedEdges);

	const onInit = useCallback(() => {
		// Any initialization logic
	}, []);

	return (
		<div className={`w-full h-[800px] ${className}`}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onInit={onInit}
				nodeTypes={nodeTypes}
				connectionMode={ConnectionMode.Strict}
				fitView
				fitViewOptions={{ minZoom: 0.8, maxZoom: 1.2, padding: 0.1 }}
				minZoom={0.5}
				maxZoom={1.5}
				defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
				attributionPosition="bottom-left"
			>
				<Background color="#9ca3af" gap={16} />
				<Controls
					className="!bg-white !border-gray-300 dark:!bg-gray-800 dark:!border-gray-600"
					showInteractive={false}
				/>
				<DownloadButton title={title} />
			</ReactFlow>
		</div>
	);
}
