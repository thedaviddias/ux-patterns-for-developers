import { DocsLayout } from "@ux-patterns/ui/components/custom/layout-notebook";
import type { ReactNode } from "react";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
	const { nav, ...base } = baseOptions();

	return (
		<DocsLayout
			{...base}
			nav={{ ...nav, mode: "top" }}
			tabMode="none"
			tree={source.pageTree}
			links={linkItems}
			themeSwitch={{ enabled: false }}
		>
			{children}
		</DocsLayout>
	);
}
