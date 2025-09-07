/**
 * @registry
 * @name button-link
 * @title Link Button
 * @type registry:block
 * @description Link-styled button variant. For navigation, prefer using asChild with an <a> element to preserve link semantics and accessibility.
 * @categories ["buttons", "variants", "navigation"]
 * @tags ["link", "variant", "navigation", "text", "minimal"]
 * @registryDependencies ["button"]
 */
import { Button } from "@/ui/button";

export default function ButtonLink() {
	return (
		<Button variant="link" asChild>
			<a href="#">Link</a>
		</Button>
	);
}
