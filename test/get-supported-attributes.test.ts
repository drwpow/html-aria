import { describe, expect, test } from 'vitest';
import {
  type ARIAAttribute,
  getSupportedAttributes,
  isSupportedAttribute,
  attributes,
  isValidAttributeValue,
  tags,
} from '../src/index.js';
import { checkTestAndTagName } from './helpers.js';

const ALL_ATTRIBUTES = Object.keys(attributes) as ARIAAttribute[];

const tests: [
  string,
  {
    given: Parameters<typeof getSupportedAttributes>;
    want: ReturnType<typeof getSupportedAttributes>;
  },
][] = [
  ['canvas', { given: [{ tagName: 'canvas' }], want: ALL_ATTRIBUTES }],
  ['cite', { given: [{ tagName: 'cite' }], want: ALL_ATTRIBUTES }],
  ['code', { given: [{ tagName: 'code' }], want: ALL_ATTRIBUTES }],
  ['col', { given: [{ tagName: 'col' }], want: [] }],
  ['colgroup', { given: [{ tagName: 'col' }], want: [] }],
  ['data', { given: [{ tagName: 'data' }], want: ALL_ATTRIBUTES }],
  ['datalist', { given: [{ tagName: 'datalist' }], want: [] }],
  ['dd', { given: [{ tagName: 'dd' }], want: ALL_ATTRIBUTES }],
];

describe('getSupportedAttributes', () => {
  const testedTags = new Set<string>();

  test.each(tests)('%s', (name, { given, want }) => {
    checkTestAndTagName(name, given[0].tagName);
    expect(getSupportedAttributes(...given)).toEqual(want);
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
  ['aria-checked="?"', { given: ['aria-checked', undefined], want: true }], // "undefined" is a spec-defined valid value
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
