# @ux-patterns/seo

Unified SEO package for the UX Patterns monorepo. Provides standardized metadata generation, structured data helpers, sitemap builders, and OpenGraph utilities.

## Features

- 🎯 **Metadata Management** - Consistent metadata generation across all apps
- 📊 **Structured Data** - JSON-LD schema generators for rich snippets
- 🗺️ **Sitemap Builder** - Flexible sitemap generation with priority rules
- 🤖 **Robots.txt Builder** - SEO-friendly robots configuration
- 🖼️ **OpenGraph Helpers** - Utilities for Next.js file-based OG images
- 📝 **TypeScript Support** - Full type safety for all configurations

## Installation

This package is used internally within the monorepo and doesn't require separate installation.

## Usage

### Metadata Generation

```typescript
import { MetadataGenerator } from "@ux-patterns/seo/metadata";

const metaGenerator = new MetadataGenerator({
  site: {
    name: "UX Patterns",
    description: "UX patterns for developers",
    url: "https://uxpatterns.dev",
    author: "David Dias",
  },
  defaults: {
    openGraph: {
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
    },
  },
});

// Generate page metadata
export async function generateMetadata() {
  return metaGenerator.generate({
    title: "Page Title",
    description: "Page description",
    path: "/page-path",
    image: "/og-image.png",
  });
}
```

### Structured Data

```typescript
import { StructuredDataGenerator } from "@ux-patterns/seo/structured-data";

const structuredData = new StructuredDataGenerator({
  baseUrl: "https://uxpatterns.dev",
  organizationName: "UX Patterns",
  authorName: "David Dias",
});

// Generate Article schema
const articleSchema = structuredData.article({
  headline: "Article Title",
  description: "Article description",
  url: "/blog/article",
  datePublished: "2024-01-01",
});

// Generate Breadcrumbs
const breadcrumbs = structuredData.breadcrumbs([
  { name: "Home", url: "/" },
  { name: "Blog", url: "/blog" },
  { name: "Article" },
]);
```

### Sitemap Generation

```typescript
import { SitemapBuilder } from "@ux-patterns/seo/sitemap";

export default function sitemap() {
  const builder = new SitemapBuilder("https://uxpatterns.dev");
  
  return builder
    .addStaticPages(["/", "/about", "/blog"])
    .addDynamicPages(contentPages, 
      (path) => path.startsWith("/patterns") ? 0.8 : 0.5,
      (path) => path.includes("blog") ? "weekly" : "monthly"
    )
    .sort()
    .build();
}
```

### Robots.txt Configuration

```typescript
import { createSEORobots } from "@ux-patterns/seo/robots";

export default function robots() {
  return createSEORobots("https://uxpatterns.dev", {
    disallowPaths: ["/admin", "/private"],
    blockBadBots: true,
    crawlDelay: 1,
  });
}
```

### OpenGraph Image Helpers

The package provides utilities to support Next.js file-based OpenGraph image generation:

```typescript
// app/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { createOGImageMetadata, createPatternOGImage } from "@ux-patterns/seo/opengraph-helpers";

export const runtime = "edge";
export const { alt, size, contentType } = createOGImageMetadata({
  alt: "UX Patterns",
  size: "standard", // 1200x630
});

export default async function Image() {
  const element = createPatternOGImage({
    title: "UX Patterns for Developers",
    description: "Learn UX patterns to build better interfaces",
    subtitle: "Design Better",
    pattern: "dots",
    theme: "light",
  });
  
  return new ImageResponse(element, { ...size });
}
```

## API Reference

### Types

- `BaseMetadataConfig` - Base metadata configuration
- `PageMetadataConfig` - Page-specific metadata options
- `StructuredDataConfig` - Structured data generator config
- `SitemapEntry` - Individual sitemap entry
- `RobotsConfig` - Robots.txt configuration
- `OGImageConfig` - OpenGraph image configuration

### Metadata

- `MetadataGenerator` - Main class for metadata generation
- `createBaseMetadata()` - Create base metadata config
- `mergeMetadata()` - Merge page metadata with base
- `generatePageMetadata()` - Generate page-specific metadata

### Structured Data

- `StructuredDataGenerator` - Main class for schema generation
- Schema generators: `organization()`, `website()`, `person()`, `article()`, `blogPost()`, `breadcrumbs()`, `faq()`, `howTo()`, `itemList()`, `course()`
- `combineSchemas()` - Combine multiple schemas
- `renderJsonLd()` - Render JSON-LD for Next.js

### Sitemap

- `SitemapBuilder` - Main class for sitemap building
- `PriorityCalculator` - Calculate priorities based on patterns
- `ChangeFrequencyCalculator` - Calculate change frequencies
- `generateSitemapFromContent()` - Generate from content structure

### Robots

- `RobotsBuilder` - Main class for robots.txt building
- `createStandardRobots()` - Create standard configuration
- `createSEORobots()` - Create SEO-optimized configuration
- `createDevRobots()` - Create development configuration (blocks all)
- `isPathAllowed()` - Check if path is allowed by rules

### OpenGraph Helpers

- `createOGImageMetadata()` - Create metadata for OG images
- `createOGImageTemplate()` - Base template for OG images
- `createGradientOGImage()` - Gradient background template
- `createPatternOGImage()` - Pattern background template
- `generateOGImage()` - Generate ImageResponse
- `OG_FONTS` - Pre-configured font loaders
- `validateOGImage()` - Validate OG image requirements

## Best Practices

1. **Use the MetadataGenerator class** for consistent metadata across pages
2. **Include structured data** on all content pages for rich snippets
3. **Generate dynamic sitemaps** that reflect your content structure
4. **Configure robots.txt** to guide search engines effectively
5. **Use Next.js file convention** for OpenGraph images (opengraph-image.tsx)
6. **Validate OpenGraph images** to ensure they meet platform requirements

## Notes

- This package uses direct TypeScript imports (no build step required)
- OpenGraph image generation uses Next.js file-based convention
- All URLs are automatically normalized and made absolute
- Structured data follows Schema.org specifications