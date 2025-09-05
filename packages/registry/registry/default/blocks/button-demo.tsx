import { Button } from "../ui/button";

export default function ButtonDemo() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button>Default</Button>
			<Button type="button" variant="secondary">
				Secondary
			</Button>
			<Button type="button" variant="destructive">
				Destructive
			</Button>
			<Button type="button" variant="outline">
				Outline
			</Button>
			<Button type="button" variant="ghost">
				Ghost
			</Button>
			<Button variant="link">Link</Button>
		</div>
	);
}
