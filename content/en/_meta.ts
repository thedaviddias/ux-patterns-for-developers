export default {
  index: {
    type: 'page',
    display: 'hidden',
    theme: {
      toc: false,
      typesetting: 'article',
    },
  },
  patterns: {
    type: 'page',
    title: 'Patterns',
  },
  'pattern-guide': {
    type: 'page',
    title: 'Pattern Guide',
    theme: {
      toc: false,
      sidebar: false,
      typesetting: 'article',
    },
  },
  glossary: {
    type: 'page',
    title: 'Glossary',
    theme: {
      sidebar: true,
      typesetting: 'article',
      layout: 'full',
    },
  },
  blog: {
    type: 'page',
    title: 'Blog',
    theme: {
      toc: false,
      sidebar: false,
      typesetting: 'article',
    },
  },
  about: {
    type: 'page',
    title: 'About',
    theme: {
      toc: false,
      sidebar: false,
      typesetting: 'article',
    },
  },
  'privacy-policy': {
    type: 'page',
    title: 'Privacy Policy',
    display: 'hidden',
    theme: {
      sidebar: false,
      typesetting: 'article',
    },
  },
};
