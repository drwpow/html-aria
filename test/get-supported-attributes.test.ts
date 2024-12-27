import { describe, expect, test } from 'vitest';
import {
  type ARIAAttribute,
  getSupportedAttributes,
  isSupportedAttribute,
  attributes,
  isValidAttributeValue,
} from '../src/index.js';

const tests: [
  string,
  {
    given: Parameters<typeof getSupportedAttributes>;
    want: ReturnType<typeof getSupportedAttributes>;
  },
][] = [
  ['col', { given: [{ tagName: 'col' }], want: [] }],
  ['colgroup', { given: [{ tagName: 'col' }], want: [] }],
];

describe('getSupportedAttributes', () => {
  test.each(tests)('%s', (_, { given, want }) => {
    expect(getSupportedAttributes(...given)).toEqual(want);
  });
});

describe('isSupportedAttribute', () => {
  const allAttributes = Object.keys(attributes) as ARIAAttribute[];
  allAttributes.sort((a, b) => a.localeCompare(b));
  for (const [name, { given, want }] of tests) {
    describe(name, () => {
      for (const attr of allAttributes) {
        test(attr, () => {
          expect(isSupportedAttribute(attr, ...given)).toBe(
            want.includes(attr),
          );
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
  ['aria-checked="foobar"', { given: ['aria-checked', 'foobar'], want: false }],

  // boolean
  ['aria-disabled="true"', { given: ['aria-disabled', 'true'], want: true }],
  ['aria-disabled="false"', { given: ['aria-disabled', 'false'], want: true }],
  ['aria-disabled={true}', { given: ['aria-disabled', true], want: true }],
  ['aria-disabled={false}', { given: ['aria-disabled', false], want: true }],
  ['aria-disabled=""', { given: ['aria-disabled', ''], want: true }],
  [
    'aria-disabled="foobar"',
    { given: ['aria-disabled', 'foobar'], want: false },
  ],
];

describe('isValidAttributeValue', () => {
  test.each(valueTests)('%s', (_, { given, want }) => {
    expect(isValidAttributeValue(...given)).toBe(want);
  });
});
