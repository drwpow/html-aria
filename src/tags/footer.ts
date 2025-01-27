import { type RoleData, roles } from '../lib/aria-roles.js';
import { tags } from '../lib/html.js';
import { hasLandmarkParent } from '../lib/util.js';
import type { VirtualAncestorList, VirtualElement } from '../types.js';

export function getFooterRole(
  element: Element | VirtualElement,
  options?: { ancestors?: VirtualAncestorList },
): RoleData | undefined {
  return hasLandmarkParent(element, options?.ancestors) ? roles.generic : roles[tags.footer.defaultRole!];
}
