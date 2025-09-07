import { Button } from "@/ui/button";

export default function ButtonFullWidth() {
	return (
		<div className="w-full max-w-md space-y-4">
			<Button wide>Full Width with Wide Prop</Button>
			<Button wide variant="outline">
				Full Width Outline
			</Button>
			<Button wide size="lg">
				Full Width Large
			</Button>
			<div className="space-y-2">
				<Button wide>Primary Action</Button>
				<Button wide variant="ghost">
					Secondary Action
				</Button>
			</div>
		</div>
	);
}
