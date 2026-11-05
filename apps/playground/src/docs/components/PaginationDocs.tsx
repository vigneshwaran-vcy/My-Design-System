import { Pagination } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function PaginationDocs() {
  const [page, setPage] = useState(6);
  const [compactPage, setCompactPage] = useState(3);
  const [smallPage, setSmallPage] = useState(2);

  return (
    <DocSection id="pagination" eyebrow="Components" title="Pagination" description="Moves between pages of a table or list. Built from ghost Buttons, with the current page as a flat raised tab. Controlled: you own page and respond to onPageChange.">
      <CodeBlock label="Pagination import" code={`import { Pagination } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Default (siblingCount=1)"
          code={`const [page, setPage] = useState(6);
<Pagination page={page} pageCount={20} onPageChange={setPage} />`}
        >
          <Pagination page={page} pageCount={20} onPageChange={setPage} />
        </Example>

        <Example title="First / last controls and more siblings" code={`<Pagination page={page} pageCount={20} onPageChange={setPage} showFirstLast siblingCount={2} />`}>
          <Pagination page={page} pageCount={20} onPageChange={setPage} showFirstLast siblingCount={2} />
        </Example>

        <Example title="Compact" code={`<Pagination page={page} pageCount={9} onPageChange={setPage} compact />`}>
          <Pagination page={compactPage} pageCount={9} onPageChange={setCompactPage} compact />
        </Example>

        <Example title="Small (table footers)" code={`<Pagination size="sm" page={page} pageCount={8} onPageChange={setPage} />`}>
          <Pagination size="sm" page={smallPage} pageCount={8} onPageChange={setSmallPage} />
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Pagination props (plus native <nav> attributes)"
          rows={[
            { name: 'page', type: 'number', description: 'Current page, 1-based. Clamped to [1, pageCount].' },
            { name: 'pageCount', type: 'number', description: 'Total number of pages.' },
            { name: 'onPageChange', type: '(page: number) => void', description: 'Called with the new page. Not called when the current page is clicked.' },
            { name: 'siblingCount', type: 'number', default: '1', description: 'Pages shown on each side of the current page before an ellipsis.' },
            { name: 'showFirstLast', type: 'boolean', default: 'false', description: 'Adds "First page" and "Last page" jump buttons.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'md uses Button size sm (26px); sm uses xs (22px).' },
            { name: 'compact', type: 'boolean', default: 'false', description: 'Previous/next plus a live "Page X of Y" label; no page numbers.' },
            { name: 'aria-label', type: 'string', default: "'Pagination'", description: 'Landmark label for the <nav>.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            '<nav aria-label="Pagination"> with a list of native buttons: Tab between them, Enter/Space to activate.',
            'Every button has an aria-label ("Go to page 3", "Previous page"); the current page has aria-current="page".',
            'Previous/next (and first/last) are disabled at the bounds rather than hidden, so the layout is stable.',
            'Ellipses are aria-hidden spans; in compact mode "Page X of Y" is an aria-live="polite" region.',
            'The current page keeps the solid surface look on hover and does not fire onPageChange.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
