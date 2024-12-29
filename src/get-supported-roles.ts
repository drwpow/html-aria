import { ALL_ROLES, NO_ROLES } from './lib/aria-roles.js';
import { tags } from './lib/html.js';
import { calculateAccessibleName, virtualizeElement } from './lib/util.js';
import { getFooterRole } from './tags/footer.js';
import { getInputRole } from './tags/input.js';
import { getTDRole } from './tags/td.js';
import type { ARIARole, AncestorList, VirtualElement } from './types.js';

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
  ancestors?: AncestorList;
}

/**
 * Given an HTML element, returns a list of supported ARIA roles for that element.
 * An empty array means no roles are supported (which is true for some elements!)
 */
export function getSupportedRoles(element: HTMLElement | VirtualElement, options?: SupportedRoleOptions): ARIARole[] {
  const { tagName, attributes } = virtualizeElement(element);
  const tag = tags[tagName];
  if (!tag) {
    return [];
  }

  // special cases: some HTML elements require unique logic to determine supported roles based on attributes, etc.
  switch (tagName) {
    case 'a': {
      return attributes && !('href' in attributes)
        ? ALL_ROLES
        : ['button', 'checkbox', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'switch', 'tab', 'treeitem']; // biome-ignore format: long list
    }
    case 'area': {
      return attributes && !('href' in attributes) ? ['button', 'generic', 'link'] : tag.supportedRoles;
    }
    case 'footer':
    case 'header': {
      const role = getFooterRole(options);
      return role === 'generic' ? ['generic', 'group', 'none', 'presentation'] : tag.supportedRoles;
    }
    case 'div': {
      return options?.ancestors?.[0]?.tagName === 'dl' ? ['none', 'presentation'] : tag.supportedRoles;
    }
    case 'img': {
      const name = calculateAccessibleName({ tagName, attributes });
      if (name) {
        /** @see https://www.w3.org/TR/html-aria/#el-img */
        return ['button', 'checkbox', 'image', 'img', 'link', 'math', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'meter', 'option', 'progressbar', 'radio', 'scrollbar', 'separator', 'slider', 'switch', 'tab', 'treeitem']; // biome-ignore format: long list
      }
      return tag.supportedRoles;
    }
    case 'input': {
      const type = attributes?.type;
      const role = getInputRole({ attributes });

      switch (type) {
        case 'file': {
          return NO_ROLES;
        }
      }

      switch (role) {
        case 'button': {
          return ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem']; // biome-ignore format: long list
        }
        case 'checkbox': {
          const coreRoles: ARIARole[] = ['checkbox', 'menuitemcheckbox', 'option', 'switch'];
          return attributes && 'aria-pressed' in attributes ? ['button', ...coreRoles] : coreRoles;
        }
        default: {
          return role ? [role] : NO_ROLES;
        }
      }
    }
    case 'summary': {
      return options?.ancestors?.some((a) => a.tagName === 'details') ? [] : tag.supportedRoles;
    }
    case 'td': {
      const role = getTDRole(options);
      switch (role) {
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
      // Deviation from the spec: only treat as “no corresponding role” if user has explicated this
      if (options?.ancestors && options.ancestors.length === 0) {
        return ALL_ROLES;
      }
      return ['cell', 'columnheader', 'gridcell', 'rowheader'];
    }
  }

  // Known cases that aren’t possible to detect without scanning full DOM:
  // - <div> directly <dl> MUST be either role="presentation" or role="none"

  return tag.supportedRoles;
}

/** Helper function for getSupportedRoles that returns a boolean instead */
export function isSupportedRole(
  role: string,
  element: HTMLElement | VirtualElement,
  options?: SupportedRoleOptions,
): boolean {
  return getSupportedRoles(element, options).includes(role as ARIARole);
}
