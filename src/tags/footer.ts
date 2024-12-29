import { tags } from '../lib/html.js';
import { firstMatchingAncestor } from '../lib/util.js';
import type { AncestorList } from '../types.js';

export function getFooterRole(options?: { ancestors?: AncestorList }) {
  if (!options?.ancestors) {
    return tags.footer.defaultRole;
  }
  const hasLandmarkParent = firstMatchingAncestor(
    [
      { tagName: 'article', attributes: { role: 'article' } },
      { tagName: 'aside', attributes: { role: 'complementary' } },
      { tagName: 'main', attributes: { role: 'main' } },
      { tagName: 'nav', attributes: { role: 'navigation' } },
      { tagName: 'section', attributes: { role: 'region' } },
    ],
    options?.ancestors,
  );
  return hasLandmarkParent ? 'generic' : tags.footer.defaultRole;
}
