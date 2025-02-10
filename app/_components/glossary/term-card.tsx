"use client"

import Link from 'next/link'

interface TermCardProps {
  title: string
  description: string
  category: string[]
  slug: string
}

export function TermCard({ title, description, category, slug }: TermCardProps) {
  return (
    <Link
      href={`/glossary/${slug}`}
      className="block p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200 dark:border-gray-700"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {category.map((cat) => (
            <span
              key={cat}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

