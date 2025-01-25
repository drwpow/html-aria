import { NO_CORRESPONDING_ROLE, tags } from '../lib/html.js';
import { firstMatchingAncestor, hasGridParent, isEmptyAncestorList } from '../lib/util.js';
import type { AncestorList, VirtualElement } from '../types.js';

/** Special behavior for <th> element */
export function getTHRole({
  attributes,
  ancestors,
}: { attributes?: VirtualElement['attributes']; ancestors?: AncestorList } = {}) {
  // Special behavior: require an explicitly empty ancestor array to return
  // “no corresponding role” like the spec describes (if we did this by
  // default, it would likely cause bad results because most users would
  // likely skip this optional setup).
  if (isEmptyAncestorList(ancestors)) {
    return NO_CORRESPONDING_ROLE;
  }

  // Currently deviates from specification as doesn't handle the `auto`
  // behaviour as that would require access to the DOM context.
  switch (attributes?.scope) {
    /**
     * @see https://www.w3.org/TR/html-aam-1.0/#el-th-columnheader
     */
    case 'col':
    case 'colgroup': {
      return 'columnheader';
    }
    /**
     * @see https://www.w3.org/TR/html-aam-1.0/#el-th-rowheader
     */
    case 'row':
    case 'rowgroup': {
      return 'rowheader';
    }
  }

  // See previous comment r.e. special behaviour.
  if (!ancestors) {
    return tags.th.defaultRole;
  }

  /**
   * @see https://www.w3.org/TR/html-aam-1.0/#el-th-gridcell
   */
  if (hasGridParent(ancestors)) {
    return 'gridcell';
  }

  /**
   * @see https://www.w3.org/TR/html-aam-1.0/#el-th
   */
  const hasTableParent = !!firstMatchingAncestor([{ tagName: 'table', attributes: { role: 'table' } }], ancestors);

  if (hasTableParent) {
    return 'cell';
  }

  // See previous comment r.e. special behaviour.
  return tags.th.defaultRole;
}
