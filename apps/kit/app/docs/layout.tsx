import {
	TrackedLargeSearchToggle,
	TrackedSearchToggle,
} from "@ux-patterns/ui/components/custom/tracked-search-toggle";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { TRACKING_EVENTS } from "@/lib/tracking";

export default function Layout({ children }: LayoutProps<"/docs">) {
	const {
		githubStars: _githubStars,
		nav,
		wide: _wide,
		...base
	} = baseOptions();

	return (
		<DocsLayout
			{...base}
			nav={{ ...nav, mode: "top" }}
			tabMode="navbar"
			tree={source.pageTree}
			links={linkItems}
			themeSwitch={{ enabled: false }}
			searchToggle={{
				enabled: true,
				components: {
					lg: (
						<TrackedLargeSearchToggle
							trackingEvent={TRACKING_EVENTS.SEARCH_OPEN}
						/>
					),
					sm: (
						<TrackedSearchToggle trackingEvent={TRACKING_EVENTS.SEARCH_OPEN} />
					),
				},
			}}
		>
			{children}
		</DocsLayout>
	);
}
