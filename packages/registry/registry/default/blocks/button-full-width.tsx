import { Button } from "../ui/button";

export default function ButtonFullWidth() {
	return (
		<div className="w-full max-w-md space-y-4">
			<div className="space-y-2">
				<span className="text-sm font-medium">Full Width Default</span>
				<Button className="w-full">Full Width Button</Button>
			</div>

			<div className="space-y-2">
				<span className="text-sm font-medium">Full Width Secondary</span>
				<Button variant="secondary" className="w-full">
					Secondary Full Width
				</Button>
			</div>

			<div className="space-y-2">
				<span className="text-sm font-medium">Full Width Outline</span>
				<Button variant="outline" className="w-full">
					Outline Full Width
				</Button>
			</div>

			<div className="space-y-2">
				<span className="text-sm font-medium">Full Width Large</span>
				<Button size="lg" className="w-full">
					Large Full Width Button
				</Button>
			</div>

			<div className="space-y-2">
				<span className="text-sm font-medium">Stacked Full Width</span>
				<div className="space-y-2">
					<Button className="w-full">Primary Action</Button>
					<Button variant="outline" className="w-full">
						Secondary Action
					</Button>
				</div>
			</div>
		</div>
	);
}
