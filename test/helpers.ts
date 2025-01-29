/** Ensure no copypasta error */
export function checkTestAndTagName(testName: string, tagName: string) {
  if (!testName.includes(tagName)) {
    throw new Error(`Test "${testName}" is testing tag "${tagName}". Has there been a mistake?`);
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
export function setUpDOM(html: string, querySelector: string) {
  if (querySelector === 'html') {
    return { root: document.documentElement, element: document.documentElement as Element };
  }
  if (querySelector === 'head' || querySelector === 'body') {
    return { root: document.documentElement, element: document.querySelector(querySelector) as Element };
  }

  const container = document.createElement('div');
  container.innerHTML = html;
  return { root: container, element: (container.querySelector(querySelector) || container.children[0]) as Element };
}
