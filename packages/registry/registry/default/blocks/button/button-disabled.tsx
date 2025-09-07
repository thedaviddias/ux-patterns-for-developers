/**
 * @registry
 * @name button-disabled
 * @title Disabled Button States
 * @type registry:block
 * @description Button in disabled states with different approaches
 * @categories ["buttons", "states", "accessibility"]
 * @tags ["disabled", "states", "accessibility", "aria", "interactive"]
 * @registryDependencies ["button"]
 */
import { Button } from "@/ui/button";

export default function ButtonDisabled() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button disabled>Default (ARIA Disabled)</Button>
			<Button disabled forceNativeDisabled>
				Force Native Disabled
			</Button>
			<Button state="disabled">State Disabled</Button>
			<Button variant="outline" disabled>
				Disabled Outline
			</Button>
		</div>
	);
}
