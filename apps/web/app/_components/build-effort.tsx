import { cn } from '../_utils/cn';
import { Badge } from './ui/badge';

type BuildEffortProps = {
  level: 'low' | 'medium' | 'high';
  description: string;
};

export const BuildEffort = ({ level, description }: BuildEffortProps) => {
  const effortConfig = {
    low: {
      label: 'Low',
      icon: '🟢',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    },
    medium: {
      label: 'Medium',
      icon: '🟡',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    },
    high: {
      label: 'High',
      icon: '🔴',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    },
  }[level];

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 mt-4 p-6 rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">Build Effort</h3>
          <Badge
            className={cn('px-3 py-1 font-medium', effortConfig.className)}
            aria-label={`Effort level: ${effortConfig.label}`}
          >
            <span className="mr-1.5">{effortConfig.icon}</span>
            {effortConfig.label}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
