import { Icon, iconNames, type IconSize } from '@my-ds/ui';
import { useState } from 'react';
import { CodeBlock, CopyButton, DocSection, SubSection } from './DocBlocks';

const SIZES: IconSize[] = ['xs', 'sm', 'md', 'lg'];

export function Icons() {
  const [size, setSize] = useState<IconSize>('md');

  return (
    <DocSection
      id="icons"
      title="Icons"
      description={
        <>
          Solar, Linear style: 1.5px strokes on a 24px grid. {iconNames.length} icons are bundled; they inherit{' '}
          <code>currentColor</code>, so colour them from the parent.
        </>
      }
    >
      <CodeBlock
        label="Icon usage code"
        code={`import { Icon } from '@my-ds/ui';

<Icon name="search" />                       // decorative, 16px
<Icon name="info" size="md" label="Info" />  // meaningful: role="img" + accessible name`}
      />

      <SubSection title="Library">
        <div className="tk-icon-sizes" role="group" aria-label="Preview size">
          {SIZES.map((s) => (
            <button key={s} type="button" className="tk-icon-size" aria-pressed={size === s} onClick={() => setSize(s)}>
              {s}
            </button>
          ))}
        </div>
        <ul className="tk-icons">
          {iconNames.map((name) => (
            <li key={name} className="tk-icon">
              <Icon name={name} size={size} />
              <code className="tk-icon__name">{name}</code>
              <CopyButton value={`<Icon name="${name}" />`} label={`${name} icon code`} />
            </li>
          ))}
        </ul>
      </SubSection>

      <SubSection title="Adding an icon">
        <p className="doc-body">
          Find it at <a href="https://icones.js.org/collection/solar">icones.js.org/collection/solar</a>, add its name
          (without <code>-linear</code>) to <code>LINEAR</code> in <code>packages/ui/scripts/build-icons.mjs</code>, then
          run <code>pnpm --filter @my-ds/ui icons</code>. Only listed icons are bundled. <code>check</code>,{' '}
          <code>close</code>, <code>info</code> and <code>alert</code> are Solar’s circled glyphs with the circle removed,
          for places that need a bare mark.
        </p>
        <p className="doc-muted">Solar icon set by 480 Design, licensed CC BY 4.0.</p>
      </SubSection>
    </DocSection>
  );
}
