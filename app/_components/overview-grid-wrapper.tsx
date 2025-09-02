import { Suspense } from 'react';
import { OverviewGrid } from './sections/overview-grid';

export function OverviewGridWrapper({ lang }: { lang: string }) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-10 my-10">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-8 bg-neutral-100 dark:bg-neutral-900 rounded w-48 mb-5" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-32 bg-neutral-100 dark:bg-neutral-900 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    >
      <OverviewGrid lang={lang} />
    </Suspense>
  );
}
