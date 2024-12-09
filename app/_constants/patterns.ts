import { contentManagementPatterns } from './patterns/content-management'
import { formPatterns } from './patterns/forms'
import { navigationPatterns } from './patterns/navigation'
import { userFeedbackPatterns } from './patterns/user-feedback'

export const PATTERNS_MAP = {
  navigation: {
    name: 'Layout & Navigation',
    path: 'navigation'
  },
  forms: {
    name: 'Input & Forms',
    path: 'forms'
  },
  'content-management': {
    name: 'Content Management',
    path: 'content-management'
  },
  'user-feedback': {
    name: 'User Feedback',
    path: 'user-feedback'
  }
} as const



export const PATTERNS = {
  'Layout & Navigation': navigationPatterns,
  'Content Management': contentManagementPatterns,
  'User Feedback': userFeedbackPatterns,
  'Input & Forms': formPatterns
} as const


export type Pattern = {
  title: string
  description: string
  href?: string
  comingSoon?: boolean
}

export type Category = {
  name: string
  patterns: Pattern[]
}


export const getRandomPattern = (): Pattern | null => {
  const allPatterns = Object.values(PATTERNS).flatMap(category => [...category] as Pattern[]);
  const availablePatterns = allPatterns.filter(pattern => pattern.href);

  if (availablePatterns.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availablePatterns.length);
  const pattern = availablePatterns[randomIndex];
  if (!pattern) return null;

  return {
    title: pattern.title,
    description: pattern.description,
    href: pattern.href!
  };
};
