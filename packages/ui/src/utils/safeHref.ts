/**
 * Drops link URLs that run code when clicked (`javascript:`, `vbscript:`, `data:`), so a URL that came from
 * user content cannot turn a design-system link into script. Relative, hash, http(s), mailto and tel links pass.
 */
const UNSAFE_SCHEME = /^(?:javascript|vbscript|data):/i;

export function safeHref(href: string | undefined): string | undefined {
  if (href === undefined) return undefined;
  // Browsers ignore control characters and whitespace inside the scheme ("java\tscript:"), so strip them first.
  // eslint-disable-next-line no-control-regex
  const normalised = href.replace(/[\u0000- \u007f-\u009f]/g, '');
  return UNSAFE_SCHEME.test(normalised) ? undefined : href;
}
