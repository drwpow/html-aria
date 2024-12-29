import { describe, expect, test } from 'vitest';
import { type VirtualElement, getRole, tags } from '../src/index.js';
import { checkTestAndTagName } from './helpers.js';

describe('getRole', () => {
  /**
   * Document conformance requirements for use of aria-* attributes in HTML
   *
   * The following table provides normative per-element document conformance
   * requirements for the use of ARIA markup in HTML documents. Additionally, it
   * identifies the [implicit ARIA semantics](https://www.w3.org/TR/wai-aria-1.2/#implicit_semantics) that
   * apply to [HTML elements](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements).
   * The [implicit ARIA semantics](https://www.w3.org/TR/wai-aria-1.2/#implicit_semantics) of these
   * elements are defined in [HTML AAM](https://www.w3.org/TR/html-aria/#bib-html-aam-1.0).
   * @see https://www.w3.org/TR/html-aria/#docconformance
   */
  const testCases: [
    string,
    {
      given: Parameters<typeof getRole>;
      want: ReturnType<typeof getRole>;
    },
  ][] = [
    ['a', { given: [{ tagName: 'a' }], want: 'generic' }],
    ['a[href]', { given: [{ tagName: 'a', attributes: { href: '#' } }], want: 'link' }],
    ['a[href] (empty)', { given: [{ tagName: 'a', attributes: { href: '' } }], want: 'link' }],
    ['abbr', { given: [{ tagName: 'abbr' }], want: undefined }],
    ['address', { given: [{ tagName: 'address' }], want: 'group' }],
    ['area', { given: [{ tagName: 'area' }], want: 'generic' }],
    ['area[href]', { given: [{ tagName: 'area', attributes: { href: '#' } }], want: 'link' }],
    ['area[href] (empty)', { given: [{ tagName: 'area', attributes: { href: '' } }], want: 'link' }],
    ['article', { given: [{ tagName: 'article' }], want: 'article' }],
    ['aside', { given: [{ tagName: 'aside' }], want: 'complementary' }],
    ['audio', { given: [{ tagName: 'audio' }], want: undefined }],
    ['b', { given: [{ tagName: 'b' }], want: 'generic' }],
    ['base', { given: [{ tagName: 'base' }], want: undefined }],
    ['bdi', { given: [{ tagName: 'bdi' }], want: 'generic' }],
    ['bdo', { given: [{ tagName: 'bdo' }], want: 'generic' }],
    ['blockquote', { given: [{ tagName: 'blockquote' }], want: 'blockquote' }],
    ['body', { given: [{ tagName: 'body' }], want: 'generic' }],
    ['br', { given: [{ tagName: 'br' }], want: undefined }],
    ['button', { given: [{ tagName: 'button' }], want: 'button' }],
    ['canvas', { given: [{ tagName: 'canvas' }], want: undefined }],
    ['caption', { given: [{ tagName: 'caption' }], want: 'caption' }],
    ['cite', { given: [{ tagName: 'cite' }], want: undefined }],
    ['code', { given: [{ tagName: 'code' }], want: 'code' }],
    ['col', { given: [{ tagName: 'col' }], want: undefined }],
    ['colgroup', { given: [{ tagName: 'colgroup' }], want: undefined }],
    ['data', { given: [{ tagName: 'data' }], want: 'generic' }],
    ['datalist', { given: [{ tagName: 'datalist' }], want: 'listbox' }],
    ['dd', { given: [{ tagName: 'dd' }], want: undefined }],
    ['del', { given: [{ tagName: 'del' }], want: 'deletion' }],
    ['details', { given: [{ tagName: 'details' }], want: 'group' }],
    ['dfn', { given: [{ tagName: 'dfn' }], want: 'term' }],
    ['dialog', { given: [{ tagName: 'dialog' }], want: 'dialog' }],
    ['div', { given: [{ tagName: 'div' }], want: 'generic' }],
    ['dl', { given: [{ tagName: 'dl' }], want: undefined }],
    ['dt', { given: [{ tagName: 'dt' }], want: undefined }],
    ['em', { given: [{ tagName: 'em' }], want: 'emphasis' }],
    ['embed', { given: [{ tagName: 'embed' }], want: undefined }],
    ['fieldset', { given: [{ tagName: 'fieldset' }], want: 'group' }],
    ['figure', { given: [{ tagName: 'figure' }], want: 'figure' }],
    ['figcaption', { given: [{ tagName: 'figcaption' }], want: undefined }],
    ['form', { given: [{ tagName: 'form' }], want: 'form' }],
    ['footer', { given: [{ tagName: 'footer' }], want: 'contentinfo' }],
    ['footer (landmark)', { given: [{ tagName: 'footer' }, { ancestors: [{ tagName: 'article' }] }], want: 'generic' }],
    ['br', { given: [{ tagName: 'br' }], want: undefined }],
    ['h1', { given: [{ tagName: 'h1' }], want: 'heading' }],
    ['h2', { given: [{ tagName: 'h2' }], want: 'heading' }],
    ['h3', { given: [{ tagName: 'h3' }], want: 'heading' }],
    ['h4', { given: [{ tagName: 'h4' }], want: 'heading' }],
    ['h5', { given: [{ tagName: 'h5' }], want: 'heading' }],
    ['h6', { given: [{ tagName: 'h6' }], want: 'heading' }],
    ['head', { given: [{ tagName: 'head' }], want: undefined }],
    ['header', { given: [{ tagName: 'header' }], want: 'banner' }],
    ['header (landmark)', { given: [{ tagName: 'header' }, { ancestors: [{ tagName: 'main' }] }], want: 'generic' }],
    ['hgroup', { given: [{ tagName: 'hgroup' }], want: 'group' }],
    ['hr', { given: [{ tagName: 'hr' }], want: 'separator' }],
    ['html', { given: [{ tagName: 'html' }], want: 'document' }],
    ['i', { given: [{ tagName: 'i' }], want: 'generic' }],
    ['iframe', { given: [{ tagName: 'iframe' }], want: undefined }],
    ['img (name)', { given: [{ tagName: 'img', attributes: { alt: 'My image' } }], want: 'img' }],
    ['img (no name)', { given: [{ tagName: 'img' }], want: 'none' }],
    ['input', { given: [{ tagName: 'input' }], want: 'textbox' }],
    ['input[type="button"]', { given: [{ tagName: 'input', attributes: { type: 'button' } }], want: 'button' }],
    ['input[type="color"]', { given: [{ tagName: 'input', attributes: { type: 'color' } }], want: undefined }],
    ['input[type="date"]', { given: [{ tagName: 'input', attributes: { type: 'date' } }], want: undefined }],
    [
      'input[type="datetime-local"]',
      { given: [{ tagName: 'input', attributes: { type: 'datetime-local' } }], want: undefined },
    ],
    ['input[type="email"]', { given: [{ tagName: 'input', attributes: { type: 'email' } }], want: 'textbox' }],
    [
      'input[type="email"] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'email', list: 'emails' } }], want: 'combobox' },
    ],
    ['input[type="file"]', { given: [{ tagName: 'input', attributes: { type: 'file' } }], want: undefined }],
    ['input[type="hidden"]', { given: [{ tagName: 'input', attributes: { type: 'hidden' } }], want: undefined }],
    ['input[type="month"]', { given: [{ tagName: 'input', attributes: { type: 'month' } }], want: undefined }],
    ['input[type="number"]', { given: [{ tagName: 'input', attributes: { type: 'number' } }], want: 'spinbutton' }],
    ['input[type="password"]', { given: [{ tagName: 'input', attributes: { type: 'password' } }], want: undefined }],
    ['input[type="radio"]', { given: [{ tagName: 'input', attributes: { type: 'radio' } }], want: 'radio' }],
    ['input[type="range"]', { given: [{ tagName: 'input', attributes: { type: 'range' } }], want: 'slider' }],
    ['input[type="reset"]', { given: [{ tagName: 'input', attributes: { type: 'reset' } }], want: 'button' }],
    ['input[type="search"]', { given: [{ tagName: 'input', attributes: { type: 'search' } }], want: 'searchbox' }],
    ['input[type="submit"]', { given: [{ tagName: 'input', attributes: { type: 'submit' } }], want: 'button' }],
    ['input[type="tel"]', { given: [{ tagName: 'input', attributes: { type: 'tel' } }], want: 'textbox' }],
    ['input[type="text"]', { given: [{ tagName: 'input', attributes: { type: 'text' } }], want: 'textbox' }],
    ['input[type="shrek"]', { given: [{ tagName: 'input', attributes: { type: 'shrek' } }], want: 'textbox' }],
    [
      'input (email combobox)',
      { given: [{ tagName: 'input', attributes: { type: 'email', list: 'emails' } }], want: 'combobox' },
    ],
    [
      'input (text combobox)',
      { given: [{ tagName: 'input', attributes: { type: 'text', list: 'texts' } }], want: 'combobox' },
    ],
    [
      'input (search combobox)',
      { given: [{ tagName: 'input', attributes: { type: 'search', list: 'searches' } }], want: 'combobox' },
    ],
    [
      'input (tel combobox)',
      { given: [{ tagName: 'input', attributes: { type: 'tel', list: 'numbers' } }], want: 'combobox' },
    ],
    [
      'input (url combobox)',
      { given: [{ tagName: 'input', attributes: { type: 'url', list: 'urls' } }], want: 'combobox' },
    ],
    ['input[type="time"]', { given: [{ tagName: 'input', attributes: { type: 'time' } }], want: undefined }],
    ['input[type="url"]', { given: [{ tagName: 'input', attributes: { type: 'url' } }], want: 'textbox' }],
    ['input[type="week"]', { given: [{ tagName: 'input', attributes: { type: 'week' } }], want: undefined }],
    ['ins', { given: [{ tagName: 'ins' }], want: 'insertion' }],
    ['label', { given: [{ tagName: 'label' }], want: undefined }],
    ['legend', { given: [{ tagName: 'legend' }], want: undefined }],
    ['li', { given: [{ tagName: 'li' }], want: 'listitem' }],
    ['li (no ancestors)', { given: [{ tagName: 'li' }, { ancestors: [] }], want: 'generic' }],
    ['link', { given: [{ tagName: 'link' }], want: undefined }],
    ['kbd', { given: [{ tagName: 'kbd' }], want: undefined }],
    ['main', { given: [{ tagName: 'main' }], want: 'main' }],
    ['map', { given: [{ tagName: 'map' }], want: undefined }],
    ['mark', { given: [{ tagName: 'mark' }], want: undefined }],
    ['math', { given: [{ tagName: 'math' }], want: 'math' }],
    ['menu', { given: [{ tagName: 'menu' }], want: 'list' }],
    ['meta', { given: [{ tagName: 'meta' }], want: undefined }],
    ['meter', { given: [{ tagName: 'meter' }], want: 'meter' }],
    ['nav', { given: [{ tagName: 'nav' }], want: 'navigation' }],
    ['noscript', { given: [{ tagName: 'noscript' }], want: undefined }],
    ['object', { given: [{ tagName: 'object' }], want: undefined }],
    ['ol', { given: [{ tagName: 'ol' }], want: 'list' }],
    ['optgroup', { given: [{ tagName: 'optgroup' }], want: 'group' }],
    ['option', { given: [{ tagName: 'option' }], want: 'option' }],
    ['output', { given: [{ tagName: 'output' }], want: 'status' }],
    ['p', { given: [{ tagName: 'p' }], want: 'paragraph' }],
    ['picture', { given: [{ tagName: 'picture' }], want: undefined }],
    ['pre', { given: [{ tagName: 'pre' }], want: 'generic' }],
    ['progress', { given: [{ tagName: 'progress' }], want: 'progressbar' }],
    ['q', { given: [{ tagName: 'q' }], want: 'generic' }],
    ['rp', { given: [{ tagName: 'rp' }], want: undefined }],
    ['rt', { given: [{ tagName: 'rt' }], want: undefined }],
    ['ruby', { given: [{ tagName: 'ruby' }], want: undefined }],
    ['s', { given: [{ tagName: 's' }], want: 'deletion' }],
    ['samp', { given: [{ tagName: 'samp' }], want: 'generic' }],
    ['script', { given: [{ tagName: 'script' }], want: undefined }],
    ['search', { given: [{ tagName: 'search' }], want: 'search' }],
    ['section', { given: [{ tagName: 'section' }], want: 'region' }],
    ['select', { given: [{ tagName: 'select' }], want: 'combobox' }],
    ['select[size=1]', { given: [{ tagName: 'select', attributes: { size: 1 } }], want: 'combobox' }],
    ['select[multiple]', { given: [{ tagName: 'select', attributes: { multiple: true } }], want: 'listbox' }],
    ['select[size=2]', { given: [{ tagName: 'select', attributes: { size: 2 } }], want: 'listbox' }],
    ['select[role=generic]', { given: [{ tagName: 'select', attributes: { role: 'generic' } }], want: 'generic' }],
    ['span', { given: [{ tagName: 'span' }], want: 'generic' }],
    ['small', { given: [{ tagName: 'small' }], want: 'generic' }],
    ['source', { given: [{ tagName: 'source' }], want: undefined }],
    ['slot', { given: [{ tagName: 'slot' }], want: undefined }],
    ['strong', { given: [{ tagName: 'strong' }], want: 'strong' }],
    ['style', { given: [{ tagName: 'style' }], want: undefined }],
    ['sub', { given: [{ tagName: 'sub' }], want: 'subscript' }],
    ['summary', { given: [{ tagName: 'summary' }], want: undefined }],
    ['sup', { given: [{ tagName: 'sup' }], want: 'superscript' }],
    ['svg', { given: [{ tagName: 'svg' }], want: 'graphics-document' }],
    ['svg[role="img"]', { given: [{ tagName: 'svg', attributes: { role: 'img' } }], want: 'img' }],
    [
      'svg[role="graphics-symbol img"]',
      { given: [{ tagName: 'svg', attributes: { role: 'graphics-symbol img' } }], want: 'graphics-symbol' },
    ],
    ['table', { given: [{ tagName: 'table' }], want: 'table' }],
    ['tbody', { given: [{ tagName: 'tbody' }], want: 'rowgroup' }],
    ['td', { given: [{ tagName: 'td' }], want: 'cell' }],
    ['td (no ancestors)', { given: [{ tagName: 'td' }, { ancestors: [] }], want: undefined }],
    ['td (table)', { given: [{ tagName: 'td' }, { ancestors: [{ tagName: 'table' }] }], want: 'cell' }],
    [
      'td (grid)',
      {
        given: [{ tagName: 'td' }, { ancestors: [{ tagName: 'table', attributes: { role: 'grid' } }] }],
        want: 'gridcell',
      },
    ],
    [
      'td (treegrid)',
      {
        given: [{ tagName: 'td' }, { ancestors: [{ tagName: 'table', attributes: { role: 'treegrid' } }] }],
        want: 'gridcell',
      },
    ],
    ['template', { given: [{ tagName: 'template' }], want: undefined }],
    ['textarea', { given: [{ tagName: 'textarea' }], want: 'textbox' }],
    ['thead', { given: [{ tagName: 'thead' }], want: 'rowgroup' }],
    ['tfoot', { given: [{ tagName: 'tfoot' }], want: 'rowgroup' }],
    ['th', { given: [{ tagName: 'th' }], want: 'columnheader' }],
    ['th (no ancestors)', { given: [{ tagName: 'th' }, { ancestors: [] }], want: undefined }],
    ['th[scope="col"]', { given: [{ tagName: 'th', attributes: { scope: 'col' } }], want: 'columnheader' }],
    ['th[scope="rol"]', { given: [{ tagName: 'th', attributes: { scope: 'row' } }], want: 'rowheader' }],
    ['time', { given: [{ tagName: 'time' }], want: 'time' }],
    ['title', { given: [{ tagName: 'title' }], want: undefined }],
    ['tr', { given: [{ tagName: 'tr' }], want: 'row' }],
    ['track', { given: [{ tagName: 'track' }], want: undefined }],
    ['u', { given: [{ tagName: 'u' }], want: 'generic' }],
    ['ul', { given: [{ tagName: 'ul' }], want: 'list' }],
    ['var', { given: [{ tagName: 'var' }], want: undefined }],
    ['video', { given: [{ tagName: 'video' }], want: undefined }],
    ['wbr', { given: [{ tagName: 'wbr' }], want: undefined }],
  ];

  describe('from object', () => {
    const testedTags = new Set<string>();

    test.each(testCases)('%s', (name, { given, want }) => {
      testedTags.add(given[0].tagName);
      checkTestAndTagName(name, given[0].tagName);
      expect(getRole(...given)).toBe(want);
    });

    test('all tags are tested', () => {
      const allTags = Object.keys(tags);
      for (const tag of allTags) {
        if (!testedTags.has(tag)) {
          console.warn(`Tag "${tag}" is not tested`);
        }
      }
    });
  });

  describe('from DOM element', () => {
    function elFromVirtual(el: VirtualElement) {
      const element = document.createElement(el.tagName);
      if (el.attributes) {
        for (const [name, value] of Object.entries(el.attributes)) {
          element.setAttribute(name, String(value));
        }
      }
      return element;
    }

    test.each(testCases)('%s', (_, { given, want }) => {
      // convert main element to DOM element
      const mainEl = elFromVirtual(given[0] as VirtualElement);
      const options = { ...given[1] };
      // also, to test ancestors, convert those, too
      if (options.ancestors) {
        options.ancestors = options.ancestors.map((el) => elFromVirtual(el as VirtualElement));
      }
      expect(getRole(mainEl, options)).toBe(want);
    });
  });
});
