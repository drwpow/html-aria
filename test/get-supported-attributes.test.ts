import { describe, expect, test } from 'vitest';
import {
  type ARIAAttribute,
  getSupportedAttributes,
  isSupportedAttribute,
  isValidAttributeValue,
  tags,
} from '../src/index.js';
import { globalAttributes, widgetAttributes } from '../src/lib/aria-attributes.js';
import { checkTestAndTagName } from './helpers.js';

const GLOBAL_ATTRIBUTES = Object.keys(globalAttributes) as ARIAAttribute[];
const GLOBAL_NO_NAMING = GLOBAL_ATTRIBUTES.filter(
  (attr) => attr !== 'aria-label' && attr !== 'aria-labelledby',
) as ARIAAttribute[];
const WIDGET_ATTRIBUTES = Object.keys(widgetAttributes) as ARIAAttribute[];

const tests: [
  string,
  {
    given: Parameters<typeof getSupportedAttributes>;
    want: ReturnType<typeof getSupportedAttributes>;
  },
][] = [
  ['bdi', { given: [{ tagName: 'bdi' }], want: GLOBAL_ATTRIBUTES }],
  ['bdo', { given: [{ tagName: 'bdo' }], want: GLOBAL_ATTRIBUTES }],
  ['blockquote', { given: [{ tagName: 'blockquote' }], want: GLOBAL_ATTRIBUTES }],
  ['br', { given: [{ tagName: 'br' }], want: ['aria-hidden'] }],
  ['body', { given: [{ tagName: 'body' }], want: [] }],
  ['canvas', { given: [{ tagName: 'canvas' }], want: GLOBAL_ATTRIBUTES }],
  ['cite', { given: [{ tagName: 'cite' }], want: GLOBAL_ATTRIBUTES }],
  ['code', { given: [{ tagName: 'code' }], want: GLOBAL_NO_NAMING }],
  ['col', { given: [{ tagName: 'col' }], want: [] }],
  ['colgroup', { given: [{ tagName: 'col' }], want: [] }],
  ['data', { given: [{ tagName: 'data' }], want: GLOBAL_ATTRIBUTES }],
  ['datalist', { given: [{ tagName: 'datalist' }], want: [] }],
  ['dd', { given: [{ tagName: 'dd' }], want: GLOBAL_ATTRIBUTES }],
  ['head', { given: [{ tagName: 'head' }], want: [] }],
  [
    'input[type="checkbox"]',
    {
      given: [{ tagName: 'input', attributes: { type: 'checkbox' } }],
      want: [...GLOBAL_ATTRIBUTES, ...WIDGET_ATTRIBUTES],
    },
  ],
  [
    'input[type="radio"]',
    {
      given: [{ tagName: 'input', attributes: { type: 'radio' } }],
      want: [...GLOBAL_ATTRIBUTES, ...WIDGET_ATTRIBUTES],
    },
  ],
  [
    'input[type="email"]',
    {
      given: [{ tagName: 'input', attributes: { type: 'email' } }],
      want: [...GLOBAL_ATTRIBUTES, ...WIDGET_ATTRIBUTES],
    },
  ],
  ['link', { given: [{ tagName: 'link' }], want: [] }],
  ['main', { given: [{ tagName: 'main' }], want: GLOBAL_ATTRIBUTES }],
  ['map', { given: [{ tagName: 'map' }], want: [] }],
  ['meta', { given: [{ tagName: 'meta' }], want: [] }],
  ['noscript', { given: [{ tagName: 'noscript' }], want: [] }],
  ['picture', { given: [{ tagName: 'picture' }], want: ['aria-hidden'] }],
  ['s', { given: [{ tagName: 's' }], want: [] }],
  ['samp', { given: [{ tagName: 'samp' }], want: [] }],
  ['script', { given: [{ tagName: 'script' }], want: [] }],
  ['search', { given: [{ tagName: 'search' }], want: [] }],
  ['slot', { given: [{ tagName: 'slot' }], want: [] }],
  ['span', { given: [{ tagName: 'span' }], want: GLOBAL_NO_NAMING }],
  ['source', { given: [{ tagName: 'source' }], want: [] }],
  ['style', { given: [{ tagName: 'style' }], want: [] }],
  ['template', { given: [{ tagName: 'template' }], want: [] }],
  ['textarea', { given: [{ tagName: 'textarea' }], want: [...GLOBAL_ATTRIBUTES, ...WIDGET_ATTRIBUTES] }],
  ['title', { given: [{ tagName: 'title' }], want: [] }],
  ['track', { given: [{ tagName: 'textarea' }], want: [] }],
  ['u', { given: [{ tagName: 'textarea' }], want: GLOBAL_NO_NAMING }],
];

describe('getSupportedAttributes', () => {
  const testedTags = new Set<string>();

  test.each(tests)('%s', (name, { given, want }) => {
    checkTestAndTagName(name, given[0].tagName);

    // dedupe, sort, and alphabetize these to make tests easier to write
    const supportedAttributes = [...getSupportedAttributes(...given)];
    supportedAttributes.sort((a, b) => a.localeCompare(b));
    const normalizedWant = [...new Set(want)];
    normalizedWant.sort((a, b) => a.localeCompare(b));

    expect(supportedAttributes).toEqual(normalizedWant);
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

describe('isSupportedAttribute', () => {
  const allAttributes = Object.keys(attributes) as ARIAAttribute[];
  allAttributes.sort((a, b) => a.localeCompare(b));
  for (const [name, { given, want }] of tests) {
    describe(name, () => {
      for (const attr of allAttributes) {
        test(attr, () => {
          expect(isSupportedAttribute(attr, ...given)).toBe(want.includes(attr));
        });
      }
    });
  }
});

const valueTests: [
  string,
  {
    given: Parameters<typeof isValidAttributeValue>;
    want: ReturnType<typeof isValidAttributeValue>;
  },
][] = [
  // enum
  ['aria-checked="true"', { given: ['aria-checked', 'true'], want: true }],
  ['aria-checked="false"', { given: ['aria-checked', 'false'], want: true }],
  ['aria-checked="mixed"', { given: ['aria-checked', 'mixed'], want: true }],
  ['aria-checked={true}', { given: ['aria-checked', true], want: true }],
  ['aria-checked={false}', { given: ['aria-checked', false], want: true }],
  ['aria-checked=""', { given: ['aria-checked', ''], want: false }], // acceptable for boolean, but this is an enum!
  ['aria-checked="?"', { given: ['aria-checked', undefined], want: false }], // "undefined" is a valid value, however, this method assumes presence of an attribute (undefined is absence)
  ['aria-checked="foobar"', { given: ['aria-checked', 'foobar'], want: false }],

  // boolean
  ['aria-disabled="true"', { given: ['aria-disabled', 'true'], want: true }],
  ['aria-disabled="false"', { given: ['aria-disabled', 'false'], want: true }],
  ['aria-disabled={true}', { given: ['aria-disabled', true], want: true }],
  ['aria-disabled={false}', { given: ['aria-disabled', false], want: true }],
  ['aria-disabled=""', { given: ['aria-disabled', ''], want: true }],
  ['aria-disabled="foobar"', { given: ['aria-disabled', 'foobar'], want: false }],
];

describe('isValidAttributeValue', () => {
  test.each(valueTests)('%s', (_, { given, want }) => {
    expect(isValidAttributeValue(...given)).toBe(want);
  });
});
