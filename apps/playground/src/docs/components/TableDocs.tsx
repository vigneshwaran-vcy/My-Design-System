import {
  Avatar,
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  type TableSortDirection,
} from '@my-ds/ui';
import { useMemo, useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

type User = { id: string; name: string; email: string; role: string; status: 'Active' | 'Invited' | 'Suspended'; seats: number; lastActive: string };

const users: User[] = [
  { id: 'u1', name: 'Ada Lovelace', email: 'ada@acme.io', role: 'Owner', status: 'Active', seats: 24, lastActive: '2 min ago' },
  { id: 'u2', name: 'Grace Hopper', email: 'grace@acme.io', role: 'Admin', status: 'Active', seats: 12, lastActive: '1 h ago' },
  { id: 'u3', name: 'Alan Turing', email: 'alan@acme.io', role: 'Member', status: 'Invited', seats: 0, lastActive: '—' },
  { id: 'u4', name: 'Katherine Johnson', email: 'kat@acme.io', role: 'Member', status: 'Suspended', seats: 3, lastActive: '12 d ago' },
];

const statusVariant: Record<User['status'], 'success' | 'accent' | 'danger'> = { Active: 'success', Invited: 'accent', Suspended: 'danger' };

type SortKey = 'name' | 'seats';

export function TableDocs() {
  const [sort, setSort] = useState<{ key: SortKey; dir: TableSortDirection }>({ key: 'name', dir: 'asc' });
  const [selected, setSelected] = useState<string | null>('u2');

  const sorted = useMemo(() => {
    const list = [...users];
    list.sort((a, b) => {
      const cmp = sort.key === 'seats' ? a.seats - b.seats : a.name.localeCompare(b.name);
      return sort.dir === 'desc' ? -cmp : cmp;
    });
    return list;
  }, [sort]);
  const dirFor = (key: SortKey) => (sort.key === key ? sort.dir : 'none');

  return (
    <DocSection id="table" eyebrow="Components" title="Table" description="Composable data table: a scroll container with a ring edge, hairline rows, a subtle header and optional sorting, selection, striping and a sticky header.">
      <CodeBlock
        label="Table import"
        code={`import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableEmpty } from '@my-ds/ui';`}
      />

      <SubSection title="Examples">
        <Example
          title="Users table — sortable, selectable rows with avatars and badges"
          code={`<Table columns={5}>
  <TableCaption>Workspace members</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead sortable sortDirection={dir} onSort={setDir}>User</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Status</TableHead>
      <TableHead numeric sortable sortDirection="none" onSort={…}>Seats</TableHead>
      <TableHead align="end">Last active</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow interactive selected={selected === user.id} onClick={() => select(user.id)}>
      <TableCell><Avatar size="sm" name={user.name} /> {user.name}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell><Badge dot variant="success">Active</Badge></TableCell>
      <TableCell numeric>{user.seats}</TableCell>
      <TableCell align="end">{user.lastActive}</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
        >
          <Table columns={5} containerProps={{ style: { width: '100%' } }}>
            <TableCaption>Workspace members</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead sortable sortDirection={dirFor('name')} onSort={(dir) => setSort({ key: 'name', dir })}>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead numeric sortable sortDirection={dirFor('seats')} onSort={(dir) => setSort({ key: 'seats', dir })}>Seats</TableHead>
                <TableHead align="end">Last active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((user) => (
                <TableRow key={user.id} interactive selected={selected === user.id} onClick={() => setSelected(user.id)}>
                  <TableCell>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--ds-space-3)' }}>
                      <Avatar size="sm" name={user.name} />
                      <span style={{ display: 'grid', lineHeight: 'var(--ds-font-line-height-tight)' }}>
                        <span style={{ fontWeight: 'var(--ds-font-weight-medium)' }}>{user.name}</span>
                        <span style={{ fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-muted)' }}>{user.email}</span>
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge dot variant={statusVariant[user.status]}>{user.status}</Badge>
                  </TableCell>
                  <TableCell numeric>{user.seats}</TableCell>
                  <TableCell align="end">{user.lastActive}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Example>

        <Example title="Small and striped" code={`<Table size="sm" striped>…</Table>`}>
          <Table size="sm" striped columns={3} containerProps={{ style: { width: '100%' } }}>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead numeric>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[['INV-1041', 'Acme Corp', '$1,250.00'], ['INV-1042', 'Globex', '$480.00'], ['INV-1043', 'Initech', '$2,310.00'], ['INV-1044', 'Umbrella', '$990.00']].map(([id, c, a]) => (
                <TableRow key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{c}</TableCell>
                  <TableCell numeric>{a}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Example>

        <Example title="Sticky header in a scrolling container" code={`<Table stickyHeader containerProps={{ style: { maxHeight: 200 } }}>…</Table>`}>
          <Table stickyHeader columns={2} containerProps={{ style: { width: '100%', maxHeight: 'calc(var(--ds-space-16) * 3)' } }}>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead align="end">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 12 }, (_, i) => (
                <TableRow key={i}>
                  <TableCell>Deployment #{1200 - i} succeeded</TableCell>
                  <TableCell align="end">{i + 1} h ago</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Example>

        <Example title="Empty state" code={`<TableBody>
  <TableEmpty>No members match "design".</TableEmpty>
</TableBody>`}>
          <Table columns={3} containerProps={{ style: { width: '100%' } }}>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableEmpty>No members match &ldquo;design&rdquo;.</TableEmpty>
            </TableBody>
          </Table>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Table props (plus all native <table> attributes)"
          rows={[
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Cell padding and font size (xs / sm).' },
            { name: 'striped', type: 'boolean', default: 'false', description: 'Alternates even rows with bg-subtle.' },
            { name: 'stickyHeader', type: 'boolean', default: 'false', description: 'Header sticks to the top of the scroll container (layer-sticky).' },
            { name: 'columns', type: 'number', description: 'Column count, used as the colSpan of TableEmpty.' },
            { name: 'containerProps', type: 'HTMLAttributes<HTMLDivElement>', description: 'Props for the scroll container (e.g. maxHeight).' },
          ]}
        />
        <PropsTable
          caption="TableRow / TableHead / TableCell / TableEmpty"
          rows={[
            { name: 'TableRow.selected', type: 'boolean', description: 'Sets aria-selected and an accent-subtle background.' },
            { name: 'TableRow.interactive', type: 'boolean', default: 'false', description: 'Hover highlight and pointer cursor for clickable rows.' },
            { name: 'TableHead.sortable', type: 'boolean', default: 'false', description: 'Renders the label as a sort button and sets aria-sort.' },
            { name: 'TableHead.sortDirection', type: "'asc' | 'desc' | 'none'", default: "'none'", description: 'Current sort for this column.' },
            { name: 'TableHead.onSort', type: "(direction: 'asc' | 'desc') => void", description: 'Called with the next direction (asc → desc → asc).' },
            { name: 'TableCell.align', type: "'start' | 'center' | 'end'", default: "'start'", description: 'Text alignment (also on TableHead).' },
            { name: 'TableCell.numeric', type: 'boolean', default: 'false', description: 'Tabular figures, end-aligned by default (also on TableHead).' },
            { name: 'TableEmpty.colSpan', type: 'number', description: 'Overrides the Table columns count.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Native <table>, <thead>, <tbody>, <th scope="col"> and <caption>: always add a TableCaption or aria-label on Table.',
            'Sortable headers expose aria-sort="ascending | descending | none" and a real <button> (Tab, Enter, Space) whose name is the column label.',
            'Selected rows set aria-selected; interactive rows are only a hover affordance — put the actual link or button inside a cell.',
            'The scroll container keeps the table usable on narrow viewports; sticky headers stay readable while scrolling.',
            'Numeric cells use tabular figures and end alignment so columns of numbers line up.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
