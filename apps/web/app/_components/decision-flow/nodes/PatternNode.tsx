"use client";

import { Component } from "lucide-react";
import Link from "next/link";
import { Handle, Position } from "reactflow";
import type { NodeData } from "../types";

interface PatternNodeProps {
	data: NodeData;
	isConnectable: boolean;
}

export function PatternNode({ data, isConnectable }: PatternNodeProps) {
	return (
		<div className="px-4 py-2 shadow-lg rounded-md border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/80 dark:bg-indigo-900/30 backdrop-blur-sm">
			<Handle
				type="target"
				position={Position.Top}
				isConnectable={isConnectable}
				className="w-2 h-2 !bg-indigo-500"
			/>

			<div className="flex items-center gap-2">
				<Component className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
				{data.patternLink ? (
					<Link
						href={data.patternLink}
						className="text-sm font-medium text-indigo-700 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200 transition-colors"
					>
						{data.label}
					</Link>
				) : (
					<div className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
						{data.label}
					</div>
				)}
			</div>

			{data.description && (
				<div className="mt-2 text-xs text-indigo-600/80 dark:text-indigo-300/80">
					{data.description}
				</div>
			)}

			<Handle
				type="source"
				position={Position.Bottom}
				isConnectable={isConnectable}
				className="w-2 h-2 !bg-indigo-500"
			/>
		</div>
	);
}
