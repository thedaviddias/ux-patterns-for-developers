import type { Edge, Node } from "reactflow";

export type NodeData = {
	label: string;
	description?: string;
	patternLink?: string;
};

export type DecisionNodeType =
	| "question" // Decision points
	| "pattern" // Pattern recommendations
	| "category" // Pattern categories
	| "consideration" // Important factors to consider
	| "comparison"; // Compare multiple patterns

export type DecisionNode = Node<NodeData> & {
	type: DecisionNodeType;
};

export type DecisionEdge = Edge & {
	label?: string;
};

export interface DecisionFlowProps {
	nodes: DecisionNode[];
	edges: DecisionEdge[];
	className?: string;
	title?: string; // Optional title for the download filename
}
