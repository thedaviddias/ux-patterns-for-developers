'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const PatternPreview = ({ alt }: { alt: string }) => {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const patternName = segments[segments.length - 1];

  return (
    <div className="pattern-preview">
      <Image
        src={`/covers/patterns/${patternName}.png`}
        alt={alt || `Example of ${patternName} pattern`}
        width={800}
        height={400}
        priority
        unoptimized
      />
    </div>
  );
};
