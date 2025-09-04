"use client";

import { ComponentPreview } from "@ux-patterns/ui/components/custom/registry/component-preview";
import React from "react";

// Create a context to pass metadata to components
const MetadataContext = React.createContext<any>(null);

// Enhanced ComponentPreview that uses metadata context
export const ComponentPreviewWithMetadata = (props: any) => {
	const metadata = React.useContext(MetadataContext);
	return <ComponentPreview {...props} pageMetadata={metadata} />;
};

// Provider component to wrap MDX content with metadata
export const MetadataProvider = ({
	children,
	metadata,
}: {
	children: React.ReactNode;
	metadata: any;
}) => {
	return (
		<MetadataContext.Provider value={metadata}>
			{children}
		</MetadataContext.Provider>
	);
};
