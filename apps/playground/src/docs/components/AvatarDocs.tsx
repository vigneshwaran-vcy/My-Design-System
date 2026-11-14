import { Avatar, AvatarGroup } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const photo = 'https://i.pravatar.cc/128?img=47';

export function AvatarDocs() {
  return (
    <DocSection id="avatar" eyebrow="Components" title="Avatar" description="Represents a person or workspace with a photo, falling back to tinted initials. Group them with AvatarGroup to show who is involved.">
      <CodeBlock label="Avatar import" code={`import { Avatar, AvatarGroup } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Image and initials fallback"
          code={`<Avatar src="/ada.jpg" name="Ada Lovelace" />
<Avatar name="Grace Hopper" />
<Avatar name="Alan Turing" />
<Avatar />`}
        >
          <Avatar src={photo} name="Ada Lovelace" />
          <Avatar name="Grace Hopper" />
          <Avatar name="Alan Turing" />
          <Avatar name="Katherine Johnson" />
          <Avatar />
        </Example>

        <Example title="Sizes — 24 / 32 / 40 / 48 / 64" code={`<Avatar size="xs" name="Ada Lovelace" />
<Avatar size="sm" … /> <Avatar size="md" … /> <Avatar size="lg" … /> <Avatar size="xl" … />`}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <Avatar key={size} size={size} name="Ada Lovelace" />
          ))}
        </Example>

        <Example title="Square" code={`<Avatar shape="square" name="Acme Corp" />
<Avatar shape="square" src="/logo.png" name="Globex" />`}>
          <Avatar shape="square" name="Acme Corp" />
          <Avatar shape="square" src={photo} name="Globex" />
          <Avatar shape="square" size="lg" name="Initech" />
        </Example>

        <Example
          title="Presence status"
          code={`<Avatar name="Ada Lovelace" status="online" />
<Avatar name="Grace Hopper" status="away" />
<Avatar name="Alan Turing" status="busy" />
<Avatar name="Linus" status="offline" />`}
        >
          <Avatar name="Ada Lovelace" status="online" />
          <Avatar name="Grace Hopper" status="away" src={photo} />
          <Avatar name="Alan Turing" status="busy" />
          <Avatar name="Linus Torvalds" status="offline" />
        </Example>

        <Example
          title="Broken image → initials"
          code={`<Avatar src="https://example.invalid/missing.png" name="Margaret Hamilton" />`}
        >
          <Avatar src="https://example.invalid/missing.png" name="Margaret Hamilton" />
        </Example>

        <Example
          title="AvatarGroup (project members)"
          code={`<AvatarGroup max={3} aria-label="Project members">
  <Avatar name="Ada Lovelace" src="/ada.jpg" />
  <Avatar name="Grace Hopper" />
  <Avatar name="Alan Turing" />
  <Avatar name="Katherine Johnson" />
  <Avatar name="Linus Torvalds" />
</AvatarGroup>`}
        >
          <AvatarGroup max={3} aria-label="Project members">
            <Avatar name="Ada Lovelace" src={photo} />
            <Avatar name="Grace Hopper" />
            <Avatar name="Alan Turing" />
            <Avatar name="Katherine Johnson" />
            <Avatar name="Linus Torvalds" />
          </AvatarGroup>
          <AvatarGroup size="sm" max={4} aria-label="Reviewers">
            <Avatar size="sm" name="Ada Lovelace" />
            <Avatar size="sm" name="Grace Hopper" />
            <Avatar size="sm" name="Alan Turing" />
          </AvatarGroup>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Avatar props (plus all native <span> attributes)"
          rows={[
            { name: 'src', type: 'string', description: 'Image URL. Falls back to initials when missing or on load error.' },
            { name: 'alt', type: 'string', description: 'Accessible name for the image. Defaults to name.' },
            { name: 'name', type: 'string', description: 'Drives the initials (first letters of the first two words), the deterministic tint and the accessible name.' },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Diameter 24 / 32 / 40 / 48 / 64 (size-avatar-*).' },
            { name: 'shape', type: "'circle' | 'square'", default: "'circle'", description: 'Square uses radius-md (sm on xs, control on lg/xl).' },
            { name: 'status', type: "'online' | 'offline' | 'busy' | 'away'", description: 'Presence dot bottom-right, ringed by bg-surface. Appended to the accessible name.' },
          ]}
        />
        <PropsTable
          caption="AvatarGroup props (plus all native <div> attributes)"
          rows={[
            { name: 'max', type: 'number', description: 'Avatars shown before the rest collapse into a "+N" bubble.' },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Overlap amount and the size of the overflow bubble. Pass the same size to each Avatar.' },
            { name: 'shape', type: "'circle' | 'square'", default: "'circle'", description: 'Shape of the overflow bubble.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Renders role="img" with aria-label from alt or name; the inner <img> has an empty alt so the name is announced once.',
            'With no name or image, the placeholder is aria-hidden (purely decorative).',
            'Status is announced as part of the name ("Ada Lovelace, busy"); the dot itself is aria-hidden.',
            'AvatarGroup is role="group" — give it an aria-label; the "+N" bubble is announced as "N more".',
            'Initial tints are chosen by hashing the name, so the same person always gets the same colour across views.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
