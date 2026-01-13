import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineCollection, defineConfig, s } from "velite";

/**
 * Pattern status enum - matches existing status field values
 */
const patternStatus = s.enum(["complete", "draft", "coming-soon", "published"]);

/**
 * Pattern popularity enum - for displaying popularity badges
 */
const patternPopularity = s.enum(["low", "medium", "high", "trending"]);

/**
 * Step schema for HowTo structured data
 * Used in pattern frontmatter for instructional content
 */
const stepSchema = s.object({
	name: s.string(),
	text: s.string(),
	url: s.string().optional(),
	image: s.string().optional(),
});

/**
 * Main docs schema - migrated from source.config.ts
 * Covers patterns, glossary, and general pages
 */
const docs = defineCollection({
	name: "Doc",
	pattern: "content/**/*.mdx",
	schema: s
		.object({
			// Core fields
			title: s.string(),
			description: s.string().optional(),
			summary: s.string().optional(),

			// Status and publishing
			status: patternStatus.default("complete"),
			date: s.isodate().optional(),
			datePublished: s.isodate().optional(),
			dateModified: s.isodate().optional(),
			lastModified: s.isodate().optional(),
			publishedAt: s.isodate().optional(),
			lastMajorUpdate: s.isodate().optional(),

			// Metadata and organization
			icon: s.string().optional(),
			author: s.string().optional(),
			image: s.string().optional(),
			ogImage: s.string().optional(),
			tags: s.array(s.string()).optional(),
			keywords: s.array(s.string()).optional(),
			category: s.array(s.string()).optional(),
			hideFromNav: s.boolean().default(false),
			featured: s.boolean().default(false),

			// Pattern-specific fields
			aliases: s.array(s.string()).optional(),
			popularity: patternPopularity.optional(),

			// Content metadata
			thumbnail: s.string().optional(),

			// Instructional/educational fields
			steps: s.array(stepSchema).optional(),
			totalTime: s.string().optional(),
			educationalLevel: s.string().optional(),
			timeRequired: s.string().optional(),
			prerequisites: s.array(s.string()).optional(),

			// Component reference
			component: s.string().optional(),

			// Velite computed fields - MDX content, TOC, and metadata
			body: s.mdx(),
			toc: s.toc(),
			metadata: s.metadata(),
		})
		.transform((data, { meta }) => {
			// Compute slug from file path - handle both relative and absolute paths
			const filePath = meta.path;
			// Extract the relative path after 'content/'
			const contentIndex = filePath.indexOf("content/");
			const relativePath =
				contentIndex !== -1
					? filePath.substring(contentIndex + "content/".length)
					: filePath;

			const slug = relativePath
				.replace(/\.mdx$/, "")
				.replace(/\/index$/, "");

			// Compute URL
			const url = `/${slug}`;

			// Compute reading time from metadata (rough estimate: 200 words/min)
			const wordCount = data.metadata?.wordCount;
			const readTime = wordCount
				? `${Math.ceil(wordCount / 200)} min read`
				: undefined;

			return {
				...data,
				slug,
				slugAsParams: slug.split("/"),
				url,
				readTime,
			};
		}),
});

/**
 * Blog post schema - simpler than docs, focused on articles
 */
const blog = defineCollection({
	name: "BlogPost",
	pattern: "content/blog/*.mdx",
	schema: s
		.object({
			title: s.string(),
			description: s.string().optional(),
			author: s.string(),
			date: s.isodate(),
			image: s.string().optional(),
			tags: s.array(s.string()).optional(),
			// Velite computed fields
			body: s.mdx(),
			toc: s.toc(),
			metadata: s.metadata(),
		})
		.transform((data, { meta }) => {
			const filePath = meta.path;
			// Extract the relative path after 'content/blog/'
			const blogIndex = filePath.indexOf("content/blog/");
			const relativePath =
				blogIndex !== -1
					? filePath.substring(blogIndex + "content/blog/".length)
					: filePath;

			const slug = relativePath.replace(/\.mdx$/, "");

			// Compute reading time from metadata
			const wordCount = data.metadata?.wordCount;
			const readTime = wordCount
				? `${Math.ceil(wordCount / 200)} min read`
				: undefined;

			return {
				...data,
				slug,
				slugAsParams: slug,
				url: `/blog/${slug}`,
				readTime,
			};
		}),
});

/**
 * Meta collection for navigation structure
 * Parses meta.json files that define sidebar ordering
 */
const meta = defineCollection({
	name: "Meta",
	pattern: "content/**/meta.json",
	schema: s
		.object({
			title: s.string(),
			description: s.string().optional(),
			icon: s.string().optional(),
			root: s.boolean().optional(),
			pages: s.array(s.string()),
		})
		.transform((data, { meta: fileMeta }) => {
			// Extract the directory path from the meta.json location
			const filePath = fileMeta.path;
			const contentIndex = filePath.indexOf("content/");
			const relativePath =
				contentIndex !== -1
					? filePath.substring(contentIndex + "content/".length)
					: filePath;

			const dirPath = relativePath.replace(/\/meta\.json$/, "");

			return {
				...data,
				path: dirPath === "meta.json" ? "" : dirPath,
			};
		}),
});

export default defineConfig({
	root: ".",
	output: {
		data: ".velite",
		assets: "public/static",
		base: "/static/",
		name: "[name]-[hash:6].[ext]",
		clean: true,
	},
	collections: { docs, blog, meta },
	mdx: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			// Note: rehypeAutolinkHeadings is disabled because some MDX headings
			// contain links to glossary terms, and wrapping them in anchor links
			// causes invalid HTML nesting (<a> inside <a>)
			[
				rehypeShiki,
				{
					themes: {
						light: "github-light",
						dark: "github-dark",
					},
				},
			],
		],
	},
});
