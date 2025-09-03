'use client';

import { siInstagram, siReddit } from 'simple-icons';
import { SimpleIconComponent } from './browser-support';

type SocialIconLink = {
  label: string;
  href: string;
  icon: typeof siInstagram;
};

const socialLinks: SocialIconLink[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/uxpatternsfordevs',
    icon: siInstagram,
  },
  {
    label: 'Reddit',
    href: 'https://www.reddit.com/r/UXPatterns/',
    icon: siReddit,
  },
];

export const HeaderIcons = () => {
  return (
    <div className="flex items-center gap-3">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer me"
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          aria-label={link.label}
        >
          <SimpleIconComponent icon={link.icon} className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
};
