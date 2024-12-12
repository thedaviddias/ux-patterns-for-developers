'use client'

import { ArrowRight } from "lucide-react";
import { usePlausible } from "next-plausible";
import { LinkCustom } from "../link-custom";

export const HomeCTA = () => {
  const plausible = usePlausible()

  return (
    <div className="my-8 flex justify-center gap-4">
      <LinkCustom
        href="/patterns/getting-started"
        onClick={() => plausible('get-started')}
        variant="neutral"
      >
        Get Started
        <ArrowRight className="ml-2 h-4 w-4" />
      </LinkCustom>
      <LinkCustom
        href="https://git.new/uxpatterns"
        onClick={() => plausible('view-github')}
        variant="outline"
      >
        View on GitHub
      </LinkCustom>
    </div >
  );
};
