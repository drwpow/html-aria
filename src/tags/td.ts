import { NO_CORRESPONDING_ROLE, tags } from '../lib/html.js';
import { hasGridParent, isEmptyAncestorList } from '../lib/util.js';
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
    return NO_CORRESPONDING_ROLE;
  }

  if (hasGridParent(ancestors)) {
    return 'gridcell';
  }

  return tags.td.defaultRole;
}
