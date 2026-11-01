import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@my-ds/ui';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function App() {
  const [theme, setTheme] = useState<Theme>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const error = email && !email.includes('@') ? 'Enter a valid email address.' : undefined;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const submit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <main className="pg">
      <header className="pg__header">
        <h1 className="pg__title">Playground</h1>
        <Button variant="secondary" size="sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </Button>
      </header>

      <section className="pg__section" aria-labelledby="buttons">
        <h2 id="buttons" className="pg__heading">Buttons</h2>
        <div className="pg__row">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
        <div className="pg__row">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="pg__section" aria-labelledby="form">
        <h2 id="form" className="pg__heading">Composed</h2>
        <Card as="form" className="pg__card" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <CardHeader title="Join the beta" description="We'll email you when your seat is ready." />
          <CardBody className="pg__stack">
            <Input label="Name" placeholder="Ada Lovelace" />
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              hint="Work email preferred."
              error={error}
            />
          </CardBody>
          <CardFooter>
            <Button variant="ghost" type="reset" onClick={() => setEmail('')}>Clear</Button>
            <Button type="submit" loading={loading} disabled={!!error}>Request access</Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
