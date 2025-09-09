import Link from "next/link";
import React from "react";
import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	Breadcrumb as BreadcrumbRoot,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateBreadcrumbSchema } from "@/lib/breadcrumb-schema";
import { getBreadcrumbIcon } from "@/lib/icon-mapping";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/lib/url-utils";

interface BreadcrumbProps {
	items: BreadcrumbItemType[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
	// Generate JSON-LD schema
	const breadcrumbSchema = generateBreadcrumbSchema(items);
	// Get icon based on breadcrumb type and value
	const getIcon = (item: BreadcrumbItemType, index: number) => {
		// Parse the href to determine the type
		const segments = item.href.split("/").filter(Boolean);

		// Root (Gallery)
		if (index === 0 && item.label === "Gallery") {
			const Icon = getBreadcrumbIcon("root", "");
			return Icon ? <Icon size={16} aria-hidden="true" /> : null;
		}

		// Platform (Web/Mobile)
		if (
			segments.length === 1 &&
			(segments[0] === "web" || segments[0] === "mobile")
		) {
			const Icon = getBreadcrumbIcon("platform", segments[0]);
			return Icon ? <Icon size={16} aria-hidden="true" /> : null;
		}

		// Category
		if (segments.length === 2) {
			const Icon = getBreadcrumbIcon("category", segments[1]);
			return Icon ? <Icon size={16} aria-hidden="true" /> : null;
		}

		// Pattern
		if (segments.length === 3) {
			const Icon = getBreadcrumbIcon("pattern", segments[2]);
			return Icon ? <Icon size={16} aria-hidden="true" /> : null;
		}

		return null;
	};

	return (
		<>
			{/* JSON-LD Structured Data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbSchema)
						.replace(/</g, "\\u003c")
						.replace(/\u2028/g, "\\u2028")
						.replace(/\u2029/g, "\\u2029"),
				}}
			/>

			<BreadcrumbRoot>
				<BreadcrumbList>
					{items.map((item, index) => {
						const isLast = index === items.length - 1;
						const icon = getIcon(item, index);
						// Only hide text for the root Gallery item with home icon
						const hideText = index === 0 && item.label === "Gallery" && icon;

						return (
							<React.Fragment key={item.href}>
								<BreadcrumbItem>
									{isLast ? (
										<BreadcrumbPage className="inline-flex items-center gap-1.5">
											{icon}
											{!hideText && item.label}
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<Link
												href={item.href}
												className="inline-flex items-center gap-1.5"
											>
												{icon}
												{!hideText && item.label}
											</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
								{!isLast && <BreadcrumbSeparator />}
							</React.Fragment>
						);
					})}
				</BreadcrumbList>
			</BreadcrumbRoot>
		</>
	);
}
