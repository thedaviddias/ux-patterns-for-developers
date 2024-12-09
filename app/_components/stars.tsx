'use client'

import { PROJECT_URL } from '@/app/_constants/project';
import * as Sentry from "@sentry/nextjs";
import { StarIcon } from 'lucide-react';
import { GitHubIcon } from 'nextra/icons';
import { useEffect, useState } from 'react';

export function Stars() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    fetch('https://api.github.com/repos/thedaviddias/ux-patterns-for-developers')
      .then(res => res.json())
      .then(data => setStars(data.stargazers_count))
      .catch(err => Sentry.captureException(err))
  }, [])

  if (stars === null) return <div className="flex items-center justify-center gap-2">
    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-900 dark:text-gray-100 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-gray-700">Loading...</span>
  </div>

  return (
    <div className="flex items-center justify-center gap-2">
      <a
        href={PROJECT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="plausible-event-name=Star+Github inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium text-gray-900 dark:text-gray-100 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-gray-700"
      >
        <GitHubIcon className="w-4 h-4" />
        <span className="hidden lg:inline">Star on GitHub</span>
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <StarIcon className="w-4 h-4 mr-1" />
          {stars}
        </span>
      </a>
    </div>
  )
}
