import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { FormElement } from './FormElement';

describe('FormElement', () => {
  it('labels a cloned child control', () => {
    render(
      <FormElement label="Account name">
        <input />
      </FormElement>,
    );
    expect(screen.getByRole('textbox', { name: 'Account name' })).toBeInTheDocument();
  });

  it('wires hint, error, aria-invalid and aria-required onto the control', () => {
    render(
      <FormElement label="Email" hint="Work email" error="Required" required>
        <input aria-describedby="external" />
      </FormElement>,
    );
    const input = screen.getByRole('textbox', { name: /Email/ });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input.getAttribute('aria-describedby')).toMatch(/^external .*-hint .*-error$/);
    expect(input).toHaveAccessibleDescription(/Work email Required/);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('keeps the child id and supports a render prop', () => {
    render(
      <>
        <FormElement label="Kept">
          <input id="kept" />
        </FormElement>
        <FormElement label="Notes" hint="Optional">
          {(props, meta) => <div role="textbox" tabIndex={0} aria-labelledby={meta.labelId} {...props} />}
        </FormElement>
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Kept' })).toHaveAttribute('id', 'kept');
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveAccessibleDescription('Optional');
  });

  it('shows inline help in a tooltip on keyboard focus', async () => {
    const user = userEvent.setup();
    render(
      <FormElement label="Tax ID" inlineHelp="Your VAT number">
        <input />
      </FormElement>,
    );
    await user.tab();
    const help = screen.getByRole('button', { name: 'More information' });
    expect(help).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Your VAT number');
  });

  it('applies layout, size and disabled classes, and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FormElement ref={ref} label="Name" layout="horizontal" size="lg" disabled data-testid="fe">
        <input disabled />
      </FormElement>,
    );
    expect(ref.current).toBe(screen.getByTestId('fe'));
    expect(ref.current).toHaveClass('ds-form-element--horizontal', 'ds-form-element--lg', 'ds-field--disabled');
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
