import { type RoleData, roles } from '../lib/aria-roles.js';
import { hasListParent } from '../lib/util.js';
import type { VirtualAncestorList, VirtualElement } from '../types.js';

export function getLIRole(
  element: Element | VirtualElement,
  options?: { ancestors?: VirtualAncestorList },
): RoleData | undefined {
  return hasListParent(element, options?.ancestors) ? roles.listitem : roles.generic;
}
