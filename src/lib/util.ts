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
  let attributes: NonNullable<VirtualElement['attributes']> = {};

  if (isHTMLElement(element)) {
    tagName = element.tagName.toLowerCase() as TagName;
    attributes = {};
    for (let i = 0; i < (element as HTMLElement).attributes.length; i++) {
      // biome-ignore lint/style/noNonNullAssertion: This is guaranteed
      const { name } = (element as HTMLElement).attributes[i]!;
      attributes[name] = (element as HTMLElement).getAttribute(name);
    }
    return {
      tagName,
      ...(Object.keys(attributes) && { attributes }),
    };
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
  const { tagName, attributes = {} } = element;

  switch (tagName) {
    case 'img': {
      // according to spec, aria-label is technically allowed for <img> (even if alt is preferred)
      return (attributes.alt || attributes['aria-label'] || attributes['aria-labelledby']) as string;
    }
  }
}

/** Given ancestors, find the first matching ancestor. */
export function findFirstSignificantAncestor(
  validAncestors: VirtualElement[],
  ancestors?: AncestorList,
): VirtualElement | undefined {
  if (!ancestors) {
    return undefined;
  }
  for (const ancestor of ancestors) {
    if (!ancestor) {
      continue;
    }
    const { tagName, attributes = {} } = virtualizeElement(ancestor);
    const match = validAncestors.find(
      (a) => (a.attributes?.role && a.attributes.role === attributes.role) || a.tagName === tagName,
    );
    if (match) {
      return match;
    }
  }
}

/** Remove naming attributes */
export function namingProhibited(attributes: ARIAAttribute[]): ARIAAttribute[] {
  return attributes.filter((attr) => attr !== 'aria-label' && attr !== 'aria-labelledby');
}
