'use client';

import { AspectRatio } from '@/app/_components/ui/aspect-ratio';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/_components/ui/dialog';
import { ImagePlaceholder } from '@/app/_components/ui/image-placeholder';
import Image from 'next/image';
import { useState } from 'react';

interface Example {
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
}

interface PatternExamples {
  pattern: string;
  examples: Example[];
}

interface ExamplesGridProps {
  examples: PatternExamples[];
}

export function ExamplesGrid({ examples }: ExamplesGridProps) {
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageUrl: string) => {
    setFailedImages((prev) => new Set(prev).add(imageUrl));
  };

  // Ensure image URLs are absolute from root
  const getImageUrl = (url: string) => {
    // If URL is already absolute (starts with http or //), return as is
    if (url.startsWith('http') || url.startsWith('//')) return url;
    // Remove any leading slashes and add a single slash
    return `/${url.replace(/^\/+/, '')}`;
  };

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Real-world Examples</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {examples.map((pattern) => (
          <div
            key={pattern.pattern}
            className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 bg-gradient-to-b from-transparent to-neutral-50 dark:to-neutral-900"
          >
            <div className="flex items-start gap-3 mb-6">
              <div>
                <h3 className="text-lg font-medium">{pattern.pattern}</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {pattern.examples.map((example, index) => (
                <button
                  key={`example-${pattern.pattern}-${example.title || index}`}
                  type="button"
                  onClick={() => setSelectedExample(example)}
                  className="group relative text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300"
                >
                  <AspectRatio ratio={16 / 9}>
                    {failedImages.has(example.thumbnailUrl || example.imageUrl) ? (
                      <ImagePlaceholder
                        title={example.title}
                        description="Screenshot not available"
                      />
                    ) : (
                      // biome-ignore lint/performance/noImgElement: Using img for grid thumbnails is more performant
                      <img
                        src={getImageUrl(example.thumbnailUrl || example.imageUrl)}
                        alt={example.title}
                        className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
                        onError={() => {
                          handleImageError(example.thumbnailUrl || example.imageUrl);
                        }}
                        onLoad={() => {
                          // Image loaded successfully
                        }}
                      />
                    )}
                  </AspectRatio>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">{example.title}</h4>
                    {example.description && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {example.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedExample} onOpenChange={() => setSelectedExample(null)}>
        <DialogContent className="max-w-4xl">
          {selectedExample && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedExample.title}</DialogTitle>
                {selectedExample.description && (
                  <DialogDescription>{selectedExample.description}</DialogDescription>
                )}
              </DialogHeader>
              <div className="relative mt-4">
                <AspectRatio ratio={16 / 9}>
                  {failedImages.has(selectedExample.imageUrl) ? (
                    <ImagePlaceholder
                      title={selectedExample.title}
                      description="Screenshot not available"
                    />
                  ) : (
                    <Image
                      src={getImageUrl(selectedExample.imageUrl)}
                      alt={selectedExample.title}
                      width={1280}
                      height={720}
                      className="w-full h-full object-contain rounded-lg"
                      priority
                      onError={() => {
                        handleImageError(selectedExample.imageUrl);
                      }}
                      onLoad={() => {
                        // Modal image loaded successfully
                      }}
                    />
                  )}
                </AspectRatio>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
