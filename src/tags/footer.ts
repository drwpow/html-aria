import { tags } from '../lib/html.js';
import { hasLandmarkParent } from '../lib/util.js';
import type { AncestorList } from '../types.js';

export function getFooterRole({ ancestors }: { ancestors?: AncestorList } = {}) {
  if (!ancestors) {
    return tags.footer.defaultRole;
  }
  return hasLandmarkParent(ancestors) ? 'generic' : tags.footer.defaultRole;
}
