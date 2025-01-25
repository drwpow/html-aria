import { tags } from '../lib/html.js';
import { firstMatchingAncestor } from '../lib/util.js';
import type { AncestorList } from '../types.js';

function hasSectioningContentParent(ancestors: AncestorList) {
  return !!firstMatchingAncestor(
    [
      { tagName: 'article', attributes: { role: 'article' } },
      { tagName: 'aside', attributes: { role: 'complementary' } },
      { tagName: 'nav', attributes: { role: 'navigation' } },
      { tagName: 'section', attributes: { role: 'region' } },
    ],
    ancestors,
  );
}

export function getAsideRole({ ancestors }: { ancestors?: AncestorList } = {}) {
  if (!ancestors) {
    return tags.aside.defaultRole;
  }
  return hasSectioningContentParent(ancestors) ? 'generic' : tags.aside.defaultRole;
}
