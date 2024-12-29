import type { AncestorList, VirtualElement } from '../types.js';

/** Special behavior for <th> element */
export function getTHRole(options?: { attributes?: VirtualElement['attributes']; ancestors?: AncestorList }) {
  // Special behavior: require an explicitly empty ancestor array to return
  // “no corresponding role” like the spec describes (if we did this by
  // default, it would likely cause bad results because most users would
  // likely skip this optional setup).
  if (Array.isArray(options?.ancestors) && options.ancestors.length === 0) {
    return undefined;
  }

  return options?.attributes?.scope === 'row' ? 'rowheader' : 'columnheader';
}
