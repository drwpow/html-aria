import { tags } from '../lib/html.js';
import { hasLandmarkParent } from '../lib/util.js';
import type { AncestorList } from '../types.js';

export function getHeaderRole({ ancestors }: { ancestors?: AncestorList } = {}) {
  if (!ancestors) {
    return tags.header.defaultRole;
  }
  return hasLandmarkParent(ancestors) ? 'generic' : tags.header.defaultRole;
}
