"use client";

import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, Filter, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterDropdownProps {
	value: string;
	onValueChange: (value: string) => void;
	placeholder: string;
	label: string;
	displayValue?: string;
	items: Array<{
		value: string;
		label: string;
	}>;
	className?: string;
}

export function FilterDropdown({
	value,
	onValueChange,
	placeholder,
	label,
	displayValue,
	items,
	className,
}: FilterDropdownProps) {
	const handleClearClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onValueChange("all");
	};

	return (
		<Select.Root value={value} onValueChange={onValueChange}>
			<Select.Trigger
				className={cn(
					"flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-fd-primary relative",
					value
						? "bg-fd-foreground text-fd-background hover:bg-fd-foreground/90"
						: "bg-fd-card border border-fd-border hover:bg-fd-muted py-2",
					className,
				)}
				asChild
			>
				<button type="button">
					{!value && <Filter className="w-4 h-4" />}
					<span className="flex-1 text-left">
						{value ? displayValue || `${label}: ${value}` : placeholder}
					</span>
					{value ? (
						<button
							type="button"
							onClick={handleClearClick}
							className="p-0.5"
							aria-label={`Clear ${label} filter`}
						>
							<XCircle className="w-3.5 h-3.5" />
						</button>
					) : (
						<ChevronDownIcon className="w-4 h-4" />
					)}
				</button>
			</Select.Trigger>

			<Select.Portal>
				<Select.Content
					className="bg-fd-card border border-fd-border rounded-lg shadow-lg z-50"
					position="popper"
					sideOffset={5}
				>
					<Select.Viewport className="p-1">
						{items.map((item) => (
							<Select.Item
								key={item.value}
								value={item.value}
								className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-fd-muted cursor-pointer focus:bg-fd-muted focus:outline-none"
							>
								<Select.ItemText>{item.label}</Select.ItemText>
							</Select.Item>
						))}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}
