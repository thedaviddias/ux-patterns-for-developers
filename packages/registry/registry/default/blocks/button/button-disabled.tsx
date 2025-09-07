import { Button } from "@/ui/button";

export default function ButtonDisabled() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button disabled>Default (ARIA Disabled)</Button>
			<Button disabled forceNativeDisabled>
				Force Native Disabled
			</Button>
			<Button state="disabled">State Disabled</Button>
			<Button variant="outline" disabled>
				Disabled Outline
			</Button>
		</div>
	);
}
