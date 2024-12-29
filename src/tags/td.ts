import { tags } from '../lib/html.js';
import { firstMatchingAncestor } from '../lib/util.js';
import type { AncestorList } from '../types.js';

/** Special behavior for <td> element */
export function getTDRole(options?: { ancestors?: AncestorList }) {
  if (!options?.ancestors) {
    return tags.td.defaultRole;
  }

  // Special behavior: require an explicitly empty ancestor array to return
  // “no corresponding role” like the spec describes (if we did this by
  // default, it would likely cause bad results because most users would
  // likely skip this optional setup).
  if (Array.isArray(options?.ancestors) && options.ancestors.length === 0) {
    return undefined;
  }

  const hasGridParent = firstMatchingAncestor(
    [
      // Note: most of the time, the tagName
      { tagName: 'table', attributes: { role: 'table' } },
      { tagName: 'table', attributes: { role: 'grid' } },
      { tagName: 'table', attributes: { role: 'treegrid' } },
    ],
    options?.ancestors,
  );
  if (hasGridParent?.attributes?.role === 'grid' || hasGridParent?.attributes?.role === 'treegrid') {
    return 'gridcell';
  }
  return tags.td.defaultRole;
}
