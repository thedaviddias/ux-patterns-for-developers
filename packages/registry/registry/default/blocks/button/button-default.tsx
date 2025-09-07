/**
 * @registry
 * @name button-default
 * @title Default Button
 * @type registry:block
 * @description Basic button with default styling and behavior
 * @categories ["buttons", "basic", "foundation"]
 * @tags ["default", "basic", "foundation", "simple"]
 * @registryDependencies ["button"]
 */
import { Button } from "@/ui/button";

export default function ButtonDefault() {
	return <Button>Default Button</Button>;
}
