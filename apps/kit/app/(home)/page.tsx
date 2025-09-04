import Link from "next/link";

export default function HomePage() {
	return (
		<main className="flex flex-1 flex-col justify-center text-center">
			<h1 className="mb-4 text-2xl font-bold">UP Kit</h1>
			<p className="text-fd-muted-foreground mb-6">
				A component registry for UX patterns and UI components.
			</p>
			<div className="flex gap-4 justify-center">
				<Link
					href="/docs"
					className="text-fd-foreground font-semibold underline"
				>
					Documentation
				</Link>
				<Link
					href="/examples"
					className="text-fd-foreground font-semibold underline"
				>
					Examples
				</Link>
			</div>
		</main>
	);
}
