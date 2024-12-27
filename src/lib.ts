import type { TagName, VirtualElement } from './types.js';

/**
 * Parse a list of roles, e.g. role="graphics-symbol img"
 */
export function parseTokenList(tokenList: string): string[] {
  return tokenList.toLocaleLowerCase().split(' ').filter(Boolean);
}

/**
 */
export function virtualizeElement(
  element: HTMLElement | VirtualElement,
): VirtualElement {
  // handle HTMLElement or VirtualElement
  let tagName = '' as TagName;
  let attributes: NonNullable<VirtualElement['attributes']> = {};
  if (typeof HTMLElement !== 'undefined' && element instanceof HTMLElement) {
    tagName = element.tagName.toLowerCase() as TagName;
    attributes = {};
    for (let i = 0; i < element.attributes.length; i++) {
      // biome-ignore lint/style/noNonNullAssertion: This is guaranteed
      const { name } = element.attributes[i]!;
      attributes[name] = element.getAttribute(name);
    }
    return {
      tagName,
      ...(Object.keys(attributes) && { attributes }),
    };
  }

  if (
    !element ||
    typeof element !== 'object' ||
    Array.isArray(element) ||
    typeof element.tagName !== 'string'
  ) {
    throw new Error(
      `Expected { tagName, [attributes] } object, received ${JSON.stringify(element)}`,
    );
  }

  return { ...element } as VirtualElement;
}
