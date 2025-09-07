/**
 * @registry
 * @name button-full-width
 * @title Full-Width Buttons
 * @type registry:block
 * @description Button with full width styling for prominent actions
 * @categories ["buttons", "layout", "full-width"]
 * @tags ["full-width", "wide", "layout", "prominent", "mobile"]
 * @registryDependencies ["button"]
 */
import { Button } from "@/ui/button";

export default function ButtonFullWidth() {
	return (
		<div className="w-full max-w-md space-y-4">
			<Button wide type="button">Full Width with Wide Prop</Button>
			<Button wide variant="outline" type="button">
				Full Width Outline
			</Button>
			<Button wide size="lg" type="button">
				Full Width Large
			</Button>
			<div className="space-y-2">
				<Button wide type="button">Primary Action</Button>
				<Button wide variant="ghost" type="button">
					Secondary Action
				</Button>
			</div>
		</div>
	);
}
