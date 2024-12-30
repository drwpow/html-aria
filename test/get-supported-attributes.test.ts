import { describe, expect, test } from 'vitest';
import {
  type ARIAAttribute,
  type AttributeCategory,
  attributes,
  draganddropAttributes,
  getSupportedAttributes,
  globalAttributes,
  isSupportedAttribute,
  isValidAttributeValue,
  liveregionAttributes,
  relationshipAttributes,
  tags,
  widgetAttributes,
} from '../src/index.js';
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
  ['a', { given: [{ tagName: 'a' }], want: [] }],
  ['abbr', { given: [{ tagName: 'abbr' }], want: [] }],
  ['address', { given: [{ tagName: 'address' }], want: [] }],
  ['area', { given: [{ tagName: 'area' }], want: [] }],
  ['article', { given: [{ tagName: 'article' }], want: [] }],
  ['aside', { given: [{ tagName: 'aside' }], want: [] }],
  ['base', { given: [{ tagName: 'base' }], want: [] }],
  ['bdi', { given: [{ tagName: 'bdi' }], want: GLOBAL_ATTRIBUTES }],
  ['bdo', { given: [{ tagName: 'bdo' }], want: GLOBAL_ATTRIBUTES }],
  ['blockquote', { given: [{ tagName: 'blockquote' }], want: GLOBAL_ATTRIBUTES }],
  ['body', { given: [{ tagName: 'body' }], want: ['aria-hidden'] }],
  ['br', { given: [{ tagName: 'br' }], want: ['aria-hidden'] }],
  ['canvas', { given: [{ tagName: 'canvas' }], want: GLOBAL_ATTRIBUTES }],
  ['cite', { given: [{ tagName: 'cite' }], want: GLOBAL_ATTRIBUTES }],
  ['code', { given: [{ tagName: 'code' }], want: GLOBAL_NO_NAMING }],
  ['col', { given: [{ tagName: 'col' }], want: [] }],
  ['colgroup', { given: [{ tagName: 'col' }], want: [] }],
  ['data', { given: [{ tagName: 'data' }], want: GLOBAL_ATTRIBUTES }],
  ['datalist', { given: [{ tagName: 'datalist' }], want: [] }],
  ['dd', { given: [{ tagName: 'dd' }], want: GLOBAL_ATTRIBUTES }],
  ['footer', { given: [{ tagName: 'footer' }], want: [] }],
  ['h1', { given: [{ tagName: 'h1' }], want: [] }],
  ['h2', { given: [{ tagName: 'h1' }], want: [] }],
  ['h3', { given: [{ tagName: 'h1' }], want: [] }],
  ['h4', { given: [{ tagName: 'h1' }], want: [] }],
  ['h5', { given: [{ tagName: 'h1' }], want: [] }],
  ['h6', { given: [{ tagName: 'h6' }], want: [] }],
  ['head', { given: [{ tagName: 'head' }], want: [] }],
  ['header', { given: [{ tagName: 'header' }], want: [] }],
  ['hgroup', { given: [{ tagName: 'hgroup' }], want: [] }],
  ['html', { given: [{ tagName: 'html' }], want: [] }],
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
  ['meta', { given: [{ tagName: 'meta' }], want: [] }],
  ['main', { given: [{ tagName: 'main' }], want: GLOBAL_ATTRIBUTES }],
  ['map', { given: [{ tagName: 'map' }], want: [] }],
  ['meta', { given: [{ tagName: 'meta' }], want: [] }],
  ['nav', { given: [{ tagName: 'nav' }], want: [] }],
  ['noscript', { given: [{ tagName: 'noscript' }], want: [] }],
  ['picture', { given: [{ tagName: 'picture' }], want: ['aria-hidden'] }],
  ['s', { given: [{ tagName: 's' }], want: [] }],
  ['samp', { given: [{ tagName: 'samp' }], want: [] }],
  ['script', { given: [{ tagName: 'script' }], want: [] }],
  ['search', { given: [{ tagName: 'search' }], want: [] }],
  ['section', { given: [{ tagName: 'section' }], want: [] }],
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

  const attributeMap: Record<AttributeCategory, ARIAAttribute[]> = {
    global: Object.keys(globalAttributes) as ARIAAttribute[],
    widget: Object.keys(widgetAttributes) as ARIAAttribute[],
    liveregion: Object.keys(liveregionAttributes) as ARIAAttribute[],
    draganddrop: Object.keys(draganddropAttributes) as ARIAAttribute[],
    relationship: Object.keys(relationshipAttributes) as ARIAAttribute[],
  };

  test.each(tests)('%s', (name, { given, want }) => {
    testedTags.add(given[0].tagName);
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
