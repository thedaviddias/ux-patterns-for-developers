export default function ExamplesPage() {
	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8">UP Kit Registry</h1>

			<section>
				<h2 className="text-2xl font-semibold mb-4">Available Components</h2>
				<p className="text-muted-foreground mb-6">
					Components are installed via the shadcn CLI and added directly to your
					project.
				</p>

				<div className="space-y-4">
					<div className="border rounded-lg p-4">
						<h3 className="font-semibold mb-2">Button Component</h3>
						<p className="text-sm text-muted-foreground mb-3">
							A versatile button component with multiple variants and sizes.
						</p>
						<code className="bg-muted px-2 py-1 rounded text-sm">
							npx shadcn@latest add http://localhost:3065/r/button.json
						</code>
					</div>

					<div className="border rounded-lg p-4">
						<h3 className="font-semibold mb-2">Utils Library</h3>
						<p className="text-sm text-muted-foreground mb-3">
							Utility functions for class merging with Tailwind CSS.
						</p>
						<code className="bg-muted px-2 py-1 rounded text-sm">
							npx shadcn@latest add http://localhost:3065/r/utils.json
						</code>
					</div>
				</div>

				<div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
					<h3 className="font-semibold mb-2">How to Add Components</h3>
					<ol className="text-sm space-y-1 list-decimal list-inside">
						<li>
							Drop component files in{" "}
							<code>packages/registry/registry/default/</code>
						</li>
						<li>
							Run <code>pnpm registry:generate</code>
						</li>
						<li>
							Install with <code>npx shadcn@latest add [url]</code>
						</li>
					</ol>
				</div>
			</section>
		</div>
	);
}
