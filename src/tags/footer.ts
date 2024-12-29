import { tags } from '../lib/html.js';
import { firstMatchingAncestor } from '../lib/util.js';
import type { AncestorList } from '../types.js';

export function getFooterRole({ ancestors }: { ancestors?: AncestorList } = {}) {
  if (!ancestors) {
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
    ancestors,
  );
  return hasLandmarkParent ? 'generic' : tags.footer.defaultRole;
}
