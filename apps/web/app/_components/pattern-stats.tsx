'use client';

import { Eye } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '../_utils/cn';
import { Badge } from './ui/badge';

type PatternStatsProps = {
  views?: number;
  popularity?: 'low' | 'medium' | 'high' | 'trending';
  className?: string;
};

export const PatternStats = ({ views: initialViews, popularity, className }: PatternStatsProps) => {
  const [views, setViews] = useState<number | undefined>(initialViews);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchStats = async () => {
      // Only fetch if no initial views provided and we have a pathname
      if (initialViews === undefined && pathname) {
        setLoading(true);
        try {
          const response = await fetch(`/api/stats?page=${encodeURIComponent(pathname)}`);
          if (response.ok) {
            const data = await response.json();
            setViews(data.pageviews);
          }
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStats();
  }, [pathname, initialViews]);
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const popularityConfig = {
    low: {
      label: 'Growing',
      icon: '📈',
      className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    },
    medium: {
      label: 'Popular',
      icon: '⭐',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    },
    high: {
      label: 'Very Popular',
      icon: '🌟',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    },
    trending: {
      label: 'Trending',
      icon: '🔥',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    },
  };

  const hasStats = (views && views > 0) || popularity;

  if (!hasStats) return null;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400',
        'pt-4 mb-4',
        className
      )}
    >
      {views && views > 0 && (
        <div className="flex items-center gap-1.5">
          <Eye className="w-4 h-4" />
          <span>{loading ? '...' : formatNumber(views)} views</span>
        </div>
      )}

      {popularity && (
        <Badge
          className={cn('px-2 py-0.5 text-xs font-medium', popularityConfig[popularity].className)}
        >
          <span className="mr-1">{popularityConfig[popularity].icon}</span>
          {popularityConfig[popularity].label}
        </Badge>
      )}
    </div>
  );
};
