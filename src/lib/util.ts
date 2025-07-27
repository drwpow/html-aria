import type {
  ARIAAttribute,
  ARIARole,
  LandmarkRole,
  NameProhibitedAttributes,
  TagName,
  VirtualAncestorList,
  VirtualElement,
} from '../types.js';
import { landmarkRoles } from './aria-roles.js';

/** Parse a list of roles, e.g. role="graphics-symbol img" */
export function parseTokenList(tokenList: string): string[] {
  return tokenList.toLocaleLowerCase().split(' ').filter(Boolean);
}

/**
 * Get the first matching value in a tokenlist
 *
 * Note: according to the spec, `role` can not only be a list of
 * spring-separated values; it can contain fallbacks the browser may not
 * understand. According to spec, an arbitrary role is to be ignored, so we take
 * the first match (if any), or `undefined`.
 * @see
 */
export function firstMatchingToken<T>(tokenList: string, validValues: T[]): T | undefined {
  return parseTokenList(tokenList).find((value) => validValues.includes(value as T)) as T | undefined;
}

export function getTagName(element: Element | VirtualElement): TagName {
  // JSDOM bug: feDropShadow gets converted to fedropshadow. Since this library is often used in JSDOM contexts, we should handle this at runtime, cheaply
  if (element.tagName === 'fedropshadow') {
    return 'feDropShadow';
  }

  // note: HTML is case-insensitive, but SVG is not. Browsers will normalize case-insensitive
  // names to UPPERCASE (e.g. `BUTTON`), and leave SVG in its original camelCase format.
  const caseInsensitive = /^[A-Z]/.test(element.tagName);
  return (caseInsensitive ? element.tagName.toLowerCase() : element.tagName) as TagName;
}

/**
 * Get attribute from any type of element. Optimized for performance.
 */
export function attr(element: Element | VirtualElement, attribute: string): string | null {
  if (typeof Element !== 'undefined' && element instanceof Element) {
    return (element as Element).getAttribute(attribute) ?? null;
  }
  const { attributes = {} } = element as VirtualElement;
  return attribute in attributes ? String(attributes[attribute]) : null;
}

export const NAME_PROHIBITED_ATTRIBUTES = new Set<string>([
  'aria-braillelabel',
  'aria-label',
  'aria-labelledby',
] satisfies NameProhibitedAttributes[]);

const LANDMARK_ROLES = Object.keys(landmarkRoles) as LandmarkRole[];
const LANDMARK_ELEMENTS: TagName[] = ['article', 'aside', 'main', 'nav', 'section'];
const LANDMARK_CSS_SELECTOR = LANDMARK_ROLES.map((role) => `[role=${role}]`)
  .concat(...LANDMARK_ELEMENTS.map((el) => `${el}:not([role])`))
  .join(',');

/** Logic shared by <header> and <footer> when determining role */
export function hasLandmarkParent(element: Element | VirtualElement, ancestors?: VirtualAncestorList): boolean {
  if (typeof Element !== 'undefined' && element instanceof Element) {
    return !!element.parentElement?.closest(LANDMARK_CSS_SELECTOR);
  }
  return !!ancestors?.some(
    (el) => LANDMARK_ELEMENTS.includes(el.tagName) || LANDMARK_ROLES.includes(attr(el, 'role') as LandmarkRole),
  );
}

/** Used to calculate some host language labels */
const LIST_ELEMENTS: TagName[] = ['ul', 'ol', 'menu'];
const LIST_ROLES: ARIARole[] = ['list'];
const LIST_CSS_SELECTOR = LIST_ROLES.map((role) => `[role=${role}]`)
  .concat(...LIST_ELEMENTS.map((el) => `${el}:not([role])`))
  .join(',');

export function hasListParent(element: Element | VirtualElement, ancestors?: VirtualAncestorList): boolean {
  if (typeof Element !== 'undefined' && element instanceof Element) {
    return !!element.parentElement?.closest(LIST_CSS_SELECTOR);
  }
  // special behavior: outside the DOM, if we’re testing a list-like element, assume it’s within a list
  if (ancestors?.length !== 0 && getTagName(element) === 'li') {
    return true;
  }
  return !!ancestors?.some(
    (el) => LIST_ELEMENTS.includes(el.tagName) || (LIST_ROLES as string[]).includes(attr(el, 'role') as string),
  );
}

const GRID_ROLES: ARIARole[] = ['grid', 'treegrid'];
const GRID_CSS_SELECTOR = GRID_ROLES.map((role) => `[role=${role}]`).join(',');

/** Logic shared by <td> and <th> when determining role */
export function hasGridParent(element: Element | VirtualElement, ancestors?: VirtualAncestorList): boolean {
  if (typeof Element !== 'undefined' && element instanceof Element) {
    return !!element.parentElement?.closest(GRID_CSS_SELECTOR);
  }
  return !!ancestors?.some((el) => GRID_ROLES.includes(attr(el, 'role')! as (typeof GRID_ROLES)[number]));
}

export interface RemoveProhibitedOptions<P extends ARIAAttribute[]> {
  nameProhibited?: boolean;
  prohibited?: P;
}

export function hasTableParent(element: Element | VirtualElement, ancestors?: VirtualAncestorList): boolean {
  if (typeof Element !== 'undefined' && element instanceof Element) {
    return !!element.parentElement?.closest('table,[role=table]');
  }
  // special behavior: outside the DOM, if we’re testing a table-like element, assume it’s within a table
  if (
    ancestors?.length !== 0 &&
    ['tbody', 'thead', 'tfoot', 'tr', 'td', 'th', 'col', 'colgroup', 'rowgroup'].includes(getTagName(element))
  ) {
    return true;
  }
  return !!ancestors?.some((el) => el.tagName === 'table' || attr(el, 'role') === 'table');
}

const SECTIONING_CONTENT_ROLES: ARIARole[] = ['article', 'complementary', 'navigation', 'region'];
const SECTIONING_CONTENT_ELEMENTS: TagName[] = ['article', 'aside', 'nav', 'section'];
const SECTIONING_CONTENT_CSS_SELECTOR = SECTIONING_CONTENT_ROLES.map((role) => `[role=${role}]`)
  .concat(...SECTIONING_CONTENT_ELEMENTS.map((el) => `${el}:not([role])`))
  .join(',');

/**
 * Has sectioning content parent
 * @see https://html.spec.whatwg.org/multipage/dom.html#sectioning-content
 */
export function hasSectioningContentParent(
  element: Element | VirtualElement,
  ancestors?: VirtualAncestorList,
): boolean {
  if (typeof Element !== 'undefined' && element instanceof Element) {
    return !!element.parentElement?.closest(SECTIONING_CONTENT_CSS_SELECTOR);
  }
  return !!ancestors?.some(
    (el) =>
      SECTIONING_CONTENT_ELEMENTS.includes(el.tagName) ||
      (SECTIONING_CONTENT_ROLES as string[]).includes(attr(el, 'role') as string),
  );
}

/** Remove prohibited aria-* attributes from a list */
export function removeProhibited<T extends ARIAAttribute[], P extends ARIAAttribute[]>(
  attributeList: T,
  options?: RemoveProhibitedOptions<P>,
): Exclude<T, keyof P> {
  if (!options || (!options.nameProhibited && !options.prohibited)) {
    return attributeList as Exclude<T, keyof P>;
  }
  return attributeList.filter((attr) => {
    const isProhibited =
      (options.nameProhibited && NAME_PROHIBITED_ATTRIBUTES.has(attr)) || options.prohibited?.includes(attr);
    return !isProhibited;
  }) as Exclude<T, keyof P>;
}

/** Inject new items into an array */
export function concatDedupeAndSort<T extends string>(list: T[], newItems: T[]): T[] {
  const newList = [...new Set([...list, ...newItems])];
  newList.sort((a, b) => a.localeCompare(b));
  return newList;
}

/** Is this element disabled? */
export function isDisabled(element: Element | VirtualElement): boolean {
  const disabled = String(attr(element, 'disabled'));
  if (disabled === '' || disabled === 'true') {
    return true;
  }
  const ariaDisabled = String(attr(element, 'aria-disabled'));
  return ariaDisabled === '' || ariaDisabled === 'true';
}

/**
 * Is a given element hidden?
 * @see https://w3c.github.io/accname/#dfn-hidden
 */
export function isHidden(element: Element | VirtualElement): boolean {
  // Note: <div aria-hidden> will yield "", so equate that with "true"
  if (['true', ''].includes(attr(element, 'aria-hidden') as string)) {
    return true;
  }

  // Check if the element is hidden by CSS
  // https://w3c.github.io/accname/#computation-steps
  if (!('getComputedStyle' in globalThis) || typeof Element === 'undefined' || !(element instanceof Element)) {
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
export function getCSSContent(
  element: Element | VirtualElement,
  pseudoElt?: '::before' | '::after' | '::marker',
): string | undefined {
  if (!('getComputedStyle' in globalThis) || typeof Element === 'undefined' || !(element instanceof Element))
    return undefined;
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
  if (!('getComputedStyle' in globalThis || typeof Element === 'undefined')) return 'block';
  return globalThis.getComputedStyle(element, pseudoElt).display || 'block';
}

/** Get tooltip content */
export function getTooltip(element: Element | VirtualElement): string {
  // Already handled in Host Language Label above; this would only result in duplicate/inaccurate names
  if (['input', 'img', 'output', 'select', 'svg', 'textarea'].includes(getTagName(element))) {
    return '';
  }
  return attr(element, 'title') ?? '';
}
