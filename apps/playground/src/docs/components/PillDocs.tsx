import { Avatar, Pill, PillContainer } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const ACCOUNTS = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli'];

export function PillDocs() {
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [people, setPeople] = useState(['Ada Lovelace', 'Grace Hopper', 'Alan Turing']);

  return (
    <DocSection
      id="pill"
      eyebrow="Components"
      title="Pill"
      description="A compact token for a selected value: a record in a lookup, a filter, a recipient. Removable pills sit in a PillContainer, a listbox with one Tab stop and arrow-key navigation."
    >
      <CodeBlock label="Pill import" code={`import { Pill, PillContainer } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Variants"
          code={`<Pill label="Neutral" onRemove={…} />
<Pill label="Accent" variant="accent" onRemove={…} />
<Pill label="Invalid value" variant="danger" icon="danger-circle" onRemove={…} />`}
        >
          <Pill label="Neutral" onRemove={() => {}} />
          <Pill label="Accent" variant="accent" onRemove={() => {}} />
          <Pill label="Invalid value" variant="danger" icon="danger-circle" onRemove={() => {}} />
        </Example>

        <Example title="Sizes — 22 / 26" code={`<Pill size="sm" label="Small" icon="tag" />
<Pill size="md" label="Medium" icon="tag" />`}>
          <Pill size="sm" label="Small" icon="tag" onRemove={() => {}} />
          <Pill size="md" label="Medium" icon="tag" onRemove={() => {}} />
        </Example>

        <Example
          title="Icon or avatar"
          code={`<Pill label="Acme" icon="case" />
<Pill label="Ada Lovelace" avatar={<Avatar size="xs" name="Ada Lovelace" />} />`}
        >
          <Pill label="Acme" icon="case" onRemove={() => {}} />
          <Pill label="Ada Lovelace" avatar={<Avatar size="xs" name="Ada Lovelace" />} onRemove={() => {}} />
        </Example>

        <Example title="States" code={`<Pill label="Read only" />
<Pill label="Disabled" disabled onRemove={…} />`}>
          <Pill label="Read only" />
          <Pill label="Removable" onRemove={() => {}} />
          <Pill label="Disabled" disabled onRemove={() => {}} />
        </Example>

        <Example
          title="Pill container (Tab in, arrows move, Backspace/Delete remove)"
          code={`<PillContainer label="Selected accounts">
  {accounts.map((name) => (
    <Pill key={name} label={name} icon="case" onRemove={() => remove(name)} />
  ))}
</PillContainer>`}
        >
          <div className="doc-stack">
            <PillContainer label="Selected accounts">
              {accounts.map((name) => (
                <Pill key={name} label={name} icon="case" onRemove={() => setAccounts((all) => all.filter((n) => n !== name))} />
              ))}
            </PillContainer>
            {accounts.length === 0 && <p className="doc-muted">All removed. <button type="button" onClick={() => setAccounts(ACCOUNTS)}>Reset</button></p>}
          </div>
        </Example>

        <Example
          title="Framed container"
          code={`<PillContainer label="Recipients" variant="framed" size="sm">…</PillContainer>`}
        >
          <div className="doc-stack">
            <PillContainer label="Recipients" variant="framed" size="sm">
              {people.map((name) => (
                <Pill
                  key={name}
                  label={name}
                  variant="accent"
                  avatar={<Avatar size="xs" name={name} />}
                  onRemove={() => setPeople((all) => all.filter((n) => n !== name))}
                />
              ))}
            </PillContainer>
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Pill props (plus native span attributes)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Visible text and accessible name.' },
            { name: 'variant', type: "'neutral' | 'accent' | 'danger'", default: "'neutral'", description: 'neutral: surface + ring · accent: blue tint · danger: an invalid value.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '22 / 26. Inside a container, defaults to the container size.' },
            { name: 'icon', type: 'IconName | ReactNode', description: 'Leading decorative icon.' },
            { name: 'avatar', type: 'ReactNode', description: 'Leading avatar (replaces icon); shrunk to fit.' },
            { name: 'onRemove', type: '() => void', description: 'Makes the pill removable (× button, Backspace, Delete).' },
            { name: 'removeLabel', type: 'string', default: '"Remove <label>"', description: 'Accessible name of the × button.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Greyed out, aria-disabled, cannot be removed.' },
          ]}
        />
        <PropsTable
          caption="PillContainer props (plus native div attributes)"
          rows={[
            { name: 'label', type: 'string', description: 'Required accessible name of the listbox.' },
            { name: 'variant', type: "'bare' | 'framed'", default: "'bare'", description: 'framed: pills on a tinted frame, like a multi-select selection area.' },
            { name: 'size', type: "'sm' | 'md'", description: 'Default size of the pills inside.' },
            { name: 'removeHint', type: 'string', default: "'Press Delete or Backspace to remove.'", description: 'Description read with each removable pill.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Standalone: the pill is plain text plus a real × <button> labelled "Remove <label>"; Backspace/Delete on it remove too.',
            'In a PillContainer: role="listbox" (aria-orientation="horizontal") of role="option" pills with a roving tabindex — one Tab stop for the whole set.',
            'Left/Right (and Up/Down) move between pills and wrap; Home/End jump to the ends; Right/Left swap in right-to-left layouts.',
            'Backspace or Delete removes the focused pill; focus moves to the next pill, else the previous one, else the container — it is never lost.',
            'Each removable option is described by a hidden "Press Delete or Backspace to remove." hint; the × buttons are tabindex="-1" to avoid extra stops.',
            'Focus ring (1px border-focus + shadow-focus) on :focus-visible; a transparent border keeps an edge in forced-colors mode.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
