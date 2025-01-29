import { type RoleData, roles } from '../lib/aria-roles.js';
import { NO_CORRESPONDING_ROLE } from '../lib/html.js';
import { hasGridParent, hasTableParent } from '../lib/util.js';
import type { VirtualAncestorList, VirtualElement } from '../types.js';

/** Special behavior for <td> element */
export function getTDRole(
  element: Element | VirtualElement,
  options?: { ancestors?: VirtualAncestorList },
): RoleData | undefined {
  if (hasGridParent(element, options?.ancestors)) {
    return roles.gridcell;
  }
  if (hasTableParent(element, options?.ancestors)) {
    return roles.cell;
  }
  return NO_CORRESPONDING_ROLE;
}
