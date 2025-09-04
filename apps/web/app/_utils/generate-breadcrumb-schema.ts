import { BASE_URL } from '@app/_constants/project';

interface BreadcrumbItem {
  title: string;
  url?: string;
}

export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  // Extract language code from the first breadcrumb that has a URL with language
  const langMatch = breadcrumbs.find((crumb) => crumb.url)?.url?.match(/^\/([a-z]{2})\//);
  const lang = langMatch ? langMatch[1] : 'en'; // Default to 'en' if no language found

  // Ensure home page is always first in the breadcrumb with correct language
  const homePage: BreadcrumbItem = {
    title: 'Home',
    url: `/${lang}`,
  };

  // Filter breadcrumbs based on the section
  const filteredBreadcrumbs = breadcrumbs.reduce((acc: BreadcrumbItem[], crumb, index) => {
    // Always keep the main section (patterns, pattern-guide, etc.)
    if (crumb.url?.match(/^\/[a-z]{2}\/[^/]+$/)) {
      acc.push(crumb);
      return acc;
    }

    // For the patterns section, skip category level
    if (crumb.url?.includes('/patterns/')) {
      // If it's the last item, keep it
      if (index === breadcrumbs.length - 1) {
        acc.push(crumb);
      }
      return acc;
    }

    // For all other sections, keep everything
    acc.push(crumb);
    return acc;
  }, []);

  // Combine home page with filtered breadcrumbs
  const fullBreadcrumbs = [homePage, ...filteredBreadcrumbs];

  if (fullBreadcrumbs.length === 0) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullBreadcrumbs.map((crumb, index) => {
      const isLastItem = index === fullBreadcrumbs.length - 1;
      const baseItem: Record<string, unknown> = {
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.title,
      };

      if (!isLastItem && crumb.url) {
        baseItem.item = `${BASE_URL}${crumb.url}`;
      }

      return baseItem;
    }),
  };
}
