/**
 * @registry
 * @name button-soft
 * @title Soft Button
 * @type registry:block
 * @description Soft button variant with subtle background
 * @categories ["buttons", "variants", "soft"]
 * @tags ["soft", "variant", "subtle", "background", "muted"]
 * @registryDependencies ["button"]
 */
import { Button } from "@/ui/button";

export default function ButtonSoft() {
	return <Button variant="soft">Soft</Button>;
}
