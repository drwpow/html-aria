import { isEmptyAncestorList } from '../lib/util.js';
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
    return undefined;
  }

  return attributes?.scope === 'row' ? 'rowheader' : 'columnheader';
}
