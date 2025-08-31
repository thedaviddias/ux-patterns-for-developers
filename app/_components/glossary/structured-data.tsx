import { JsonLd } from '@app/_components/json-ld';

interface GlossaryStructuredDataProps {
  term: string;
  definition: string;
  category: string[];
}

export function GlossaryStructuredData({
  term,
  definition,
  category,
}: GlossaryStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term,
    description: definition,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'UX Patterns Glossary',
      url: 'https://uxpatterns.dev/glossary',
    },
    termCode: category.join(','),
  };

  return <JsonLd data={structuredData} />;
}
