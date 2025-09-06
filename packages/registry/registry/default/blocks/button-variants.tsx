import { Button } from "../ui/button";

export default function ButtonVariants() {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<span className="text-sm font-medium">Default</span>
				<Button type="button">Default Button</Button>
			</div>

			<div className="space-y-2">
				<span className="text-sm font-medium">Secondary</span>
				<Button variant="secondary" type="button">
					Secondary Button
				</Button>
			</div>

			<div className="space-y-2">
				<span className="text-sm font-medium">Destructive</span>
				<Button variant="destructive" type="button">
					Destructive Button
				</Button>
			</div>

			<div className="space-y-2">
				<span className="text-sm font-medium">Outline</span>
				<Button variant="outline" type="button">
					Outline Button
				</Button>
			</div>

			<div className="space-y-2">
				<span className="text-sm font-medium">Ghost</span>
				<Button variant="ghost" type="button">
					Ghost Button
				</Button>
			</div>

			<div className="space-y-2">
				<span className="text-sm font-medium">Link</span>
				<Button variant="link">Link Button</Button>
			</div>
		</div>
	);
}
