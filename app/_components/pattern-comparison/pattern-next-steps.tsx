'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PatternLink {
  title: string;
  description: string;
  href: string;
}

interface PatternNextStepsProps {
  patterns: PatternLink[];
}

export function PatternNextSteps({ patterns }: PatternNextStepsProps) {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
      <div className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Ready to implement your chosen pattern? Check out our detailed implementation guides:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map((pattern) => (
            <Link
              key={pattern.title}
              href={pattern.href}
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 hover:border-neutral-200 dark:hover:bg-neutral-900 dark:hover:border-neutral-400 transition-all duration-100 ease-in-out group"
            >
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {pattern.title}
                </h3>
                <p className="text-sm text-gray-500">{pattern.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
