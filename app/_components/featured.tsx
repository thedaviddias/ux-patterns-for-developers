'use client'

import { Star } from "lucide-react"
import { usePlausible } from 'next-plausible'
import { useEffect, useState } from 'react'
import { Pattern } from "../_actions/patterns"
import { LinkCustom } from "./link-custom"

async function getRandomPattern(locale: string = 'en') {
  // Try to get from sessionStorage first
  const cached = sessionStorage.getItem(`featured-pattern-${locale}`)
  if (cached) {
    return JSON.parse(cached)
  }

  const response = await fetch(`/api/patterns/random?locale=${locale}`)
  if (!response.ok) return null

  const pattern = await response.json()

  // Cache in sessionStorage
  sessionStorage.setItem(`featured-pattern-${locale}`, JSON.stringify(pattern))
  return pattern
}

const FeaturedPatternSection = ({ pattern }: { pattern: Pattern }) => {
  const plausible = usePlausible()

  return (
    <div className="featured-pattern animate-fade-up flex flex-col mt-10 py-10 px-4 border border-neutral-400 dark:border-neutral-600 rounded-xl">
      <div className="absolute inset-0 bg-gradient-radial from-neutral-900/10 via-transparent to-transparent dark:bg-gradient-radial dark:from-neutral-500/10 dark:via-transparent dark:to-transparent
      " />
      <div className="relative">
        <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-400">
          <Star className="h-5 w-5" />
          <h2 className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Featured Pattern</h2>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-neutral-800 dark:text-neutral-100">{pattern.title}</h3>
        <p className="mt-2 text-muted-foreground text-neutral-800 dark:text-neutral-100">
          {pattern.description}
        </p>
        <div className="mt-6 flex gap-4 text-neutral-800 dark:text-neutral-100">
          <LinkCustom
            href={`${pattern.href}`}
            variant="outline"
            size="xs"
            onClick={() => plausible('view-pattern')}
          >
            View Pattern
          </LinkCustom>
        </div>
      </div>
    </div>
  );
};

const FeaturedPatternSkeleton = () => {
  return (
    <div className="featured-pattern animate-fade-up flex flex-col mt-10 py-10 px-4 border border-neutral-400 dark:border-neutral-600 rounded-xl">
      <div className="absolute inset-0 bg-gradient-radial from-neutral-900/10 via-transparent to-transparent dark:bg-gradient-radial dark:from-neutral-500/10 dark:via-transparent dark:to-transparent" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="h-4 w-5 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
        <div className="mt-4 h-8 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        <div className="mt-2 h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        <div className="mt-6">
          <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export const FeaturedPattern = () => {
  const [pattern, setPattern] = useState<Pattern | null>(null)

  useEffect(() => {
    getRandomPattern().then(setPattern)
  }, [])

  console.log(pattern)

  return pattern ? <FeaturedPatternSection pattern={pattern} /> : <FeaturedPatternSkeleton />;
};
