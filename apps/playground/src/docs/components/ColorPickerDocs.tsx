import { ColorPicker } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function ColorPickerDocs() {
  const [color, setColor] = useState('#8B5CF6');

  return (
    <DocSection
      id="color-picker"
      eyebrow="Components"
      title="Color picker"
      description="Choose a colour from preset swatches (the token palette by default), a hex value, or the browser's native picker. The trigger shows the current colour and opens a popover."
    >
      <CodeBlock label="ColorPicker import" code={`import { ColorPicker } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example title="Controlled" code={`<ColorPicker label="Brand colour" value={color} onChange={setColor} />`}>
          <div className="doc-stack">
            <ColorPicker label="Brand colour" value={color} onChange={setColor} hint={`Value: ${color}`} />
          </div>
        </Example>

        <Example
          title="Custom swatches"
          code={`<ColorPicker
  label="Label colour"
  columns={4}
  showNativePicker={false}
  swatches={[
    { value: '#0260FF', label: 'Blue' },
    { value: '#16A34A', label: 'Green' },
    { value: '#D97706', label: 'Amber' },
    { value: '#DC2626', label: 'Red' },
  ]}
/>`}
        >
          <div className="doc-stack">
            <ColorPicker
              label="Label colour"
              columns={4}
              showNativePicker={false}
              defaultValue="#16A34A"
              swatches={[
                { value: '#0260FF', label: 'Blue' },
                { value: '#16A34A', label: 'Green' },
                { value: '#D97706', label: 'Amber' },
                { value: '#DC2626', label: 'Red' },
              ]}
            />
          </div>
        </Example>

        <Example title="Swatches only" code={`<ColorPicker label="Accent" showCustom={false} showNativePicker={false} />`}>
          <div className="doc-stack">
            <ColorPicker label="Accent" showCustom={false} showNativePicker={false} />
          </div>
        </Example>

        <Example title="Variants & sizes" code={`<ColorPicker variant="filled" … />
<ColorPicker size="sm" … />
<ColorPicker size="lg" … />`}>
          <div className="doc-stack">
            <ColorPicker label="Filled" variant="filled" />
            <ColorPicker label="Small" size="sm" />
            <ColorPicker label="Large" size="lg" />
          </div>
        </Example>

        <Example title="States" code={`<ColorPicker label="Text colour" error="Fails contrast on white." />
<ColorPicker label="Locked" disabled />`}>
          <div className="doc-stack">
            <ColorPicker label="Text colour" required error="Fails contrast on white." />
            <ColorPicker label="Locked" disabled />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="ColorPicker props (plus native <button> attributes, applied to the trigger)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Labels the trigger.' },
            { name: 'value', type: 'string', description: 'Controlled hex colour (#RRGGBB).' },
            { name: 'defaultValue', type: 'string', default: 'primary 500', description: 'Initial colour when uncontrolled.' },
            { name: 'onChange', type: '(hex: string) => void', description: 'Called with an upper-case #RRGGBB.' },
            { name: 'swatches', type: 'Array<string | { value, label? }>', default: 'defaultColorSwatches', description: '300 / 500 / 700 of every palette hue (24).' },
            { name: 'columns', type: 'number', default: '8', description: 'Swatch grid columns (also the ↑/↓ stride).' },
            { name: 'showCustom', type: 'boolean', default: 'true', description: 'Hex text field with a preview.' },
            { name: 'showNativePicker', type: 'boolean', default: 'true', description: 'Pipette button opening the native colour input.' },
            { name: 'name', type: 'string', description: 'Hidden input so the value submits with a form.' },
            { name: 'variant', type: "'outline' | 'filled'", default: "'outline'", description: 'Matches Dropdown.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Trigger height 26 / 32 / 40.' },
            { name: 'hint / error / required / disabled', type: '—', description: 'Same as Input.' },
          ]}
        />
      </SubSection>

      <SubSection title="Keyboard">
        <div className="doc-table-wrap">
          <table className="doc-table">
            <caption>Keyboard interaction</caption>
            <thead>
              <tr>
                <th scope="col">Key</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Enter / Space', 'On the trigger: open the popover (focus lands on the selected swatch)'],
                ['← / →', 'Previous / next swatch, and select it'],
                ['↑ / ↓', 'Swatch above / below'],
                ['Home / End', 'First / last swatch'],
                ['Tab', 'Swatches → hex field → native picker'],
                ['Enter (hex field)', 'Apply the typed hex'],
                ['Esc', 'Close and return focus to the trigger'],
              ].map(([key, action]) => (
                <tr key={key}>
                  <th scope="row"><code>{key}</code></th>
                  <td>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'The trigger names the field and announces the current hex; it carries aria-haspopup="dialog" and aria-expanded.',
            'Swatches are a role="radiogroup" of named radios (“Blue 500”) with a roving tabindex.',
            'Invalid hex input is flagged with aria-invalid and an error message.',
            'Colour is never the only cue: the hex value is always shown next to the swatch.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
