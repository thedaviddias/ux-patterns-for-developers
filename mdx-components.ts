import { Pre, withIcons } from 'nextra/components';
import { GitHubIcon } from 'nextra/icons';
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs';
import { LinkCustom } from './app/_components/link-custom';

const docsComponents = getDocsMDXComponents({
  pre: withIcons(Pre, { js: GitHubIcon }),
});

export const useMDXComponents = (components: Record<string, unknown>) => ({
  ...docsComponents,
  ...components,
  a: LinkCustom,
});
