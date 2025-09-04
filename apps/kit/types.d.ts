// Comprehensive type declarations to fix fumadocs-mdx type inference issues in monorepo setups

// Override the problematic generated .source/index.ts types
declare module "@/.source" {
	export const docs: any;
}

// Override the generated .source/index.ts module completely
declare module "./.source/index" {
	export const docs: any;
}

// Override the relative import in the generated file
declare module "../source.config" {
	export const docs: any;
}

// Override the fumadocs-mdx runtime types
declare module "fumadocs-mdx" {
	export const _runtime: {
		docs: <T>(docs: any[], meta: any[]) => any;
	};
}

// Extend the fumadocs-core/source module to include the loader export
declare module "fumadocs-core/source" {
	export function loader(config: any): any;

	interface PageData {
		body: React.ComponentType<any>;
		title: string;
		description: string;
		toc: any;
		full: any;
	}
}

// Override the specific generated file path
declare module "/Users/thedaviddias/Projects/ux-patterns-for-developers/apps/kit/.source/index" {
	export const docs: any;
}

// Override the absolute path import
declare module "/Users/thedaviddias/Projects/ux-patterns-for-developers/apps/kit/source.config" {
	export const docs: any;
}
