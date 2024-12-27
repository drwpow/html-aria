import type { ARIARole, TagName, VirtualElement } from '../types.js';

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

/** Given a lineage, find the first matching ancestor. */
export function findFirstSignificantAncestor(
  validRoles: ARIARole[],
  lineage?: (string | undefined | null)[],
): ARIARole | undefined {
  if (!lineage) {
    return undefined;
  }
  return (lineage as ARIARole[]).find((r) => validRoles.includes(r)) || undefined;
}
