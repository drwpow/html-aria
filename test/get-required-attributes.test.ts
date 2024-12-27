import { describe, expect, test } from 'vitest';
import { getRequiredAttributes, isRequiredAttribute, roles } from '../src';
import { checkTestAndTagName } from './helpers';

const tests: [
  string,
  {
    given: Parameters<typeof getRequiredAttributes>;
    want: ReturnType<typeof getRequiredAttributes>;
  },
][] = [
  ['code', { given: ['code'], want: [] }],
  ['group', { given: ['group'], want: [] }],
  ['listbox', { given: ['listbox'], want: [] }],
  ['meter', { given: ['meter'], want: ['aria-valuenow'] }],
  ['radio', { given: ['radio'], want: ['aria-checked'] }],
  ['scrollbar', { given: ['scrollbar'], want: ['aria-controls', 'aria-valuenow'] }],
];

describe('getRequiredAttributes', () => {
  const testedRoles = new Set<string>();

  test.each(tests)('%s', (name, { given, want }) => {
    checkTestAndTagName(name, given[0]);
    testedRoles.add(given[0]);
    expect(getRequiredAttributes(...given)).toEqual(want);
  });

  test('all tags are tested', () => {
    const allRoles = Object.keys(roles);
    for (const role of allRoles) {
      if (!testedRoles.has(role)) {
        console.warn(`Role "${role}" is not tested`);
      }
    }
  });
});

// Simple “working” test; non-exhaustive
test('isRequiredAttribute', () => {
  expect(isRequiredAttribute('aria-valuenow', 'meter')).toBe(true);
  expect(isRequiredAttribute('aria-valuemin', 'meter')).toBe(false);
});
