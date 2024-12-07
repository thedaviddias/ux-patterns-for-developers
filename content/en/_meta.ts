export default {
  index: {
    type: 'page',
    display: 'hidden',
    theme: {
      typesetting: 'article'
    }
  },
  docs: {
    type: 'page',
    title: 'Documentation'
  },
  about: {
    type: 'menu',
    title: 'About',
    items: {
      about: 'Project',
      contributors: {
        href: 'https://github.com/thedaviddias/ux-patterns-for-developers/graphs/contributors'
      }
    }
  },
}
