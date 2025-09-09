"use client";

import { DecisionFlow } from "@/components/decision-flow";
import type {
	DecisionEdge,
	DecisionNode,
} from "@/components/decision-flow/types";

interface DecisionFlowSectionProps {
	title: string;
	nodes: DecisionNode[];
	edges: DecisionEdge[];
}

export function DecisionFlowSection({
	title,
	nodes,
	edges,
}: DecisionFlowSectionProps) {
	return (
		<div className="mb-16">
			<h2 className="text-2xl font-bold mb-6">Interactive Decision Flow</h2>
			<div className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 p-8">
				<DecisionFlow
					nodes={nodes}
					edges={edges}
					className="rounded-xl"
					title={title}
				/>
			</div>
		</div>
	);
}
