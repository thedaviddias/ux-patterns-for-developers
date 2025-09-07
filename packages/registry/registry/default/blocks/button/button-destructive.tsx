/**
 * @registry
 * @name button-destructive
 * @title Destructive Button
 * @type registry:block
 * @description Destructive button variant for dangerous actions
 * @categories ["buttons", "destructive-actions", "danger"]
 * @tags ["destructive", "danger", "delete", "warning", "red"]
 * @registryDependencies ["button"]
 */
import { Button } from "@/ui/button";

export default function ButtonDestructive() {
	return <Button variant="danger" type="button">Delete</Button>;
}
