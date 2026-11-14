import { ButtonIcon } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function ButtonIconDocs() {
  const [starred, setStarred] = useState(false);
  const [muted, setMuted] = useState(true);

  return (
    <DocSection
      id="button-icon"
      eyebrow="Components"
      title="Button Icon"
      description="An icon-only button for compact, well-known actions: settings, close, more, favourite. It always needs a text label for assistive tech; prefer a labelled Button when the icon alone is ambiguous."
    >
      <CodeBlock label="ButtonIcon import" code={`import { ButtonIcon } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Variants"
          code={`<ButtonIcon variant="bare" icon="settings" label="Settings" />
<ButtonIcon variant="container" icon="settings" label="Settings" />
<ButtonIcon variant="border" icon="settings" label="Settings" />
<ButtonIcon variant="brand" icon="add" label="New record" />`}
        >
          <ButtonIcon variant="bare" icon="settings" label="Settings (bare)" />
          <ButtonIcon variant="container" icon="settings" label="Settings (container)" />
          <ButtonIcon variant="border" icon="settings" label="Settings (border)" />
          <ButtonIcon variant="brand" icon="add" label="New record" />
        </Example>

        <Example
          title="Sizes — 22 / 26 / 32 / 40 (Button heights)"
          code={`<ButtonIcon size="xs" icon="pen" label="Edit" />
<ButtonIcon size="sm" icon="pen" label="Edit" />
<ButtonIcon size="md" icon="pen" label="Edit" />
<ButtonIcon size="lg" icon="pen" label="Edit" />`}
        >
          <ButtonIcon size="xs" icon="pen" label="Edit (xs)" />
          <ButtonIcon size="sm" icon="pen" label="Edit (sm)" />
          <ButtonIcon size="md" icon="pen" label="Edit (md)" />
          <ButtonIcon size="lg" icon="pen" label="Edit (lg)" />
        </Example>

        <Example
          title="Toggle (aria-pressed)"
          code={`const [starred, setStarred] = useState(false);
<ButtonIcon icon="star" label="Favourite" selected={starred} onClick={() => setStarred(!starred)} />`}
        >
          <ButtonIcon icon="star" label="Favourite" selected={starred} onClick={() => setStarred((v) => !v)} />
          <ButtonIcon variant="bare" icon="bell" label="Mute notifications" selected={muted} onClick={() => setMuted((v) => !v)} />
          <ButtonIcon variant="brand" icon="bookmark" label="Bookmark" selected />
        </Example>

        <Example title="Disabled" code={`<ButtonIcon icon="trash" label="Delete" disabled />`}>
          <ButtonIcon variant="bare" icon="trash" label="Delete (bare)" disabled />
          <ButtonIcon variant="container" icon="trash" label="Delete (container)" disabled />
          <ButtonIcon variant="border" icon="trash" label="Delete (border)" disabled />
          <ButtonIcon variant="brand" icon="trash" label="Delete (brand)" disabled />
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="ButtonIcon props (plus native button attributes)"
          rows={[
            { name: 'icon', type: 'IconName | ReactNode', description: 'A Solar icon name, or an icon node. Always hidden from assistive tech.' },
            { name: 'label', type: 'string', description: 'Required accessible name (aria-label); also the native tooltip.' },
            { name: 'variant', type: "'bare' | 'container' | 'border' | 'brand'", default: "'border'", description: 'bare: no fill · container: tinted fill · border: surface + ring edge · brand: solid accent.' },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Square: 22 / 26 / 32 / 40, matching Button heights.' },
            { name: 'selected', type: 'boolean', description: 'Makes it a toggle: sets aria-pressed and the selected look. Leave undefined for an action.' },
            { name: 'showTitle', type: 'boolean', default: 'true', description: 'Use the label as the native title tooltip. Turn off when wrapping in a Tooltip.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Native disabled; not focusable.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'A native <button type="button">: Tab to focus, Enter or Space to activate.',
            '`label` is required and becomes aria-label, so the button is never nameless; the icon is aria-hidden.',
            'Toggle buttons expose aria-pressed="true|false"; keep the label constant (e.g. "Favourite") and let the state carry the meaning.',
            'Focus ring (1px border-focus + shadow-focus) shows on :focus-visible only; a transparent border keeps an edge in forced-colors mode.',
            'xs (22) is below the 24×24 minimum target size; give it spacing, or use sm and up for touch.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
