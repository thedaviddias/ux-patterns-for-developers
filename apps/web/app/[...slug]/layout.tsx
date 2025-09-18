import { DocsLayout } from "@ux-patterns/ui/components/custom/layout-notebook";
import {
	TrackedLargeSearchToggle,
	TrackedSearchToggle,
} from "@ux-patterns/ui/components/custom/tracked-search-toggle";
import type { ReactNode } from "react";
import { baseOptions, linkItems } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { TRACKING_EVENTS } from "@/lib/tracking";

export default function Layout({ children }: { children: ReactNode }) {
	const { nav, ...base } = baseOptions();

	return (
		<DocsLayout
			{...base}
			nav={{ ...nav, mode: "top" }}
			tabMode="none"
			tree={source.pageTree}
			links={linkItems}
			sidebar={{ defaultOpenLevel: 2 }}
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
