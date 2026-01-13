/**
 * Data for the pagination-vs-infinite-scroll pattern guide
 */

export const comparisonData = {
  patterns: [
    {
      title: "Pagination",
      href: "/patterns/navigation/pagination",
      criteria: [
        "SEO is critical",
        "Users need to bookmark specific pages",
        "Content is structured and searchable",
        "Memory usage is a concern",
      ],
    },
    {
      title: "Infinite Scroll",
      href: "/patterns/navigation/infinite-scroll",
      criteria: [
        "Content is discovery-focused",
        "Mobile is the primary platform",
        "User engagement is key",
        "Content flow should be seamless",
      ],
    },
  ],
};

export const performanceData = {
  patterns: [
    {
      pattern: "Pagination",
      initialLoad: {
        label: "Initial Load",
        value: 80,
        status: "green",
        description: "Faster",
      },
      memoryUsage: {
        label: "Memory Usage",
        value: 90,
        status: "green",
        description: "Efficient",
      },
    },
    {
      pattern: "Infinite Scroll",
      initialLoad: {
        label: "Initial Load",
        value: 60,
        status: "yellow",
        description: "Moderate",
      },
      memoryUsage: {
        label: "Memory Usage",
        value: 40,
        status: "red",
        description: "Heavy",
      },
    },
  ],
};

export const examplesData = {
  examples: [
    {
      pattern: "Pagination",
      examples: [
        {
          title: "Google Search Results",
          description: "Classic pagination for search results",
          imageUrl: "/examples/google-search-pagination.webp",
        },
        {
          title: "Amazon Product Listings",
          description: "E-commerce product navigation",
          imageUrl: "/examples/amazon-pagination.webp",
        },
      ],
    },
    {
      pattern: "Infinite Scroll",
      examples: [
        {
          title: "Pinterest Board",
          description: "Visual content discovery",
          imageUrl: "/examples/pinterest-infinite.gif",
        },
      ],
    },
  ],
};
