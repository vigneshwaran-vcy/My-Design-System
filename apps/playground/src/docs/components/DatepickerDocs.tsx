import { Button, Datepicker } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function DatepickerDocs() {
  const [value, setValue] = useState<Date | null>(new Date());
  const [due, setDue] = useState<Date | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const today = new Date();
  const max = new Date(today.getFullYear(), today.getMonth() + 3, 0);

  return (
    <DocSection
      id="datepicker"
      eyebrow="Components"
      title="Datepicker"
      description="A date field: type a date in the locale's format, or open a calendar dialog to pick one. The value is a Date (local midnight) or null."
    >
      <CodeBlock label="Datepicker import" code={`import { Datepicker } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Controlled (type a date in the format shown, or press Alt+↓ to open the calendar)"
          code={`const [value, setValue] = useState<Date | null>(new Date());

<Datepicker label="Start date" value={value} onChange={setValue} />`}
        >
          <div className="doc-stack">
            <Datepicker label="Start date" value={value} onChange={setValue} hint={`Value: ${value?.toDateString() ?? 'null'}`} />
          </div>
        </Example>

        <Example
          title="Formats and locales"
          code={`<Datepicker label="ISO" format="YYYY-MM-DD" />
<Datepicker label="Startdatum" locale="de-DE" calendarLabel="Datum wählen" />`}
        >
          <div className="doc-stack">
            <Datepicker label="ISO" format="YYYY-MM-DD" />
            <Datepicker label="Startdatum" locale="de-DE" calendarLabel="Datum wählen" />
          </div>
        </Example>

        <Example
          title="Min, max and disabled days"
          code={`<Datepicker
  label="Delivery"
  min={new Date()}
  max={endOfNextTwoMonths}
  isDateDisabled={(d) => d.getDay() === 0}
  hint="Next three months, no Sundays."
/>`}
        >
          <div className="doc-stack">
            <Datepicker label="Delivery" min={today} max={max} isDateDisabled={(d) => d.getDay() === 0} hint="Next three months, no Sundays." />
          </div>
        </Example>

        <Example
          title="Validation in a form"
          code={`<form onSubmit={…}>
  <Datepicker
    label="Due date"
    name="due"
    required
    value={due}
    onChange={setDue}
    error={submitted && !due ? 'Choose a due date.' : undefined}
  />
  <Button type="submit">Save</Button>
</form>`}
        >
          <form
            className="doc-stack"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <Datepicker
              label="Due date"
              name="due"
              required
              value={due}
              onChange={setDue}
              error={submitted && !due ? 'Choose a due date.' : undefined}
            />
            <div>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Example>

        <Example title="Variants, sizes and disabled" code={`<Datepicker label="Small" size="sm" />
<Datepicker label="Filled" variant="filled" />
<Datepicker label="Large" size="lg" />
<Datepicker label="Disabled" disabled defaultValue={new Date()} />`}>
          <div className="doc-stack">
            <Datepicker label="Small" size="sm" />
            <Datepicker label="Filled" variant="filled" />
            <Datepicker label="Large" size="lg" />
            <Datepicker label="Disabled" disabled defaultValue={today} />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Datepicker props (plus native <input> attributes, applied to the text field)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Labels the text field.' },
            { name: 'value', type: 'Date | null', description: 'Controlled value.' },
            { name: 'defaultValue', type: 'Date | null', default: 'null', description: 'Initial value when uncontrolled.' },
            { name: 'onChange', type: '(value: Date | null) => void', description: 'Called with the picked/typed day, or null when cleared.' },
            { name: 'format', type: 'string', description: 'YYYY, MM, M, DD, D plus separators. Defaults to the locale (e.g. MM/DD/YYYY).' },
            { name: 'locale', type: 'string', description: 'Drives the default format, month and weekday names.' },
            { name: 'min / max', type: 'Date | null', description: 'Limits typed and picked days.' },
            { name: 'isDateDisabled', type: '(date: Date) => boolean', description: 'Disable individual days.' },
            { name: 'firstDayOfWeek', type: '0–6', description: 'Calendar week start. Defaults to the locale.' },
            { name: 'invalidMessage', type: 'ReactNode', default: "'Enter a valid date as …'", description: 'Shown when typed text cannot be used.' },
            { name: 'calendarLabel', type: 'string', default: "'Choose date'", description: 'Names the calendar button and dialog.' },
            { name: 'calendarLabels', type: 'Partial<CalendarLabels>', description: 'Calendar navigation labels.' },
            { name: 'placement', type: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", default: "'bottom-start'", description: 'Where the calendar opens.' },
            { name: 'name', type: 'string', description: 'Submits YYYY-MM-DD through a hidden input.' },
            { name: 'hint / error / required / disabled / hideLabel', type: '—', description: 'Same as Input.' },
            { name: 'invalid', type: 'boolean', description: 'Invalid styling without a message.' },
            { name: 'variant', type: "'outline' | 'filled'", default: "'outline'", description: 'Matches Input.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 26 / 32 / 36.' },
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
                <th scope="col">Where</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Enter', 'Text field', 'Parse the typed date'],
                ['↓ / Alt + ↓', 'Text field', 'Open the calendar'],
                ['Esc', 'Text field', 'Undo an invalid edit'],
                ['Enter / Space', 'Calendar button', 'Open or close the calendar'],
                ['Arrows, Home/End, PageUp/PageDown', 'Calendar', 'Move between days (see Calendar)'],
                ['Enter / Space', 'Calendar', 'Pick the day, close, focus the button'],
                ['Esc', 'Calendar', 'Close and return focus to the button'],
                ['Tab / Shift + Tab', 'Calendar', 'Cycle within the dialog'],
              ].map(([key, where, action]) => (
                <tr key={`${key}-${where}`}>
                  <th scope="row"><code>{key}</code></th>
                  <td>{where}</td>
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
            'The text field is a labelled input whose placeholder shows the expected format; typing is always possible.',
            'The calendar button has aria-haspopup="dialog", aria-expanded and a name that includes the selected date.',
            'The calendar opens in role="dialog" with focus on the selected (or today’s) day and Tab kept inside it.',
            'Escape, picking a day or clicking outside closes it; keyboard closes return focus to the button.',
            'Unparseable or out-of-range text sets aria-invalid and announces a message through the error slot.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
