import type { Pattern } from '../_utils/get-pattern-categories';

export const PATTERNS_MAP = {
  forms: {
    name: 'Input & Forms',
    path: 'forms',
    description:
      'Create user-friendly forms and input interfaces that streamline data collection and user interaction.',
  },
  navigation: {
    name: 'Layout & Navigation',
    path: 'navigation',
    description:
      'Guide users through your application with intuitive navigation patterns and clear layout structures.',
  },
  'content-management': {
    name: 'Content Management',
    path: 'content-management',
    description:
      'Organize and present content effectively with patterns for layout, structure, and information hierarchy.',
  },
  'data-display': {
    name: 'Data Display',
    path: 'data-display',
    description:
      'Present data effectively with tables, charts, timelines, and other visualization patterns.',
  },
  'user-feedback': {
    name: 'User Feedback',
    path: 'user-feedback',
    description:
      'Keep users informed and engaged with responsive feedback mechanisms and clear status indicators.',
  },
  authentication: {
    name: 'Authentication',
    path: 'authentication',
    description:
      'Secure user authentication patterns including login, registration, and account management.',
  },
  'ai-intelligence': {
    name: 'AI & Intelligence',
    path: 'ai-intelligence',
    description:
      'AI interaction patterns for chat interfaces, streaming responses, and intelligent features.',
  },
  media: {
    name: 'Media',
    path: 'media',
    description:
      'Media handling patterns for images, videos, and file uploads with rich interactions.',
  },
  'e-commerce': {
    name: 'E-commerce',
    path: 'e-commerce',
    description:
      'Shopping and transaction patterns including product displays, carts, and checkout flows.',
  },
  social: {
    name: 'Social',
    path: 'social',
    description: 'Social interaction patterns for comments, likes, sharing, and user engagement.',
  },
  advanced: {
    name: 'Advanced',
    path: 'advanced',
    description:
      'Advanced UI patterns for power users including search, wizards, and command interfaces.',
  },
} as const;

export type Category = {
  name: string;
  patterns: Pattern[];
};

export const getRandomPattern = async (locale: string = 'en'): Promise<Pattern | null> => {
  const { getPatternCategories } = await import('../_utils/get-pattern-categories');
  const categories = await getPatternCategories(locale);

  const allPatterns = categories.flatMap((category) => category.patterns);
  const availablePatterns = allPatterns.filter(
    (pattern) => pattern.href && pattern.status !== 'coming-soon'
  );

  if (availablePatterns.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availablePatterns.length);
  const pattern = availablePatterns[randomIndex];

  return pattern || null;
};
