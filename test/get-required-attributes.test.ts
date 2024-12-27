import { describe, expect, test } from 'vitest';
import { getRequiredAttributes, isRequiredAttribute } from '../src';

const tests: [
  string,
  {
    given: Parameters<typeof getRequiredAttributes>;
    want: ReturnType<typeof getRequiredAttributes>;
  },
][] = [
  ['meter', { given: ['meter'], want: ['aria-valuenow'] }],
  ['radio', { given: ['radio'], want: ['aria-checked'] }],
  [
    'scrollbar',
    { given: ['scrollbar'], want: ['aria-controls', 'aria-valuenow'] },
  ],
];

describe('getRequiredAttributes', () => {
  test.each(tests)('%s', (_, { given, want }) => {
    expect(getRequiredAttributes(...given)).toEqual(want);
  });
});

// Simple “working” test; non-exhaustive
test('isRequiredAttribute', () => {
  expect(isRequiredAttribute('aria-valuenow', 'meter')).toBe(true);
  expect(isRequiredAttribute('aria-valuemin', 'meter')).toBe(false);
});
