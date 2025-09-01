'use client';

import { useId } from 'react';
import { PROJECT_URL } from '@/app/_constants/project';
import { TRACKING_CLASSES } from '@app/_utils/tracking';
import { LinkCustom } from './link-custom';

export const SuggestPattern = () => {
  const suggestPatternTitleId = useId();

  return (
    <section
      className="flex flex-col mt-10 items-center justify-center py-10 px-4 text-center border border-neutral-400 dark:border-neutral-600 rounded-xl"
      aria-labelledby={suggestPatternTitleId}
    >
      <h2 id={suggestPatternTitleId} className="text-2xl font-bold mb-5 text-foreground">
        Got a pattern request?
      </h2>
      <p className="text-lg text-muted-foreground mb-6">Let us know, and we&apos;ll add it!</p>
      <LinkCustom
        href={`${PROJECT_URL}/discussions/new?category=suggestions`}
        aria-label="Suggest a pattern on GitHub"
        className={TRACKING_CLASSES.SUGGEST_PATTERN_CLICK}
        variant="outline"
      >
        Send Suggestion
      </LinkCustom>
    </section>
  );
};
