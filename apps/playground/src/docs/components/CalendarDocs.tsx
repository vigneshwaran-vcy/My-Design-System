import { Calendar, type DateRange } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const fmt = (date: Date | null) => (date ? date.toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—');

export function CalendarDocs() {
  const [value, setValue] = useState<Date | null>(new Date());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const today = new Date();
  const min = new Date(today.getFullYear(), today.getMonth(), 1);
  const max = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  return (
    <DocSection
      id="calendar"
      eyebrow="Components"
      title="Calendar"
      description="A month grid for picking a day or a range. Follows the WAI-ARIA date grid pattern with localised month and weekday names, and powers Datepicker and DatetimePicker."
    >
      <CodeBlock label="Calendar import" code={`import { Calendar, type DateRange } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Single day (try the keyboard: arrows, Home/End, PageUp/PageDown, Shift+PageUp)"
          code={`const [value, setValue] = useState<Date | null>(new Date());

<Calendar value={value} onChange={setValue} showTodayButton />`}
        >
          <div className="doc-stack">
            <Calendar value={value} onChange={setValue} showTodayButton />
            <p className="doc-muted">Selected: {fmt(value)}</p>
          </div>
        </Example>

        <Example
          title="Range"
          code={`const [range, setRange] = useState<DateRange>({ start: null, end: null });

<Calendar mode="range" range={range} onRangeChange={setRange} />`}
        >
          <div className="doc-stack">
            <Calendar mode="range" range={range} onRangeChange={setRange} />
            <p className="doc-muted">
              {fmt(range.start)} → {fmt(range.end)}
            </p>
          </div>
        </Example>

        <Example
          title="Min, max and disabled days"
          code={`<Calendar
  min={firstOfThisMonth}
  max={endOfNextMonth}
  isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
/>`}
        >
          <Calendar min={min} max={max} isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6} />
        </Example>

        <Example
          title="Locale and first day of week"
          code={`<Calendar locale="de-DE" firstDayOfWeek={1} showTodayButton labels={{ today: 'Heute' }} />`}
        >
          <Calendar locale="de-DE" firstDayOfWeek={1} showTodayButton labels={{ today: 'Heute', previousMonth: 'Vorheriger Monat', nextMonth: 'Nächster Monat', previousYear: 'Vorheriges Jahr', nextYear: 'Nächstes Jahr' }} />
        </Example>

        <Example title="Sizes and variants" code={`<Calendar size="sm" />
<Calendar size="md" variant="plain" />
<Calendar size="lg" />`}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-4)', alignItems: 'flex-start' }}>
            <Calendar size="sm" />
            <Calendar size="md" variant="plain" />
            <Calendar size="lg" />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Calendar props (plus native <div> attributes, applied to the root)"
          rows={[
            { name: 'mode', type: "'single' | 'range'", default: "'single'", description: 'Pick one day or a start and end day.' },
            { name: 'value', type: 'Date | null', description: 'Controlled selected day (single mode).' },
            { name: 'defaultValue', type: 'Date | null', default: 'null', description: 'Initial day when uncontrolled.' },
            { name: 'onChange', type: '(date: Date) => void', description: 'Called whenever a day is picked, even the selected one.' },
            { name: 'range', type: 'DateRange', description: 'Controlled { start, end } (range mode).' },
            { name: 'defaultRange', type: 'DateRange', description: 'Initial range when uncontrolled.' },
            { name: 'onRangeChange', type: '(range: DateRange) => void', description: 'First pick sets start; second sets end (swapped if earlier).' },
            { name: 'month', type: 'Date', description: 'Controlled visible month (any day in it).' },
            { name: 'defaultMonth', type: 'Date', description: 'Initial month. Defaults to the selected day or today.' },
            { name: 'onMonthChange', type: '(month: Date) => void', description: 'Called with the first of the new month.' },
            { name: 'min / max', type: 'Date | null', description: 'Earliest / latest selectable day. Navigation stops at their months.' },
            { name: 'isDateDisabled', type: '(date: Date) => boolean', description: 'Disable individual days. They stay focusable but cannot be picked.' },
            { name: 'locale', type: 'string', description: 'BCP 47 locale for names (Intl). Defaults to the runtime locale.' },
            { name: 'firstDayOfWeek', type: '0–6', description: '0 = Sunday. Defaults to the locale (Intl.Locale week info).' },
            { name: 'showOutsideDays', type: 'boolean', default: 'true', description: 'Show days of adjacent months in the first/last week.' },
            { name: 'showTodayButton', type: 'boolean', default: 'false', description: 'Footer button that jumps to and selects today.' },
            { name: 'labels', type: 'Partial<CalendarLabels>', description: 'previousMonth, nextMonth, previousYear, nextYear, today.' },
            { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Focus the active day on mount.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Day cells 26 / 32 / 36.' },
            { name: 'variant', type: "'outline' | 'plain'", default: "'outline'", description: 'Framed surface, or no frame for use inside popovers.' },
          ]}
        />
      </SubSection>

      <SubSection title="Keyboard">
        <div className="doc-table-wrap">
          <table className="doc-table">
            <caption>Keyboard interaction in the grid</caption>
            <thead>
              <tr>
                <th scope="col">Key</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['← / →', 'Previous / next day (crosses months)'],
                ['↑ / ↓', 'Same weekday in the previous / next week'],
                ['Home / End', 'First / last day of the week'],
                ['PageUp / PageDown', 'Same day in the previous / next month'],
                ['Shift + PageUp / PageDown', 'Same day in the previous / next year'],
                ['Enter / Space', 'Select the focused day'],
                ['Tab', 'Move between the header buttons, the grid and the Today button'],
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
            'The grid is role="grid", labelled by the month heading, which is a polite live region so month changes are announced.',
            'Days are buttons inside role="gridcell" cells with aria-selected; only the focused day is in the tab order (roving tabindex).',
            'Each day has a full accessible name (e.g. "Saturday, November 14, 2026"); today has aria-current="date".',
            'Weekday headers show a short name with the full name in abbr; disabled days use aria-disabled and stay reachable by keyboard.',
            'Range mode sets aria-multiselectable; start, end and in-between days are all aria-selected.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
