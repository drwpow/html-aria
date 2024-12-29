import type { ARIAAttribute, AncestorList, TagName, VirtualElement } from '../types.js';

/** Parse a list of roles, e.g. role="graphics-symbol img" */
export function parseTokenList(tokenList: string): string[] {
  return tokenList.toLocaleLowerCase().split(' ').filter(Boolean);
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

export const NAME_PROHIBITED_ATTRIBUTES = new Set(['aria-braillelabel', 'aria-label', 'aria-labelledby']);

/** Remove naming attributes */
export function namingProhibited(attributes: ARIAAttribute[]): ARIAAttribute[] {
  return attributes.filter((attr) => !NAME_PROHIBITED_ATTRIBUTES.has(attr));
}
