/**
 * @registry
 * @name button-sizes
 * @title Button Sizes
 * @type registry:block
 * @description Button component showcasing different size variants
 * @categories ["buttons", "sizes", "variants"]
 * @tags ["sizes", "variants", "xs", "sm", "md", "lg", "responsive"]
 * @registryDependencies ["button"]
 */
import { Button } from "@/ui/button";

export default function ButtonSizes() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button size="xs">Extra Small</Button>
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	);
}
