import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
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
