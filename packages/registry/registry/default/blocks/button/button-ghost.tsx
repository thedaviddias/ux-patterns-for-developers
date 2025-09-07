/**
 * @registry
 * @name button-ghost
 * @title Ghost Button
 * @type registry:block
 * @description Ghost button variant with subtle styling
 * @categories ["buttons", "variants", "subtle"]
 * @tags ["ghost", "variant", "subtle", "minimal", "transparent"]
 * @registryDependencies ["button"]
 */
import { Button } from "@/ui/button";

export default function ButtonGhost() {
	return (
		<Button type="button" variant="ghost">
			Ghost
		</Button>
	);
}
