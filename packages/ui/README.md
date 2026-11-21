# @my-ds/ui

React components for My Design System. Every colour, size and shadow comes from
[`@my-ds/tokens`](../tokens), so the library themes (light and dark) through CSS variables.

> Proprietary. Use requires a licence from the copyright holder. See [LICENSE](./LICENSE).

## Install

```bash
npm install @my-ds/ui @my-ds/tokens react react-dom
```

Requires React 18 or later.

## Set up once

Import the token variables and the component styles at your app's entry point, tokens first:

```tsx
import '@my-ds/tokens/tokens.css';
import '@my-ds/ui/style.css';
```

## Use

```tsx
import { Button, Input } from '@my-ds/ui';

export function SignIn() {
  return (
    <form>
      <Input label="Email" type="email" />
      <Button variant="primary">Sign in</Button>
    </form>
  );
}
```

## Dark mode

Dark mode follows the operating system by default. To force a theme, set `data-theme` on `<html>`:

```html
<html data-theme="dark">   <!-- or "light" -->
```

## Components

Accordion, Alert, Avatar, Badge, Breadcrumb, Button, ButtonGroup, ButtonIcon, Calendar, Card, Carousel,
ChatInput, Checkbox, ColorPicker, Datepicker, DatetimePicker, Dropdown, DualListbox, DynamicIcon, EmptyState,
FileSelector, FormElement, Icon, Input, Kbd, Menu, Modal, Pagination, Pill, Popover, Progress,
ProgressIndicator, Prompt, Radio, ScopedTabs, SegmentedControl, Separator, Sidebar, Skeleton, Slider, Spinner,
Switch, Table, Tabs, Textarea, Tile, Timepicker, Toast, Tooltip, Tree, VerticalNavigation.

Live examples and every prop: <https://vigneshwaran-vcy.github.io/My-Design-System/>

## Icons

Icons come from the [Solar](https://icones.js.org/collection/solar) icon set by 480 Design, used under
CC BY 4.0. Render one with `<Icon name="home" />`.

## Changes between versions

See [CHANGELOG.md](./CHANGELOG.md).
