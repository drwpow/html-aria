import { tags } from '../lib/html.js';
import { findFirstSignificantAncestor } from '../lib/util.js';
import type { AncestorList, VirtualElement } from '../types.js';

/** Special behavior for <td> element */
export function getTDRole(options?: { ancestors?: AncestorList }) {
  // Minor deviation from spec for ease of use: only treat as “no corresponding
  // role” if user states this does NOT have table/grid/treegrid ancestors with
  // an explicitly empty array.
  if (options?.ancestors && options?.ancestors.length === 0) {
    return undefined;
  }

  const context = findFirstSignificantAncestor(
    [
      { tagName: 'table', attributes: { role: 'table' } },
      { tagName: 'div', attributes: { role: 'grid' } },
      { tagName: 'div', attributes: { role: 'treegrid' } },
    ],
    options?.ancestors,
  );
  if (context?.attributes?.role === 'grid' || context?.attributes?.role === 'treegrid') {
    return 'gridcell';
  }
  return tags.td.defaultRole;
}
