
import { getPatterns } from '@app/_utils/get-patterns'
import Link from 'next/link'
import { Badge } from '../ui/badge'

type Pattern = {
  title: string
  description: string
  href?: string
  comingSoon?: boolean
}

export const OverviewGrid = async ({ lang }: { lang: string }) => {
  const categories = await getPatterns(lang)

  return (
    <div className="space-y-10 my-10">
      {categories.map((category) => (
        <div key={category.name}>
          <h2 className="text-2xl font-bold mb-5 text-foreground">
            {category.name}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.patterns.map((pattern) => (
              <div
                key={pattern.title}
                className={`group relative rounded-xl border border-neutral-200 dark:border-neutral-800 ${!pattern.comingSoon
                  ? 'hover:scale-105 transition-transform ease-in-out duration-100'
                  : 'opacity-75'
                  }`}
              >
                {pattern.href ? (
                  <Link href={pattern.href}>
                    <PatternContent pattern={pattern} />
                  </Link>
                ) : (
                  <PatternContent pattern={pattern} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const PatternContent = ({ pattern }: { pattern: Pattern }) => (
  <div className="relative overflow-hidden rounded-xl p-5">
    <div className="flex items-center justify-between">
      <h3 className="font-display text-xl font-semibold text-foreground">
        {pattern.title}
      </h3>
    </div>
    <p className="mt-2 mb-3 text-sm text-foreground leading-6!">
      {pattern.description}
    </p>
    {pattern.comingSoon && (
      <Badge variant="outline">
        Coming soon
      </Badge>
    )}
  </div>
)
