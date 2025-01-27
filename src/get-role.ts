import { ALL_ROLES, type RoleData, roles } from './lib/aria-roles.js';
import { tags } from './lib/html.js';
import { attr, calculateAccessibleName, firstMatchingToken, getTagName } from './lib/util.js';
import { getAsideRole } from './tags/aside.js';
import { getFooterRole } from './tags/footer.js';
import { getHeaderRole } from './tags/header.js';
import { getInputRole } from './tags/input.js';
import { getLIRole } from './tags/li.js';
import { getSelectRole } from './tags/select.js';
import { getTDRole } from './tags/td.js';
import { getTHRole } from './tags/th.js';
import type { VirtualAncestorList, VirtualElement } from './types.js';

export interface GetRoleOptions {
  /**
   * Declare relevant ancestors, ordered from most direct parent to furthest
   * ancestor. This affects the results, e.g.
   *
   * - <td> with ancestors ['table'] will be role 'cell'
   * - <td> with ancestors ['grid'] or ['treegrid'] will be 'gridcell'
   * - <td> with NO ancestors ([]) will be no role (`undefined`)
   *
   * This list does NOT have to be complete; e.g. `'row'`  can be skipped as it
   * doesn’t affect behavior. But irrelevant parents may be supplied for ease of
   * use, and only the first significant ancestor will apply.
   */
  ancestors?: VirtualAncestorList;
  /** Ignore role attribute in calculation to get the intrinsic role. Needed in some fallback scenarios. */
  ignoreRoleAttribute?: boolean;
}

/**
 * Get the corresponding ARIA role for a given HTML element.
 * `undefined` means “no corresponding role”.
 * Note this does NOT traverse the DOM, because we assume it’s not fully available, e.g. in Node.js, React Components, lint rules, etc.
 * @see https://www.w3.org/TR/html-aria/
 */
export function getRole(element: Element | VirtualElement, options?: GetRoleOptions): RoleData | undefined {
  const tagName = getTagName(element);
  const role = attr(element, 'role') as string | undefined;

  // explicit role: use if valid
  if (role && options?.ignoreRoleAttribute !== true) {
    const firstRole = firstMatchingToken(role, ALL_ROLES);
    // Note: according to the spec, certain roles aren’t allowed on certain
    // elements. However, most browsers ignore this, and accept the role at face
    // value. So don’t ignore certain combinations of roles; just accept the
    // role attribute regardless of tag name.
    return roles[firstRole!];
  }

  const tag = tags[tagName];
  if (!tag) {
    return undefined;
  }

  switch (tagName) {
    case 'a':
    case 'area': {
      const href = attr(element, 'href');
      return typeof href === 'string' ? roles[tag.defaultRole!] : roles.generic;
    }
    case 'aside': {
      const name = calculateAccessibleName(element, roles.complementary);
      return name ? roles[tag.defaultRole!] : getAsideRole(element, options);
    }
    case 'header': {
      return getHeaderRole(element, options);
    }
    case 'img': {
      const name = calculateAccessibleName(element, roles.img);
      return name ? roles.img : roles.none;
    }
    case 'li': {
      return getLIRole(element, options);
    }
    case 'input': {
      return getInputRole(element);
    }
    case 'footer': {
      return getFooterRole(element, options);
    }
    case 'section': {
      const name = calculateAccessibleName(element, roles.region);
      return name ? roles[tag.defaultRole!] : roles.generic;
    }
    case 'select': {
      return getSelectRole(element);
    }
    case 'td': {
      return getTDRole(element, options);
    }
    case 'th': {
      return getTHRole(element, options);
    }
    case 'tr': {
      return roles.row;
    }
  }

  return roles[tag.defaultRole!];
}
