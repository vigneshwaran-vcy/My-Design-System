import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileSelector } from './FileSelector';

const sample = [
  new File(['x'.repeat(48_000)], 'Q3-report.pdf', { type: 'application/pdf' }),
  new File(['x'.repeat(1_200)], 'notes.txt', { type: 'text/plain' }),
];

const meta = {
  title: 'Components/FileSelector',
  component: FileSelector,
  tags: ['autodocs'],
  args: { label: 'Attachments', size: 'md', variant: 'dropzone', multiple: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['dropzone', 'inline'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'calc(var(--ds-space-16) * 6)' }}><Story /></div>],
} satisfies Meta<typeof FileSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithFiles: Story = { args: { defaultFiles: sample } };

export const Images: Story = {
  args: { label: 'Profile photo', multiple: false, accept: 'image/*', hint: 'PNG or JPG, up to 2 MB.' },
};

export const Inline: Story = { args: { variant: 'inline', multiple: false, dropLabel: 'or drop a file' } };

export const Controlled: Story = {
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileSelector {...args} files={files} onChange={setFiles} hint={`${files.length} file(s) selected`} />;
  },
};

export const WithError: Story = { args: { required: true, error: 'Attach at least one file.' } };

export const Disabled: Story = { args: { disabled: true, defaultFiles: sample } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <FileSelector {...args} size="sm" label="Small" />
      <FileSelector {...args} size="md" label="Medium" />
      <FileSelector {...args} size="lg" label="Large" />
    </div>
  ),
};
