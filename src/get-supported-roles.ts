import { ALL_ROLES, roles } from './lib/aria-roles.js';
import { tags } from './lib/html.js';
import { attr, calculateAccessibleName, getTagName, hasListParent, hasTableParent } from './lib/util.js';
import { getFooterRole } from './tags/footer.js';
import { getInputSupportedRoles } from './tags/input.js';
import { getSelectSupportedRoles } from './tags/select.js';
import { getTDRole } from './tags/td.js';
import type { ARIARole, VirtualAncestorList, VirtualElement } from './types.js';

export interface SupportedRoleOptions {
  /**
   * Much like getRole(), the ancestors determines the intrinsic role. But ancestors
   * also determine _valid_ roles—certain roles MUST NOT contain certain children.
   * For example:
   *
   * - <td> with ancestors ['table'] MAY ONLY be a ['cell'] (all other roles are not supported)
   * - <td> with ancestors ['grid'] or ['treegrid'] MAY ONLY be a ['gridcell'] (all other roles are not supported)
   * - <td> with NO ancestors ([]) will allow any role
   */
  ancestors?: VirtualAncestorList;
}

/**
 * Given an HTML element, returns a list of supported ARIA roles for that element.
 * An empty array means no roles are supported (which is true for some elements!)
 */
export function getSupportedRoles(element: Element | VirtualElement, options?: SupportedRoleOptions): ARIARole[] {
  const tagName = getTagName(element);
  const tag = tags[tagName];
  if (!tag) {
    return [];
  }

  // special cases: some HTML elements require unique logic to determine supported roles based on attributes, etc.
  switch (tagName) {
    case 'a': {
      const href = attr(element, 'href');
      return typeof href === 'string' ? tag.supportedRoles : ALL_ROLES;
    }
    case 'area': {
      const href = attr(element, 'href');
      return typeof href === 'string' ? tag.supportedRoles : ['button', 'generic', 'link'];
    }
    case 'footer':
    case 'header': {
      const role = getFooterRole(element, options);
      return role?.name === 'generic' ? ['generic', 'group', 'none', 'presentation'] : tag.supportedRoles;
    }
    case 'div': {
      const DL_PARENT_ROLES: ARIARole[] = ['none', 'presentation'];
      if (typeof Element !== 'undefined' && element instanceof Element) {
        return element.parentElement?.closest('dl:not([role])') ? DL_PARENT_ROLES : tag.supportedRoles;
      }
      return options?.ancestors?.[0]?.tagName === 'dl' ? DL_PARENT_ROLES : tag.supportedRoles;
    }
    case 'img': {
      const name = calculateAccessibleName(element, roles.img);
      if (name) {
        /** @see https://www.w3.org/TR/html-aria/#el-img */
        return ['button', 'checkbox', 'image', 'img', 'link', 'math', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'meter', 'option', 'progressbar', 'radio', 'scrollbar', 'separator', 'slider', 'switch', 'tab', 'treeitem']; // biome-ignore format: long list
      }
      return tag.supportedRoles;
    }
    case 'li': {
      return hasListParent(element, options?.ancestors) ? ['listitem'] : ALL_ROLES;
    }
    case 'input': {
      return getInputSupportedRoles(element);
    }
    case 'select': {
      return getSelectSupportedRoles(element);
    }
    case 'summary': {
      if (typeof Element !== 'undefined' && element instanceof Element) {
        return element.parentElement?.closest('details:not([role])') ? [] : tag.supportedRoles;
      }
      return options?.ancestors?.some((a) => a.tagName === 'details') ? [] : tag.supportedRoles;
    }
    case 'td': {
      const role = getTDRole(element, options);
      switch (role?.name) {
        case 'cell': {
          return ['cell'];
        }
        case 'gridcell': {
          return ['gridcell'];
        }
        default: {
          return ALL_ROLES;
        }
      }
    }
    case 'th': {
      return hasTableParent(element, options?.ancestors) ? tag.supportedRoles : ALL_ROLES;
    }
    case 'tr': {
      return hasTableParent(element, options?.ancestors) ? tag.supportedRoles : ALL_ROLES;
    }
  }

  // Known cases that aren’t possible to detect without scanning full DOM:
  // - <div> directly <dl> MUST be either role="presentation" or role="none"

  return tag.supportedRoles;
}

/** Helper function for getSupportedRoles that returns a boolean instead */
export function isSupportedRole(
  role: string,
  element: Element | VirtualElement,
  options?: SupportedRoleOptions,
): boolean {
  return getSupportedRoles(element, options).includes(role as ARIARole);
}
