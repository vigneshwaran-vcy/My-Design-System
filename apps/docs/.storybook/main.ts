import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../../../packages/ui/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = { ...viteConfig.resolve, dedupe: ['react', 'react-dom'] };
    return viteConfig;
  },
};

export default config;
