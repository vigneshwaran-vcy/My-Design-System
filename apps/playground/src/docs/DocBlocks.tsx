import { Button } from '@my-ds/ui';
import { useEffect, useState, type ReactNode } from 'react';

export function DocSection({ id, eyebrow, title, description, children }: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="doc-section" aria-labelledby={`${id}-title`}>
      <header className="doc-section__header">
        {eyebrow && <p className="doc-eyebrow">{eyebrow}</p>}
        <h2 id={`${id}-title`} className="doc-section__title">{title}</h2>
        {description && <p className="doc-lead">{description}</p>}
      </header>
      {children}
    </section>
  );
}

export function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="doc-sub">
      <h3 className="doc-sub__title">{title}</h3>
      {children}
    </div>
  );
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={copied ? `Copied ${label}` : `Copy ${label}`}
      onClick={() => navigator.clipboard?.writeText(value).then(() => setCopied(true))}
    >
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </Button>
  );
}

export function CodeBlock({ code, label = 'code' }: { code: string; label?: string }) {
  return (
    <div className="doc-code">
      <pre>
        <code>{code}</code>
      </pre>
      <div className="doc-code__copy">
        <CopyButton value={code} label={label} />
      </div>
    </div>
  );
}

export function Example({ title, code, children }: { title: string; code?: string; children: ReactNode }) {
  return (
    <figure className="doc-example">
      <figcaption className="doc-example__title">{title}</figcaption>
      <div className="doc-example__preview">{children}</div>
      {code && <CodeBlock code={code} label={`${title} example`} />}
    </figure>
  );
}

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export function PropsTable({ caption, rows }: { caption: string; rows: PropRow[] }) {
  return (
    <div className="doc-table-wrap">
      <table className="doc-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <th scope="row"><code>{row.name}</code></th>
              <td><code className="doc-type">{row.type}</code></td>
              <td>{row.default ? <code>{row.default}</code> : '—'}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Checklist({ items }: { items: ReactNode[] }) {
  return (
    <ul className="doc-checklist">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
