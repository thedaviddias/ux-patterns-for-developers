import { BASE_URL } from '@app/_constants/project'

interface BreadcrumbItem {
  title: string
  url?: string
}

export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => {
      const isLastItem = index === breadcrumbs.length - 1
      const baseItem = {
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.title,
      }

      if (!isLastItem && crumb.url) {
        baseItem["item"] = `${BASE_URL}${crumb.url}`
      }

      return baseItem
    })
  }
}
