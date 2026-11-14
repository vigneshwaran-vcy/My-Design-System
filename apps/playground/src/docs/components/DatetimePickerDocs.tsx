import { DatetimePicker } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function DatetimePickerDocs() {
  const [value, setValue] = useState<Date | null>(() => {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  });

  return (
    <DocSection
      id="datetime-picker"
      eyebrow="Components"
      title="DatetimePicker"
      description="A Datepicker and a Timepicker side by side (stacked on narrow widths) with one label, hint and error, producing a single Date."
    >
      <CodeBlock label="DatetimePicker import" code={`import { DatetimePicker } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Controlled"
          code={`const [value, setValue] = useState<Date | null>(todayAt9);

<DatetimePicker label="Meeting starts" value={value} onChange={setValue} />`}
        >
          <div className="doc-stack">
            <DatetimePicker label="Meeting starts" value={value} onChange={setValue} hint={`Value: ${value?.toString() ?? 'null'}`} />
          </div>
        </Example>

        <Example title="Future slots every 15 minutes" code={`<DatetimePicker label="Reminder" min={new Date()} timeStep={15} />`}>
          <div className="doc-stack">
            <DatetimePicker label="Reminder" min={new Date()} timeStep={15} hint="Times before now are hidden today." />
          </div>
        </Example>

        <Example title="Narrow container (stacks)" code={`<div style={{ maxWidth: 'var(--ds-size-panel-sm)' }}>
  <DatetimePicker label="Deadline" />
</div>`}>
          <div style={{ maxWidth: 'var(--ds-size-panel-sm)', width: '100%' }}>
            <DatetimePicker label="Deadline" />
          </div>
        </Example>

        <Example title="Error, disabled, sizes" code={`<DatetimePicker label="Start" error="Pick a date and a time." required />
<DatetimePicker label="Locked" disabled defaultValue={new Date()} />
<DatetimePicker label="Small" size="sm" variant="filled" />`}>
          <div className="doc-stack">
            <DatetimePicker label="Start" error="Pick a date and a time." required />
            <DatetimePicker label="Locked" disabled defaultValue={new Date()} />
            <DatetimePicker label="Small" size="sm" variant="filled" />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="DatetimePicker props (plus native <div> attributes, applied to the group)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Labels the group.' },
            { name: 'value', type: 'Date | null', description: 'Controlled value.' },
            { name: 'defaultValue', type: 'Date | null', default: 'null', description: 'Initial value when uncontrolled.' },
            { name: 'onChange', type: '(value: Date | null) => void', description: 'Called with date + time once both are set; null when either is cleared.' },
            { name: 'min / max', type: 'Date | null', description: 'Limit days; on the boundary day, times too.' },
            { name: 'isDateDisabled', type: '(date: Date) => boolean', description: 'Disable individual days.' },
            { name: 'dateFormat', type: 'string', description: 'Date text format (see Datepicker).' },
            { name: 'timeStep', type: 'number', default: '30', description: 'Minutes between listed times.' },
            { name: 'hour12', type: 'boolean', description: '12-hour clock. Defaults to the locale.' },
            { name: 'locale / firstDayOfWeek', type: '—', description: 'Passed to both fields.' },
            { name: 'dateLabel / timeLabel', type: 'string', default: "'Date' / 'Time'", description: 'Screen-reader names of the two fields.' },
            { name: 'name', type: 'string', description: 'Submits a local "YYYY-MM-DDTHH:mm" through a hidden input.' },
            { name: 'hint / error / required / disabled / hideLabel', type: '—', description: 'Shared by both fields.' },
            { name: 'variant', type: "'outline' | 'filled'", default: "'outline'", description: 'Matches Input.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 26 / 32 / 40.' },
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
                ['Tab', 'Date field → calendar button → time field'],
                ['Date field', 'Same as Datepicker (Alt + ↓ opens the calendar)'],
                ['Time field', 'Same as Timepicker (↓ opens the list, typing filters)'],
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
            'The fields sit in role="group" labelled by the shared label, so each is announced as e.g. "Meeting starts, group, Date".',
            'The shared hint and error are linked to the group and to both inputs through aria-describedby.',
            'An error marks both fields aria-invalid; the message is announced once.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
