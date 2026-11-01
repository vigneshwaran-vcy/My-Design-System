import { Button } from '@my-ds/ui';
import { useEffect, useState } from 'react';
import { CardDocs } from './docs/components/CardDocs';
import { ButtonDocs } from './docs/components/ButtonDocs';
import { InputDocs } from './docs/components/InputDocs';
import { Foundations, foundationsNav } from './docs/Foundations';
import { Overview } from './docs/Overview';

type Theme = 'light' | 'dark';

const NAV = [
  { title: 'Getting started', items: [['overview', 'Overview']] },
  { title: 'Foundations', items: foundationsNav },
  { title: 'Components', items: [['button', 'Button'], ['input', 'Input'], ['card', 'Card']] },
] as const;

const SECTION_IDS = NAV.flatMap((g) => g.items.map(([id]) => id));

function useActiveSection() {
  const [active, setActive] = useState<string>(SECTION_IDS[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '0px 0px -75% 0px' },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

export function App() {
  const [theme, setTheme] = useState<Theme>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  const active = useActiveSection();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="pg">
      <a className="pg__skip" href="#main">Skip to content</a>

      <aside className="pg__sidebar">
        <div className="pg__brand">
          <span className="pg__logo" aria-hidden="true" />
          <span>My Design System</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          aria-pressed={theme === 'dark'}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? 'Switch to dark' : 'Switch to light'}
        </Button>
        <nav aria-label="Documentation">
          {NAV.map((group) => (
            <div key={group.title} className="pg__nav-group">
              <p className="pg__nav-title">{group.title}</p>
              <ul className="pg__nav-list">
                {group.items.map(([id, label]) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="pg__nav-link"
                      aria-current={active === id ? 'location' : undefined}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <main id="main" className="pg__main">
        <Overview />
        <Foundations />
        <ButtonDocs />
        <InputDocs />
        <CardDocs />
      </main>
    </div>
  );
}
