import { type RoleData, roles } from '../lib/aria-roles.js';
import { NO_CORRESPONDING_ROLE } from '../lib/html.js';
import { attr, hasGridParent, hasRowgroupParent, hasTableParent } from '../lib/util.js';
import type { VirtualAncestorList, VirtualElement } from '../types.js';

/** Special behavior for <th> element */
export function getTHRole(
  element: Element | VirtualElement,
  options?: {
    ancestors?: VirtualAncestorList;
  },
): RoleData | undefined {
  // Currently deviates from specification as doesn't handle the `auto`
  // behaviour as that would require access to the DOM context.
  const scope = attr(element, 'scope');
  switch (scope) {
    /** @see https://www.w3.org/TR/html-aam-1.0/#el-th-columnheader */
    case 'col':
    case 'colgroup': {
      return roles.columnheader;
    }
    /** @see https://www.w3.org/TR/html-aam-1.0/#el-th-rowheader */
    case 'row':
    case 'rowgroup': {
      return roles.rowheader;
    }
  }

  /** @see https://www.w3.org/TR/html-aam-1.0/#el-th-gridcell */
  if (hasGridParent(element, options?.ancestors)) {
    return roles.gridcell;
  }

  /** @see https://www.w3.org/TR/html-aam-1.0/#el-th */
  if (hasTableParent(element, options?.ancestors)) {
    // Minor spec deviation: if inside a rowgroup, most browsers treat this as a columnheader
    return hasRowgroupParent(element, options?.ancestors) ? roles.columnheader : roles.cell;
  }

  // See previous comment r.e. special behaviour.
  return NO_CORRESPONDING_ROLE;
}
