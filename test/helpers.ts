import { tags } from '../src';

/** Ensure no copypasta error */
export function checkTestAndTagName(testName: string, tagName: string) {
  // ignore custom elements
  if (tagName.includes('-')) {
    return;
  }
  if (!testName.includes(tagName)) {
    throw new Error(`Test "${testName}" is testing tag "${tagName}". Has there been a mistake?`);
  }
}

const ALL_TAG_KEYS = Object.keys(tags);

/** Ensure all tags are tested */
export function checkAllTagsTested(testedTags: Set<string>) {
  const untestedTags = new Set(ALL_TAG_KEYS.filter((tag) => !testedTags.has(tag)));
  if (untestedTags.size) {
    throw new Error(`The following tags are not tested:
  - ${Array.from(untestedTags).join('  - ')}`);
  }
}

/** Ensure list is sorted alphabetically. */
export function copyAndSortList<T = unknown>(list: T[]): T[] {
  return [...list].sort();
}

/**
 * Create a DOM tree from an HTML string.
 * Because these are small and a closed loop, we can not pollute the DOM by
 * appending these; these are all virtual. If we do end up writing to the DOM,
 * we would have to do more work isolating parallel tests AS WELL as come up
 * with a strategy for testing `<body>` and other structural tags.
 */
export function setUpDOM(
  html: string,
  querySelector: string,
  options?: { before?: Parameters<ChildNode['before']>; after?: Parameters<ChildNode['before']>; mount?: boolean },
) {
  const randomID = `id-${Math.random().toString(36).substring(2, 10)}`;

  let root: Element = document.documentElement;
  let element: Element = document.documentElement;
  let cleanup = () => {};
  if (querySelector === 'html') {
    root = document.documentElement;
  } else if (querySelector === 'head' || querySelector === 'body') {
    root = document.querySelector(querySelector)!;
    element = document.querySelector(querySelector)!;
  } else {
    root = document.createElement('div');
    root.innerHTML = html.replace(/:id:/g, randomID);
    element = root.querySelector(querySelector) || root.querySelector(querySelector.toLowerCase())!;
    if (!element) throw new Error(`querySelector "${querySelector}" not found in document`);
  }
  if (options?.before) {
    element.before(...options.before);
  }
  if (options?.after) {
    element.after(...options.after);
  }
  if (options?.mount) {
    document.body.appendChild(root);
    cleanup = () => {
      document.body.removeChild(root);
    };
  }
  return {
    root,
    element,
    cleanup,
  };
}
