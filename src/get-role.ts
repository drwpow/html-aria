import { findFirstSignificantAncestor, isHTMLElement, parseTokenList, virtualizeElement } from './lib/util.js';
import { roles } from './lib/role.js';
import type { ARIARole, VirtualElement } from './types.js';
import { tags } from './lib/html.js';

export interface GetRoleOptions {
  /**
   * Declare relevant lineage, ordered from most direct parent to furthest
   * ancestor. This affects the results, e.g.
   *
   * - <td> with lineage ['table'] will be role 'cell'
   * - <td> with lineage ['grid'] or ['treegrid'] will be 'gridcell'
   * - <td> with NO lineage ([]) will be no role (`undefined`)
   *
   * This list does NOT have to be complete; e.g. `'row'`  can be skipped as it
   * doesn’t affect behavior. But irrelevant parents may be supplied for ease of
   * use, and only the first significant ancestor will apply.
   */
  lineage?: (ARIARole | undefined | null)[];
}

/**
 * Get the corresponding ARIA role for a given HTML element.
 * `undefined` means “no corresponding role”.
 * Note this does NOT traverse the DOM, because we assume it’s not fully available, e.g. in Node.js, React Components, lint rules, etc.
 * @see https://www.w3.org/TR/html-aria/
 */
export function getRole(element: HTMLElement | VirtualElement, options?: GetRoleOptions): ARIARole | undefined {
  const { tagName, attributes } = virtualizeElement(element);

  // explicit role: use if valid
  if (typeof attributes?.role === 'string') {
    // Note: according to the spec, `role` can not only be a list of spring-separated values;
    // it can contain fallbacks the browser may not understand. According to spec, an arbitrary
    // role is to be ignored, so we take the first match (if any), or `undefined`.
    const roleList = parseTokenList(attributes.role);
    return roleList.find((role) => role in roles) as ARIARole | undefined;
  }

  const tag = tags[tagName];
  if (!tag) {
    return undefined;
  }

  switch (tagName) {
    case 'a':
    case 'area': {
      if (typeof attributes?.href === 'string') {
        return 'link';
      }
      return tag.defaultRole;
    }
    case 'header': {
      if (
        findFirstSignificantAncestor(['article', 'complementary', 'main', 'navigation', 'region'], options?.lineage)
      ) {
        return 'generic';
      }
      return tag.defaultRole;
    }
  }

  return tag.defaultRole;
}
