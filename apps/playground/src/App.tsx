import { useEffect, useState } from 'react';
import { AlertDocs } from './docs/components/AlertDocs';
import { AvatarDocs } from './docs/components/AvatarDocs';
import { BadgeDocs } from './docs/components/BadgeDocs';
import { BreadcrumbDocs } from './docs/components/BreadcrumbDocs';
import { ButtonDocs } from './docs/components/ButtonDocs';
import { CardDocs } from './docs/components/CardDocs';
import { ChatInputDocs } from './docs/components/ChatInputDocs';
import { CheckboxDocs } from './docs/components/CheckboxDocs';
import { DropdownDocs } from './docs/components/DropdownDocs';
import { EmptyStateDocs } from './docs/components/EmptyStateDocs';
import { InputDocs } from './docs/components/InputDocs';
import { KbdDocs } from './docs/components/KbdDocs';
import { MenuDocs } from './docs/components/MenuDocs';
import { ModalDocs } from './docs/components/ModalDocs';
import { PaginationDocs } from './docs/components/PaginationDocs';
import { PopoverDocs } from './docs/components/PopoverDocs';
import { ProgressDocs } from './docs/components/ProgressDocs';
import { RadioGroupDocs } from './docs/components/RadioGroupDocs';
import { SeparatorDocs } from './docs/components/SeparatorDocs';
import { SkeletonDocs } from './docs/components/SkeletonDocs';
import { SpinnerDocs } from './docs/components/SpinnerDocs';
import { SwitchDocs } from './docs/components/SwitchDocs';
import { TableDocs } from './docs/components/TableDocs';
import { TabsDocs } from './docs/components/TabsDocs';
import { TextareaDocs } from './docs/components/TextareaDocs';
import { ToastDocs } from './docs/components/ToastDocs';
import { TooltipDocs } from './docs/components/TooltipDocs';
import { Foundations, foundationsNav } from './docs/Foundations';
import { Overview } from './docs/Overview';

type Theme = 'light' | 'dark';

const NAV = [
  { title: 'Getting started', items: [['overview', 'Overview']] },
  { title: 'Foundations', items: foundationsNav },
  { title: 'Forms', items: [['button', 'Button'], ['input', 'Input'], ['textarea', 'Textarea'], ['dropdown', 'Dropdown'], ['checkbox', 'Checkbox'], ['radio-group', 'Radio group'], ['switch', 'Switch'], ['chat-input', 'ChatInput']] },
  { title: 'Overlays', items: [['modal', 'Modal'], ['popover', 'Popover'], ['menu', 'Menu'], ['tooltip', 'Tooltip'], ['toast', 'Toast']] },
  { title: 'Data display', items: [['card', 'Card'], ['table', 'Table'], ['badge', 'Badge'], ['avatar', 'Avatar'], ['tabs', 'Tabs'], ['kbd', 'Kbd'], ['separator', 'Separator']] },
  { title: 'Feedback', items: [['alert', 'Alert'], ['progress', 'Progress'], ['spinner', 'Spinner'], ['skeleton', 'Skeleton'], ['empty-state', 'Empty state']] },
  { title: 'Navigation', items: [['breadcrumb', 'Breadcrumb'], ['pagination', 'Pagination']] },
] as const;

const SECTION_IDS = NAV.flatMap((g) => g.items.map(([id]) => id));

function useActiveSection() {
  const [active, setActive] = useState<string>(SECTION_IDS[0]);
  // The active section is the last one whose top has scrolled past a line just below the sticky top bar.
  // (An IntersectionObserver picked the section hidden under the bar after a jump.)
  useEffect(() => {
    const update = () => {
      const line = (document.querySelector('.pg__topbar')?.getBoundingClientRect().bottom ?? 0) + window.innerHeight * 0.2;
      let current = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    // ~40 rect reads per scroll event is cheap; no rAF throttle (rAF pauses in background tabs).
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
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

  const group = NAV.find((g) => g.items.some(([id]) => id === active));
  const page = group?.items.find(([id]) => id === active)?.[1];

  return (
    <div className="pg">
      <a className="pg__skip" href="#main">Skip to content</a>

      <aside className="pg__sidebar">
        <div className="pg__brand">
          <span className="pg__logo" aria-hidden="true" />
          <span className="pg__brand-name">My Design System</span>
          <span className="pg__version">v0.1</span>
        </div>
        <nav aria-label="Documentation" className="pg__nav">
          {NAV.map((g) => (
            <div key={g.title} className="pg__nav-group">
              <p className="pg__nav-title">{g.title}</p>
              <ul className="pg__nav-list">
                {g.items.map(([id, label]) => (
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

      <div className="pg__content">
        <header className="pg__topbar">
          <p className="pg__crumbs">
            <span>{group?.title}</span>
            <span aria-hidden="true" className="pg__crumb-sep">/</span>
            <span className="pg__crumb-current">{page}</span>
          </p>
          <ThemeSwitch theme={theme} onChange={setTheme} />
        </header>

      <main id="main" className="pg__main">
        <Overview />
        <Foundations />
        <ButtonDocs />
        <InputDocs />
        <TextareaDocs />
        <DropdownDocs />
        <CheckboxDocs />
        <RadioGroupDocs />
        <SwitchDocs />
        <ChatInputDocs />
        <ModalDocs />
        <PopoverDocs />
        <MenuDocs />
        <TooltipDocs />
        <ToastDocs />
        <CardDocs />
        <TableDocs />
        <BadgeDocs />
        <AvatarDocs />
        <TabsDocs />
        <KbdDocs />
        <SeparatorDocs />
        <AlertDocs />
        <ProgressDocs />
        <SpinnerDocs />
        <SkeletonDocs />
        <EmptyStateDocs />
        <BreadcrumbDocs />
        <PaginationDocs />
      </main>
      </div>
    </div>
  );
}

const SunIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="3.25" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 2.5v1.5M10 16v1.5M2.5 10H4M16 10h1.5M4.7 4.7l1.06 1.06M14.24 14.24l1.06 1.06M4.7 15.3l1.06-1.06M14.24 5.76l1.06-1.06"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M16.5 12.2A6.5 6.5 0 0 1 7.8 3.5a6.5 6.5 0 1 0 8.7 8.7Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

/** Two-option segmented switch, like the macOS appearance picker. */
function ThemeSwitch({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <div role="group" aria-label="Theme" className="pg__theme">
      {(['light', 'dark'] as const).map((t) => (
        <button
          key={t}
          type="button"
          className="pg__theme-option"
          aria-pressed={theme === t}
          aria-label={t === 'light' ? 'Light theme' : 'Dark theme'}
          onClick={() => onChange(t)}
        >
          {t === 'light' ? <SunIcon /> : <MoonIcon />}
        </button>
      ))}
    </div>
  );
}
