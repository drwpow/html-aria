import { type RoleData, roles } from '../lib/aria-roles.js';
import { tags } from '../lib/html.js';
import { hasSectioningContentParent } from '../lib/util.js';
import type { VirtualAncestorList, VirtualElement } from '../types.js';

/**
 * @see https://www.w3.org/TR/html-aam-1.0/#el-aside-ancestorbodymain
 * @see https://www.w3.org/TR/html-aam-1.0/#el-aside
 */
export function getAsideRole(
  element: Element | VirtualElement,
  options?: { ancestors?: VirtualAncestorList },
): RoleData | undefined {
  return hasSectioningContentParent(element, options?.ancestors) ? roles.generic : roles[tags.aside.defaultRole!];
}
