import { tags } from './lib/html.js';
import { calculateAccessibleName, findFirstSignificantAncestor, virtualizeElement } from './lib/util.js';
import type { ARIARole, VirtualElement } from './types.js';

export interface SupportedRoleOptions {
  /**
   * Much like getRole(), the lineage determines the intrinsic role. But lineage
   * also determines _valid_ roles—certain roles MUST NOT contain certain children.
   * For example:
   *
   * - <td> with lineage ['table'] MAY ONLY be a ['cell'] (all other roles are not supported)
   * - <td> with lineage ['grid'] or ['treegrid'] MAY ONLY be a ['gridcell'] (all other roles are not supported)
   * - <td> with NO lineage ([]) will allow any role
   */
  lineage?: (ARIARole | undefined | null)[];
}

/**
 * Given an HTML element, returns a list of supported ARIA roles for that element.
 * An empty array means no roles are supported (which is true for some elements!)
 */
export function getSupportedRoles(element: HTMLElement | VirtualElement, options?: SupportedRoleOptions): ARIARole[] {
  const { tagName, attributes = {} } = virtualizeElement(element);
  const tag = tags[tagName];
  if (!tag) {
    return [];
  }

  // special cases: some HTML elements require unique logic to determine supported roles based on attributes, etc.
  switch (tagName) {
    case 'a': {
      if ('href' in attributes) {
        return ['link'];
      }
      return tag.supportedRoles;
    }
    case 'footer':
    case 'header': {
      const context = findFirstSignificantAncestor(
        ['article', 'complementary', 'main', 'navigation', 'region'],
        options?.lineage,
      );
      if (context) {
        return ['generic', 'group', 'none', 'presentation'];
      }
      return tag.supportedRoles;
    }
    case 'img': {
      const name = calculateAccessibleName({ tagName, attributes });
      if (name) {
        /** @see https://www.w3.org/TR/html-aria/#el-img */
        return ['button', 'checkbox', 'image', 'img', 'link', 'math', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'meter', 'option', 'progressbar', 'radio', 'scrollbar', 'separator', 'slider', 'switch', 'tab', 'treeitem']; // biome-ignore format: long list
      }
      return tag.supportedRoles;
    }
    case 'td': {
      const context = findFirstSignificantAncestor(['table', 'grid', 'treegrid'], options?.lineage);
      const parentMap: Partial<Record<ARIARole, ARIARole[]>> = {
        table: ['cell'],
        grid: ['gridcell'],
        treegrid: ['gridcell'],
      };
      return (context && parentMap[context]) || tag.supportedRoles;
    }
  }

  // Known cases that aren’t possible to detect without scanning full DOM:
  // - <div> directly <dl> MUST be either role="presentation" or role="none"

  return tag.supportedRoles;
}

/** Helper function for getSupportedRoles that returns a boolean instead */
export function isValidRole(
  role: string,
  element: HTMLElement | VirtualElement,
  options?: SupportedRoleOptions,
): boolean {
  return getSupportedRoles(element, options).includes(role as ARIARole);
}
