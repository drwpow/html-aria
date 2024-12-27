import { parseTokenList, virtualizeElement } from './lib.js';
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
  const { tagName, attributes } = virtualizeElement(element);

  // explicit role: use if valid
  if (typeof attributes?.role === 'string') {
    // Note: according to the spec, `role` can not only be a list of spring-separated values;
    // it can contain fallbacks the browser may not understand. According to spec, an arbitrary
    // role is to be ignored, so we take the first match (if any), or `undefined`.
    const roleList = parseTokenList(attributes.role);
    return roleList.find((role) => role in roles) as ARIARole | undefined;
  }

  switch (tagName) {
    case 'a':
    case 'area': {
      if (typeof attributes?.href === 'string') {
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
    case 'b':
    case 'bdi':
    case 'bdo':
    case 'div':
    case 'span': {
      return 'generic';
    }
  }
}
