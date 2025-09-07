/**
 * @registry
 * @name button-outline
 * @title Outline Button
 * @type registry:block
 * @description Outline button variant with border styling
 * @categories ["buttons", "variants", "outline"]
 * @tags ["outline", "variant", "border", "secondary"]
 * @registryDependencies ["button"]
 */
import { Button } from "@/ui/button";

export default function ButtonOutline() {
	return (
		<Button type="button" variant="outline">
			Outline
		</Button>
	);
}
