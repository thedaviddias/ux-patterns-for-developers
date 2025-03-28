"use client";

import { usePlausible } from "next-plausible";
import { LinkCustom } from "./link-custom";

export const SubscribeForm = () => {
  const plausible = usePlausible()

  return (
    <section className="flex flex-col mt-10 items-center justify-center py-10 px-4 text-center border border-neutral-400 dark:border-neutral-600 rounded-xl" aria-labelledby="subscribe-title">
      <h2 id="subscribe-title" className="text-2xl font-bold mb-5 text-foreground">
        Get notified when new patterns are added!
      </h2>
      <p className="text-muted-foreground max-w-xl mx-auto mb-5">
        Subscribe to my newsletter "David's Dev Diary" for the latest updates on UX Patterns for Devs.
      </p>

      <LinkCustom variant="neutral" href="https://thedaviddias.substack.com/" onClick={() => plausible('subscribe')}>Subscribe</LinkCustom>

    </section>
  );
}
