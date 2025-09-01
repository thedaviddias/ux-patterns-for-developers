import { TRACKING_CLASSES } from '@app/_utils/tracking';
import { Star } from 'lucide-react';
import { getFeaturedPatternSSR } from '@/app/_utils/featured-pattern-session';
import type { Pattern } from '../_actions/patterns';
import { LinkCustom } from './link-custom';

const FeaturedPatternSection = ({ pattern }: { pattern: Pattern }) => {
  return (
    <div className="featured-pattern animate-fade-up flex flex-col mt-10 py-10 px-4 border border-neutral-400 dark:border-neutral-600 rounded-xl">
      <div
        className="absolute inset-0 bg-gradient-radial from-neutral-900/10 via-transparent to-transparent dark:bg-gradient-radial dark:from-neutral-500/10 dark:via-transparent dark:to-transparent
      "
      />
      <div className="relative">
        <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-400">
          <Star className="h-5 w-5" />
          <h2 className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
            Featured Pattern
          </h2>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          {pattern.title}
        </h3>
        <p className="mt-2 text-muted-foreground text-neutral-800 dark:text-neutral-100">
          {pattern.description}
        </p>
        <div className="mt-6 flex gap-4 text-neutral-800 dark:text-neutral-100">
          <LinkCustom
            href={`${pattern.href}`}
            variant="outline"
            size="xs"
            aria-label={`View pattern: ${pattern.title}`}
            className={TRACKING_CLASSES.VIEW_PATTERN_CLICK}
          >
            View Pattern
          </LinkCustom>
        </div>
      </div>
    </div>
  );
};

export const FeaturedPattern = async () => {
  const pattern = await getFeaturedPatternSSR('en');

  if (!pattern) {
    return null;
  }

  return <FeaturedPatternSection pattern={pattern} />;
};
