import { describe, expect, test } from 'vitest';
import { getRole } from '../src/index.js';

describe('getRole', () => {
  /**
   * Document conformance requirements for use of ARIA attributes in HTML
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
    ['h1', { given: [{ tagName: 'h1' }], want: 'heading' }],
    ['h2', { given: [{ tagName: 'h2' }], want: 'heading' }],
    ['h3', { given: [{ tagName: 'h3' }], want: 'heading' }],
    ['h4', { given: [{ tagName: 'h4' }], want: 'heading' }],
    ['h5', { given: [{ tagName: 'h5' }], want: 'heading' }],
    ['h6', { given: [{ tagName: 'h6' }], want: 'heading' }],
    ['head', { given: [{ tagName: 'head' }], want: undefined }],
    ['hr', { given: [{ tagName: 'hr' }], want: 'separator' }],
    ['html', { given: [{ tagName: 'html' }], want: 'document' }],
    ['header', { given: [{ tagName: 'header' }], want: 'banner' }],
    ['header (landmark)', { given: [{ tagName: 'header' }, { lineage: ['main'] }], want: 'generic' }],
    ['i', { given: [{ tagName: 'i' }], want: 'generic' }],
    ['iframe', { given: [{ tagName: 'iframe' }], want: undefined }],
    ['img (name)', { given: [{ tagName: 'img', attributes: { alt: 'My image' } }], want: 'img' }],
    ['img (no name)', { given: [{ tagName: 'img' }], want: 'img' }],
    ['div', { given: [{ tagName: 'div' }], want: 'generic' }],
    ['span', { given: [{ tagName: 'div' }], want: 'generic' }],
    ['svg[role="img"]', { given: [{ tagName: 'svg', attributes: { role: 'img' } }], want: 'img' }],
    [
      'svg[role="graphics-symbol img"]',
      { given: [{ tagName: 'svg', attributes: { role: 'img' } }], want: ['graphics-symbol'] },
    ],
  ];

  describe('from object', () => {
    test.each(testCases)('%s', (_, { given, want }) => {
      expect(getRole(...given)).toBe(want);
    });
  });

  describe('from DOM element', () => {
    test.each(testCases)('%s', (_, { given, want }) => {
      const element = document.createElement(given[0].tagName);
      if (given[0].attributes) {
        for (const [name, value] of Object.entries(given[0].attributes)) {
          element.setAttribute(name, String(value));
        }
      }
      expect(getRole(element, given[1])).toBe(want);
    });
  });
});
