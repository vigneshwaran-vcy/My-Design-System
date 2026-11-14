import { FileSelector } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function FileSelectorDocs() {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  return (
    <DocSection
      id="file-selector"
      eyebrow="Components"
      title="File selector"
      description="Pick files with a button or drop them onto the zone. Selected files are listed with their size and a remove button."
    >
      <CodeBlock label="FileSelector import" code={`import { FileSelector } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Drop zone, multiple, controlled"
          code={`<FileSelector label="Attachments" multiple files={files} onChange={setFiles} />`}
        >
          <div className="doc-stack">
            <FileSelector label="Attachments" multiple files={files} onChange={setFiles} hint={`${files.length} file(s) selected`} />
          </div>
        </Example>

        <Example
          title="Accept filter"
          code={`<FileSelector
  label="Profile photo"
  accept="image/*"
  hint="PNG or JPG."
  onReject={(files) => …}
/>`}
        >
          <div className="doc-stack">
            <FileSelector
              label="Profile photo"
              accept="image/*"
              hint={rejected.length ? `Not an image: ${rejected.join(', ')}` : 'PNG or JPG. Dropping other files is rejected.'}
              onReject={(r) => setRejected(r.map((f) => f.name))}
            />
          </div>
        </Example>

        <Example title="Inline variant" code={`<FileSelector variant="inline" label="Contract" dropLabel="or drop a file" />`}>
          <div className="doc-stack">
            <FileSelector variant="inline" label="Contract" dropLabel="or drop a file" />
          </div>
        </Example>

        <Example title="Sizes" code={`<FileSelector size="sm" … />
<FileSelector size="lg" … />`}>
          <div className="doc-stack">
            <FileSelector size="sm" label="Small" multiple />
            <FileSelector size="lg" label="Large" multiple />
          </div>
        </Example>

        <Example title="States" code={`<FileSelector label="Receipts" required error="Attach at least one receipt." />
<FileSelector label="Locked" disabled />`}>
          <div className="doc-stack">
            <FileSelector label="Receipts" required error="Attach at least one receipt." multiple />
            <FileSelector label="Locked" disabled />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="FileSelector props (plus native <input type=file> attributes, applied to the hidden input)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Labels the input and the browse button.' },
            { name: 'files', type: 'File[]', description: 'Controlled selection.' },
            { name: 'defaultFiles', type: 'File[]', default: '[]', description: 'Initial selection when uncontrolled.' },
            { name: 'onChange', type: '(files: File[]) => void', description: 'Called after picking, dropping or removing.' },
            { name: 'accept', type: 'string', description: 'Native accept; also filters dropped files.' },
            { name: 'onReject', type: '(files: File[]) => void', description: 'Dropped files that did not match accept.' },
            { name: 'multiple', type: 'boolean', default: 'false', description: 'Append (deduplicated) instead of replace.' },
            { name: 'buttonLabel', type: 'string', default: "'Upload file(s)'", description: 'Browse button text.' },
            { name: 'dropLabel', type: 'ReactNode', default: "'or drop files here'", description: 'Text beside the button.' },
            { name: 'hideFileList', type: 'boolean', default: 'false', description: 'Render your own list.' },
            { name: 'variant', type: "'dropzone' | 'inline'", default: "'dropzone'", description: 'Framed zone with icon tile, or a compact row.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Zone padding, tile and button size.' },
            { name: 'hint / error / required / disabled', type: '—', description: 'Same as Input.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Keyboard users Tab to the browse button (Enter/Space opens the picker); the native input is hidden from the tab order.',
            'The button is named “Upload files <label>” and described by the hint and error.',
            'Drag-and-drop is an enhancement only; everything works with the button.',
            'Each file row has a “Remove <file name>” button; focus returns to the browse button after removing.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
