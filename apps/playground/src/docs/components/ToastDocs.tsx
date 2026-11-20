import { Button, ToastProvider, useToast, type ToastVariant } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const variants: ToastVariant[] = ['neutral', 'info', 'success', 'warn', 'danger'];

function VariantButtons() {
  const { toast } = useToast();
  return (
    <>
      {variants.map((variant) => (
        <Button
          key={variant}
          variant="secondary"
          onClick={() =>
            toast({
              variant,
              title: `${variant[0].toUpperCase()}${variant.slice(1)} toast`,
              description: 'Something happened that you might want to know about.',
            })
          }
        >
          {variant}
        </Button>
      ))}
    </>
  );
}

function ActionButtons() {
  const { toast, dismissAll } = useToast();
  return (
    <>
      <Button
        variant="soft"
        onClick={() =>
          toast({
            variant: 'success',
            title: 'Page archived',
            description: 'You can restore it from the archive at any time.',
            action: { label: 'Undo', onClick: () => toast({ title: 'Restored', variant: 'info', duration: 2000 }) },
          })
        }
      >
        With action
      </Button>
      <Button variant="soft" onClick={() => toast({ title: 'Sticky until dismissed', description: 'duration: 0', duration: 0 })}>
        Sticky
      </Button>
      <Button variant="secondary" onClick={dismissAll}>Dismiss all</Button>
    </>
  );
}

export function ToastDocs() {
  return (
    <ToastProvider>
      <DocSection id="toast" eyebrow="Components" title="Toast" description="Brief, non-blocking notifications that confirm an action or report a result. Mount one ToastProvider near the root of the app and call useToast() anywhere below it.">
        <CodeBlock
          label="Toast import"
          code={`import { ToastProvider, useToast } from '@my-ds/ui';

// Once, near the root:
<ToastProvider position="bottom-right">
  <App />
</ToastProvider>

// Anywhere below it:
const { toast, dismiss } = useToast();
const id = toast({ title: 'Saved', variant: 'success' });`}
        />

        <SubSection title="Examples">
          <Example
            title="Variants"
            code={`toast({ variant: 'success', title: 'Success toast', description: '…' });
toast({ variant: 'danger', title: 'Danger toast' }); // announced as role="alert"`}
          >
            <VariantButtons />
          </Example>

          <Example
            title="Action, sticky and dismiss"
            code={`toast({
  title: 'Page archived',
  action: { label: 'Undo', onClick: restore },
});
toast({ title: 'Sticky until dismissed', duration: 0 });
dismissAll();`}
          >
            <ActionButtons />
          </Example>
        </SubSection>

        <SubSection title="Props">
          <PropsTable
            caption="ToastProvider props"
            rows={[
              { name: 'position', type: "'bottom-right' | 'top-right' | 'bottom-center'", default: "'bottom-right'", description: 'Where the fixed viewport sits (layer-toast). Top stacks keep the newest nearest the edge.' },
              { name: 'duration', type: 'number', default: '5000', description: 'Default auto-dismiss time in ms for toasts that do not set their own.' },
              { name: 'limit', type: 'number', default: '5', description: 'Maximum toasts shown at once; the oldest are dropped first.' },
            ]}
          />
          <PropsTable
            caption="toast(options) — options"
            rows={[
              { name: 'title', type: 'ReactNode', description: 'Required headline.' },
              { name: 'description', type: 'ReactNode', description: 'Supporting copy in text-muted.' },
              { name: 'variant', type: "'neutral' | 'success' | 'warn' | 'danger' | 'info'", default: "'neutral'", description: 'Colours the status disc and the countdown line. danger is announced assertively.' },
              { name: 'duration', type: 'number', default: 'provider duration', description: 'Auto-dismiss in ms; 0 keeps the toast until dismissed. The timer pauses on hover and focus.' },
              { name: 'action', type: '{ label: ReactNode; onClick: () => void }', description: 'One optional action button; selecting it also dismisses the toast.' },
              { name: 'id', type: 'string', description: 'Stable id to update a toast in place. toast() returns the id for dismiss(id).' },
            ]}
          />
        </SubSection>

        <SubSection title="Accessibility">
          <Checklist
            items={[
              'Viewport is role="region" aria-label="Notifications" so screen-reader users can jump to it.',
              'Each toast is role="status" (polite live region); the danger variant is role="alert".',
              'Auto-dismiss pauses while hovered or focused, so keyboard users can reach the action and close buttons.',
              'Close button is a ghost Button with aria-label="Dismiss"; decorative icons are aria-hidden.',
              'Dark inverse card (light in dark mode) with a countdown line that pauses on hover and focus; slide-in and countdown respect prefers-reduced-motion.',
            ]}
          />
        </SubSection>
      </DocSection>
    </ToastProvider>
  );
}
