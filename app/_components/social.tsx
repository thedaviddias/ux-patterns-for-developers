import { siGithub, siInstagram, siReddit, siX } from 'simple-icons';
import { SimpleIconComponent } from './browser-support';

interface SocialLink {
  label: string;
  link: string;
  shortlink: string;
  icon?: React.ReactNode;
  rel?: 'me';
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Instagram',
    link: 'https://www.instagram.com/uxpatternsfordevs',
    rel: 'me',
    icon: (
      <SimpleIconComponent
        icon={siInstagram}
        className="w-10 h-10 p-1.5 border rounded-full transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
      />
    ),
  },
  {
    label: 'Reddit',
    link: 'https://www.reddit.com/r/UXPatterns/',
    shortlink: 'https://ddias.link/ux-reddit',
    rel: 'me',
    icon: (
      <SimpleIconComponent
        icon={siReddit}
        className="w-10 h-10 p-1.5 border rounded-full transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
      />
    ),
  },
  {
    label: 'X',
    link: 'https://x.com/thedaviddias',
    shortlink: 'https://x.com/thedaviddias',
    rel: 'me',
    icon: (
      <SimpleIconComponent
        icon={siX}
        className="w-10 h-10 p-1.5 border rounded-full transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
      />
    ),
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/thedaviddias',
    shortlink: 'https://www.linkedin.com/in/thedaviddias/',
    rel: 'me',
  },
  {
    label: 'Github',
    link: 'https://github.com/thedaviddias',
    shortlink: 'https://github.com/thedaviddias',
    rel: 'me',
    icon: (
      <SimpleIconComponent
        icon={siGithub}
        className="w-10 h-10 p-1.5 border rounded-full transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
      />
    ),
  },
];
