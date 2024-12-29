import { tags } from '../lib/html.js';
import { firstMatchingAncestor, isEmptyAncestorList } from '../lib/util.js';
import type { AncestorList } from '../types.js';

/** Special behavior for <td> element */
export function getTDRole({ ancestors }: { ancestors?: AncestorList } = {}) {
  if (!ancestors) {
    return tags.td.defaultRole;
  }

  // Special behavior: require an explicitly empty ancestor array to return
  // “no corresponding role” like the spec describes (if we did this by
  // default, it would likely cause bad results because most users would
  // likely skip this optional setup).
  if (isEmptyAncestorList(ancestors)) {
    return undefined;
  }

  const hasGridParent = firstMatchingAncestor(
    [
      // Note: most of the time, the tagName
      { tagName: 'table', attributes: { role: 'table' } },
      { tagName: 'table', attributes: { role: 'grid' } },
      { tagName: 'table', attributes: { role: 'treegrid' } },
    ],
    ancestors,
  );
  if (hasGridParent?.attributes?.role === 'grid' || hasGridParent?.attributes?.role === 'treegrid') {
    return 'gridcell';
  }
  return tags.td.defaultRole;
}
