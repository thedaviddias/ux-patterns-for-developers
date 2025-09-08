"use client";

import { Cpu, Gauge } from "lucide-react";
import { cn } from "@/lib/cn";

interface MetricData {
	label: string;
	value: number;
	status: "green" | "yellow" | "red";
	description: string;
}

interface PatternMetrics {
	pattern: string;
	initialLoad: MetricData;
	memoryUsage: MetricData;
}

interface PerformanceComparisonProps {
	patterns: PatternMetrics[];
}

const metricInfo = {
	initialLoad: {
		icon: Gauge,
		title: "Initial Load",
		description: "Time taken to load and display the first set of content",
	},
	memoryUsage: {
		icon: Cpu,
		title: "Memory Usage",
		description: "RAM consumption during normal usage",
	},
};

export function PerformanceComparison({
	patterns,
}: PerformanceComparisonProps) {
	const getStatusColor = (status: MetricData["status"]) => {
		switch (status) {
			case "green":
				return "text-green-600 dark:text-green-400";
			case "yellow":
				return "text-yellow-600 dark:text-yellow-400";
			case "red":
				return "text-red-600 dark:text-red-400";
		}
	};

	const getProgressColor = (status: MetricData["status"]) => {
		switch (status) {
			case "green":
				return "bg-green-600 dark:bg-green-400";
			case "yellow":
				return "bg-yellow-600 dark:bg-yellow-400";
			case "red":
				return "bg-red-600 dark:bg-red-400";
		}
	};

	return (
		<div className="mb-16">
			<h2 className="text-2xl font-bold mb-6">Performance Impact</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-gradient-to-b from-transparent to-neutral-50 dark:to-neutral-900">
					<div className="flex items-start gap-3">
						<div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
							<Gauge className="h-5 w-5 text-neutral-500" />
						</div>
						<div>
							<h3 className="text-lg font-medium mt-0">
								{metricInfo.initialLoad.title}
							</h3>
							<p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
								{metricInfo.initialLoad.description}
							</p>
						</div>
					</div>
					<div className="space-y-6">
						{patterns.map((pattern) => (
							<div key={`${pattern.pattern}-initial-load`}>
								<div className="flex justify-between mb-2">
									<span className="text-sm font-medium">{pattern.pattern}</span>
									<span
										className={cn(
											"text-sm font-medium",
											getStatusColor(pattern.initialLoad.status),
										)}
									>
										{pattern.initialLoad.description}
									</span>
								</div>
								<div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5">
									<div
										className={cn(
											"h-2.5 rounded-full transition-all duration-500",
											getProgressColor(pattern.initialLoad.status),
										)}
										style={{ width: `${pattern.initialLoad.value}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-gradient-to-b from-transparent to-neutral-50 dark:to-neutral-900">
					<div className="flex items-start gap-3">
						<div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
							<Cpu className="h-5 w-5 text-neutral-500" />
						</div>
						<div>
							<h3 className="text-lg font-medium mt-0">
								{metricInfo.memoryUsage.title}
							</h3>
							<p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
								{metricInfo.memoryUsage.description}
							</p>
						</div>
					</div>
					<div className="space-y-6">
						{patterns.map((pattern) => (
							<div key={`${pattern.pattern}-memory-usage`}>
								<div className="flex justify-between mb-2">
									<span className="text-sm font-medium">{pattern.pattern}</span>
									<span
										className={cn(
											"text-sm font-medium",
											getStatusColor(pattern.memoryUsage.status),
										)}
									>
										{pattern.memoryUsage.description}
									</span>
								</div>
								<div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5">
									<div
										className={cn(
											"h-2.5 rounded-full transition-all duration-500",
											getProgressColor(pattern.memoryUsage.status),
										)}
										style={{ width: `${pattern.memoryUsage.value}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
