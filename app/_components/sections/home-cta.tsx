'use client';

import { ArrowRight } from 'lucide-react';
import { LinkCustom } from '../link-custom';

export const HomeCTA = () => {
  return (
    <div className="my-8 flex justify-center gap-4">
      <LinkCustom
        href="/patterns/getting-started"
        aria-label="Get started with UX Patterns"
        className="plausible-event-name=Get+Started"
        variant="neutral"
      >
        Get Started
        <ArrowRight className="ml-2 h-4 w-4" />
      </LinkCustom>
      <LinkCustom
        href="https://git.new/uxpatterns"
        aria-label="View the project on GitHub"
        className="plausible-event-name=View+GitHub"
        variant="outline"
      >
        View on GitHub
      </LinkCustom>
    </div>
  );
};
