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
			<Button variant="solid">Solid</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="soft">Soft</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="link">Link</Button>
			<Button variant="danger">Danger</Button>
			<Button variant="success">Success</Button>
			<Button variant="warning">Warning</Button>
		</div>
	);
}
