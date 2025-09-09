import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import type { ReactNode } from "react";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
	const { nav, ...base } = baseOptions();

	return (
		<DocsLayout
			{...base}
			nav={{ ...nav, mode: "top" }}
			tabMode="navbar"
			tree={source.pageTree}
			links={linkItems}
			themeSwitch={{ enabled: true, mode: "light-dark" }}
		>
			{children}
		</DocsLayout>
	);
}
