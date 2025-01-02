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

/** Logic shared by <header> and <footer> when determining role */
export function hasLandmarkParent(ancestors: AncestorList) {
  return !!firstMatchingAncestor(
    [
      { tagName: 'article', attributes: { role: 'article' } },
      { tagName: 'aside', attributes: { role: 'complementary' } },
      { tagName: 'main', attributes: { role: 'main' } },
      { tagName: 'nav', attributes: { role: 'navigation' } },
      { tagName: 'section', attributes: { role: 'region' } },
    ],
    ancestors,
  );
}

export interface RemoveProhibitedOptions<P extends ARIAAttribute[]> {
  nameProhibited?: boolean;
  prohibited?: P;
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

/** Inject attributes into an array */
export function injectAttrs(list: ARIAAttribute[], attrs: ARIAAttribute[]): ARIAAttribute[] {
  const newList = [...new Set([...list, ...attrs])];
  newList.sort((a, b) => a.localeCompare(b));
  return newList;
}

/** Is this element disabled? */
export function isDisabled(attributes: Record<string, string | boolean | number | undefined | null>): boolean {
  return (
    String(attributes.disabled).toLowerCase() === 'true' || String(attributes['aria-disabled']).toLowerCase() === 'true'
  );
}
