import type { Meta, StoryObj } from '@storybook/react';
import { FormElement } from './FormElement';

const nativeInput = (
  <input
    className="ds-input ds-input--outline ds-input--md"
    placeholder="Acme Inc."
  />
);

const meta = {
  title: 'Components/FormElement',
  component: FormElement,
  tags: ['autodocs'],
  args: { label: 'Account name', layout: 'stacked', size: 'md', children: nativeInput },
  argTypes: {
    layout: { control: 'inline-radio', options: ['stacked', 'horizontal'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'calc(var(--ds-space-16) * 6)' }}><Story /></div>],
} satisfies Meta<typeof FormElement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Required: Story = { args: { required: true, hint: 'Shown on invoices.' } };

export const InlineHelp: Story = {
  args: { inlineHelp: 'The legal name registered with your tax authority.', hint: 'Max 80 characters.' },
};

export const WithError: Story = { args: { required: true, error: 'Enter an account name.' } };

export const Horizontal: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <FormElement {...args} layout="horizontal" label="First name">
        <input className="ds-input ds-input--outline ds-input--md" />
      </FormElement>
      <FormElement {...args} layout="horizontal" label="Email" hint="We never share it." required>
        <input type="email" className="ds-input ds-input--outline ds-input--md" />
      </FormElement>
    </div>
  ),
};

export const RenderProp: Story = {
  args: {
    label: 'Notes',
    hint: 'The render prop receives id and aria-* props to spread.',
    children: (props) => <textarea {...props} className="ds-input ds-input--outline ds-input--md" rows={3} />,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <FormElement key={size} {...args} size={size} layout="horizontal" label={`Size ${size}`}>
          <input className={`ds-input ds-input--outline ds-input--${size}`} />
        </FormElement>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, children: <input className="ds-input ds-input--outline ds-input--md" disabled defaultValue="Locked" /> },
};
