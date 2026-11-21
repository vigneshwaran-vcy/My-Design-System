import { describe, expect, it } from 'vitest';
import { safeHref } from './safeHref';

describe('safeHref', () => {
  it('keeps ordinary links', () => {
    for (const href of ['/projects', '#tokens', '?page=2', 'https://example.com', 'mailto:hi@example.com', 'tel:+100']) {
      expect(safeHref(href)).toBe(href);
    }
    expect(safeHref(undefined)).toBeUndefined();
  });

  it('drops links that would run script, however they are disguised', () => {
    for (const href of ['javascript:alert(1)', 'JavaScript:alert(1)', ' javascript:alert(1)', 'java\tscript:alert(1)', 'java\nscript:x', 'vbscript:x', 'data:text/html,<script>x</script>']) {
      expect(safeHref(href)).toBeUndefined();
    }
  });
});
