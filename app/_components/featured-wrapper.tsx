import { Suspense } from 'react';
import { FeaturedPattern } from './featured';

export function FeaturedPatternWrapper() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse h-48 bg-neutral-100 dark:bg-neutral-900 rounded-xl mt-10" />
      }
    >
      <FeaturedPattern />
    </Suspense>
  );
}
