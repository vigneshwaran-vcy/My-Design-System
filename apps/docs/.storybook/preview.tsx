import type { Preview } from '@storybook/react';
import '@my-ds/tokens/tokens.css';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme;
      return <Story />;
    },
  ],
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    controls: { expanded: true },
    a11y: { test: 'error' },
  },
};

export default preview;
