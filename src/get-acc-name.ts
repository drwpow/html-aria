import { type RoleData, roles } from './lib/aria-roles.js';
import { attr, getCSSContent, getDisplay, getTagName, getTooltip, isHidden } from './lib/util.js';
import { getAsideRole } from './tags/aside.js';
import { getFooterRole } from './tags/footer.js';
import { getLIRole } from './tags/li.js';
import type { VirtualElement } from './types.js';

/** Common options */
interface Options {
  /**
   * Important: Each node in the subtree is consulted only once. If text has
   * been collected from a descendant, but is referenced by another IDREF in
   * some descendant node, then that second, or subsequent, reference is not
   * followed. This is done to avoid infinite loops.
   * @see https://www.w3.org/TR/accname-1.2/#computation-steps
   */
  nodesReferenced: Set<Element | VirtualElement>;
}

/**
 * Get [acc]essible name & description.
 * Per spec, a missing name is represented as an empty string ("").  Name and
 * description must be calculated together, to ensure descriptions are not
 * redundant.
 *
 * @see https://www.w3.org/TR/html-aam-1.0/#accessible-name-and-description-computation
 */
export function getAccNameAndDescription(
  element: Element | VirtualElement,
  { nodesReferenced }: Options = { nodesReferenced: new Set<Element>() },
): {
  name: string;
  description: string | undefined;
} {
  const tagName = getTagName(element);

  // helper to conditionally return description, only if unique from name
  // https://www.w3.org/TR/accname-1.2/#mapping_additional_nd_description
  const nameFrom = (name: string | undefined) => {
    let description: string | undefined;
    // 1. aria-describedby
    const describedby = attr(element, 'aria-describedby');
    if (describedby) {
      description = concatIDRefList(element, 'aria-describedby', { nodesReferenced });
    } else {
      description =
        // 2. aria-description
        attr(element, 'aria-description') ||
        // 3. title
        attr(element, 'title') ||
        // 4. no acc description
        undefined;
    }
    return {
      name: name?.trim() || '',
      description: (description !== name && description?.trim()) || undefined,
    };
  };

  const ariaLabelledby = attr(element, 'aria-labelledby');
  const ariaLabel = attr(element, 'aria-label');

  // https://www.w3.org/TR/html-aam-1.0/#accessible-name-and-description-computation
  // 4.1.1 input type="text", input type="password", input type="number", input
  // type="search", input type="tel", input type="email", input type="url", textarea
  if (!ariaLabel && !ariaLabelledby) {
    switch (tagName) {
      case 'input':
      case 'textarea': {
        const inputType = attr(element, 'type');
        const title = attr(element, 'title');
        const placeholder = attr(element, 'placeholder');
        if (
          ['text', 'password', 'number', 'search', 'tel', 'email', 'url'].includes(inputType!) ||
          tagName === 'textarea'
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
      case 'button': {
        // 1. aria-label (handled below)
        // 2. <label>
        const parentLabel = (element as Element).parentElement?.closest('label');
        if (parentLabel) return getAccNameAndDescription(parentLabel, { nodesReferenced });
        return nameFrom(
          // 3. visible text
          computeName(element, { nodesReferenced }) ||
            // 4. title
            attr(element, 'title') ||
            // 5. no accname
            undefined,
        );
      }

      // 4.1.5 fieldset Element Accessible Name Computation
      case 'fieldset': {
        // 1. aria-label (handled below)
        // 2. <legend>
        const legend =
          typeof Element !== 'undefined' && element instanceof Element ? element.querySelector('legend') : null;
        const legendText = legend ? computeName(legend, { nodesReferenced }) : undefined;
        if (legendText) return nameFrom(legendText);
        return nameFrom(
          // 3. title
          attr(element, 'title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.6 output Element Accessible Name Computation
      case 'output': {
        // 1. aria-label (handled below)
        // 2. <label>
        const hll = calculateHostLanguageLabel(element, { nodesReferenced });
        if (hll) return nameFrom(hll);
        return nameFrom(
          // 3. title
          attr(element, 'title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.7 Other Form Elements Accessible Name Computation
      // TODO: what are “other form elements?”

      // 4.1.8 summary Element Accessible Name Computation
      case 'summary': {
        if (getTagName((element as Element).parentElement!) !== 'details') {
          break;
        }

        // 1. aria-label (handled below)
        // 2. visibleText
        const subtree = computeName(element, { nodesReferenced });
        if (subtree) return nameFrom(subtree);
        // 3. title
        return nameFrom(
          attr(element, 'title') ||
            // 4. (user agent provided)
            // 5. no accname
            undefined,
        );
      }

      // 4.1.9 figure Element Accessible Name Computation
      case 'figure': {
        // 1. aria-label (handled below)
        // 2. <figcaption>
        const figcaptionEl =
          typeof Element !== 'undefined' && element instanceof Element ? element.querySelector('figcaption') : null;
        if (figcaptionEl) return getAccNameAndDescription(figcaptionEl);
        // 3. title
        return nameFrom(
          attr(element, 'title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.10 img Element Accessible Name Computation
      case 'img': {
        // 1. aria-label (handled below)
        // 2. alt
        if (attr(element, 'alt') !== null) return nameFrom(attr(element, 'alt') || undefined);
        // 3. title
        if (attr(element, 'title') !== null) return nameFrom(attr(element, 'title') || undefined);
        // 4. figcaption
        const figcaptionParent =
          typeof Element !== 'undefined' && element instanceof Element && element.parentElement?.closest('figcaption');
        if (figcaptionParent) return getAccNameAndDescription(figcaptionParent);
        // 5. no accname
        return nameFrom(undefined);
      }

      // 4.1.11 table Element Accessible Name Computation
      case 'table': {
        // 1. aria-label (handled below)
        // 2. <caption>
        const captionEl =
          typeof Element !== 'undefined' && element instanceof Element ? element.querySelector('caption') : null;
        if (captionEl) return getAccNameAndDescription(captionEl);
        return nameFrom(
          // 3. title
          attr(element, 'title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.12 tr, td, th Elements Accessible Name Computation
      case 'tr':
      case 'td':
      case 'th': {
        // 1. aria-label (handled below)
        return nameFrom(
          // 2. title
          attr(element, 'title') ||
            // 3. no accname
            undefined,
        );
      }

      // 4.1.13 a Element Accessible Name Computation
      case 'a': {
        // 1. aria-label (handled below)
        // 2. subtree
        const subtree = computeName(element, { nodesReferenced });
        if (subtree) return nameFrom(subtree);
        return nameFrom(
          // 3. title
          attr(element, 'title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.14 area Element Accessible Name Computation
      case 'area': {
        // 1. aria-label (handled below)
        return nameFrom(
          // 2. alt
          attr(element, 'alt') ||
            // 3. title
            attr(element, 'title') ||
            // 4. no accname
            undefined,
        );
      }

      // 4.1.15 iframe Element Accessible Name Computation
      case 'iframe': {
        // 1. aria-label (handled below)
        return nameFrom(
          // 2. title
          attr(element, 'title') ||
            // 3. no accname
            undefined,
        );
      }

      // 4.1.16 Section and Grouping Element Accessible Name Computation
      case 'section': {
        // TODO: what other tags are “grouping?”
        // 1. aria-label (handled below)
        return nameFrom(
          // 2. title
          attr(element, 'title') ||
            // 3. no accname
            undefined,
        );
      }

      // 4.1.17 Text-level Element Accessible Name Computation
      case 'abbr':
      case 'b':
      case 'bdi':
      case 'bdo':
      case 'br':
      case 'cite':
      case 'code':
      case 'dfn':
      case 'em':
      case 'i':
      case 'kbd':
      case 'mark':
      case 'q':
      case 'rp':
      case 'ruby':
      case 's':
      case 'samp':
      case 'small':
      case 'strong':
      case 'sub':
      case 'sup':
      case 'time':
      case 'u':
      case 'var':
      case 'wbr': {
        // 1. aria-label (handled below)
        return nameFrom(
          // 2. title
          attr(element, 'title') ||
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
  element: Element | VirtualElement,
  attribute: 'aria-labelledby' | 'aria-describedby' | 'aria-owns',
  { nodesReferenced }: Options,
): string {
  // In faked DOM environments, we can’t traverse the ID list, so just return the attribute
  if (typeof document === 'undefined' || typeof Element === 'undefined' || !(element instanceof Element)) {
    return attr(element, attribute)?.trim() || '';
  }

  const idRefList = attr(element, attribute)?.trim();
  if (!idRefList) return '';
  const idList = idRefList.split(/\s+/);
  const nameList: (string | undefined)[] = [];
  for (const id of idList) {
    let nextEl = document.getElementById(id) as Element | null;
    if (nextEl) {
      // edge case: eleemnts can reference themselves, but we have to remove the infinite loop first
      if (nextEl === element) {
        nextEl = nextEl.cloneNode(false) as Element;
        nextEl.removeAttribute(attribute);
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
  element: Element | VirtualElement,
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
  // Important: Each node in the subtree is consulted only once. If text has
  // been collected from a descendant, but is referenced by another IDREF in
  // some descendant node, then that second, or subsequent, reference is not
  // followed.  This is done to avoid infinite loops.
  if (nodesReferenced.has(element)) {
    return '';
  }
  nodesReferenced.add(element);

  // 1. Initialization
  const role = getRoleIncomplete(element);
  const tagName = getTagName(element);
  const ariaLabel = attr(element, 'aria-label');
  const ariaLabelledby = attr(element, 'aria-labelledby');
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

  // Name from author
  // https://w3c.github.io/aria/#namecalculation
  const tooltip = getTooltip(element);
  const hll = calculateHostLanguageLabel(element, { nodesReferenced });
  if (role?.nameFrom === 'author' && (ariaLabel || hll || tooltip)) {
    return ariaLabel?.trim() || hll || tooltip;
  }

  // 2.3 embedded control
  // 2.3.1 embedded control: textbox
  if (role?.name === 'textbox') {
    const value = (element as HTMLInputElement).value?.trim() || '';
    if (value) return value;
  }
  // 2.3.2 embedded control: combobox/listbox
  if (
    (role?.name === 'combobox' || role?.name === 'listbox') &&
    typeof Element !== 'undefined' &&
    element instanceof Element
  ) {
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
      attr(element, 'aria-valuetext')?.trim() ||
      attr(element, 'aria-valuenow')?.trim() ||
      (element as HTMLInputElement).value?.trim();
    if (value) return value;
  }

  // 2.4 aria-label
  if (tagName !== 'slot' && ariaLabel) {
    return ariaLabel;
  }

  // 2.5 host language label
  if (
    ['input', 'img', 'output', 'select', 'textarea', 'svg'].includes(tagName) &&
    !['presentation', 'none'].includes(role?.name!)
  ) {
    return calculateHostLanguageLabel(element, { nodesReferenced });
  }

  // TODO: fix incomplete "nameFrom" implementation. According to WPT, <aside> doesn’t get named from contents.
  // There could be other bugs here too, look into "nameFrom" handling
  if (['complementary'].includes(role?.name!)) {
    return '';
  }

  // 2.6.1 init
  let totalAccumulatedText = '';

  // 2.6.2 pseudo + 2.6.3, 2.6.4, 2.6.5 child nodes, 2.6.8 tooltips
  const childNodes = typeof Element !== 'undefined' && element instanceof Element ? Array.from(element.childNodes) : [];
  const { before, after, marker } = {
    before: getCSSContent(element, '::before'),
    after: getCSSContent(element, '::after'),
    marker: getCSSContent(element, '::marker'),
  };
  if (before) childNodes.unshift(createTextNode(before));
  if (tooltip) childNodes.push(createTextNode(` ${tooltip} `));
  if (marker) childNodes.push(createTextNode(marker));
  if (after) childNodes.push(createTextNode(after));
  for (const node of childNodes) {
    switch (node.nodeType) {
      // TEXT_NODE. Declared manually to work in Node.js
      case 3: {
        if (node.nodeValue) totalAccumulatedText += node.nodeValue;
        break;
      }
      // ELEMENT_NODE. Declared manually to work in Node.
      case 1: {
        if (nodesReferenced.has(node as Element)) {
          continue;
        }

        const childRole = getRoleIncomplete(node as Element);
        // If we hit a menu as part of another name calculation, ignore
        if (childRole?.name === 'menu') {
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
        else if (getTagName(node as Element) === 'br') {
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
function calculateHostLanguageLabel(element: Element | VirtualElement, { nodesReferenced }: Options): string {
  if (nodesReferenced.has(element)) {
    return '';
  }
  nodesReferenced.add(element);
  switch (getTagName(element)) {
    case 'img': {
      return attr(element, 'alt')?.trim() || '';
    }
    case 'input':
    case 'output':
    case 'select':
    case 'textarea': {
      if (typeof Element === 'undefined' || typeof document === 'undefined' || !(element instanceof Element)) return '';
      let totalAccumulatedText = '';
      // Note: <label>s all have to be calculated in DOM order, which means neither
      // parent <label>s or <label for>s take precedence. Also, a <label> may not be
      // exclusive to a single element (via `aria-labelledby`), so we have to iterate
      // over all <label>s each time.
      const labels = document.querySelectorAll('label');
      for (const label of Array.from(labels)) {
        const isAssociated = label.contains(element) || (element.id && attr(label, 'for') === element.id);
        if (isAssociated) {
          const labelName = computeName(label, { nodesReferenced });
          if (labelName) totalAccumulatedText += ` ${labelName}`;
        }
      }
      return totalAccumulatedText.trim();
    }
    case 'svg': {
      if (typeof Element === 'undefined' || !(element instanceof Element)) return '';
      return element.querySelector('title,desc')?.textContent?.trim() || '';
    }
  }
  return '';
}

/** Universal helper for text nodes */
function createTextNode(content: string): ChildNode {
  if (typeof document !== 'undefined') return document.createTextNode(content);
  return { type: 3, nodeValue: content } as unknown as ChildNode;
}

/**
 * @deprecated DO NOT USE EXTERNALLY!
 * This is not an accurate or complete role calcuation, this is only the bare-minimum for calculating accessible name.
 * If we included the full logic, we’d have an infinite loop because it involves name calculation.
 */
function getRoleIncomplete(element: Element | VirtualElement): RoleData | undefined {
  const roleAttr = attr(element, 'role');
  if (roleAttr) return roles[roleAttr as keyof typeof roles];

  const tagName = getTagName(element);

  if (tagName === 'li') {
    return getLIRole(element);
  }

  for (const role of Object.values(roles)) {
    if (
      role.elements.some(
        (el) =>
          el.tagName === tagName &&
          (!el.attributes || Object.entries(el.attributes).every(([k, v]) => attr(element, k) === v)),
      )
    ) {
      return role;
    }
  }
}
