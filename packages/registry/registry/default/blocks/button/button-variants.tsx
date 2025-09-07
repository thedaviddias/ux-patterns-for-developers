/**
 * @registry
 * @name button-variants
 * @title Button Variants Showcase
 * @type registry:block
 * @description Button component showcasing all available style variants
 * @categories ["buttons", "variants", "showcase"]
 * @tags ["variants", "showcase", "solid", "outline", "ghost", "link", "danger", "success", "warning"]
 * @registryDependencies ["button"]
 */
import { Button } from "@/ui/button";

export default function ButtonVariants() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button variant="solid" type="button">Solid</Button>
			<Button variant="outline" type="button">Outline</Button>
			<Button variant="soft" type="button">Soft</Button>
			<Button variant="ghost" type="button">Ghost</Button>
			<Button variant="link" type="button">Link</Button>
			<Button variant="danger" type="button">Danger</Button>
			<Button variant="success" type="button">Success</Button>
			<Button variant="warning" type="button">Warning</Button>
		</div>
	);
}
