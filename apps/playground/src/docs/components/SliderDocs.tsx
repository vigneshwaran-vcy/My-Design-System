import { Slider } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function SliderDocs() {
  const [volume, setVolume] = useState(40);

  return (
    <DocSection
      id="slider"
      eyebrow="Components"
      title="Slider"
      description="Pick a single value from a range. A fully themed native range input: the filled track follows the value and the thumb is the Switch knob."
    >
      <CodeBlock label="Slider import" code={`import { Slider } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example title="Controlled with value label" code={`<Slider label="Volume" value={volume} onChange={setVolume} showValue />`}>
          <div className="doc-stack">
            <Slider label="Volume" value={volume} onChange={(v) => setVolume(v)} showValue hint={`Value: ${volume}`} />
          </div>
        </Example>

        <Example
          title="Step, range labels and formatting"
          code={`<Slider
  label="Discount"
  min={0}
  max={50}
  step={5}
  defaultValue={15}
  showValue
  showRange
  formatValue={(v) => \`\${v}%\`}
/>`}
        >
          <div className="doc-stack">
            <Slider label="Discount" min={0} max={50} step={5} defaultValue={15} showValue showRange formatValue={(v) => `${v}%`} />
          </div>
        </Example>

        <Example title="Variants" code={`<Slider label="Accent" />
<Slider label="Neutral" variant="neutral" />`}>
          <div className="doc-stack">
            <Slider label="Accent" defaultValue={60} showValue />
            <Slider label="Neutral" variant="neutral" defaultValue={60} showValue />
          </div>
        </Example>

        <Example title="Sizes" code={`<Slider size="sm" … />
<Slider size="md" … />
<Slider size="lg" … />`}>
          <div className="doc-stack">
            <Slider label="Small" size="sm" defaultValue={30} />
            <Slider label="Medium" size="md" defaultValue={50} />
            <Slider label="Large" size="lg" defaultValue={70} />
          </div>
        </Example>

        <Example title="States" code={`<Slider label="Budget" error="Exceeds the approved limit." defaultValue={90} />
<Slider label="Locked" disabled defaultValue={20} />`}>
          <div className="doc-stack">
            <Slider label="Budget" error="Exceeds the approved limit." defaultValue={90} showValue />
            <Slider label="Locked" disabled defaultValue={20} showValue />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Slider props (plus native <input> attributes, applied to the range input)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Labels the range input.' },
            { name: 'min / max / step', type: 'number', default: '0 / 100 / 1', description: 'Range and granularity; values snap to step.' },
            { name: 'value', type: 'number', description: 'Controlled value.' },
            { name: 'defaultValue', type: 'number', default: 'min', description: 'Initial value when uncontrolled.' },
            { name: 'onChange', type: '(value: number, event) => void', description: 'Called with the snapped value.' },
            { name: 'showValue', type: 'boolean', default: 'false', description: 'Shows the current value at the end of the label row.' },
            { name: 'showRange', type: 'boolean', default: 'false', description: 'Shows min and max under the track.' },
            { name: 'formatValue', type: '(value: number) => string', default: 'String', description: 'Formats the visible value and aria-valuetext.' },
            { name: 'variant', type: "'accent' | 'neutral'", default: "'accent'", description: 'Fill colour of the selected range.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Track 4 / 5 / 8 and thumb 14 / 16 / 20.' },
            { name: 'hint / error', type: 'ReactNode', description: 'Linked via aria-describedby; error sets aria-invalid.' },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Keeps the label for screen readers only.' },
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
                ['→ / ↑', 'Increase by one step'],
                ['← / ↓', 'Decrease by one step'],
                ['Page Up / Page Down', 'Increase / decrease by 10% of the range'],
                ['Home / End', 'Jump to min / max'],
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
            'Native input[type=range]: role="slider" with aria-valuemin/max/now for free.',
            'aria-valuetext uses formatValue, so "15%" is announced instead of "15".',
            'Focus draws a soft ring and a 1px focus edge on the thumb; forced-colors keeps a transparent outline.',
            'Disabled sliders are skipped by Tab and ignore keys.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
