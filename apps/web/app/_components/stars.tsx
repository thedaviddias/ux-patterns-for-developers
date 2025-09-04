'use client';

import { TRACKING_EVENTS } from '@app/_utils/tracking';
import { StarIcon } from 'lucide-react';
import { usePlausible } from 'next-plausible';
import { GitHubIcon } from 'nextra/icons';

type StarsProps = {
  variant?: 'default' | 'small';
  starsCount: number;
  asLink?: boolean;
};

export const Stars = ({ variant = 'default', starsCount, asLink = true }: StarsProps) => {
  const plausible = usePlausible();

  const content = (
    <>
      <GitHubIcon className="w-4 h-4" aria-hidden="true" />
      {variant === 'default' && <span className="hidden lg:inline">Star on GitHub</span>}
      <span className="inline-flex items-center px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100">
        <StarIcon className="w-4 h-4 mr-1" aria-hidden="true" />
        {starsCount}
      </span>
    </>
  );

  const className =
    '!no-underline inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-900 dark:text-neutral-100 rounded-lg border border-neutral-400 dark:border-neutral-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-200 dark:focus:ring-neutral-700';

  return (
    <div className="flex items-center justify-center gap-2">
      {asLink ? (
        <a
          href="https://github.com/thedaviddias/ux-patterns-for-developers"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => plausible(TRACKING_EVENTS.GITHUB_STAR_CLICK)}
          className={className}
          aria-label="Star on GitHub"
        >
          {content}
        </a>
      ) : (
        <span className={className}>{content}</span>
      )}
    </div>
  );
};
