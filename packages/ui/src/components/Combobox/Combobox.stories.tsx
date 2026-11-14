import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Combobox, type ComboboxOption, type ComboboxProps } from './Combobox';

const accounts: ComboboxOption[] = [
  { value: 'acme', label: 'Acme Corporation', description: 'San Francisco' },
  { value: 'globex', label: 'Globex', description: 'Springfield' },
  { value: 'initech', label: 'Initech', description: 'Austin' },
  { value: 'umbrella', label: 'Umbrella Corp', description: 'Raccoon City', disabled: true },
  { value: 'hooli', label: 'Hooli', description: 'Palo Alto' },
  { value: 'stark', label: 'Stark Industries', description: 'New York' },
  { value: 'wayne', label: 'Wayne Enterprises', description: 'Gotham' },
];

const meta: Meta<ComboboxProps> = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: { label: 'Account', options: accounts, placeholder: 'Search accounts…', size: 'md', variant: 'outline' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'filled'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'calc(var(--ds-space-16) * 6)', minHeight: 'calc(var(--ds-space-16) * 6)' }}><Story /></div>],
};

export default meta;

/** Story args without the single/multiple value props, so a story can pick either mode. */
const base = ({ multiple, value, defaultValue, onChange, ...rest }: ComboboxProps) => rest;
type Story = StoryObj<ComboboxProps>;

export const Playground: Story = {};

export const WithValue: Story = { args: { defaultValue: 'globex' } };

export const Multiple: Story = {
  render: (args: ComboboxProps) => {
    const [value, setValue] = useState<string[]>(['acme', 'hooli']);
    return (
      <Combobox
        {...base(args)}
        label="Accounts"
        multiple
        value={value}
        onChange={setValue}
        hint={`${value.length} selected`}
      />
    );
  },
};

export const NoResultsMessage: Story = { args: { emptyMessage: 'No accounts match. Try another name.', defaultInputValue: '' } };

export const WithError: Story = { args: { required: true, error: 'Choose an account.' } };

export const Filled: Story = { args: { variant: 'filled' } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 'initech' } };

export const Sizes: Story = {
  render: (args: ComboboxProps) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <Combobox {...args} size="sm" label="Small" />
      <Combobox {...args} size="md" label="Medium" />
      <Combobox {...args} size="lg" label="Large" />
      <Combobox {...base(args)} size="sm" label="Small multiple" multiple defaultValue={['acme', 'globex']} />
    </div>
  ),
};
