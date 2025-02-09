'use client'

import { cn } from '@/app/_utils/cn'
import { Accessibility, Globe, Smartphone } from 'lucide-react'

interface MetricData {
  label: string
  value: number
  status: 'green' | 'yellow' | 'red'
  description: string
}

interface PatternMetrics {
  pattern: string
  accessibility: MetricData
  mobile: MetricData
  browser: MetricData
}

interface ImplementationMetricsProps {
  patterns: PatternMetrics[]
}

const metricInfo = {
  accessibility: {
    icon: Accessibility,
    title: 'Accessibility Support',
    description: 'Native support for screen readers and keyboard navigation',
  },
  mobile: {
    icon: Smartphone,
    title: 'Mobile Usability',
    description: 'Touch-friendly interface and mobile keyboard optimization',
  },
  browser: {
    icon: Globe,
    title: 'Browser Support',
    description: 'Cross-browser compatibility and consistent behavior',
  },
}

export function ImplementationMetrics({ patterns }: ImplementationMetricsProps) {
  const getStatusColor = (status: MetricData['status']) => {
    switch (status) {
      case 'green':
        return 'text-green-600 dark:text-green-400'
      case 'yellow':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'red':
        return 'text-red-600 dark:text-red-400'
    }
  }

  const getProgressColor = (status: MetricData['status']) => {
    switch (status) {
      case 'green':
        return 'bg-green-600 dark:bg-green-400'
      case 'yellow':
        return 'bg-yellow-600 dark:bg-yellow-400'
      case 'red':
        return 'bg-red-600 dark:bg-red-400'
    }
  }

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Implementation Considerations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-gradient-to-b from-transparent to-neutral-50 dark:to-neutral-900">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <Accessibility className="h-5 w-5 text-neutral-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{metricInfo.accessibility.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {metricInfo.accessibility.description}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            {patterns.map((pattern) => (
              <div key={`${pattern.pattern}-accessibility`}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{pattern.pattern}</span>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      getStatusColor(pattern.accessibility.status)
                    )}
                  >
                    {pattern.accessibility.description}
                  </span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5">
                  <div
                    className={cn(
                      'h-2.5 rounded-full transition-all duration-500',
                      getProgressColor(pattern.accessibility.status)
                    )}
                    style={{ width: `${pattern.accessibility.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-gradient-to-b from-transparent to-neutral-50 dark:to-neutral-900">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <Smartphone className="h-5 w-5 text-neutral-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{metricInfo.mobile.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {metricInfo.mobile.description}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            {patterns.map((pattern) => (
              <div key={`${pattern.pattern}-mobile`}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{pattern.pattern}</span>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      getStatusColor(pattern.mobile.status)
                    )}
                  >
                    {pattern.mobile.description}
                  </span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5">
                  <div
                    className={cn(
                      'h-2.5 rounded-full transition-all duration-500',
                      getProgressColor(pattern.mobile.status)
                    )}
                    style={{ width: `${pattern.mobile.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-gradient-to-b from-transparent to-neutral-50 dark:to-neutral-900">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <Globe className="h-5 w-5 text-neutral-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{metricInfo.browser.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {metricInfo.browser.description}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            {patterns.map((pattern) => (
              <div key={`${pattern.pattern}-browser`}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{pattern.pattern}</span>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      getStatusColor(pattern.browser.status)
                    )}
                  >
                    {pattern.browser.description}
                  </span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5">
                  <div
                    className={cn(
                      'h-2.5 rounded-full transition-all duration-500',
                      getProgressColor(pattern.browser.status)
                    )}
                    style={{ width: `${pattern.browser.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

