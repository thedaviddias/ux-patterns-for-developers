import { groupedCarouselExample } from './content-management/carousel/grouped';
import { tabbedCarouselExample } from './content-management/carousel/tabbed';
import { basicExpandableTextExample } from './content-management/expandable-text/basic';
import { basicModalExample } from './content-management/modal/basic';
import { nativeModalExample } from './content-management/modal/native';

export const examples = {
  'content-management': {
    carousel: {
      tabbed: tabbedCarouselExample,
      grouped: groupedCarouselExample,
    },
    'expandable-text': {
      basic: basicExpandableTextExample,
    },
    modal: {
      basic: basicModalExample,
      native: nativeModalExample,
    },
  },
} as const;

export type PatternType = keyof typeof examples;
export type PatternName<T extends PatternType> = keyof (typeof examples)[T];
export type ExampleName<
  T extends PatternType,
  P extends PatternName<T>,
> = keyof (typeof examples)[T][P];
