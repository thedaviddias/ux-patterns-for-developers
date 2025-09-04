import { Button } from "../ui/button";

export default function ButtonVariants() {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<h4 className="text-sm font-medium">Default</h4>
				<Button>Default Button</Button>
			</div>

			<div className="space-y-2">
				<h4 className="text-sm font-medium">Secondary</h4>
				<Button variant="secondary">Secondary Button</Button>
			</div>

			<div className="space-y-2">
				<h4 className="text-sm font-medium">Destructive</h4>
				<Button variant="destructive">Destructive Button</Button>
			</div>

			<div className="space-y-2">
				<h4 className="text-sm font-medium">Outline</h4>
				<Button variant="outline">Outline Button</Button>
			</div>

			<div className="space-y-2">
				<h4 className="text-sm font-medium">Ghost</h4>
				<Button variant="ghost">Ghost Button</Button>
			</div>

			<div className="space-y-2">
				<h4 className="text-sm font-medium">Link</h4>
				<Button variant="link">Link Button</Button>
			</div>
		</div>
	);
}
