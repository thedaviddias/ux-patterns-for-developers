"use client";

import React from "react";

interface PageMetadata {
	title?: string;
	description?: string;
	[key: string]: unknown;
}

// Create a context to pass metadata to components
const MetadataContext = React.createContext<PageMetadata | null>(null);

// Enhanced ComponentPreview that uses metadata context
export const ComponentPreviewWithMetadata = (
	props: React.ComponentProps<any>,
) => {
	const _metadata = React.useContext(MetadataContext);
	return <>{props.children}</>;
};

// Provider component to wrap MDX content with metadata
export const MetadataProvider = ({
	children,
	metadata,
}: {
	children: React.ReactNode;
	metadata: PageMetadata;
}) => {
	return (
		<MetadataContext.Provider value={metadata}>
			{children}
		</MetadataContext.Provider>
	);
};
