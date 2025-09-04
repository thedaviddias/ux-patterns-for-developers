import { cn } from '@/app/_utils/cn';
import {
  getPatternAssistantPages,
  type PatternAssistantPage,
} from '@/app/_utils/get-pattern-assistant';
import { LinkCustom } from '../link-custom';

type PatternAssistantCardProps = {
  page: PatternAssistantPage;
};

export const PatternAssistantGrid = async ({ lang }: { lang: string }) => {
  const pages = await getPatternAssistantPages(lang);

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">Pattern Decision Flows</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <PatternAssistantCard key={page.title} page={page} />
        ))}
      </div>
    </div>
  );
};

const PatternAssistantCard = ({ page }: PatternAssistantCardProps) => {
  const wrapperClasses = cn(
    'relative rounded-xl border border-neutral-200 dark:border-neutral-800',
    'border-neutral-400 dark:border-neutral-600 hover:bg-neutral-100 hover:border-neutral-200 dark:hover:bg-neutral-900 dark:hover:border-neutral-400 hover:scale-105 transition-all duration-100 ease-in-out'
  );

  return (
    <div className={wrapperClasses}>
      <LinkCustom href={page.href} className="!no-underline w-full" icon={false}>
        <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl p-5 transition-all duration-300 hover:animate-card-hover cursor-pointer">
          <div className="flex items-center justify-between">
            {page.icon && <page.icon className="h-8 w-8 text-primary" />}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-foreground">{page.title}</h3>
            </div>
            <p className="mb-3 text-sm text-foreground leading-6">{page.summary}</p>
          </div>
        </div>
      </LinkCustom>
    </div>
  );
};
