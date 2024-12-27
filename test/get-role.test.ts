import { describe, expect, test } from 'vitest';
import { getRole } from '../src/index.js';

describe('getRole', () => {
  const testCases: [
    string,
    {
      given: Parameters<typeof getRole>[0];
      want: ReturnType<typeof getRole>;
    },
  ][] = [
    ['a', { given: { tagName: 'a' }, want: 'generic' }],
    [
      'a[href]',
      { given: { tagName: 'a', attributes: { href: '#' } }, want: 'link' },
    ],
    [
      'a[href] (empty)',
      { given: { tagName: 'a', attributes: { href: '' } }, want: 'link' },
    ],
    ['abbr', { given: { tagName: 'abbr' }, want: undefined }],
    ['address', { given: { tagName: 'address' }, want: 'group' }],
    ['area', { given: { tagName: 'area' }, want: 'generic' }],
    [
      'area[href]',
      { given: { tagName: 'area', attributes: { href: '#' } }, want: 'link' },
    ],
    [
      'area[href] (empty)',
      { given: { tagName: 'area', attributes: { href: '' } }, want: 'link' },
    ],
    ['article', { given: { tagName: 'article' }, want: 'article' }],
    ['aside', { given: { tagName: 'aside' }, want: 'complementary' }],
    ['audio', { given: { tagName: 'audio' }, want: undefined }],
    ['b', { given: { tagName: 'b' }, want: 'generic' }],
    ['base', { given: { tagName: 'base' }, want: undefined }],
    ['bdi', { given: { tagName: 'bdi' }, want: 'generic' }],
    ['bdo', { given: { tagName: 'bdo' }, want: 'generic' }],
    ['blockquote', { given: { tagName: 'blockquote' }, want: 'blockquote' }],
    ['body', { given: { tagName: 'body' }, want: 'generic' }],
    ['br', { given: { tagName: 'br' }, want: undefined }],
    ['html', { given: { tagName: 'html' }, want: 'document' }],
    ['i', { given: { tagName: 'i' }, want: 'generic' }],
    ['iframe', { given: { tagName: 'iframe' }, want: undefined }],
    [
      'img (name)',
      {
        given: { tagName: 'img', attributes: { alt: 'My image' } },
        want: 'img',
      },
    ],
    ['img (no name)', { given: { tagName: 'img' }, want: 'img' }],
    ['div', { given: { tagName: 'div' }, want: 'generic' }],
    ['span', { given: { tagName: 'div' }, want: 'generic' }],

    [
      'svg[role="img"]',
      { given: { tagName: 'svg', attributes: { role: 'img' } }, want: 'img' },
    ],
    [
      'svg[role="graphics-symbol img"]',
      {
        given: { tagName: 'svg', attributes: { role: 'img' } },
        want: 'graphics-symbol',
      },
    ],
  ];

  describe('from object', () => {
    test.each(testCases)('%s', (_, { given, want }) => {
      expect(getRole(given)).toBe(want);
    });
  });

  describe('from DOM element', () => {
    test.each(testCases)('%s', (_, { given, want }) => {
      const element = document.createElement(given.tagName);
      if (given.attributes) {
        for (const [name, value] of Object.entries(given.attributes)) {
          element.setAttribute(name, String(value));
        }
      }
      expect(getRole(element)).toBe(want);
    });
  });
});
