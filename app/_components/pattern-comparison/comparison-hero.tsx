'use client';

interface ComparisonHeroProps {
  title: string;
  description: string;
}

export function ComparisonHero({ title, description }: ComparisonHeroProps) {
  return (
    <div className="text-center py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{title}</h1>
      <div className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-2xl">
        {description}
      </div>
    </div>
  );
}
