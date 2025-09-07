/**
 * @registry
 * @name button-link
 * @title Link Button
 * @type registry:block
 * @description Link-styled button variant for navigation
 * @categories ["buttons", "variants", "navigation"]
 * @tags ["link", "variant", "navigation", "text", "minimal"]
 * @registryDependencies ["button"]
 */
import { Button } from "@/ui/button";

export default function ButtonLink() {
	return <Button variant="link">Link</Button>;
}
