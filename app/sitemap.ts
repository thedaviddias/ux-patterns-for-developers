import { readdirSync, statSync } from "fs";
import { MetadataRoute } from "next";
import { join } from "path";
import { BASE_URL } from "./_constants/project";
import { i18n } from "./_dictionaries/i18n-config";

function getContentPages(dir: string, baseDir: string = ''): string[] {
  const pages: string[] = [];

  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip hidden directories and _meta files
        if (!item.startsWith('_')) {
          pages.push(...getContentPages(fullPath, join(baseDir, item)));
        }
      } else if (item.endsWith('.mdx') && !item.startsWith('_')) {
        // Remove .mdx extension and index becomes empty string
        const pagePath = item === 'index.mdx'
          ? baseDir
          : join(baseDir, item.replace('.mdx', ''));
        pages.push(pagePath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return pages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Generate routes for each language
  for (const locale of i18n.locales) {
    const contentDir = join(process.cwd(), 'content', locale);
    const pages = getContentPages(contentDir);

    // Add routes for this language
    pages.forEach(page => {
      routes.push({
        url: `${BASE_URL}/${locale}${page ? `/${page}` : ''}`,
        lastModified: new Date(),
        changeFrequency: page.includes('docs') ?
          "weekly" :
          "monthly",
        priority: getPriority(page),
      });
    });
  }

  // Add the root URL that redirects to default locale
  routes.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  });

  return routes;
}

function getPriority(path: string): number {
  if (!path) return 1; // Homepage
  if (path === 'docs/getting-started') return 0.9;
  if (path.startsWith('docs/')) return 0.8;
  return 0.5; // Other pages
}
