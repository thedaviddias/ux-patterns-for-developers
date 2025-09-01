import type { FC, ReactNode } from 'react';

export const Separator: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="flex items-center gap-2">{children}</div>;
};

export default {
  'getting-started': '',
  'when-to-use-what': '',
  books: '',
  _: {
    title: <Separator>Categories</Separator>,
    type: 'separator',
  },
  'content-management': {
    title: 'Content Management',
    theme: {
      collapsed: false,
    },
  },
  navigation: {
    title: 'Layout & Navigation',
    theme: {
      collapsed: false,
    },
  },
  'user-feedback': {
    title: 'User Feedback',
    theme: {
      collapsed: false,
    },
  },
  forms: {
    title: 'Inputs & Forms',
    theme: {
      collapsed: false,
    },
  },
};
