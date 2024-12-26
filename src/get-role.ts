import { roles } from './role.js';
import type { ARIARole, TagName, VirtualElement } from './types.js';

/**
 * Get the corresponding ARIA role for a given HTML element.
 * `undefined` means “no corresponding role”
 * @see https://www.w3.org/TR/html-aria/
 */
export function getRole(
  element: HTMLElement | VirtualElement,
): ARIARole | undefined {
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
  } else {
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

    tagName = (element as VirtualElement).tagName;
    attributes = (element as VirtualElement).attributes || {};
  }

  // explicit role: use if valid
  if (typeof attributes.role === 'string' && attributes.role in roles) {
    // TODO: throw error if role isn’t allowed?
    return attributes.role as ARIARole;
  }

  switch (tagName) {
    case 'a':
    case 'area': {
      if ('href' in attributes) {
        return 'link';
      }
      return 'generic';
    }
    case 'address': {
      return 'group';
    }
    case 'article': {
      return 'article';
    }
    case 'div': {
      return 'generic';
    }
    case 'span': {
      return 'generic';
    }
  }
}
