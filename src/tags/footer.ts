import { tags } from '../lib/html.js';
import { findFirstSignificantAncestor } from '../lib/util.js';
import type { AncestorList } from '../types.js';

export function getFooterRole(options?: { ancestors?: AncestorList }) {
  const hasLandmarkParent = findFirstSignificantAncestor(
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
