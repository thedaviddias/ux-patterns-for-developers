import { cn } from '@/app/_utils/cn'
import { Pattern } from '@/app/_utils/get-pattern-categories'
import { getPatterns } from '@app/_utils/get-patterns'

import { LinkCustom } from '../link-custom'
import { Badge } from '../ui/badge'


export type PatternWrapperProps = {
  pattern: Pattern
}

export const OverviewGrid = async ({ lang }: { lang: string }) => {
  const categories = await getPatterns(lang)

  return (
    <div className="space-y-10 my-10">
      {categories.map((category) => (
        <div key={category.name}>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-foreground">
              {category.name}
            </h2>
            <p className="mt-2 text-muted-foreground text-sm">
              {category.description}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {category.patterns.map((pattern) => (
              <PatternWrapper key={pattern.title} pattern={pattern} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export const PatternWrapper = ({ pattern }: PatternWrapperProps) => {
  const wrapperClasses = cn(
    "relative rounded-xl border border-neutral-200 dark:border-neutral-800",
    pattern.status !== 'coming-soon' && "border-neutral-400 dark:border-neutral-600 hover:bg-neutral-100 hover:border-neutral-200 dark:hover:bg-neutral-900 dark:hover:border-neutral-400 hover:scale-105 transition-all duration-100 ease-in-out"
  )

  const content = <PatternContent pattern={pattern} />

  return (
    <div className={wrapperClasses}>
      {pattern.status !== 'coming-soon' ? (
        <LinkCustom
          href={pattern.href}
          className="!no-underline w-full"
          icon={false}
        >
          {content}
        </LinkCustom>
      ) : content}
    </div>
  )
}

const PatternContent = ({ pattern }: PatternWrapperProps) => (
  <div className={cn(
    "relative flex flex-col gap-4 overflow-hidden rounded-xl p-5 transition-all duration-300",
    pattern.status !== 'coming-soon' ? "hover:animate-card-hover cursor-pointer" : "opacity-60 cursor-not-allowed"
  )}>

    <div className="flex items-center justify-between">
      {pattern.icon && <pattern.icon className="h-8 w-8 text-primary" />}
      {pattern.status === 'coming-soon' && (
        <Badge variant="outline">
          <span className="text-[10px]">Coming soon</span>
        </Badge>
      )}
      {pattern.status === 'draft' && (
        <Badge variant="outline">
          <span className="text-[10px]">Draft</span>
        </Badge>
      )}
    </div>
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold text-foreground">
          {pattern.title}
        </h3>
      </div>
      <p className="mb-3 text-sm text-foreground leading-6!">
        {pattern.summary}
      </p>
    </div>
  </div>
)
