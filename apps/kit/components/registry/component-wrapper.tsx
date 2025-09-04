"use client";

import { OpenInV0Button } from "@/components/registry/open-in-v0-button";
import { Button } from "@ux-patterns/ui/components/shadcn/button";
import { cn } from "@ux-patterns/ui/lib/utils";
import { RotateCcw } from "lucide-react";
import React from "react";
import CopyButton from "../copy-registry";

interface ComponentWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  height?: string;
}

export const ComponentWrapper = ({
  className,
  children,
  name,
  height = "min-h-[350px]",
}: ComponentWrapperProps) => {
  const [key, setKey] = React.useState(0);

  const url = `https://kit.uxpatterns.dev/r/${name}.json`

  return (
    <div
      className={cn(
        "max-w-screen relative rounded-xl border bg-fd-code",
        className,
      )}
      key={key}
    >
      <div className="absolute right-4 top-4 flex items-center justify-end gap-2">
        <CopyButton
          url={url}
      />
        <OpenInV0Button url={url} />
        <Button
          onClick={() => setKey((prev) => prev + 1)}
          className="h-8 gap-1 rounded-[6px] px-3 text-xs dark:text-white text-black bg:text-white hover:bg-black hover:text-white bg-transparent"
          variant="ghost"
        >
          <RotateCcw aria-label="restart-btn" size={16} />
        </Button>
      </div>

      <div className={cn("flex w-full items-center justify-center p-10", height)}>
        {children}
      </div>
    </div>
  );
};
