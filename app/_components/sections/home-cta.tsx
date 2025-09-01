'use client';

import { TRACKING_CLASSES } from '@app/_utils/tracking';
import { ArrowRight } from 'lucide-react';
import { LinkCustom } from '../link-custom';

export const HomeCTA = () => {
  return (
    <div className="my-8 flex justify-center gap-4">
      <LinkCustom
        href="/patterns/getting-started"
        aria-label="Get started with UX Patterns"
        className={TRACKING_CLASSES.GET_STARTED_CLICK}
        variant="neutral"
      >
        Get Started
        <ArrowRight className="ml-2 h-4 w-4" />
      </LinkCustom>
      <LinkCustom
        href="https://git.new/uxpatterns"
        aria-label="View the project on GitHub"
        className={TRACKING_CLASSES.VIEW_GITHUB_CLICK}
        variant="outline"
      >
        View on GitHub
      </LinkCustom>
    </div>
  );
};
