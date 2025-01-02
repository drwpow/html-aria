import type {
  ARIAAttribute,
  AncestorList,
  AttributeData,
  NameProhibitedAttributes,
  TagName,
  VirtualElement,
} from '../types.js';

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

/** Are we able to traverse the DOM? */
export function isHTMLElement(element: HTMLElement | VirtualElement): boolean {
  return typeof HTMLElement !== 'undefined' && element instanceof HTMLElement;
}

/** Normalize HTML Elements */
export function virtualizeElement(element: HTMLElement | VirtualElement): VirtualElement {
  // handle HTMLElement or VirtualElement
  let tagName = '' as TagName;
  let attributes: VirtualElement['attributes'];

  if (isHTMLElement(element)) {
    tagName = element.tagName.toLowerCase() as TagName;
    attributes = {};
    for (let i = 0; i < (element as HTMLElement).attributes.length; i++) {
      // biome-ignore lint/style/noNonNullAssertion: This is guaranteed
      const { name } = (element as HTMLElement).attributes[i]!;
      attributes[name] = (element as HTMLElement).getAttribute(name);
    }
    return { tagName, attributes };
  }

  if (!element || typeof element !== 'object' || Array.isArray(element) || typeof element.tagName !== 'string') {
    throw new Error(`Expected { tagName, [attributes] } object, received ${JSON.stringify(element)}`);
  }

  return { ...element } as VirtualElement;
}

/**
 * Determine accessible names for SOME tags (not all)
 * @see https://www.w3.org/TR/wai-aria-1.3/#namecalculation
 */
export function calculateAccessibleName(element: VirtualElement): string | undefined {
  const { tagName, attributes } = element;

  switch (tagName) {
    case 'img': {
      // according to spec, aria-label is technically allowed for <img> (even if alt is preferred)
      return (attributes?.alt || attributes?.['aria-label'] || attributes?.['aria-labelledby']) as string;
    }
  }
}

/** Is an ancestor list provided and is it empty? */
export function isEmptyAncestorList(ancestors?: AncestorList): boolean {
  return Array.isArray(ancestors) && ancestors.length === 0;
}

/** Given ancestors, find the first matching ancestor. */
export function firstMatchingAncestor(
  validAncestors: VirtualElement[],
  ancestors?: AncestorList,
): VirtualElement | undefined {
  const match = (ancestors ?? []).find((a) => {
    const { tagName, attributes } = virtualizeElement(a);
    return validAncestors.some(
      (v) => (v.attributes?.role && v.attributes.role === attributes?.role) || v.tagName === tagName,
    );
  });
  if (match) {
    return virtualizeElement(match);
  }
}

export const NAME_PROHIBITED_ATTRIBUTES = new Set<string>([
  'aria-braillelabel',
  'aria-brailleroledescription',
  'aria-label',
  'aria-labelledby',
  'aria-roledescription',
] satisfies NameProhibitedAttributes[]);

/** Remove naming attributes */
export function namingProhibitedList<T extends string[]>(attributeList: T): Exclude<T, NameProhibitedAttributes> {
  return attributeList.filter((attr) => !NAME_PROHIBITED_ATTRIBUTES.has(attr)) as Exclude<T, NameProhibitedAttributes>;
}

/** Remove naming attributes */
export function namingProhibitedMap<T extends Record<string, AttributeData>>(
  attributeMap: T,
): Omit<T, NameProhibitedAttributes> {
  const clone = {} as T;

  for (const [k, v] of Object.entries(attributeMap)) {
    if (!NAME_PROHIBITED_ATTRIBUTES.has(k)) {
      (clone as Record<string, unknown>)[k] = v;
    }
  }
  return clone;
}
