'use client'

import { PROJECT_URL } from '@/app/_constants/project'
import { usePlausible } from 'next-plausible'
import { LinkCustom } from './link-custom'

export const SuggestPattern = () => {
  const plausible = usePlausible()

  return (
    <section className="flex flex-col mt-10 items-center justify-center py-10 px-4 text-center border border-neutral-400 dark:border-neutral-600 rounded-xl" aria-labelledby="suggest-pattern-title">
      <h2 id="suggest-pattern-title" className="text-2xl font-bold mb-5 text-foreground">Got a pattern request?</h2>
      <p className="text-lg text-muted-foreground mb-6">
        Let us know, and we&apos;ll add it!
      </p>
      <LinkCustom
        href={`${PROJECT_URL}/discussions/new?category=suggestions`}
        onClick={() => plausible('suggest-pattern')}
        variant="outline"
      >
        Send Suggestion
      </LinkCustom>
    </section>
  )
}
