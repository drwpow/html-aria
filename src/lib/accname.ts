/**
 * Is a given element hidden?
 * @see https://w3c.github.io/accname/#dfn-hidden
 */
export function isHidden(element: Element): boolean {
  // Note: <div aria-hidden> will yield "", so equate that with "true"
  if (['true', ''].includes(element.getAttribute('aria-hidden')!)) {
    return true;
  }

  // Check if the element is hidden by CSS
  // https://w3c.github.io/accname/#computation-steps
  if (!('getComputedStyle' in globalThis)) {
    return false;
  }
  const style = globalThis.getComputedStyle(element);
  return (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.visibility === 'collapse' ||
    style.contentVisibility === 'hidden'
    // Note: opacity: 0 is NOT hidden
  );
}

/** Get CSS `content` */
export function getCSSContent(element: Element, pseudoElt?: '::before' | '::after' | '::marker'): string | undefined {
  if (!('getComputedStyle' in globalThis)) return undefined;
  const styles = globalThis.getComputedStyle(element, pseudoElt);
  let content = styles.getPropertyValue('content');

  // remove default/fallback placeholders
  if (
    !content ||
    ((pseudoElt === '::before' || pseudoElt === '::after') && content === 'none') ||
    (pseudoElt === '::marker' && (content === 'normal' || styles.display !== 'list-item')) // "list-item" needed to support ::marker, otherwise it’s ignored
  ) {
    return undefined;
  }

  // remove surrounding quotes (if any)
  if ((content.startsWith('"') && content.endsWith('"')) || (content.startsWith("'") && content.endsWith("'"))) {
    content = content.slice(1, -1);
  }

  const isInline = styles.display === 'inline';
  return isInline ? content : ` ${content} `;
}

/** Get calculated `display` property */
export function getDisplay(element: Element, pseudoElt?: string | null): string {
  if (!('getComputedStyle' in globalThis)) return 'block';
  return globalThis.getComputedStyle(element, pseudoElt).display || 'block';
}

/** Get tooltip content */
export function getTooltip(element: Element): string {
  // Already handled in Host Language Label above; this would only result in duplicate/inaccurate names
  if (['INPUT', 'IMG', 'OUTPUT', 'SELECT', 'SVG', 'TEXTAREA'].includes(element.tagName)) {
    return '';
  }
  const title = element.getAttribute('title');
  if (title) return title;
  return '';
}
