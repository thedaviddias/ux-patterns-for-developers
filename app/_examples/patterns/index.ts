import { groupedCarouselExample } from './content-management/carousel/grouped';
import { tabbedCarouselExample } from './content-management/carousel/tabbed';

export const examples = {
  'content-management': {
    carousel: {
      tabbed: tabbedCarouselExample,
      grouped: groupedCarouselExample,
    },
  },
} as const;

export type PatternType = keyof typeof examples;
export type PatternName<T extends PatternType> = keyof typeof examples[T];
export type ExampleName<T extends PatternType, P extends PatternName<T>> = keyof typeof examples[T][P];
