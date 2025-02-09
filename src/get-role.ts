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
   * Not needed in DOM environments.
   * For Node.js, when we can’t traverse the DOM, provide the hierarchy upward, going from closest to furthest.
   * E.g. the following HTML:
   *
   * ```html
   * <table>
   *   <tbody>
   *     <tr>
   *       <td></td>
   *     </tr>
   *   </tbody>
   * </table>
   * ```
   * Could be represented as:
   *
   * ```ts
   * getRole(
   *   { tagName: 'td' },
   *   { ancestors: [{ tagName: 'tr' }, { tagName: 'tbody' }, { tagName: 'table' }] },
   * );
   * ```
   *
   * Note: This list does _not_ have to be complete; simply listing out the significant elements that
   * affect a11y.
   * @see https://github.com/drwpow/html-aria/tree/dom-support#nodejs-vs-dom-behavior
   */
  ancestors?: VirtualAncestorList;
  /** Ignore role attribute in calculation to get the intrinsic role. Needed in some fallback scenarios. */
  ignoreRoleAttribute?: boolean;
}

/**
 * Get the corresponding ARIA role for a given HTML element.
 * `undefined` means “no corresponding role”.
 * This traverses the DOM when available.
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

  // If custom element (unknown HTML element), assume generic
  if (!tag) {
    return roles.generic;
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
