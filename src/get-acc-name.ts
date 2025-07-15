import { getRole } from './get-role.js';
import { getCSSContent, getDisplay, getTooltip, isHidden } from './lib/accname.js';

/** Common options */
interface Options {
  /**
   * Important: Each node in the subtree is consulted only once. If text has
   * been collected from a descendant, but is referenced by another IDREF in
   * some descendant node, then that second, or subsequent, reference is not
   * followed. This is done to avoid infinite loops.
   * @see https://www.w3.org/TR/accname-1.2/#computation-steps
   */
  nodesReferenced: Set<Element>;
}

/**
 * Get [acc]essible name & description.
 * Per spec, a missing name is represented as an empty string ("").
 * Name and description must be calculated together, to ensure
 * descriptions are not redundant.
 * @see https://www.w3.org/TR/html-aam-1.0/#accessible-name-and-description-computation
 */
export function getAccNameAndDescription(
  element: Element,
  { nodesReferenced }: Options = { nodesReferenced: new Set<Element>() },
): {
  name: string;
  description: string | undefined;
} {
  if (typeof Element === 'undefined') {
    throw new Error('getAccNameAndDescription is not supported in this environment.');
  }

  // helper to conditionally return description, only if unique from name
  // https://www.w3.org/TR/accname-1.2/#mapping_additional_nd_description
  const nameFrom = (name: string | undefined) => {
    let description: string | undefined;
    // 1. aria-describedby
    const describedby = element.getAttribute('aria-describedby');
    if (describedby) {
      description = concatIDRefList(element, 'aria-describedby', { nodesReferenced });
    } else {
      description =
        // 2. aria-description
        element.getAttribute('aria-description') ||
        // 3. title
        element.getAttribute('title') ||
        // 4. no acc description
        undefined;
    }
    return {
      name: name?.trim() || '',
      description: (description !== name && description?.trim()) || undefined,
    };
  };

  const ariaLabelledby = element.getAttribute('aria-labelledby');
  const ariaLabel = element.getAttribute('aria-label');

  // https://www.w3.org/TR/html-aam-1.0/#accessible-name-and-description-computation
  // 4.1.1 input type="text", input type="password", input type="number", input
  // type="search", input type="tel", input type="email", input type="url", textarea
  if (!ariaLabel && !ariaLabelledby) {
    switch (element.tagName) {
      case 'INPUT':
      case 'TEXTAREA': {
        const inputType = element.getAttribute('type');
        const title = element.getAttribute('title');
        const placeholder = element.getAttribute('placeholder');
        if (
          ['text', 'password', 'number', 'search', 'tel', 'email', 'url'].includes(inputType!) ||
          element.tagName === 'TEXTAREA'
        ) {
          // 1. aria-label (handled below)
          // 2. <label>
          const hll = calculateHostLanguageLabel(element, { nodesReferenced });
          if (hll) return nameFrom(hll);
          // 3. title
          if (title) return nameFrom(title);
          // 4. placeholder
          if (placeholder) return nameFrom(placeholder);
          // 5. no accname
          return nameFrom(undefined);
        }

        // 4.1.2 input type="button", input type="submit" and input type="reset" Accessible Name Computation
        if (['button', 'submit', 'reset'].includes(inputType!)) {
          // 1. aria-label (handled below)
          // 2. <label>
          const hll = calculateHostLanguageLabel(element, { nodesReferenced });
          if (hll) return nameFrom(hll);
          // 3. value
          if ((element as HTMLInputElement).value) return nameFrom((element as HTMLInputElement).value);
          // 4. title
          if (title) return nameFrom(title);
          // Missing: default value from local translation (input[type=submit] should yield “Submit Query,” however,
          // there’s no simple way to get this string and translate it into the user’s current language. So
          // return `undefined` instead.
          // 5. no accname
          return nameFrom(undefined);
        }

        // 4.1.3 input type="image" Accessible Name Computation
        if (inputType === 'image') {
          // 1. aria-label (handled below)
          // 2. <label>
          const hll = calculateHostLanguageLabel(element, { nodesReferenced });
          if (hll) return nameFrom(hll);
          // 3. alt
          if ((element as HTMLInputElement).alt) return nameFrom((element as HTMLInputElement).alt);
          // 4. title
          if (title) return nameFrom(title);
          // 5. (user agent provided)
          // 6. no accname
          return nameFrom(undefined);
        }

        // 4.1.7 Other Form Elements
        // 1. aria-label (handled below)
        // 2. <label>
        const hll = calculateHostLanguageLabel(element, { nodesReferenced });
        if (hll) return nameFrom(hll);
        return nameFrom(
          // 3. title
          title ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.4 button Element Accessible Name Computation
      case 'BUTTON': {
        // 1. aria-label (handled below)
        // 2. <label>
        const parentLabel = element.parentElement?.closest('label');
        if (parentLabel) return getAccNameAndDescription(parentLabel, { nodesReferenced });
        return nameFrom(
          // 3. visible text
          computeName(element, { nodesReferenced }) ||
            // 4. title
            element.getAttribute('title') ||
            // 5. no accname
            undefined,
        );
      }

      // 4.1.5 fieldset Element Accessible Name Computation
      case 'FIELDSET': {
        // 1. aria-label (handled below)
        // 2. <legend>
        const legend = element.querySelector('legend');
        const legendText = legend ? computeName(legend, { nodesReferenced }) : undefined;
        if (legendText) return nameFrom(legendText);
        return nameFrom(
          // 3. title
          element.getAttribute('title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.6 output Element Accessible Name Computation
      case 'OUTPUT': {
        // 1. aria-label (handled below)
        // 2. <label>
        const hll = calculateHostLanguageLabel(element, { nodesReferenced });
        if (hll) return nameFrom(hll);
        return nameFrom(
          // 3. title
          element.getAttribute('title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.7 Other Form Elements Accessible Name Computation
      // TODO: what are “other form elements?”

      // 4.1.8 summary Element Accessible Name Computation
      case 'SUMMARY': {
        if (element.parentElement?.tagName !== 'DETAILS') {
          break;
        }

        // 1. aria-label (handled below)
        // 2. visibleText
        const subtree = computeName(element, { nodesReferenced });
        if (subtree) return nameFrom(subtree);
        // 3. title
        return nameFrom(
          element.getAttribute('title') ||
            // 4. (user agent provided)
            // 5. no accname
            undefined,
        );
      }

      // 4.1.9 figure Element Accessible Name Computation
      case 'FIGURE': {
        // 1. aria-label (handled below)
        // 2. <figcaption>
        const figcaptionEl = element.querySelector('figcaption');
        if (figcaptionEl) return getAccNameAndDescription(figcaptionEl);
        // 3. title
        return nameFrom(
          element.getAttribute('title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.10 img Element Accessible Name Computation
      case 'IMG': {
        // 1. aria-label (handled below)
        return nameFrom(
          // 2. alt
          element.getAttribute('alt') ||
            // 3. title
            element.getAttribute('title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.11 table Element Accessible Name Computation
      case 'TABLE': {
        // 1. aria-label (handled below)
        // 2. <caption>
        const captionEl = element.querySelector('caption');
        if (captionEl) return getAccNameAndDescription(captionEl);
        return nameFrom(
          // 3. title
          element.getAttribute('title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.12 tr, td, th Elements Accessible Name Computation
      case 'TR':
      case 'TD':
      case 'TH': {
        // 1. aria-label (handled below)
        return nameFrom(
          // 2. title
          element.getAttribute('title') ||
            // 3. no accname
            undefined,
        );
      }

      // 4.1.13 a Element Accessible Name Computation
      case 'A': {
        // 1. aria-label (handled below)
        // 2. subtree
        const subtree = computeName(element, { nodesReferenced });
        if (subtree) return nameFrom(subtree);
        return nameFrom(
          // 3. title
          element.getAttribute('title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.14 area Element Accessible Name Computation
      case 'AREA': {
        // 1. aria-label (handled below)
        return nameFrom(
          // 2. alt
          element.getAttribute('alt') ||
            // 3. title
            element.getAttribute('title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.15 iframe Element Accessible Name Computation
      case 'IFRAME': {
        // 1. aria-label (handled below)
        return nameFrom(
          // 2. title
          element.getAttribute('title') ||
            // 3. no accname
            undefined,
        );
      }

      // 4.1.16 Section and Grouping Element Accessible Name Computation
      case 'SECTION': {
        // TODO: what other tags are “grouping?”
        // 1. aria-label (handled below)
        return nameFrom(
          // 2. title
          element.getAttribute('title') ||
            // 3. no accname
            undefined,
        );
      }

      // 4.1.17 Text-level Element Accessible Name Computation
      case 'ABBR':
      case 'B':
      case 'BDI':
      case 'BDO':
      case 'BR':
      case 'CITE':
      case 'CODE':
      case 'DFN':
      case 'EM':
      case 'I':
      case 'KBD':
      case 'MARK':
      case 'Q':
      case 'RP':
      case 'RUBY':
      case 'S':
      case 'SAMP':
      case 'SMALL':
      case 'STRONG':
      case 'SUB':
      case 'SUP':
      case 'TIME':
      case 'U':
      case 'VAR':
      case 'WBR': {
        // 1. aria-label (handled below)
        return nameFrom(
          // 2. title
          element.getAttribute('title') ||
            // 3. no accname
            undefined,
        );
      }
    }
  }

  // 4.3.2 Default computation
  // https://www.w3.org/TR/accname-1.2/#computation-steps
  return nameFrom(computeName(element, { nodesReferenced }));
}

/**
 * Turn an array of potential values into a concatenated string, separated by " "
 * @see https://w3c.github.io/accname/#mapping_additional_nd_description
 */
function concatIDRefList(
  element: Element,
  attr: 'aria-labelledby' | 'aria-describedby' | 'aria-owns',
  { nodesReferenced }: Options,
): string {
  const idRefList = element.getAttribute(attr)?.trim();
  if (!idRefList) return '';
  const idList = idRefList.split(/\s+/);
  const nameList: (string | undefined)[] = [];
  for (const id of idList) {
    let nextEl = document.getElementById(id) as Element | null;
    if (nextEl) {
      // edge case: eleemnts can reference themselves, but we have to remove the infinite loop first
      if (nextEl === element) {
        nextEl = nextEl.cloneNode(false) as Element;
        nextEl.removeAttribute(attr);
      }
      nameList.push(
        computeName(nextEl, {
          includeHidden: true, // this counts as “referencing,” which ignores hidden (see 2.1 Hidden Not Referenced)
          nodesReferenced,
          includeNamingProhibitedText: true,
        }),
      );
    }
  }
  return nameList.join(' ').trim();
}

/**
 * Default name calculation
 * @see https://www.w3.org/TR/accname-1.2/#computation-steps
 */
function computeName(
  element: Element,
  {
    nodesReferenced,
    includeHidden = false,
    includeNamingProhibitedText = false,
  }: Options & {
    /** Include hidden nodes */
    includeHidden?: boolean;
    /** Set to `true` to always include naming prohibited text content (false by default for names) */
    includeNamingProhibitedText?: boolean;
  },
): string {
  const ariaLabel = element.getAttribute('aria-label')?.trim();

  // Important: Each node in the subtree is consulted only once. If text has
  // been collected from a descendant, but is referenced by another IDREF in
  // some descendant node, then that second, or subsequent, reference is not
  // followed.  This is done to avoid infinite loops.
  if (nodesReferenced.has(element)) {
    return '';
  }
  nodesReferenced.add(element);

  const ariaLabelledby = element.getAttribute('aria-labelledby')?.trim();
  const role = getRole(element);

  // 1. Initialization
  if (
    role?.prohibited.includes('aria-label') &&
    includeNamingProhibitedText !== true &&
    !ariaLabel &&
    !ariaLabelledby
  ) {
    return '';
  }

  // 2.1 hidden
  if (includeHidden !== true && isHidden(element)) {
    return '';
  }

  // 2.2 aria-labelledby
  if (ariaLabelledby) {
    // note:[aria-labelledby] does NOT count as a reference
    return concatIDRefList(element, 'aria-labelledby', { nodesReferenced });
  }

  // 2.3 embedded control
  // 2.3.1 embedded control: textbox
  if (role?.name === 'textbox') {
    const value = (element as HTMLInputElement).value?.trim() || '';
    if (value) return value;
  }
  // 2.3.2 embedded control: combobox/listbox
  if (role?.name === 'combobox' || role?.name === 'listbox') {
    const value = (element as HTMLInputElement).value?.trim() || '';
    if (value) return value;
    const option =
      element.querySelector(
        'option[aria-selected=true],[role=option][aria-selected=true],option[selected],[role=option][selected]',
      ) || element.querySelector('option');
    if (option)
      return computeName(option, {
        nodesReferenced,
        includeHidden,
        includeNamingProhibitedText,
      });
    const tooltip = getTooltip(element);
    if (tooltip) return tooltip;
  }
  // 2.3.3 embedded control: range
  if (['meter', 'progressbar', 'scrollbar', 'slider', 'spinbutton'].includes(role?.name!)) {
    const value =
      element.getAttribute('aria-valuetext')?.trim() ||
      element.getAttribute('aria-valuenow')?.trim() ||
      (element as HTMLInputElement).value?.trim();
    if (value) return value;
  }

  // 2.4 aria-label
  if (element.tagName !== 'SLOT' && ariaLabel) {
    return ariaLabel;
  }

  // 2.5 host language label
  if (
    ['INPUT', 'IMG', 'OUTPUT', 'SELECT', 'TEXTAREA', 'SVG'].includes(element.tagName) &&
    !['presentation', 'none'].includes(role?.name!) &&
    element.getAttribute('alt') !== ''
  ) {
    return calculateHostLanguageLabel(element, { nodesReferenced });
  }

  // 2.6 name from content
  // 2.6.1 init
  let totalAccumulatedText = '';

  // 2.6.2 pseudo + 2.6.3, 2.6.4, 2.6.5 child nodes, 2.6.8 tooltips
  const childNodes = Array.from(element.childNodes);
  const { before, after, marker } = {
    before: getCSSContent(element, '::before'),
    after: getCSSContent(element, '::after'),
    marker: getCSSContent(element, '::marker'),
  };
  if (before) childNodes.unshift(document.createTextNode(before));
  const tooltip = getTooltip(element);
  if (tooltip) childNodes.push(document.createTextNode(` ${tooltip} `));
  if (marker) childNodes.push(document.createTextNode(marker));
  if (after) childNodes.push(document.createTextNode(after));
  for (const node of childNodes) {
    switch (node.nodeType) {
      case Node.TEXT_NODE: {
        if (node.nodeValue) totalAccumulatedText += node.nodeValue;
        break;
      }
      case Node.ELEMENT_NODE: {
        if (nodesReferenced.has(node as Element)) {
          continue;
        }
        const childRole = (node as Element).getAttribute('role');
        // TEMPORARY: ignore menus
        if (childRole === 'menu') {
          continue;
        }
        // edge case: convert <br> to space
        const childName = computeName(node as Element, {
          nodesReferenced,
          includeNamingProhibitedText: true, // calculating child nodes means including naming prohibited elements
          includeHidden: false,
        });
        const isInline = getDisplay(node as Element) === 'inline';
        if (childName) {
          // Note: block-level elements ALSO space afterward, e.g. if followed by a text node
          totalAccumulatedText += !isInline && totalAccumulatedText ? ` ${childName} ` : childName;
        }
        // edge case: if this was as <br /> tag with nothing special (no role, aria-labelledby, etc.)
        // preserve the line break in the form of a space
        else if ((node as Element).tagName === 'BR') {
          totalAccumulatedText += ' ';
        }
        break;
      }
    }
  }

  const ownedText = concatIDRefList(element, 'aria-owns', { nodesReferenced });
  if (ownedText) totalAccumulatedText += ` ${ownedText}`;
  // 2.7 text node (ignored, handled in child nodes)
  // 2.10 join, and remove non-significant whitespace
  return totalAccumulatedText.trim().replace(/(\r?\n|\s)+/g, ' ');
}

/**
 * Calculate label for <img>, <svg>, and <input>.
 * @see https://www.w3.org/TR/accname-1.2/#comp_host_language_label
 */
function calculateHostLanguageLabel(element: Element, { nodesReferenced }: Options): string {
  if (nodesReferenced.has(element)) {
    return '';
  }
  nodesReferenced.add(element);
  switch (element.tagName) {
    case 'IMG': {
      return element.getAttribute('alt')?.trim() || element.getAttribute('title')?.trim() || '';
    }
    case 'INPUT':
    case 'OUTPUT':
    case 'SELECT':
    case 'TEXTAREA': {
      let totalAccumulatedText = '';
      // Note: <label>s all have to be calculated in DOM order, which means neither
      // parent <label>s or <label for>s take precedence. Also, a <label> may not be
      // exclusive to a single element (via `aria-labelledby`), so we have to iterate
      // over all <label>s each time.
      const labels = document.querySelectorAll('label');
      for (const label of Array.from(labels)) {
        const isAssociated = label.contains(element) || (element.id && label.getAttribute('for') === element.id);
        if (isAssociated) {
          const labelName = computeName(label, { nodesReferenced });
          if (labelName) totalAccumulatedText += ` ${labelName}`;
        }
      }
      return totalAccumulatedText.trim();
    }
    case 'SVG': {
      return element.querySelector('title,desc')?.textContent?.trim() || '';
    }
  }
  return '';
}
