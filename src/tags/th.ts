import { type RoleData, roles } from '../lib/aria-roles.js';
import { NO_CORRESPONDING_ROLE } from '../lib/html.js';
import { attr, hasGridParent, hasTableParent } from '../lib/util.js';
import type { VirtualAncestorList, VirtualElement } from '../types.js';

/** Special behavior for <th> element */
export function getTHRole(
  element: Element | VirtualElement,
  options?: {
    ancestors?: VirtualAncestorList;
  },
): RoleData | undefined {
  // Note: Chrome 135/Firefox 137/Safari 18.4 currently ignore "scope" attr,
  // We still respect it all the same, because it’s unlikely this is being
  // explicitly set only to be ignored
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

  // Role determination is a bit dicey per-browser:
  // - Chrome 135/Firefox 137: <th> in a table is columnheader, unless there’s a sibling <td> then it’s rowheader
  // - Safari 18.4: <th> is columnheader in <thead>, rowheader in <tbody>/<tfoot> (unless it’s not the first element in row)
  // We also align with WPT tests (https://github.com/web-platform-tests/wpt/blob/master/html-aam/table-roles.html#L29)
  // but try and find a balance with the best support for everything
  if (hasTableParent(element, options?.ancestors)) {
    // DOM behavior; follow Chrome/Firefox behavior (look for <td> sibling, regardless of group, also look behind element)
    if (typeof Element !== 'undefined') {
      const hasTDSibling = (element as Element).parentElement?.querySelector('td');
      return hasTDSibling ? roles.rowheader : roles.columnheader;
    }
    // non-DOM behavior: follow Safari behavior (look for <thead>/<tbody> ancestor)
    // TODO: if sibling behavior is implemented, use that
    return options?.ancestors?.some((el) => el.tagName === 'thead') ? roles.columnheader : roles.rowheader;
  }

  // See previous comment r.e. special behaviour.
  return NO_CORRESPONDING_ROLE;
}
