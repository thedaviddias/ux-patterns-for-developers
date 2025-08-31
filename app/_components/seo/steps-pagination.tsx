export function StepsPagination() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Implement Pagination',
    description:
      'Learn how to implement pagination in web applications with best practices for SEO, accessibility, and performance.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Wrap pagination controls in a container',
        text: 'Use a <nav> or <div> element to enclose pagination links.',
        url: 'https://uxpatterns.dev/en/patterns/navigation/pagination#anatomy',
      },
      {
        '@type': 'HowToStep',
        name: 'Ensure numbered page links are clickable',
        text: 'Provide interactive <a> or <button> elements for each page.',
        url: 'https://uxpatterns.dev/en/patterns/navigation/pagination#best-practices',
      },
      {
        '@type': 'HowToStep',
        name: 'Highlight the current page',
        text: "Use aria-current='page' and visual styling to indicate the active page.",
        url: 'https://uxpatterns.dev/en/patterns/navigation/pagination#accessibility',
      },
      {
        '@type': 'HowToStep',
        name: 'Optimize pagination for SEO',
        text: 'Use canonical tags, clean URLs, and prevent duplicate content issues.',
        url: 'https://uxpatterns.dev/en/patterns/navigation/pagination#seo',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
