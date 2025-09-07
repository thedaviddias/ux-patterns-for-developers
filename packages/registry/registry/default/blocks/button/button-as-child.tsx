/**
 * @registry
 * @name button-as-child
 * @title Polymorphic Button (asChild)
 * @type registry:block
 * @description Button component using the asChild pattern for custom elements
 * @categories ["buttons", "patterns", "composition"]
 * @tags ["asChild", "composition", "polymorphic", "links", "navigation"]
 * @registryDependencies ["button"]
 */
"use client";

import { Button } from "@/ui/button";
// import Link from "next/link"; // Uncomment when using Next.js Link example

export default function ButtonAsChild() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button asChild>
				<a href="#pricing" className="no-underline">
					View Pricing
				</a>
			</Button>
			<Button variant="outline" asChild>
				{/* Example with Next.js Link (uncomment and add the import above) */}
				{/* <Link href="/docs" className="no-underline"> */}
				<a href="#docs" className="no-underline">
					Documentation
				</a>
				{/* </Link> */}
			</Button>
			<Button variant="ghost" asChild>
				<a href="#about">About Us</a>
			</Button>
		</div>
	);
}
